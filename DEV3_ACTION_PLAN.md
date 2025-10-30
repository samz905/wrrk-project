# Dev 3 (Backend Specialist) - Action Plan

**Role:** Backend Developer, Execution Engine, APIs
**Total Time:** 55 hours over 10 days (5-6h/day)
**Focus:** Workflow execution, step executor, APIs, database

---

## Your Responsibilities

1. ✅ **Execution Engine** (sequential step processing)
2. ✅ **Step Executor** (16 node type implementations)
3. ✅ **API Endpoints** (execute, validate, logs)
4. ✅ **Database Schemas** (executions, logs)
5. ✅ **Integration** (BotCore, Voice services)

---

## Day 1: Database Schemas (Monday)

**Time:** 5 hours
**Goal:** Database schemas created and tested

### Morning (3h): Create Schemas

#### Task 1.1: Create Execution Schema (1h)

File: `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/schemas/execution.schema.ts`

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
    default: 'running'
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
ExecutionSchema.index({ orgId: 1, userId: 1 });
ExecutionSchema.index({ status: 1 });
```

**Test:** Import in module, ensure MongoDB accepts schema

---

#### Task 1.2: Create Execution Log Schema (1h)

File: `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/schemas/execution-log.schema.ts`

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

  @Prop({ type: Number, required: true })
  stepOrder: number; // 0, 1, 2, ...

  @Prop({
    enum: ['running', 'completed', 'failed'],
    default: 'running'
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
```

**Test:** Create test document, query by executionId

---

#### Task 1.3: Register Schemas in Module (30 min)

File: `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/execution.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Execution, ExecutionSchema } from './schemas/execution.schema';
import { ExecutionLog, ExecutionLogSchema } from './schemas/execution-log.schema';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Execution.name, schema: ExecutionSchema },
      { name: ExecutionLog.name, schema: ExecutionLogSchema },
    ]),
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
```

**Test:** Module imports correctly

---

### Afternoon (2h): Document Execution Flow

#### Task 1.4: Create Architecture Doc (2h)

Work with Dev 1 to document execution flow (see their Day 1 task 1.2).

**Your responsibility:** Understand the flow thoroughly, ask questions.

**End of Day 1 Check:**
- [ ] Schemas created
- [ ] Indexes defined
- [ ] Module registered
- [ ] Execution flow understood

---

## Day 2: Execution Engine Core (Tuesday)

**Time:** 6 hours
**Goal:** Execution engine skeleton working

### Morning (3h): Create Execution Engine Service

#### Task 2.1: Create ExecutionEngineService (3h)

File: `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/execution-engine.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Execution, ExecutionDocument } from './schemas/execution.schema';
import { ExecutionLog, ExecutionLogDocument } from './schemas/execution-log.schema';
import { StepExecutorService } from './step-executor.service';

@Injectable()
export class ExecutionEngineService {
  constructor(
    @InjectModel(Execution.name) private executionModel: Model<ExecutionDocument>,
    @InjectModel(ExecutionLog.name) private logModel: Model<ExecutionLogDocument>,
    private stepExecutor: StepExecutorService,
  ) {}

  /**
   * Execute workflow step-by-step
   */
  async executeWorkflow(
    workflowId: string,
    triggerData: Record<string, any>
  ): Promise<any> {
    // 1. Load workflow and steps
    const workflow = await this.loadWorkflow(workflowId);
    const steps = await this.loadSteps(workflowId);

    if (!workflow || steps.length === 0) {
      throw new Error('Workflow not found or has no steps');
    }

    // 2. Create execution record
    const execution = await this.executionModel.create({
      workflowId,
      orgId: workflow.orgId,
      userId: workflow.userId,
      status: 'running',
      triggerData,
      startedAt: new Date(),
    });

    // 3. Execute steps sequentially
    let currentStepId = steps[0].stepId;
    let context = { ...triggerData };
    let stepOrder = 0;

    while (currentStepId) {
      const step = steps.find(s => s.stepId === currentStepId);
      if (!step) break;

      try {
        // Execute step
        const startTime = Date.now();
        const result = await this.stepExecutor.execute(step, context);
        const duration = Date.now() - startTime;

        // Log step execution
        await this.logModel.create({
          executionId: execution._id,
          stepId: step.stepId,
          stepType: step.stepType,
          stepOrder,
          status: 'completed',
          input: context,
          output: result.output,
          duration,
          startedAt: new Date(startTime),
          completedAt: new Date(),
        });

        // Update context with step output
        context = { ...context, ...result.output };

        // Move to next step
        currentStepId = step.nextStepId || null;
        stepOrder++;

      } catch (error) {
        // Log step error
        await this.logModel.create({
          executionId: execution._id,
          stepId: step.stepId,
          stepType: step.stepType,
          stepOrder,
          status: 'failed',
          input: context,
          errorMessage: error.message,
          startedAt: new Date(),
          completedAt: new Date(),
        });

        // Mark execution as failed
        await this.executionModel.updateOne(
          { _id: execution._id },
          {
            status: 'failed',
            errorMessage: error.message,
            completedAt: new Date(),
          }
        );

        throw error;
      }
    }

    // 4. Mark execution as completed
    await this.executionModel.updateOne(
      { _id: execution._id },
      {
        status: 'completed',
        finalOutput: context,
        completedAt: new Date(),
        totalDuration: Date.now() - execution.startedAt.getTime(),
      }
    );

    return { executionId: execution._id, status: 'completed' };
  }

  /**
   * Load workflow from database
   */
  private async loadWorkflow(workflowId: string) {
    // Use existing workflow model
    const Workflow = this.executionModel.db.model('workflows');
    return Workflow.findById(workflowId);
  }

  /**
   * Load all steps for workflow
   */
  private async loadSteps(workflowId: string) {
    const WorkflowStep = this.executionModel.db.model('workflowsteps');
    return WorkflowStep.find({ workflowId }).sort({ createdAt: 1 });
  }
}
```

**Test:** Call executeWorkflow with simple workflow (even if step executor not done yet)

---

### Afternoon (3h): Create Step Executor Skeleton

#### Task 2.2: Create StepExecutorService (3h)

File: `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/step-executor.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface StepResult {
  success: boolean;
  output: Record<string, any>;
  duration?: number;
}

@Injectable()
export class StepExecutorService {
  constructor(private httpService: HttpService) {}

  /**
   * Execute a single step
   */
  async execute(
    step: any,
    context: Record<string, any>
  ): Promise<StepResult> {
    const startTime = Date.now();
    let result: any;

    // Route to correct handler based on stepType
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
      duration: Date.now() - startTime,
    };
  }

  /**
   * Execute trigger (just extract data, no API call)
   */
  private async executeTrigger(step: any, context: any) {
    // Triggers just pass through the trigger data
    return {
      phone_number: context.phone_number,
      message_text: context.message_text,
      message_timestamp: context.message_timestamp || new Date().toISOString(),
      message_id: context.message_id || 'test-message-id',
    };
  }

  /**
   * Execute agent (call BW_BotCore)
   */
  private async executeAgent(step: any, context: any) {
    const { agentType, systemPrompt, memoryContext } = step.config;

    // Call BW_BotCoreFunctionalityService
    const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:5000';

    // For now, just call /qna
    // TODO: Map agentType to correct endpoint
    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/qna`, {
        question: context.message_text || '',
        uuid: 'default-uuid', // TODO: Get from agent config
        chatHistory: [],
      })
    );

    return {
      agent_response: response.data.response || response.data.answer,
    };
  }

  /**
   * Execute action (e.g., send WhatsApp)
   */
  private async executeAction(step: any, context: any) {
    const { actionType } = step.config;

    if (actionType === 'send_whatsapp') {
      // TODO: Call WhatsApp service
      const message = this.replaceVariables(step.config.messageTemplate, context);
      const recipient = step.config.recipient === 'trigger'
        ? context.phone_number
        : step.config.customRecipient;

      // Mock for now
      console.log(`Sending WhatsApp to ${recipient}: ${message}`);

      return {
        message_sent: true,
        message_id: 'whatsapp-msg-123',
        status: 'delivered',
      };
    }

    // TODO: Other action types
    return {};
  }

  /**
   * Execute utility (call BW_BotCore utility endpoints)
   */
  private async executeUtility(step: any, context: any) {
    const { utilityType, inputText } = step.config;
    const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:5000';

    // Replace variables in input text
    const text = this.replaceVariables(inputText, context);

    if (utilityType === 'sentiment') {
      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/sentiment-analysis`, { text })
      );

      return {
        sentiment: response.data.sentiment,
        sentiment_score: response.data.score,
      };
    }

    if (utilityType === 'intent') {
      const response = await firstValueFrom(
        this.httpService.post(`${botServiceUrl}/intent`, { text })
      );

      return {
        intent: response.data.intent,
        confidence: response.data.confidence,
      };
    }

    // TODO: Other utility types
    return {};
  }

  /**
   * Replace variables in template
   */
  private replaceVariables(template: string, context: any): string {
    if (!template) return '';

    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }
}
```

**Test:** Create simple workflow (Trigger → Agent), execute, check if agent called

**End of Day 2 Check:**
- [ ] Execution engine skeleton works
- [ ] Step executor routes to handlers
- [ ] At least one agent type works
- [ ] Variable replacement works

---

## Day 3: Implement All 16 Node Types (Wednesday)

**Time:** 6 hours
**Goal:** All node type handlers implemented

### Strategy: Complete one category at a time

#### Task 3.1: Complete Trigger Handlers (30 min)

All triggers just pass through data:

```typescript
private async executeTrigger(step: any, context: any) {
  const { triggerType } = step.config;

  // All triggers return the trigger data
  if (triggerType === 'whatsapp') {
    return {
      phone_number: context.phone_number,
      message_text: context.message_text,
      message_timestamp: context.message_timestamp || new Date().toISOString(),
      message_id: context.message_id,
    };
  }

  if (triggerType === 'email') {
    return {
      email_from: context.email_from,
      email_subject: context.email_subject,
      email_body: context.email_body,
      email_timestamp: context.email_timestamp || new Date().toISOString(),
    };
  }

  if (triggerType === 'voice') {
    return {
      caller_number: context.caller_number,
      call_duration: context.call_duration || 0,
      call_transcript: context.call_transcript || '',
    };
  }

  return context; // Fallback
}
```

---

#### Task 3.2: Complete Agent Handlers (2h)

```typescript
private async executeAgent(step: any, context: any) {
  const { agentType, systemPrompt, memoryContext } = step.config;
  const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:5000';

  // Conversational Agent
  if (agentType === 'conversational') {
    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/qna`, {
        question: context.message_text || '',
        uuid: memoryContext || 'default-uuid',
        chatHistory: context.chatHistory || [],
      })
    );

    return {
      agent_response: response.data.response || response.data.answer,
    };
  }

  // Decision Agent (Approve/Reject/Review)
  if (agentType === 'decision') {
    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/qna`, {
        question: context.message_text || '',
        uuid: 'decorpot-agent-uuid', // Special agent for decisions
        chatHistory: context.chatHistory || [],
      })
    );

    // Parse decision from response
    const decision = this.parseDecision(response.data.response);

    return {
      decision: decision.decision, // 'Approve' | 'Reject' | 'Review'
      confidence: decision.confidence || 0.9,
    };
  }

  // Reasoning Agent
  if (agentType === 'reasoning') {
    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/qna`, {
        question: context.message_text || '',
        uuid: memoryContext || 'default-uuid',
        chatHistory: context.chatHistory || [],
      })
    );

    return {
      reasoning: response.data.response,
      conclusion: response.data.response, // Can be same or extracted
    };
  }

  throw new Error(`Unknown agent type: ${agentType}`);
}

/**
 * Parse decision from AI response
 */
private parseDecision(response: string): { decision: string; confidence: number } {
  const lower = response.toLowerCase();

  if (lower.includes('approve')) {
    return { decision: 'Approve', confidence: 0.9 };
  }
  if (lower.includes('reject')) {
    return { decision: 'Reject', confidence: 0.9 };
  }
  if (lower.includes('review')) {
    return { decision: 'Review', confidence: 0.8 };
  }

  // Default to Review if unclear
  return { decision: 'Review', confidence: 0.5 };
}
```

**Test:** Test all 3 agent types

---

#### Task 3.3: Complete Action Handlers (2h)

```typescript
private async executeAction(step: any, context: any) {
  const { actionType } = step.config;

  // Send WhatsApp
  if (actionType === 'send_whatsapp') {
    const message = this.replaceVariables(step.config.messageTemplate, context);
    const recipient = step.config.recipient === 'trigger'
      ? context.phone_number
      : step.config.customRecipient;

    // Call existing WhatsApp service
    // TODO: Inject WhatsAppService
    console.log(`[WhatsApp] To: ${recipient}, Message: ${message}`);

    return {
      message_sent: true,
      message_id: `whatsapp-${Date.now()}`,
      status: 'delivered',
    };
  }

  // Send Email
  if (actionType === 'send_email') {
    const to = this.replaceVariables(step.config.to, context);
    const subject = this.replaceVariables(step.config.subject, context);
    const body = this.replaceVariables(step.config.body, context);

    // TODO: Call email service
    console.log(`[Email] To: ${to}, Subject: ${subject}`);

    return {
      email_sent: true,
      email_id: `email-${Date.now()}`,
    };
  }

  // Initiate Call
  if (actionType === 'initiate_call') {
    const phoneNumber = this.replaceVariables(step.config.phoneNumber, context);
    const voiceAgent = step.config.voiceAgent;

    // Call BW_VOICE service
    const voiceServiceUrl = process.env.VOICE_SERVICE_URL || 'http://localhost:8001';

    const response = await firstValueFrom(
      this.httpService.post(`${voiceServiceUrl}/twilio/outbound-call`, {
        toNumber: phoneNumber,
        agentId: voiceAgent,
      })
    );

    return {
      call_initiated: true,
      call_id: response.data.callId,
    };
  }

  // Update CRM
  if (actionType === 'update_crm') {
    const crmSystem = step.config.crmSystem;
    const action = step.config.action; // 'create' | 'update'
    const fields = JSON.parse(step.config.fields || '{}');

    // Replace variables in fields
    const processedFields = {};
    for (const [key, value] of Object.entries(fields)) {
      processedFields[key] = typeof value === 'string'
        ? this.replaceVariables(value, context)
        : value;
    }

    // Call appropriate CRM endpoint
    if (crmSystem === 'decorpot') {
      // TODO: Call Decorpot API
      console.log(`[Decorpot] ${action}: ${JSON.stringify(processedFields)}`);
    }

    return {
      crm_updated: true,
      crm_system: crmSystem,
    };
  }

  throw new Error(`Unknown action type: ${actionType}`);
}
```

**Test:** Test all 4 action types

---

#### Task 3.4: Complete Utility Handlers (1.5h)

```typescript
private async executeUtility(step: any, context: any) {
  const { utilityType } = step.config;
  const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:5000';

  // Get input text (with variables replaced)
  const inputText = this.replaceVariables(step.config.inputText, context);

  // Text Generator
  if (utilityType === 'text_gen') {
    const systemPrompt = step.config.systemPrompt;
    const temperature = parseFloat(step.config.temperature || '0.7');

    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/generate-answer`, {
        question: inputText,
        uuid: 'text-gen-uuid',
        temperature,
      })
    );

    return {
      generated_text: response.data.answer,
    };
  }

  // Sentiment Calculator
  if (utilityType === 'sentiment') {
    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/sentiment-analysis`, {
        text: inputText,
      })
    );

    return {
      sentiment: response.data.sentiment,
      sentiment_score: response.data.score,
    };
  }

  // Intent Calculator
  if (utilityType === 'intent') {
    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/intent`, {
        text: inputText,
      })
    );

    return {
      intent: response.data.intent,
      confidence: response.data.confidence,
    };
  }

  // Vulnerability Scanner
  if (utilityType === 'vulnerability') {
    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/vulnerability-analysis`, {
        text: inputText,
      })
    );

    return {
      vulnerabilities: response.data.vulnerabilities,
      risk_level: response.data.risk_level,
    };
  }

  // Reason Analyzer
  if (utilityType === 'reason') {
    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/reason-analysis`, {
        text: inputText,
      })
    );

    return {
      reason: response.data.reason,
    };
  }

  // Custom AI Utility
  if (utilityType === 'custom') {
    const systemPrompt = step.config.systemPrompt;

    const response = await firstValueFrom(
      this.httpService.post(`${botServiceUrl}/qna`, {
        question: inputText,
        uuid: 'custom-ai-uuid',
        chatHistory: [],
      })
    );

    return {
      custom_output: response.data.response,
    };
  }

  throw new Error(`Unknown utility type: ${utilityType}`);
}
```

**Test:** Test all 6 utility types

**End of Day 3 Check:**
- [ ] All 16 node types implemented
- [ ] Each type tested individually
- [ ] Integration with BotCore works
- [ ] Variable replacement works everywhere

---

## Day 4: API Endpoints (Thursday)

**Time:** 6 hours
**Goal:** All API endpoints working

### Task 4.1: Create Execute Workflow Endpoint (1.5h)

File: `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/execution.controller.ts`

```typescript
import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard';
import { ExecutionEngineService } from './execution-engine.service';
import { ExecutionService } from './execution.service';

@Controller('workFlow')
@UseGuards(JwtAuthGuard)
export class ExecutionController {
  constructor(
    private executionEngineService: ExecutionEngineService,
    private executionService: ExecutionService,
  ) {}

  /**
   * Execute workflow
   */
  @Post(':id/execute')
  async executeWorkflow(
    @Param('id') workflowId: string,
    @Body() body: { triggerData: Record<string, any> }
  ) {
    try {
      const result = await this.executionEngineService.executeWorkflow(
        workflowId,
        body.triggerData
      );

      return {
        success: true,
        executionId: result.executionId,
        status: result.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
```

**Test:**
```bash
curl -X POST http://localhost:3001/workFlow/123/execute \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"triggerData": {"phone_number": "+91 98765 43210", "message_text": "Hello"}}'
```

---

### Task 4.2: Create Get Executions Endpoint (1h)

```typescript
// execution.service.ts
async getExecutions(
  workflowId: string,
  filters: { status?: string; dateRange?: string },
  page: number = 1,
  limit: number = 20
): Promise<any> {
  const query: any = { workflowId };

  // Status filter
  if (filters.status && filters.status !== 'all') {
    query.status = filters.status;
  }

  // Date range filter
  if (filters.dateRange) {
    const now = new Date();
    const ranges = {
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    };
    query.startedAt = { $gte: ranges[filters.dateRange] || ranges['7d'] };
  }

  // Pagination
  const skip = (page - 1) * limit;

  const [executions, total] = await Promise.all([
    this.executionModel.find(query).sort({ startedAt: -1 }).skip(skip).limit(limit),
    this.executionModel.countDocuments(query),
  ]);

  return {
    executions,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
}

// Controller
@Get(':id/executions')
async getExecutions(
  @Param('id') workflowId: string,
  @Query('status') status: string,
  @Query('dateRange') dateRange: string,
  @Query('page') page: string = '1',
  @Query('limit') limit: string = '20'
) {
  return this.executionService.getExecutions(
    workflowId,
    { status, dateRange },
    parseInt(page),
    parseInt(limit)
  );
}
```

**Test:**
```bash
curl http://localhost:3001/workFlow/123/executions?status=completed&page=1
```

---

### Task 4.4: Create Get Execution Details Endpoint (1h)

```typescript
// execution.service.ts
async getExecutionDetails(executionId: string): Promise<any> {
  const execution = await this.executionModel.findById(executionId);
  if (!execution) {
    throw new Error('Execution not found');
  }

  const logs = await this.logModel.find({ executionId }).sort({ stepOrder: 1 });

  return {
    execution,
    logs,
  };
}

// Controller
@Get('execution/:id')
async getExecutionDetails(@Param('id') executionId: string) {
  return this.executionService.getExecutionDetails(executionId);
}
```

**Test:**
```bash
curl http://localhost:3001/workFlow/execution/67123abc
```

---

### Task 4.5: Create Retry Execution Endpoint (30 min)

```typescript
// execution.service.ts
async retryExecution(executionId: string): Promise<any> {
  const execution = await this.executionModel.findById(executionId);
  if (!execution) {
    throw new Error('Execution not found');
  }

  // Re-execute with same trigger data
  return this.executionEngineService.executeWorkflow(
    execution.workflowId,
    execution.triggerData
  );
}

// Controller
@Post('execution/:id/retry')
async retryExecution(@Param('id') executionId: string) {
  return this.executionService.retryExecution(executionId);
}
```

**Test:** Retry a failed execution

**End of Day 4 Check:**
- [ ] Execute endpoint works
- [ ] Test endpoint works
- [ ] Get executions endpoint works
- [ ] Get details endpoint works
- [ ] Retry endpoint works

---

## Day 5: Validation & Error Handling (Friday)

**Time:** 5 hours
**Goal:** Validation and robust error handling

### Task 5.1: Create Workflow Validation (2h)

```typescript
// execution.service.ts
async validateWorkflow(workflowId: string): Promise<any> {
  const Workflow = this.executionModel.db.model('workflows');
  const WorkflowStep = this.executionModel.db.model('workflowsteps');

  const workflow = await Workflow.findById(workflowId);
  const steps = await WorkflowStep.find({ workflowId });

  const errors = [];

  // Check 1: Workflow exists
  if (!workflow) {
    return { valid: false, errors: [{ message: 'Workflow not found' }] };
  }

  // Check 2: Has steps
  if (steps.length === 0) {
    errors.push({ message: 'Workflow has no steps' });
  }

  // Check 3: Has at least one trigger
  const triggers = steps.filter(s => s.stepType === 'trigger');
  if (triggers.length === 0) {
    errors.push({ message: 'Workflow must have at least one trigger' });
  }

  // Check 4: All steps are configured
  for (const step of steps) {
    if (!step.config || Object.keys(step.config).length === 0) {
      errors.push({
        stepId: step.stepId,
        message: `Step ${step.stepId} is not configured`,
      });
    }
  }

  // Check 5: All steps are connected (except terminal actions)
  for (const step of steps) {
    if (step.stepType !== 'action' && !step.nextStepId) {
      errors.push({
        stepId: step.stepId,
        message: `Step ${step.stepId} has no outgoing connection`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Controller
@Post(':id/validate')
async validateWorkflow(@Param('id') workflowId: string) {
  return this.executionService.validateWorkflow(workflowId);
}
```

**Test:** Validate incomplete workflow, should return errors

---

### Task 5.2: Add Error Handling (2h)

Add try-catch blocks everywhere:

```typescript
// execution-engine.service.ts

// Add timeout for step execution
private async executeStepWithTimeout(step: any, context: any, timeoutMs: number = 30000) {
  return Promise.race([
    this.stepExecutor.execute(step, context),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Step execution timeout')), timeoutMs)
    ),
  ]);
}

// Use in executeWorkflow
try {
  const result = await this.executeStepWithTimeout(step, context);
  // ... rest of code
} catch (error) {
  // Detailed error logging
  console.error(`Step ${step.stepId} failed:`, error);

  // Log to database
  await this.logModel.create({
    executionId: execution._id,
    stepId: step.stepId,
    stepType: step.stepType,
    stepOrder,
    status: 'failed',
    errorMessage: `${error.message}\n${error.stack}`,
    startedAt: new Date(),
    completedAt: new Date(),
  });

  throw error;
}
```

---

### Task 5.3: Add Input Validation (1h)

Add DTOs for request validation:

```typescript
// dtos/execute-workflow.dto.ts
import { IsObject, IsNotEmpty } from 'class-validator';

export class ExecuteWorkflowDto {
  @IsObject()
  @IsNotEmpty()
  triggerData: Record<string, any>;
}

// Use in controller
@Post(':id/execute')
async executeWorkflow(
  @Param('id') workflowId: string,
  @Body() body: ExecuteWorkflowDto
) {
  // Validation happens automatically
  return this.executionEngineService.executeWorkflow(workflowId, body.triggerData);
}
```

**End of Day 5 Check:**
- [ ] Validation endpoint works
- [ ] Error handling robust
- [ ] Timeouts implemented
- [ ] Input validation works

---

## Day 6-7: Testing & Integration (Monday-Tuesday)

**Time:** 6h/day = 12 hours
**Goal:** All integrations tested

### Day 6 Tasks

#### Task 6.1: Test Integration with BotCore (3h)

For each utility/agent, test actual API calls:

```bash
# Test sentiment
curl -X POST http://localhost:5000/sentiment-analysis \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this product!"}'

# Test intent
curl -X POST http://localhost:5000/intent \
  -H "Content-Type: application/json" \
  -d '{"text": "I want to buy your product"}'
```

Fix any integration issues.

---

#### Task 6.2: Test Integration with Voice Service (2h)

```bash
# Test outbound call
curl -X POST http://localhost:8001/twilio/outbound-call \
  -H "Content-Type: application/json" \
  -d '{"toNumber": "+1234567890", "agentId": "agent-123"}'
```

---

#### Task 6.3: Write Unit Tests (3h)

```typescript
// execution-engine.service.spec.ts
import { Test } from '@nestjs/testing';
import { ExecutionEngineService } from './execution-engine.service';

describe('ExecutionEngineService', () => {
  let service: ExecutionEngineService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ExecutionEngineService, /* mock dependencies */],
    }).compile();

    service = module.get(ExecutionEngineService);
  });

  it('should execute workflow step-by-step', async () => {
    const workflowId = 'test-workflow-id';
    const triggerData = { phone_number: '+1234567890', message_text: 'Hello' };

    const result = await service.executeWorkflow(workflowId, triggerData);

    expect(result.status).toBe('completed');
    expect(result.executionId).toBeDefined();
  });

  it('should handle step failures', async () => {
    // Test error handling
    // ...
  });
});
```

Run tests:
```bash
npm test
```

---

### Day 7 Tasks

#### Task 7.1: Test Complete Workflows (4h)

Create test workflows for each pattern:

1. **Simple:** Trigger → Agent → Action
2. **Decision:** Trigger → Decision Agent → 3 Actions
3. **Utility:** Trigger → Sentiment → Intent → Action
4. **Complex:** Trigger → Agent → Utility → Agent → Action

Execute each, verify logs.

---

#### Task 7.2: Load Testing (2h)

```typescript
// load-test.ts
async function loadTest() {
  const promises = [];

  for (let i = 0; i < 100; i++) {
    promises.push(
      fetch('http://localhost:3001/workFlow/123/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          triggerData: { phone_number: `+${i}`, message_text: `Test ${i}` }
        }),
      })
    );
  }

  const results = await Promise.all(promises);
  console.log(`Completed: ${results.filter(r => r.ok).length}/100`);
}

loadTest();
```

**Goal:** All 100 succeed within reasonable time (<30 seconds total)

---

#### Task 7.3: Fix Bugs (2h)

Fix any issues found during testing.

**End of Day 7 Check:**
- [ ] All integrations tested
- [ ] Unit tests pass
- [ ] Load test passes
- [ ] Bugs fixed

---

## Day 8-10: Polish & Deploy (Wednesday-Friday)

**Time:** 5h/day = 15 hours

### Day 8: Multi-Tenancy & Security

#### Task 8.1: Add OrgId Filtering (2h)

```typescript
// Ensure all queries filter by orgId
async getExecutions(workflowId: string, orgId: string, userId: string, ...) {
  const query = { workflowId, orgId, userId };
  // ... rest of query
}
```

#### Task 8.2: Test Security (2h)

- User A cannot access User B's workflows
- Invalid JWT rejected
- Rate limiting (if implemented)

---

### Day 9: Performance Optimization

#### Task 9.1: Add Database Indexes (1h)

```typescript
// Already in schemas, but verify they're created:
db.workflow_executions.getIndexes()
db.execution_logs.getIndexes()

// Create if missing:
db.workflow_executions.createIndex({ workflowId: 1, startedAt: -1 })
db.execution_logs.createIndex({ executionId: 1, stepOrder: 1 })
```

#### Task 9.2: Optimize Queries (2h)

- Use projections (only fetch needed fields)
- Batch queries where possible

---

### Day 10: Final Testing & Deploy

#### Task 10.1: Final Integration Test (2h)

Run complete E2E test with Dev 1.

#### Task 10.2: Deploy to Staging (2h)

```bash
# Build
npm run build

# Deploy (method depends on infrastructure)
# Docker, PM2, or cloud platform
```

#### Task 10.3: Smoke Tests (1h)

After deploy, test all endpoints on staging.

**End of Day 10 Check:**
- [ ] All endpoints working
- [ ] Multi-tenancy secure
- [ ] Performance acceptable
- [ ] Deployed to staging

---

## Testing Checklist (Use Daily)

**For Each Endpoint:**
- [ ] Valid request returns 200
- [ ] Invalid request returns 400
- [ ] Unauthorized returns 401
- [ ] Not found returns 404
- [ ] Server error returns 500
- [ ] Response matches schema

**For Each Node Type:**
- [ ] Executes without error
- [ ] Returns expected output
- [ ] Variables replaced correctly
- [ ] Error handling works

---

## Common Mistakes to Avoid

1. **Not handling async errors** - Always use try-catch
2. **Forgetting to await** - Use await for all promises
3. **Hardcoded URLs** - Use environment variables
4. **No timeout** - Add timeout to API calls
5. **Missing indexes** - Slow queries without indexes
6. **No logging** - Add console.log for debugging
7. **Not testing edge cases** - Empty, null, invalid data

---

## Resources

- NestJS Docs: https://docs.nestjs.com
- Mongoose Docs: https://mongoosejs.com
- BotWot Unified PRD: `BotWot_Unified_PRD.md`
- BotCore API: Check existing endpoints in BW_BotCoreFunctionalityService

---

**Build solid backends! 🚀**
