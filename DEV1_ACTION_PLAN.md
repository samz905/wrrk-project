# Dev 1 (Lead Developer) - Action Plan

**Role:** Lead Developer, Architecture, Critical Path, Code Review
**Total Time:** 45 hours over 10 days (4-5h/day)
**Focus:** Architecture decisions, unblocking team, code review, critical integrations

---

## Your Responsibilities

1. ✅ **Architecture & Technical Decisions**
2. ✅ **Critical Path Implementation** (React Flow setup, execution engine foundation)
3. ✅ **Code Review** (all PRs)
4. ✅ **Integration** (JWT auth, existing APIs)
5. ✅ **E2E Testing**
6. ✅ **Unblocking Team**

---

## Day 1: Project Setup & Architecture (Monday)

**Time:** 4 hours
**Goal:** Set up foundation, define schemas, review with team

### Morning (2h): Project Setup

#### Task 1.1: Create Frontend Project Structure (30 min)
```bash
cd BW_FE_Application

# Create new workflow builder folder structure
mkdir -p src/pages/workflow
mkdir -p src/components/workflow/canvas
mkdir -p src/components/workflow/nodes
mkdir -p src/components/workflow/config
mkdir -p src/components/workflow/test
mkdir -p src/components/monitoring
mkdir -p src/store
mkdir -p src/hooks
mkdir -p src/api/services
mkdir -p src/types
```

**Files to create:**
```typescript
// src/types/workflow.types.ts
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'agent' | 'action' | 'utility';
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
    configured: boolean;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: 'draft' | 'published';
  orgId: string;
  userId: string;
}
```

**Test:** Can you import these types without errors?

---

#### Task 1.2: Document Execution Flow (1h)

Create architecture doc:

```markdown
// docs/EXECUTION_FLOW.md

## Workflow Execution Flow

1. User triggers workflow (e.g., WhatsApp message received)
2. POST /workFlow/:id/execute with triggerData
3. ExecutionEngine.executeWorkflow():
   - Load workflow + all steps from DB
   - Create execution record
   - Loop through steps:
     a. Load step
     b. Execute via StepExecutor
     c. Log result
     d. Pass output to context for next step
     e. Move to nextStepId
4. Mark execution complete/failed
5. Return execution result

## Context Passing
- Each step output becomes input for next step
- Context = { ...triggerData, ...step1Output, ...step2Output }
- Variables replaced: {{phone_number}} → actual value from context
```

**Test:** Review with Dev 3, answer questions

---

### Afternoon (2h): Node Configuration Schemas

#### Task 1.3: Define All 16 Node Config Schemas (2h)

Create comprehensive schema file:

```typescript
// src/config/nodeSchemas.ts

export interface NodeConfigSchema {
  nodeType: string;
  fields: ConfigField[];
}

export interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file';
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: any; // Yup schema
}

// TRIGGERS

export const whatsappTriggerSchema: NodeConfigSchema = {
  nodeType: 'trigger_whatsapp',
  fields: [
    {
      name: 'accountId',
      label: 'WhatsApp Account',
      type: 'select',
      required: true,
      options: [], // Populated from API
    },
    {
      name: 'keywordMatch',
      label: 'Keyword Match',
      type: 'text',
      required: false,
      placeholder: 'e.g., "help", "support"',
    },
    {
      name: 'conditions',
      label: 'Trigger Conditions',
      type: 'checkbox',
      required: false,
    },
  ],
};

export const emailTriggerSchema: NodeConfigSchema = {
  nodeType: 'trigger_email',
  fields: [
    {
      name: 'emailAccount',
      label: 'Email Account',
      type: 'select',
      required: true,
      options: [],
    },
    {
      name: 'subjectContains',
      label: 'Subject Contains',
      type: 'text',
      required: false,
    },
    {
      name: 'fromAddress',
      label: 'From Address',
      type: 'text',
      required: false,
    },
  ],
};

export const voiceTriggerSchema: NodeConfigSchema = {
  nodeType: 'trigger_voice',
  fields: [
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'select',
      required: true,
      options: [],
    },
    {
      name: 'businessHoursOnly',
      label: 'Business Hours Only',
      type: 'checkbox',
      required: false,
    },
  ],
};

// AGENTS

export const conversationalAgentSchema: NodeConfigSchema = {
  nodeType: 'agent_conversational',
  fields: [
    {
      name: 'systemPrompt',
      label: 'System Prompt',
      type: 'textarea',
      required: true,
      placeholder: 'You are a helpful assistant...',
    },
    {
      name: 'memoryContext',
      label: 'Knowledge Base',
      type: 'select',
      required: false,
      options: [],
    },
    {
      name: 'responseFormat',
      label: 'Response Format',
      type: 'select',
      required: true,
      options: [
        { label: 'Freeform Text', value: 'text' },
        { label: 'Structured JSON', value: 'json' },
      ],
    },
  ],
};

export const decisionAgentSchema: NodeConfigSchema = {
  nodeType: 'agent_decision',
  fields: [
    {
      name: 'systemPrompt',
      label: 'System Prompt',
      type: 'textarea',
      required: true,
      placeholder: 'Analyze the customer intent and decide...',
    },
    {
      name: 'memoryContext',
      label: 'Knowledge Base',
      type: 'select',
      required: false,
      options: [],
    },
    // Decision has fixed outputs: Approve, Reject, Review
  ],
};

export const reasoningAgentSchema: NodeConfigSchema = {
  nodeType: 'agent_reasoning',
  fields: [
    {
      name: 'systemPrompt',
      label: 'System Prompt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'memoryContext',
      label: 'Knowledge Base',
      type: 'select',
      required: false,
      options: [],
    },
  ],
};

// ACTIONS

export const sendWhatsAppSchema: NodeConfigSchema = {
  nodeType: 'action_whatsapp',
  fields: [
    {
      name: 'messageTemplate',
      label: 'Message Template',
      type: 'textarea',
      required: true,
      placeholder: 'Hi {{customer_name}}, thanks for your interest...',
    },
    {
      name: 'recipient',
      label: 'Recipient',
      type: 'select',
      required: true,
      options: [
        { label: 'Use Trigger Phone Number', value: 'trigger' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'customRecipient',
      label: 'Custom Phone Number',
      type: 'text',
      required: false,
    },
  ],
};

export const sendEmailSchema: NodeConfigSchema = {
  nodeType: 'action_email',
  fields: [
    {
      name: 'to',
      label: 'To',
      type: 'text',
      required: true,
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      label: 'Body',
      type: 'textarea',
      required: true,
    },
  ],
};

export const initiateCallSchema: NodeConfigSchema = {
  nodeType: 'action_call',
  fields: [
    {
      name: 'voiceAgent',
      label: 'Voice Agent',
      type: 'select',
      required: true,
      options: [],
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      required: true,
      placeholder: '{{phone_number}} or +1234567890',
    },
  ],
};

export const updateCRMSchema: NodeConfigSchema = {
  nodeType: 'action_crm',
  fields: [
    {
      name: 'crmSystem',
      label: 'CRM System',
      type: 'select',
      required: true,
      options: [
        { label: 'Decorpot', value: 'decorpot' },
        { label: 'Shopify', value: 'shopify' },
        { label: 'Salesforce', value: 'salesforce' },
      ],
    },
    {
      name: 'action',
      label: 'Action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
      ],
    },
    {
      name: 'fields',
      label: 'Fields (JSON)',
      type: 'textarea',
      required: true,
      placeholder: '{"leadStatus": "Real", "notes": "..."}',
    },
  ],
};

// UTILITIES

export const textGeneratorSchema: NodeConfigSchema = {
  nodeType: 'utility_text_gen',
  fields: [
    {
      name: 'systemPrompt',
      label: 'System Prompt',
      type: 'textarea',
      required: true,
      placeholder: 'Generate a personalized response...',
    },
    {
      name: 'temperature',
      label: 'Temperature',
      type: 'text',
      required: false,
      placeholder: '0.7',
    },
  ],
};

export const sentimentCalcSchema: NodeConfigSchema = {
  nodeType: 'utility_sentiment',
  fields: [
    {
      name: 'inputText',
      label: 'Input Text',
      type: 'text',
      required: true,
      placeholder: '{{message_text}}',
    },
  ],
};

export const intentCalcSchema: NodeConfigSchema = {
  nodeType: 'utility_intent',
  fields: [
    {
      name: 'inputText',
      label: 'Input Text',
      type: 'text',
      required: true,
      placeholder: '{{message_text}}',
    },
  ],
};

export const vulnScannerSchema: NodeConfigSchema = {
  nodeType: 'utility_vulnerability',
  fields: [
    {
      name: 'inputText',
      label: 'Input Text',
      type: 'text',
      required: true,
      placeholder: '{{message_text}}',
    },
  ],
};

export const reasonAnalyzerSchema: NodeConfigSchema = {
  nodeType: 'utility_reason',
  fields: [
    {
      name: 'inputText',
      label: 'Input Text',
      type: 'text',
      required: true,
      placeholder: '{{message_text}}',
    },
  ],
};

export const customAIUtilitySchema: NodeConfigSchema = {
  nodeType: 'utility_custom',
  fields: [
    {
      name: 'systemPrompt',
      label: 'System Prompt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'temperature',
      label: 'Temperature',
      type: 'text',
      required: false,
    },
  ],
};

// Export all schemas
export const nodeSchemas = {
  trigger_whatsapp: whatsappTriggerSchema,
  trigger_email: emailTriggerSchema,
  trigger_voice: voiceTriggerSchema,
  agent_conversational: conversationalAgentSchema,
  agent_decision: decisionAgentSchema,
  agent_reasoning: reasoningAgentSchema,
  action_whatsapp: sendWhatsAppSchema,
  action_email: sendEmailSchema,
  action_call: initiateCallSchema,
  action_crm: updateCRMSchema,
  utility_text_gen: textGeneratorSchema,
  utility_sentiment: sentimentCalcSchema,
  utility_intent: intentCalcSchema,
  utility_vulnerability: vulnScannerSchema,
  utility_reason: reasonAnalyzerSchema,
  utility_custom: customAIUtilitySchema,
};
```

**Test:** Share with Dev 2, confirm they understand the schema structure

**End of Day 1 Check:**
- [ ] Folder structure created
- [ ] Type definitions exist
- [ ] Node schemas documented
- [ ] Dev 3 understands execution flow
- [ ] Dev 2 has schemas for config forms

---

## Day 2: React Flow Setup & Code Review (Tuesday)

**Time:** 4 hours
**Goal:** Help Dev 2 set up React Flow, review their work

### Morning (2h): React Flow Setup Support

#### Task 2.1: Review React Flow Docs with Dev 2 (1h)

**Key Resources:**
- https://reactflow.dev/learn/getting-started/quickstart
- https://reactflow.dev/examples

**What to review:**
- Basic canvas setup
- Custom node types
- Connection validation
- State management

#### Task 2.2: Pair Program Canvas Setup (1h)

Help Dev 2 create WorkflowCanvas.tsx:

```typescript
// src/components/workflow/canvas/WorkflowCanvas.tsx
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node types (Dev 2 will create these)
import TriggerNode from '../nodes/TriggerNode';
import AgentNode from '../nodes/AgentNode';
import ActionNode from '../nodes/ActionNode';
import UtilityNode from '../nodes/UtilityNode';

const nodeTypes = {
  trigger: TriggerNode,
  agent: AgentNode,
  action: ActionNode,
  utility: UtilityNode,
};

// Connection validation
const isValidConnection = (connection: Connection) => {
  // Trigger can connect to: Agent, Action, Utility
  // Agent can connect to: Agent, Action, Utility
  // Action can connect to: nothing (terminal)
  // Utility can connect to: Agent, Action, Utility

  // TODO: Implement validation logic
  return true;
};

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = (params: Connection) => {
    setEdges((eds) => [...eds, { ...params, id: `e${params.source}-${params.target}` } as Edge]);
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

**Test:** Canvas renders, can pan/zoom

---

### Afternoon (2h): Code Review

#### Task 2.3: Review Dev 2's PRs (1h)
- Canvas setup
- Node library panel
- Drag-drop implementation

**Checklist:**
- [ ] Code follows TypeScript best practices
- [ ] No `any` types
- [ ] Components are properly typed
- [ ] No console.log statements
- [ ] Styles are clean (Tailwind CSS)

#### Task 2.4: Review Dev 3's PRs (1h)
- Execution schema
- Database models

**Checklist:**
- [ ] Schemas have all required fields
- [ ] Indexes defined correctly
- [ ] Timestamps enabled
- [ ] No sensitive data in schemas

**End of Day 2 Check:**
- [ ] React Flow canvas works
- [ ] Dev 2 understands custom nodes
- [ ] Dev 3's schemas merged

---

## Day 3: Architecture Review & Unblocking (Wednesday)

**Time:** 4 hours
**Goal:** Ensure execution engine architecture is solid

### Morning (2h): Execution Engine Review

#### Task 3.1: Review Execution Engine with Dev 3 (2h)

Sit with Dev 3 and review:

```typescript
// BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/execution-engine.service.ts

@Injectable()
export class ExecutionEngineService {
  async executeWorkflow(
    workflowId: string,
    triggerData: Record<string, any>
  ): Promise<ExecutionResult> {
    // 1. Load workflow + steps
    const workflow = await this.loadWorkflow(workflowId);
    const steps = await this.loadSteps(workflowId);

    // 2. Create execution record
    const execution = await this.createExecution(workflow, triggerData);

    // 3. Execute steps sequentially
    let currentStepId = steps[0].stepId;
    let context = { ...triggerData };

    while (currentStepId) {
      const step = steps.find(s => s.stepId === currentStepId);

      try {
        const result = await this.stepExecutor.execute(step, context);
        await this.logStepExecution(execution._id, step, result);

        context = { ...context, ...result.output };
        currentStepId = step.nextStepId;
      } catch (error) {
        await this.logStepError(execution._id, step, error);
        break;
      }
    }

    await this.completeExecution(execution._id);
    return execution;
  }
}
```

**Questions to ask Dev 3:**
1. How do you handle circular dependencies? (A → B → A)
2. What happens if a step takes > 30 seconds?
3. How do you prevent duplicate executions?

**Test:** Walk through execution flow on whiteboard

---

### Afternoon (2h): Help Dev 2 with Node Connections

#### Task 3.2: Implement Connection Validation (2h)

Help Dev 2 fix connection validation:

```typescript
// src/utils/connectionValidation.ts

export const isValidConnection = (
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
): boolean => {
  const { source, target } = connection;

  // Get source and target node types
  const sourceNode = nodes.find(n => n.id === source);
  const targetNode = nodes.find(n => n.id === target);

  if (!sourceNode || !targetNode) return false;

  const sourceType = sourceNode.type;
  const targetType = targetNode.type;

  // Validation rules
  const validConnections: Record<string, string[]> = {
    trigger: ['agent', 'action', 'utility'],
    agent: ['agent', 'action', 'utility'],
    action: [], // Terminal node
    utility: ['agent', 'action', 'utility'],
  };

  // Check if connection is valid
  if (!validConnections[sourceType]?.includes(targetType)) {
    return false;
  }

  // Prevent circular dependencies (simple check)
  // TODO: Implement proper cycle detection if needed

  return true;
};
```

**Test:** Try invalid connections, should be blocked

**End of Day 3 Check:**
- [ ] Execution engine architecture approved
- [ ] Connection validation works
- [ ] Dev 3 ready to implement step executor

---

## Day 4-5: Code Review & Support (Thursday-Friday)

**Time:** 4 hours/day
**Goal:** Review Dev 2's config forms, help where needed

### Task 4.1: Review Config Forms Daily (1h/day)

**Checklist for each config form:**
- [ ] Uses correct schema from nodeSchemas.ts
- [ ] Required fields marked with *
- [ ] Validation works (try submitting empty)
- [ ] Variable insertion UI present (if text field)
- [ ] Save button updates node data
- [ ] Node shows "configured" status after save

### Task 4.2: Help Dev 2 with Complex Forms (1h/day)

**Decision Agent Config** - special attention needed:
- Has 3 output ports (Approve, Reject, Review)
- May need custom connection logic

**Decorpot Agent Config** - complex validation:
- Budget must be >= ₹300,000
- Project needs validation

### Task 4.3: Review Dev 3's Step Executor (2h)

Key integration points:

```typescript
// Step Executor should call:

// For Agents:
POST http://bot-service:5000/qna
Body: { question, uuid, chatHistory }

// For Actions (WhatsApp):
this.whatsappService.sendMessage(recipient, message)

// For Utilities (Sentiment):
POST http://bot-service:5000/sentiment-analysis
Body: { text }
```

**Test:** Execute simple workflow (Trigger → Agent → Action)

**End of Day 5 Check:**
- [ ] All 16 config forms complete
- [ ] Step executor can call all services
- [ ] Execute API works for simple workflow

---

## Day 6: Validation & Early Integration (Monday)

**Time:** 6 hours
**Goal:** Enhance validation, begin integration, polish UI

### Task 6.1: Enhance Validation Logic (2h)

Work with Dev 3 to implement comprehensive validation:

```typescript
// execution.service.ts
async validateWorkflow(workflowId: string): Promise<ValidationResult> {
  const workflow = await this.loadWorkflow(workflowId);
  const steps = await this.loadSteps(workflowId);

  const errors = [];

  // Check 1: All nodes configured
  for (const step of steps) {
    if (!step.config || Object.keys(step.config).length === 0) {
      errors.push({
        stepId: step.stepId,
        message: `Step ${step.stepId} is not configured`,
      });
    }
  }

  // Check 2: No orphan nodes (all connected)
  const connectedSteps = new Set<string>();
  const triggerSteps = steps.filter(s => s.stepType === 'trigger');

  // BFS traversal from each trigger
  for (const trigger of triggerSteps) {
    const queue = [trigger.stepId];
    while (queue.length > 0) {
      const currentId = queue.shift();
      connectedSteps.add(currentId);
      const current = steps.find(s => s.stepId === currentId);
      if (current?.nextStepId) {
        queue.push(current.nextStepId);
      }
    }
  }

  // Find orphan nodes
  for (const step of steps) {
    if (!connectedSteps.has(step.stepId)) {
      errors.push({
        stepId: step.stepId,
        message: `Step ${step.stepId} is not connected to workflow`,
      });
    }
  }

  // Check 3: At least one trigger
  if (triggerSteps.length === 0) {
    errors.push({ message: 'Workflow must have at least one trigger' });
  }

  // Check 4: No circular dependencies
  // TODO: Implement cycle detection if needed

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Task 6.2: Code Review Validation UI (1.5h)

Review Dev 2's ValidationModal component:
- [ ] Opens when "Publish" button clicked
- [ ] Shows clear error messages for each validation issue
- [ ] Highlights problematic nodes on canvas
- [ ] Allows user to fix issues and re-validate
- [ ] Prevents publishing if validation fails

### Task 6.3: Early Integration Testing (2h)

Begin integration with existing BotWot backend:
- [ ] Test workflow creation API with JWT auth
- [ ] Test step creation with real node configs
- [ ] Test workflow publishing flow
- [ ] Document any integration issues
- [ ] Coordinate with Dev 3 on auth token handling

### Task 6.4: UI Polish & Bug Fixes (0.5h)

Address any UI issues found during testing:
- [ ] Canvas interactions smooth
- [ ] Node configuration saves correctly
- [ ] Validation feedback clear
- [ ] Loading states working

**End of Day 6 Check:**
- [ ] Validation catches all major workflow issues
- [ ] ValidationModal provides clear feedback
- [ ] Basic integration with existing APIs working
- [ ] No critical UI bugs

---

## Day 7-8: Integration & Auth (Tuesday-Wednesday)

**Time:** 4-5 hours/day
**Goal:** Integrate with existing BotWot APIs, JWT auth

### Task 7.1: Document API Integration Points (2h)

Create integration doc:

```markdown
// docs/API_INTEGRATION.md

## Existing APIs to Use

### Create Workflow
POST /workFlow/create
Body: { orgId, userId, botId, integrationId, phoneNumberId, name }
Returns: { workflowId }

### Create Step
POST /workFlow/step
Body: { workflowId, stepId, stepType, platform, actionId, config, position }
Returns: { stepId }

### Update Step (for connections)
PUT /workFlow/step/:wfId/:stepId
Body: { nextStepId }

### Publish Workflow
POST /workFlow/publish/:id
Returns: { status: 'PUBLISHED' }

## Integration Flow

When user clicks "Save Draft":
1. Call POST /workFlow/create (if new workflow)
2. For each node:
   - Call POST /workFlow/step
3. For each connection:
   - Call PUT /workFlow/step (update nextStepId)

When user clicks "Publish":
1. Call POST /workFlow/:id/validate (new API)
2. If valid, call POST /workFlow/publish/:id
```

### Task 7.2: Implement JWT Auth Integration (2h)

```typescript
// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
});

// Add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### Task 7.3: Implement saveWorkflow() (2h)

Help Dev 2:

```typescript
// src/api/services/workflowBuilderServices.ts
import axiosInstance from '../axiosInstance';

export const saveWorkflow = async (workflow: Workflow) => {
  // 1. Create workflow
  const { data: workflowData } = await axiosInstance.post('/workFlow/create', {
    orgId: workflow.orgId,
    userId: workflow.userId,
    name: workflow.name,
  });

  // 2. Create steps
  for (const node of workflow.nodes) {
    await axiosInstance.post('/workFlow/step', {
      workflowId: workflowData.workflowId,
      stepId: node.id,
      stepType: node.type,
      config: node.data.config,
      position: node.position,
    });
  }

  // 3. Update connections (nextStepId)
  for (const edge of workflow.edges) {
    await axiosInstance.put(`/workFlow/step/${workflowData.workflowId}/${edge.source}`, {
      nextStepId: edge.target,
    });
  }

  return workflowData;
};
```

**Test:** Save workflow, check MongoDB to see if data persisted

**End of Day 8 Check:**
- [ ] JWT auth works
- [ ] Workflows save to existing DB
- [ ] Multi-tenant isolation verified (orgId filtering)

---

## Day 9: E2E Testing (Thursday)

**Time:** 5 hours
**Goal:** Write and run E2E test

### Task 9.1: Setup Playwright (1h)

```bash
npm install -D @playwright/test

npx playwright install
```

Create config:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

### Task 9.2: Write E2E Test (3h)

```typescript
// e2e/workflow-builder.spec.ts
import { test, expect } from '@playwright/test';

test('create, validate, publish, and monitor workflow', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/);

  // Create new workflow
  await page.click('text=New Workflow');
  await expect(page).toHaveURL(/\/workflows\/builder/);

  // Drag WhatsApp Trigger
  const trigger = page.locator('text=WhatsApp Message Trigger').first();
  const canvas = page.locator('.react-flow');
  await trigger.dragTo(canvas, { targetPosition: { x: 300, y: 200 } });

  // Configure trigger
  await page.click('.react-flow__node:has-text("WhatsApp Message Trigger")');
  await page.selectOption('select[name="accountId"]', { index: 0 });
  await page.click('button:has-text("Save Configuration")');
  await expect(page.locator('text=Configuration saved')).toBeVisible();

  // Drag Decision Agent
  const agent = page.locator('text=Decision Agent').first();
  await agent.dragTo(canvas, { targetPosition: { x: 300, y: 400 } });

  // Configure agent
  await page.click('.react-flow__node:has-text("Decision Agent")');
  await page.fill('textarea[name="systemPrompt"]', 'Analyze customer intent and decide...');
  await page.click('button:has-text("Save Configuration")');

  // Connect trigger to agent
  const triggerHandle = page.locator('.react-flow__node:has-text("WhatsApp Message Trigger") .react-flow__handle-bottom');
  const agentHandle = page.locator('.react-flow__node:has-text("Decision Agent") .react-flow__handle-top');
  await triggerHandle.dragTo(agentHandle);

  // Drag Send WhatsApp action
  const action = page.locator('text=Send WhatsApp').first();
  await action.dragTo(canvas, { targetPosition: { x: 300, y: 600 } });

  // Configure action
  await page.click('.react-flow__node:has-text("Send WhatsApp")');
  await page.fill('textarea[name="messageTemplate"]', 'Hi {{customer_name}}, thanks for reaching out!');
  await page.click('button:has-text("Save Configuration")');

  // Connect agent to action
  const agentOutHandle = page.locator('.react-flow__node:has-text("Decision Agent") .react-flow__handle-bottom');
  const actionInHandle = page.locator('.react-flow__node:has-text("Send WhatsApp") .react-flow__handle-top');
  await agentOutHandle.dragTo(actionInHandle);

  // Save workflow
  await page.click('button:has-text("Save Draft")');
  await expect(page.locator('text=Draft saved')).toBeVisible();

  // Publish workflow (validation happens automatically)
  await page.click('button:has-text("Publish")');

  // Validation should pass
  await expect(page.locator('text=Validation passed')).toBeVisible();

  await page.click('button:has-text("Publish & Go Live")');
  await expect(page).toHaveURL(/\/workflows\/[a-z0-9]+/);

  // Check monitoring page
  await expect(page.locator('text=🟢 Live')).toBeVisible();
  await expect(page.locator('.execution-row')).toHaveCount(0); // No executions yet

  // View details
  await page.click('button:has-text("View Details")');
  await expect(page.locator('.step-log')).toHaveCount(3);
});
```

### Task 9.3: Run Test & Fix Issues (1h)

```bash
npx playwright test

# If test fails, debug:
npx playwright test --debug
```

**End of Day 9 Check:**
- [ ] E2E test passes
- [ ] Complete user journey works
- [ ] Screenshots captured for failures

---

## Day 10: Final Review & Deploy (Friday)

**Time:** 5 hours
**Goal:** Final review, bug fixes, deploy

### Task 10.1: Final Code Review (2h)

Review all merged code:
- [ ] No console.log
- [ ] No hardcoded values
- [ ] Error handling present
- [ ] Loading states implemented
- [ ] Responsive design (basic)

### Task 10.2: Performance Check (1h)

```typescript
// Test canvas performance
const testLargeWorkflow = () => {
  // Create 50 nodes
  const nodes = Array.from({ length: 50 }, (_, i) => ({
    id: `node-${i}`,
    type: 'trigger',
    position: { x: (i % 10) * 200, y: Math.floor(i / 10) * 200 },
    data: { label: `Node ${i}`, config: {}, configured: true },
  }));

  // Measure render time
  const start = performance.now();
  // Render canvas with 50 nodes
  const end = performance.now();
  console.log(`Render time: ${end - start}ms`); // Should be <2000ms
};
```

### Task 10.3: Deploy to Staging (2h)

```bash
# Frontend
cd BW_FE_Application
npm run build
# Deploy build/ to hosting (Vercel, Netlify, or S3)

# Backend
cd BW_ConsumerService
# Already deployed - just add new endpoints

# Run smoke tests
curl https://staging-api.wrrk.ai/workFlow/123/execute
```

**End of Day 10 Check:**
- [ ] All tests passing
- [ ] Deployed to staging
- [ ] Demo prepared
- [ ] Bug list documented (for post-MVP)

---

## Your Daily Checklist

**Every Morning (15 min):**
- [ ] Review Jira board
- [ ] Check for blockers
- [ ] Plan today's focus

**Every Evening (15 min):**
- [ ] Update Jira (move cards)
- [ ] Review PRs from team
- [ ] Document blockers

**Every Standup:**
1. What I did yesterday
2. What I'm doing today
3. Any blockers for team

---

## Code Review Checklist (Use Daily)

**For Every PR:**
- [ ] Code follows TypeScript best practices
- [ ] No `any` types
- [ ] No console.log
- [ ] Error handling present
- [ ] Tests written and passing
- [ ] Comments for complex logic
- [ ] No hardcoded values
- [ ] Follows existing patterns

**Approve only if:**
- All checkboxes checked
- Tests pass
- Manual testing done

---

## Tips for Success

1. **Don't code everything yourself** - Your job is to unblock team, not do all work
2. **Review code quickly** - Aim for <2 hour turnaround on PRs
3. **Pair program when stuck** - 30 min pair > 2 hours solo struggle
4. **Document decisions** - Future you will thank you
5. **Test integration points early** - Don't wait until Day 8
6. **Keep team motivated** - Celebrate daily wins

---

## Resources

- React Flow Docs: https://reactflow.dev
- BotWot Unified PRD: `BotWot_Unified_PRD.md`
- Tech Arch: `TECH_ARCH.md`
- Sprint Plan: `SPRINT.md`

---

**Good luck! You got this! 🚀**
