# Dev 3: Execution Engine - Instruction Manual

**Your Role:** Execution Engine & Backend Integration Specialist
**Responsibility:** Build workflow execution engine and integrate with all services
**Scope:** Sequential step execution, 30 node type handlers, API endpoints, validation, publish

---

## Overview

You are responsible for the "brain" of the workflow system - the execution engine that takes a workflow definition and executes it step-by-step. You'll implement handlers for all 30 node types and integrate with existing services (BotCore, Voice, WhatsApp, Shopify).

**What You're Building:**
- **Execution Engine** - Orchestrates step-by-step workflow execution
- **Step Executor** - Implements handlers for all 30 node types
- **API Endpoints** - Execute workflow, validate workflow, get execution logs, publish workflow
- **Database Schemas** - Execution records and step logs
- **Service Integrations** - BotCore (agents, utilities), Shopify API, WhatsApp API, Voice API

**Key Technologies:**
- **NestJS** - Backend framework
- **MongoDB** + **Mongoose** - Database and ORM
- **Axios** - HTTP client for service calls
- **BotCore Python Service** - LangChain agents and utilities (Flask on port 5000)
- **Shopify Admin API** - E-commerce data and operations
- **Meta Graph API** - WhatsApp messaging

---

## Prerequisites

### 1. Environment Setup

Ensure these services are running:

```bash
# BotCore Service (Python Flask)
cd BW_BotCoreFunctionalityService
python app.py  # Runs on http://localhost:5000

# Consumer Service (NestJS)
cd BW_ConsumerService
npm run start:dev  # Runs on http://localhost:3000
```

### 2. Environment Variables

Add to `BW_ConsumerService/.env`:

```bash
# BotCore Service
BOT_SERVICE_URL=http://localhost:5000

# Shopify (use existing config)
SHOPIFY_API_KEY=your_key
SHOPIFY_API_SECRET=your_secret
SHOPIFY_STORE_URL=your_store.myshopify.com

# MongoDB (already configured)
MONGODB_URI=mongodb://localhost:27017/botwot
```

### 3. Core Concepts

**Workflow Execution Flow:**
1. Workflow is triggered (webhook, manual, or scheduled)
2. Execution engine creates execution record in DB
3. Engine loads workflow steps from DB
4. Engine executes steps sequentially, passing context between steps
5. Each step execution is logged with input, output, duration
6. Final output is saved when workflow completes

**Context Object:**
Data passed between steps. Each step can read from and write to context.

Example:
```typescript
// After WhatsApp Trigger
context = {
  phone_number: "+919876543210",
  message_text: "Hello",
  message_id: "msg_123"
}

// After Conversational Agent
context = {
  phone_number: "+919876543210",
  message_text: "Hello",
  message_id: "msg_123",
  agent_response: "Hi! How can I help?"  // Added by agent
}

// After Send WhatsApp Action
context = {
  ...previous_data,
  message_sent: true,  // Added by action
  message_id_out: "msg_456"
}
```

---

## Part 1: Database Schemas

### What They Are

Two schemas to track workflow executions:
1. **Execution** - Top-level record for each workflow execution
2. **ExecutionLog** - Record for each step within an execution

### How to Build Them

#### Step 1.1: Create Execution Schema

Create `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/schemas/execution.schema.ts`:

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExecutionDocument = Execution & Document;

@Schema({ timestamps: true, collection: 'workflow_executions' })
export class Execution {
  @Prop({ required: true })
  workflowId: string;

  @Prop({ required: true })
  orgId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({
    enum: ['running', 'completed', 'failed'],
    default: 'running',
  })
  status: string;

  @Prop({ type: Object, required: true })
  triggerData: Record<string, any>;

  @Prop({ type: Object, required: false })
  finalOutput?: Record<string, any>;

  @Prop({ type: Number, required: false })
  totalDuration?: number; // milliseconds

  @Prop({ type: Date, default: Date.now })
  startedAt: Date;

  @Prop({ type: Date, required: false })
  completedAt?: Date;

  @Prop({ type: String, required: false })
  errorMessage?: string;
}

export const ExecutionSchema = SchemaFactory.createForClass(Execution);

// Indexes for fast queries
ExecutionSchema.index({ workflowId: 1, startedAt: -1 });
ExecutionSchema.index({ orgId: 1, userId: 1, startedAt: -1 });
ExecutionSchema.index({ status: 1 });
```

#### Step 1.2: Create Execution Log Schema

Create `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/schemas/execution-log.schema.ts`:

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExecutionLogDocument = ExecutionLog & Document;

@Schema({ timestamps: true, collection: 'execution_logs' })
export class ExecutionLog {
  @Prop({ required: true })
  executionId: string;

  @Prop({ required: true })
  stepId: string;

  @Prop({ required: true })
  stepType: string; // 'trigger' | 'agent' | 'action' | 'utility'

  @Prop({ required: true })
  nodeType: string; // e.g., 'trigger_whatsapp', 'action_shopify_create_order'

  @Prop({ type: Number, required: true })
  stepOrder: number; // 0, 1, 2, ...

  @Prop({
    enum: ['running', 'completed', 'failed'],
    default: 'running',
  })
  status: string;

  @Prop({ type: Object, required: false })
  input?: Record<string, any>;

  @Prop({ type: Object, required: false })
  output?: Record<string, any>;

  @Prop({ type: Number, required: false })
  duration?: number; // milliseconds

  @Prop({ type: String, required: false })
  errorMessage?: string;

  @Prop({ type: Date, default: Date.now })
  startedAt: Date;

  @Prop({ type: Date, required: false })
  completedAt?: Date;
}

export const ExecutionLogSchema = SchemaFactory.createForClass(ExecutionLog);

// Indexes
ExecutionLogSchema.index({ executionId: 1, stepOrder: 1 });
ExecutionLogSchema.index({ status: 1 });
ExecutionLogSchema.index({ executionId: 1, startedAt: 1 });
```

#### Step 1.3: Register Schemas in Module

Create or update `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/execution.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Execution, ExecutionSchema } from './schemas/execution.schema';
import { ExecutionLog, ExecutionLogSchema } from './schemas/execution-log.schema';
import { ExecutionEngineService } from './execution-engine.service';
import { StepExecutorService } from './step-executor.service';
import { ExecutionController } from './execution.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Execution.name, schema: ExecutionSchema },
      { name: ExecutionLog.name, schema: ExecutionLogSchema },
    ]),
    HttpModule,
  ],
  controllers: [ExecutionController],
  providers: [ExecutionEngineService, StepExecutorService],
  exports: [ExecutionEngineService],
})
export class ExecutionModule {}
```

**How to Test:**
1. Run `npm run start:dev`
2. Check MongoDB - collections `workflow_executions` and `execution_logs` should be created
3. Manually insert a test document to verify schema

---

## Part 2: Execution Engine Core

### What It Is

The orchestrator that loads a workflow, executes steps sequentially, manages context, handles errors, and logs everything.

### How to Build It

#### Step 2.1: Create Execution Engine Service

Create `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/execution-engine.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Execution, ExecutionDocument } from './schemas/execution.schema';
import { ExecutionLog, ExecutionLogDocument } from './schemas/execution-log.schema';
import { StepExecutorService } from './step-executor.service';

@Injectable()
export class ExecutionEngineService {
  private readonly logger = new Logger(ExecutionEngineService.name);

  constructor(
    @InjectModel(Execution.name)
    private executionModel: Model<ExecutionDocument>,
    @InjectModel(ExecutionLog.name)
    private logModel: Model<ExecutionLogDocument>,
    private stepExecutor: StepExecutorService,
  ) {}

  /**
   * Execute workflow step-by-step
   */
  async executeWorkflow(
    workflowId: string,
    triggerData: Record<string, any>,
  ): Promise<{ executionId: string; status: string }> {
    this.logger.log(`Starting execution for workflow ${workflowId}`);

    // 1. Load workflow and steps
    const workflow = await this.loadWorkflow(workflowId);
    const steps = await this.loadSteps(workflowId);

    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (!workflow.publishedVersion || workflow.status !== 'PUBLISHED') {
      throw new Error(`Workflow ${workflowId} is not published`);
    }

    if (steps.length === 0) {
      throw new Error(`Workflow ${workflowId} has no steps`);
    }

    // 2. Find trigger step (first step in workflow)
    const triggerStep = steps.find((s) => s.stepType === 'trigger');
    if (!triggerStep) {
      throw new Error('No trigger step found in workflow');
    }

    // 3. Create execution record
    const execution = await this.executionModel.create({
      workflowId,
      orgId: workflow.orgId,
      userId: workflow.userId,
      status: 'running',
      triggerData,
      startedAt: new Date(),
    });

    this.logger.log(`Created execution ${execution._id}`);

    // 4. Execute steps sequentially
    let currentStepId = triggerStep.stepId;
    let context: Record<string, any> = { ...triggerData };
    let stepOrder = 0;

    try {
      while (currentStepId) {
        const step = steps.find((s) => s.stepId === currentStepId);
        if (!step) {
          this.logger.warn(`Step ${currentStepId} not found, ending execution`);
          break;
        }

        this.logger.log(
          `Executing step ${step.stepId} (${step.nodeType}) - order ${stepOrder}`,
        );

        // Create log entry
        const logEntry = await this.logModel.create({
          executionId: execution._id,
          stepId: step.stepId,
          stepType: step.stepType,
          nodeType: step.nodeType,
          stepOrder,
          status: 'running',
          input: context,
          startedAt: new Date(),
        });

        try {
          // Execute step
          const startTime = Date.now();
          const result = await this.stepExecutor.execute(step, context);
          const duration = Date.now() - startTime;

          // Update log entry
          await this.logModel.updateOne(
            { _id: logEntry._id },
            {
              status: 'completed',
              output: result.output,
              duration,
              completedAt: new Date(),
            },
          );

          this.logger.log(`Step ${step.stepId} completed in ${duration}ms`);

          // Update context with step output
          context = { ...context, ...result.output };

          // Move to next step
          currentStepId = step.nextStepId || null;
          stepOrder++;
        } catch (stepError) {
          // Update log entry with error
          await this.logModel.updateOne(
            { _id: logEntry._id },
            {
              status: 'failed',
              errorMessage: stepError.message || 'Unknown error',
              completedAt: new Date(),
            },
          );

          throw stepError; // Re-throw to mark execution as failed
        }
      }

      // 5. Mark execution as completed
      await this.executionModel.updateOne(
        { _id: execution._id },
        {
          status: 'completed',
          finalOutput: context,
          completedAt: new Date(),
          totalDuration: Date.now() - execution.startedAt.getTime(),
        },
      );

      this.logger.log(`Execution ${execution._id} completed successfully`);

      return { executionId: execution._id.toString(), status: 'completed' };
    } catch (error) {
      // Mark execution as failed
      await this.executionModel.updateOne(
        { _id: execution._id },
        {
          status: 'failed',
          errorMessage: error.message || 'Unknown error',
          completedAt: new Date(),
          totalDuration: Date.now() - execution.startedAt.getTime(),
        },
      );

      this.logger.error(
        `Execution ${execution._id} failed: ${error.message}`,
      );

      throw error;
    }
  }

  /**
   * Load workflow from database
   */
  private async loadWorkflow(workflowId: string) {
    const Workflow = this.executionModel.db.model('workflows');
    return Workflow.findById(workflowId);
  }

  /**
   * Load all steps for workflow, ordered
   */
  private async loadSteps(workflowId: string) {
    const WorkflowStep = this.executionModel.db.model('workflowsteps');
    return WorkflowStep.find({ workflowId }).sort({ createdAt: 1 });
  }

  /**
   * Get execution by ID
   */
  async getExecution(executionId: string) {
    return this.executionModel.findById(executionId);
  }

  /**
   * Get executions for workflow (with pagination)
   */
  async getExecutions(
    workflowId: string,
    options: { status?: string; limit?: number; offset?: number },
  ) {
    const query: any = { workflowId };
    if (options.status) {
      query.status = options.status;
    }

    const limit = options.limit || 50;
    const offset = options.offset || 0;

    const [executions, total] = await Promise.all([
      this.executionModel
        .find(query)
        .sort({ startedAt: -1 })
        .limit(limit)
        .skip(offset),
      this.executionModel.countDocuments(query),
    ]);

    return { executions, total, limit, offset };
  }

  /**
   * Get logs for execution
   */
  async getExecutionLogs(executionId: string) {
    return this.logModel.find({ executionId }).sort({ stepOrder: 1 });
  }

  /**
   * Retry failed execution
   */
  async retryExecution(executionId: string) {
    const execution = await this.executionModel.findById(executionId);
    if (!execution) {
      throw new Error('Execution not found');
    }

    if (execution.status !== 'failed') {
      throw new Error('Only failed executions can be retried');
    }

    // Start new execution with same trigger data
    return this.executeWorkflow(
      execution.workflowId.toString(),
      execution.triggerData,
    );
  }
}
```

**How to Test:**
1. Create a simple workflow in DB (1 trigger, 1 agent, 1 action)
2. Call `executeWorkflow()` with test trigger data
3. Check logs are created
4. Check execution status updates

---

## Part 3: Step Executor - Node Type Handlers

### What It Is

Service that executes a single step based on its node type. Routes to correct handler (trigger, agent, action, utility) and calls appropriate external services.

### How to Build It

#### Step 3.1: Create Step Executor Service

Create `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/step-executor.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface StepResult {
  success: boolean;
  output: Record<string, any>;
}

@Injectable()
export class StepExecutorService {
  private readonly logger = new Logger(StepExecutorService.name);

  constructor(private httpService: HttpService) {}

  /**
   * Execute a single step
   */
  async execute(step: any, context: Record<string, any>): Promise<StepResult> {
    this.logger.log(`Executing ${step.nodeType} step`);

    let result: any;

    // Route to handler based on stepType
    switch (step.stepType) {
      case 'trigger':
        result = await this.executeTrigger(step, context);
        break;

      case 'agent':
        result = await this.executeAgent(step, context);
        break;

      case 'action':
        result = await this.executeAction(step, context);
        break;

      case 'utility':
        result = await this.executeUtility(step, context);
        break;

      default:
        throw new Error(`Unknown step type: ${step.stepType}`);
    }

    return {
      success: true,
      output: result,
    };
  }

  // =====================================================
  // TRIGGER HANDLERS
  // =====================================================

  private async executeTrigger(
    step: any,
    context: any,
  ): Promise<Record<string, any>> {
    const { nodeType } = step;

    // All triggers just pass through the trigger data
    // The actual triggering (webhooks, etc.) happens before execution starts

    if (nodeType.startsWith('trigger_whatsapp')) {
      return {
        phone_number: context.phone_number,
        message_text: context.message_text,
        message_id: context.message_id,
        message_timestamp: context.message_timestamp || new Date().toISOString(),
      };
    }

    if (nodeType.startsWith('trigger_email')) {
      return {
        email_from: context.email_from,
        email_subject: context.email_subject,
        email_body: context.email_body,
        email_timestamp: context.email_timestamp || new Date().toISOString(),
      };
    }

    if (nodeType.startsWith('trigger_voice')) {
      return {
        caller_number: context.caller_number,
        call_duration: context.call_duration || 0,
        call_transcript: context.call_transcript || '',
      };
    }

    if (nodeType === 'trigger_shopify_order_created') {
      return {
        order_id: context.order_id,
        order_number: context.order_number,
        customer_email: context.customer_email,
        total_price: context.total_price,
        order_created_at: context.created_at,
      };
    }

    if (nodeType === 'trigger_shopify_order_fulfilled') {
      return {
        order_id: context.order_id,
        fulfillment_status: 'fulfilled',
        tracking_number: context.tracking_number,
      };
    }

    if (nodeType === 'trigger_shopify_order_delivered') {
      return {
        order_id: context.order_id,
        delivery_status: 'delivered',
        delivered_at: context.delivered_at,
      };
    }

    if (nodeType === 'trigger_shopify_order_cancelled') {
      return {
        order_id: context.order_id,
        cancel_reason: context.cancel_reason,
        cancelled_at: context.cancelled_at,
      };
    }

    if (nodeType === 'trigger_shopify_time_reminder') {
      return {
        order_id: context.order_id,
        reminder_type: context.reminder_type, // '1hr', '6hr', '12hr', '18hr'
        time_elapsed: context.time_elapsed,
      };
    }

    // Default: pass through all context
    return context;
  }

  // =====================================================
  // AGENT HANDLERS
  // =====================================================

  private async executeAgent(
    step: any,
    context: any,
  ): Promise<Record<string, any>> {
    const { nodeType, config } = step;
    const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:5000';

    // Replace variables in system prompt
    const systemPrompt = this.replaceVariables(
      config.systemPrompt || '',
      context,
    );

    if (nodeType === 'agent_conversational') {
      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/qna`, {
          question: context.message_text || context.email_body || '',
          uuid: config.memoryContext || 'default-uuid',
          chatHistory: context.chatHistory || [],
          systemPrompt: systemPrompt,
        }),
      );

      return {
        agent_response: response.data.response || response.data.answer,
      };
    }

    if (nodeType === 'agent_decision') {
      // Decision agent returns one of: approve, reject, review
      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/qna`, {
          question: context.message_text || context.email_body || '',
          uuid: config.memoryContext || 'decision-uuid',
          chatHistory: [],
          systemPrompt:
            systemPrompt ||
            'Analyze the input and respond with ONLY one word: approve, reject, or review.',
        }),
      );

      const decision = (response.data.response || response.data.answer)
        .toLowerCase()
        .trim();

      return {
        decision: ['approve', 'reject', 'review'].includes(decision)
          ? decision
          : 'review',
        decision_explanation: response.data.response,
      };
    }

    if (nodeType === 'agent_reasoning') {
      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/qna`, {
          question: context.message_text || context.email_body || '',
          uuid: config.memoryContext || 'reasoning-uuid',
          chatHistory: [],
          systemPrompt:
            systemPrompt || 'Analyze and reason about the given information.',
        }),
      );

      return {
        reasoning_result: response.data.response || response.data.answer,
      };
    }

    throw new Error(`Unknown agent type: ${nodeType}`);
  }

  // =====================================================
  // ACTION HANDLERS
  // =====================================================

  private async executeAction(
    step: any,
    context: any,
  ): Promise<Record<string, any>> {
    const { nodeType, config } = step;

    // --- Original Actions ---

    if (nodeType === 'action_whatsapp') {
      const message = this.replaceVariables(config.messageTemplate, context);
      const recipient =
        config.recipient === 'trigger'
          ? context.phone_number
          : this.replaceVariables(config.customRecipient, context);

      // TODO: Call actual WhatsApp service
      this.logger.log(`Sending WhatsApp to ${recipient}: ${message}`);

      return {
        message_sent: true,
        recipient,
        message_id_out: `wa_${Date.now()}`,
      };
    }

    if (nodeType === 'action_email') {
      const to = this.replaceVariables(config.to, context);
      const subject = this.replaceVariables(config.subject, context);
      const body = this.replaceVariables(config.body, context);

      // TODO: Call email service
      this.logger.log(`Sending email to ${to}: ${subject}`);

      return {
        email_sent: true,
        recipient: to,
        email_id: `email_${Date.now()}`,
      };
    }

    if (nodeType === 'action_call') {
      const phoneNumber = this.replaceVariables(config.phoneNumber, context);

      // TODO: Call voice service
      this.logger.log(`Initiating call to ${phoneNumber}`);

      return {
        call_initiated: true,
        phone_number: phoneNumber,
        call_id: `call_${Date.now()}`,
      };
    }

    if (nodeType === 'action_crm') {
      // TODO: Implement CRM update
      this.logger.log(`Updating CRM: ${config.crmSystem}`);

      return {
        crm_updated: true,
        crm_system: config.crmSystem,
      };
    }

    // --- Shopify Actions ---

    if (nodeType === 'action_shopify_get_product') {
      const productId = this.replaceVariables(config.productId, context);
      const shopifyUrl = `https://${config.shopifyAccount}.myshopify.com`;

      const response = await firstValueFrom(
        this.httpService.get(
          `${shopifyUrl}/admin/api/2024-01/products/${productId}.json`,
          {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            },
          },
        ),
      );

      return {
        product: response.data.product,
        product_id: response.data.product.id,
        product_title: response.data.product.title,
        product_price: response.data.product.variants[0]?.price,
      };
    }

    if (nodeType === 'action_shopify_get_all_products') {
      const shopifyUrl = `https://${config.shopifyAccount}.myshopify.com`;
      const limit = config.limit || 50;

      const response = await firstValueFrom(
        this.httpService.get(
          `${shopifyUrl}/admin/api/2024-01/products.json?limit=${limit}`,
          {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            },
          },
        ),
      );

      return {
        products: response.data.products,
        product_count: response.data.products.length,
      };
    }

    if (nodeType === 'action_shopify_get_order') {
      const orderId = this.replaceVariables(config.orderId, context);
      const shopifyUrl = `https://${config.shopifyAccount}.myshopify.com`;

      const response = await firstValueFrom(
        this.httpService.get(
          `${shopifyUrl}/admin/api/2024-01/orders.json?name=${orderId}`,
          {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            },
          },
        ),
      );

      const order = response.data.orders[0];

      return {
        order: order,
        order_id: order?.id,
        order_status: order?.financial_status,
        order_total: order?.total_price,
      };
    }

    if (nodeType === 'action_shopify_auth_customer') {
      const email = this.replaceVariables(config.email, context);
      const shopifyUrl = `https://${config.shopifyAccount}.myshopify.com`;

      const response = await firstValueFrom(
        this.httpService.get(
          `${shopifyUrl}/admin/api/2024-01/customers.json?email=${email}`,
          {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            },
          },
        ),
      );

      const customer = response.data.customers[0];

      return {
        customer_found: !!customer,
        customer_id: customer?.id,
        customer_email: customer?.email,
        customer_name: `${customer?.first_name} ${customer?.last_name}`,
      };
    }

    if (nodeType === 'action_shopify_get_shop') {
      const shopifyUrl = `https://${config.shopifyAccount}.myshopify.com`;

      const response = await firstValueFrom(
        this.httpService.get(`${shopifyUrl}/admin/api/2024-01/shop.json`, {
          headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
          },
        }),
      );

      return {
        shop: response.data.shop,
        shop_name: response.data.shop.name,
        shop_email: response.data.shop.email,
      };
    }

    if (nodeType === 'action_shopify_create_order') {
      const shopifyUrl = `https://${config.shopifyAccount}.myshopify.com`;

      // Build order payload from config
      const orderPayload = {
        order: {
          email: this.replaceVariables(config.customer.email, context),
          line_items: config.lineItems.map((item: any) => ({
            variant_id: this.replaceVariables(item.productId, context),
            quantity: parseInt(this.replaceVariables(item.quantity, context)),
          })),
          customer: {
            first_name: this.replaceVariables(
              config.customer.firstName,
              context,
            ),
            last_name: this.replaceVariables(config.customer.lastName, context),
            email: this.replaceVariables(config.customer.email, context),
          },
          shipping_address: {
            address1: this.replaceVariables(
              config.shippingAddress.address,
              context,
            ),
            city: this.replaceVariables(config.shippingAddress.city, context),
            province: this.replaceVariables(
              config.shippingAddress.state,
              context,
            ),
            zip: this.replaceVariables(config.shippingAddress.zipcode, context),
            country: 'IN',
          },
          financial_status: 'pending',
          fulfillment_status: null,
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(
          `${shopifyUrl}/admin/api/2024-01/orders.json`,
          orderPayload,
          {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return {
        order_created: true,
        order_id: response.data.order.id,
        order_number: response.data.order.order_number,
      };
    }

    if (nodeType === 'action_shopify_confirm_order') {
      const orderId = this.replaceVariables(config.orderId, context);
      const shopifyUrl = `https://${config.shopifyAccount}.myshopify.com`;

      // Use existing ShopifyService.confirmOrder method
      // TODO: Import ShopifyService and call confirmOrder
      this.logger.log(`Confirming Shopify order ${orderId}`);

      return {
        order_confirmed: true,
        order_id: orderId,
      };
    }

    if (nodeType === 'action_shopify_cancel_order') {
      const orderId = this.replaceVariables(config.orderId, context);
      const shopifyUrl = `https://${config.shopifyAccount}.myshopify.com`;

      const response = await firstValueFrom(
        this.httpService.post(
          `${shopifyUrl}/admin/api/2024-01/orders/${orderId}/cancel.json`,
          { reason: config.reason || 'customer' },
          {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            },
          },
        ),
      );

      return {
        order_cancelled: true,
        order_id: orderId,
      };
    }

    if (nodeType === 'action_shopify_update_address') {
      const orderId = this.replaceVariables(config.orderId, context);
      const shopifyUrl = `https://${config.shopifyAccount}.myshopify.com`;

      const addressPayload = {
        order: {
          shipping_address: {
            address1: this.replaceVariables(
              config.shippingAddress.address,
              context,
            ),
            city: this.replaceVariables(config.shippingAddress.city, context),
            province: this.replaceVariables(
              config.shippingAddress.state,
              context,
            ),
            zip: this.replaceVariables(config.shippingAddress.zipcode, context),
          },
        },
      };

      const response = await firstValueFrom(
        this.httpService.put(
          `${shopifyUrl}/admin/api/2024-01/orders/${orderId}.json`,
          addressPayload,
          {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            },
          },
        ),
      );

      return {
        address_updated: true,
        order_id: orderId,
      };
    }

    throw new Error(`Unknown action type: ${nodeType}`);
  }

  // =====================================================
  // UTILITY HANDLERS
  // =====================================================

  private async executeUtility(
    step: any,
    context: any,
  ): Promise<Record<string, any>> {
    const { nodeType, config } = step;
    const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:5000';

    // Replace variables in input
    const inputText = this.replaceVariables(config.inputText || '', context);

    if (nodeType === 'utility_text_gen') {
      const systemPrompt = this.replaceVariables(
        config.systemPrompt || '',
        context,
      );

      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/qna`, {
          question: inputText,
          uuid: 'textgen-uuid',
          chatHistory: [],
          systemPrompt: systemPrompt || 'Generate text based on the input.',
          temperature: config.temperature || 0.7,
        }),
      );

      return {
        generated_text: response.data.response || response.data.answer,
      };
    }

    if (nodeType === 'utility_sentiment') {
      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/sentiment-analysis`, {
          text: inputText,
        }),
      );

      return {
        sentiment: response.data.sentiment,
        sentiment_score: response.data.score,
      };
    }

    if (nodeType === 'utility_intent') {
      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/intent`, {
          text: inputText,
        }),
      );

      return {
        intent: response.data.intent,
        confidence: response.data.confidence,
      };
    }

    if (nodeType === 'utility_vulnerability') {
      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/vulnerability-scanner`, {
          text: inputText,
        }),
      );

      return {
        vulnerability_detected: response.data.vulnerable,
        vulnerability_type: response.data.type,
      };
    }

    if (nodeType === 'utility_reason') {
      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/reason-analyzer`, {
          text: inputText,
        }),
      );

      return {
        reason: response.data.reason,
      };
    }

    if (nodeType === 'utility_custom') {
      const systemPrompt = this.replaceVariables(
        config.systemPrompt || '',
        context,
      );

      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/qna`, {
          question: inputText,
          uuid: 'custom-uuid',
          chatHistory: [],
          systemPrompt: systemPrompt,
          temperature: config.temperature || 0.7,
        }),
      );

      return {
        custom_output: response.data.response || response.data.answer,
      };
    }

    throw new Error(`Unknown utility type: ${nodeType}`);
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  /**
   * Replace {{variable}} with values from context
   */
  private replaceVariables(template: string, context: any): string {
    if (!template) return '';

    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] !== undefined ? context[key].toString() : match;
    });
  }
}
```

**How to Test:**
1. Test each node type individually with mock data
2. Create test workflows combining different node types
3. Verify context passes correctly between steps
4. Check variable replacement works (`{{variable_name}}`)

---

## Part 4: API Endpoints

### What They Are

REST endpoints for Dev 1 (frontend) and Dev 4 (monitoring) to interact with the execution engine.

### How to Build Them

#### Step 4.1: Create Execution Controller

Create `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/execution.controller.ts`:

```typescript
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExecutionEngineService } from './execution-engine.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'; // Use existing guard

@Controller('workflow/execution')
@UseGuards(JwtAuthGuard)
export class ExecutionController {
  constructor(private executionEngine: ExecutionEngineService) {}

  /**
   * Execute workflow manually (for testing)
   * POST /workflow/execution/:workflowId
   */
  @Post(':workflowId')
  async executeWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() body: { triggerData: Record<string, any> },
  ) {
    const result = await this.executionEngine.executeWorkflow(
      workflowId,
      body.triggerData,
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get execution by ID
   * GET /workflow/execution/:executionId
   */
  @Get(':executionId')
  async getExecution(@Param('executionId') executionId: string) {
    const execution = await this.executionEngine.getExecution(executionId);

    if (!execution) {
      return {
        success: false,
        message: 'Execution not found',
      };
    }

    return {
      success: true,
      data: execution,
    };
  }

  /**
   * Get executions for workflow
   * GET /workflow/:workflowId/executions
   */
  @Get('workflow/:workflowId')
  async getExecutions(
    @Param('workflowId') workflowId: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const result = await this.executionEngine.getExecutions(workflowId, {
      status,
      limit,
      offset,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get logs for execution
   * GET /workflow/execution/:executionId/logs
   */
  @Get(':executionId/logs')
  async getExecutionLogs(@Param('executionId') executionId: string) {
    const logs = await this.executionEngine.getExecutionLogs(executionId);

    return {
      success: true,
      data: logs,
    };
  }

  /**
   * Retry failed execution
   * POST /workflow/execution/:executionId/retry
   */
  @Post(':executionId/retry')
  async retryExecution(@Param('executionId') executionId: string) {
    const result = await this.executionEngine.retryExecution(executionId);

    return {
      success: true,
      data: result,
    };
  }
}
```

**How to Test:**
1. Use Postman to test each endpoint
2. Verify JWT authentication works
3. Check responses match expected format
4. Test error cases (invalid IDs, etc.)

---

## Part 5: Validation & Publish

### What They Are

Two additional endpoints:
1. **Validate Workflow** - Check if workflow is complete and valid before publishing
2. **Publish Workflow** - Mark workflow as published and ready to execute

### How to Build Them

#### Step 5.1: Create Validation Service

Create `BW_ConsumerService/src/integrations/whatsapp/workFlows/validation/workflow-validation.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface ValidationError {
  stepId?: string;
  message: string;
  type: string; // 'missing_trigger', 'unconfigured', 'orphan', 'circular'
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

@Injectable()
export class WorkflowValidationService {
  constructor() {}

  async validateWorkflow(workflowId: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Load workflow and steps
    const workflow = await this.loadWorkflow(workflowId);
    const steps = await this.loadSteps(workflowId);

    if (!workflow) {
      return {
        valid: false,
        errors: [{ message: 'Workflow not found', type: 'not_found' }],
      };
    }

    if (steps.length === 0) {
      return {
        valid: false,
        errors: [{ message: 'Workflow has no steps', type: 'empty' }],
      };
    }

    // 1. Check for trigger
    const triggerSteps = steps.filter((s) => s.stepType === 'trigger');
    if (triggerSteps.length === 0) {
      errors.push({
        message: 'Workflow must have at least one trigger',
        type: 'missing_trigger',
      });
    }

    if (triggerSteps.length > 1) {
      errors.push({
        message: 'Workflow can only have one trigger',
        type: 'multiple_triggers',
      });
    }

    // 2. Check for unconfigured nodes
    for (const step of steps) {
      if (!step.config || Object.keys(step.config).length === 0) {
        errors.push({
          stepId: step.stepId,
          message: `Step "${step.label}" is not configured`,
          type: 'unconfigured',
        });
      }
    }

    // 3. Check for orphan nodes (no path from trigger)
    const reachable = new Set<string>();
    const trigger = triggerSteps[0];

    if (trigger) {
      this.markReachable(trigger.stepId, steps, reachable);

      for (const step of steps) {
        if (!reachable.has(step.stepId)) {
          errors.push({
            stepId: step.stepId,
            message: `Step "${step.label}" is not connected to the workflow`,
            type: 'orphan',
          });
        }
      }
    }

    // 4. Check for circular dependencies
    const visited = new Set<string>();
    const recStack = new Set<string>();

    for (const step of steps) {
      if (this.hasCycle(step.stepId, steps, visited, recStack)) {
        errors.push({
          stepId: step.stepId,
          message: 'Circular dependency detected in workflow',
          type: 'circular',
        });
        break; // Only report once
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private markReachable(
    stepId: string,
    steps: any[],
    reachable: Set<string>,
  ) {
    if (reachable.has(stepId)) return;

    reachable.add(stepId);

    const step = steps.find((s) => s.stepId === stepId);
    if (step && step.nextStepId) {
      this.markReachable(step.nextStepId, steps, reachable);
    }
  }

  private hasCycle(
    stepId: string,
    steps: any[],
    visited: Set<string>,
    recStack: Set<string>,
  ): boolean {
    if (recStack.has(stepId)) return true;
    if (visited.has(stepId)) return false;

    visited.add(stepId);
    recStack.add(stepId);

    const step = steps.find((s) => s.stepId === stepId);
    if (step && step.nextStepId) {
      if (this.hasCycle(step.nextStepId, steps, visited, recStack)) {
        return true;
      }
    }

    recStack.delete(stepId);
    return false;
  }

  private async loadWorkflow(workflowId: string) {
    // TODO: Inject Workflow model properly
    return null; // Placeholder
  }

  private async loadSteps(workflowId: string) {
    // TODO: Inject WorkflowStep model properly
    return []; // Placeholder
  }
}
```

#### Step 5.2: Add Validation and Publish Endpoints

Add to `ExecutionController`:

```typescript
import { WorkflowValidationService } from '../validation/workflow-validation.service';

@Controller('workflow')
@UseGuards(JwtAuthGuard)
export class WorkflowController {
  constructor(
    private executionEngine: ExecutionEngineService,
    private validationService: WorkflowValidationService,
  ) {}

  /**
   * Validate workflow before publishing
   * POST /workflow/:workflowId/validate
   */
  @Post(':workflowId/validate')
  async validateWorkflow(@Param('workflowId') workflowId: string) {
    const result = await this.validationService.validateWorkflow(workflowId);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Publish workflow (make it executable)
   * POST /workflow/:workflowId/publish
   */
  @Post(':workflowId/publish')
  async publishWorkflow(@Param('workflowId') workflowId: string) {
    // First validate
    const validation = await this.validationService.validateWorkflow(
      workflowId,
    );

    if (!validation.valid) {
      return {
        success: false,
        message: 'Workflow validation failed',
        data: validation,
      };
    }

    // Update workflow status to PUBLISHED
    // TODO: Use WorkflowService to update status
    // await this.workflowService.updateStatus(workflowId, 'PUBLISHED');

    return {
      success: true,
      message: 'Workflow published successfully',
    };
  }
}
```

**How to Test:**
1. Create incomplete workflow → Validate → Should return errors
2. Fix all errors → Validate → Should pass
3. Publish workflow → Should update status
4. Try executing unpublished workflow → Should fail

---

## Common Issues & Troubleshooting

### Issue: "BotCore service connection refused"
**Solution:**
- Check BotCore service is running: `ps aux | grep python`
- Verify BOT_SERVICE_URL env variable
- Test connection: `curl http://localhost:5000/health`

### Issue: "Shopify API returns 401"
**Solution:**
- Check SHOPIFY_ACCESS_TOKEN is set correctly
- Verify token has correct permissions
- Check Shopify API version compatibility

### Issue: "Execution hangs on a step"
**Solution:**
- Add timeout to HTTP requests (30 seconds default)
- Check step executor logs for errors
- Verify external service is responding

### Issue: "Variable replacement not working"
**Solution:**
- Check template format: `{{variable_name}}` (double braces)
- Ensure variable exists in context
- Log context before replacement for debugging

### Issue: "Circular dependency false positives"
**Solution:**
- Check algorithm visits all nodes correctly
- Verify nextStepId relationships in DB
- Test with simple linear workflow first

---

## Integration Checklist

### With Dev 1 (Canvas):
- [ ] Save workflow API creates workflow and steps correctly
- [ ] Load workflow API returns correct structure
- [ ] Workflow status updates (draft → published)

### With Dev 2 (Nodes & Config):
- [ ] Config field names match what step executor expects
- [ ] Variable format `{{variable_name}}` is consistent
- [ ] Nested config objects (Shopify Create Order) parse correctly

### With Dev 4 (Monitoring):
- [ ] GET /workflow/:workflowId/executions returns paginated results
- [ ] GET /execution/:executionId/logs returns step logs in order
- [ ] Retry endpoint creates new execution with same trigger data

### With BotCore Service:
- [ ] /qna endpoint works for agents
- [ ] /sentiment-analysis, /intent, etc. work for utilities
- [ ] Responses parse correctly

### With Shopify Service:
- [ ] Existing Shopify webhooks trigger workflows
- [ ] ShopifyService methods can be called from step executor
- [ ] API authentication works

---

## Testing Checklist

**Database Schemas:**
- [ ] Execution schema creates documents correctly
- [ ] ExecutionLog schema creates documents correctly
- [ ] Indexes improve query performance

**Execution Engine:**
- [ ] Simple workflow executes (Trigger → Agent → Action)
- [ ] Context passes between steps correctly
- [ ] Failed steps mark execution as failed
- [ ] Execution duration is calculated correctly

**Step Executor:**
- [ ] All 30 node types have handlers
- [ ] Triggers pass through data correctly
- [ ] Agents call BotCore and parse responses
- [ ] Actions perform operations (WhatsApp, Email, Shopify)
- [ ] Utilities call BotCore utilities
- [ ] Variable replacement works in all fields

**API Endpoints:**
- [ ] Execute workflow endpoint works
- [ ] Get executions endpoint returns filtered results
- [ ] Get logs endpoint returns step logs
- [ ] Retry endpoint creates new execution
- [ ] Validate endpoint catches all error types
- [ ] Publish endpoint updates workflow status

**Error Handling:**
- [ ] Step failures are logged correctly
- [ ] Execution continues after recoverable errors (optional)
- [ ] Critical errors stop execution immediately
- [ ] Error messages are clear and actionable

**Performance:**
- [ ] Workflow with 10 steps executes in <10 seconds (excluding LLM time)
- [ ] Execution logs are queryable quickly (<100ms)
- [ ] Concurrent executions don't interfere with each other

---

## Code Templates

### Template: Adding a New Node Type Handler

```typescript
// In step-executor.service.ts

// If it's an action:
if (nodeType === 'action_new_type') {
  const param1 = this.replaceVariables(config.param1, context);
  const param2 = config.param2;

  // Call external service or perform operation
  const response = await firstValueFrom(
    this.httpService.post('https://api.example.com/endpoint', {
      param1,
      param2,
    }),
  );

  // Return output to context
  return {
    new_output_field: response.data.result,
    status: 'success',
  };
}
```

### Template: Error Handling in Step Executor

```typescript
try {
  const result = await this.callExternalService(config);
  return { success: true, output: result };
} catch (error) {
  this.logger.error(`Failed to execute step: ${error.message}`);

  // Decide: fail immediately or return partial result?
  if (config.continueOnError) {
    return {
      success: false,
      error: error.message,
      partial_output: {},
    };
  } else {
    throw new Error(`Step failed: ${error.message}`);
  }
}
```

---

## Final Notes

- **You're the execution brain** - Your code makes workflows run
- **Test incrementally** - Don't wait to test all 30 node types at once
- **Log everything** - Execution logs are critical for debugging
- **Handle errors gracefully** - Failed steps shouldn't crash the engine
- **Performance matters** - Optimize database queries and HTTP calls

**Resources:**
- BotCore API: Check `BW_BotCoreFunctionalityService/app/routes/`
- Shopify API Docs: https://shopify.dev/api/admin-rest
- Sprint Plan: `SPRINT.md`
- Tech Arch: `TECH_ARCH.md`
