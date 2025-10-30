# **wrrk.ai - Technical Architecture Document**
## Visual Workflow Builder MVP

**Version:** 1.0
**Target:** Production-ready in 2 weeks
**Team:** 3 developers
**Philosophy:** Reuse 85%, Build 15%
**Date:** October 29, 2025

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [What Already Exists (Reuse)](#2-what-already-exists-reuse)
3. [What Needs to be Built (New)](#3-what-needs-to-be-built-new)
4. [System Architecture](#4-system-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Database Design](#7-database-design)
8. [API Specifications](#8-api-specifications)
9. [Real-time Architecture](#9-real-time-architecture)
10. [Node Type Mappings](#10-node-type-mappings)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Performance Considerations](#13-performance-considerations)
14. [Security Considerations](#14-security-considerations)
15. [Development Workflow](#15-development-workflow)

---

## 1. Architecture Overview

### 1.1 Core Principle: **Simplicity Through Reuse**

```
┌──────────────────────────────────────────────────────────┐
│  EXISTING INFRASTRUCTURE (85% reusable)                  │
│  ✅ Workflow CRUD APIs                                   │
│  ✅ Database schemas (workflows, workflowsteps)          │
│  ✅ All action implementations (WhatsApp, Voice, CRM)    │
│  ✅ All AI utilities (sentiment, intent, agents)         │
│  ✅ Authentication & multi-tenancy                       │
│  ✅ 50+ UI components                                    │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│  NEW DEVELOPMENT (15% to build)                          │
│  🔨 Visual canvas (React Flow)                           │
│  🔨 Node configuration UI                                │
│  🔨 Workflow execution engine                            │
│  🔨 Test mode                                            │
│  🔨 Execution monitoring                                 │
└──────────────────────────────────────────────────────────┘
```

### 1.2 MVP Scope

**In Scope (2 weeks):**
- Visual workflow builder with drag-drop
- 16 node types (Trigger, Agent, Action, Utility)
- Node configuration panel
- Test execution with sample data
- Workflow publish
- Real-time execution monitoring
- Execution logs (detailed step-by-step)

**Out of Scope (Post-MVP):**
- Workflow marketplace
- Collaboration features
- Advanced branching/loops
- Workflow versioning
- Mobile app
- Advanced conditionals

---

## 2. What Already Exists (Reuse)

### 2.1 Backend Services (100% Reusable)

#### **BW_ConsumerService (NestJS)**
**Location:** `BW_ConsumerService/src/integrations/whatsapp/workFlows/`

**Existing APIs:**
```typescript
✅ POST   /workFlow/create              // Create workflow
✅ PATCH  /workFlow/:id/rename          // Rename workflow
✅ POST   /workFlow/:id/add-phone       // Add phone number
✅ POST   /workFlow/step                // Create step
✅ PUT    /workFlow/step/:wfId/:stepId  // Update step
✅ DELETE /workFlow/step/:wfId/:stepId  // Delete step
✅ POST   /workFlow/publish/:id         // Publish workflow
✅ POST   /workFlow/unpublish/:id       // Unpublish workflow
✅ DELETE /workFlow/:id                 // Delete workflow
```

**What This Means:**
- ✅ Workflow CRUD is DONE
- ✅ Step management is DONE
- ✅ Publish/unpublish is DONE
- **We only need to ADD:**
  - Execute workflow endpoint
  - Test workflow endpoint
  - Get execution logs endpoint

#### **BW_BotCoreFunctionalityService (Python Flask)**
**All AI Utilities Already Exist:**

```python
✅ POST /qna                      # Conversational agent
✅ POST /sentiment-analysis       # Sentiment calculator
✅ POST /intent                   # Intent classifier
✅ POST /emotion-analysis         # Emotion detector
✅ POST /vulnerability-analysis   # Vulnerability scanner
✅ POST /reason-analysis          # Reason extractor
✅ POST /sales-intelligence       # Sales opportunity
✅ POST /generate-answer          # RAG-based text generation
```

**Agents:**
```python
✅ Travent Agent    # Hotel booking
✅ Shopify Agent    # E-commerce
✅ Decorpot Agent   # Interior design CRM (Decision agent)
```

**What This Means:**
- ✅ All "Utility" nodes are already implemented
- ✅ All "Agent" nodes have backend logic
- **We only need to ADD:**
  - Node configuration UI (frontend)
  - Node-to-API mappings

#### **BW_VOICE (NestJS)**
**Voice Actions:**
```typescript
✅ POST /twilio/outbound-call    # Initiate call
✅ GET  /voice-agents            # List voice agents
✅ POST /conversations/init      # Initialize conversation
```

**What This Means:**
- ✅ "Initiate Call" action is DONE
- **We only need to ADD:**
  - Node configuration UI

### 2.2 Database Schemas (95% Reusable)

#### **Existing: `workflows` Collection**
```typescript
✅ Workflow {
  orgId: string
  userId: string
  botId: string
  integrationId: string
  phoneNumberId: number
  flowStepIds: string[]           // Array of step IDs
  status: WorkflowStatus          // DRAFT, ACTIVE, PUBLISHED
  published: boolean
  isDeleted: boolean
  name: string
  createdAt: Date
  updatedAt: Date
}
```

#### **Existing: `workflowsteps` Collection**
```typescript
✅ WorkflowStep {
  workflowId: string
  stepId: string                  // Unique ID
  stepType: StepType              // MESSAGE, WEBHOOK, DELAY, CONDITION
  platform: PlatformType          // WHATSAPP, EMAIL, INTERNAL
  actionId: string                // send_message, send_template
  config: Record<string, any>     // Flexible config object
  isNextStep: boolean
  nextStepId?: string             // Link to next step
  published: boolean
  statusHistory: WorkflowStatus[]
  createdAt: Date
  updatedAt: Date
}
```

**What This Means:**
- ✅ Workflow data model is PERFECT for visual builder
- ✅ Steps can store any config in `config` object
- ✅ Steps link via `nextStepId` (perfect for connections)
- **We only need to ADD:**
  - Extended config for new node types
  - Node position metadata (x, y coordinates for canvas)

### 2.3 Frontend (80% Reusable)

#### **Existing UI Components:**
```typescript
✅ 50+ components in BW_FE_Application/src/components/
✅ Button, Input, Textarea, Select, Checkbox, Toggle
✅ Modal, Dialog, Toast, Dropdown
✅ Table, Card, Badge, Avatar
✅ Loader, Skeleton
✅ Form management (Formik + Yup)
```

#### **Existing Services:**
```typescript
✅ workflowBuilderServices.ts     // All workflow APIs wrapped
✅ axiosInstance                   // Configured with auth
✅ Redux store setup
```

**What This Means:**
- ✅ UI component library is DONE
- ✅ API integration layer is DONE
- **We only need to ADD:**
  - React Flow canvas component
  - Node library panel
  - Configuration panel (dynamic based on node type)
  - Test panel
  - Monitoring page

---

## 3. What Needs to be Built (New)

### 3.1 Frontend (New Development)

```
┌─────────────────────────────────────────────────────────┐
│  NEW FRONTEND COMPONENTS (Week 1)                       │
├─────────────────────────────────────────────────────────┤
│  1. WorkflowCanvas.tsx          (React Flow wrapper)    │
│  2. NodeLibraryPanel.tsx        (Left panel)            │
│  3. NodeConfigPanel.tsx         (Right panel, dynamic)  │
│  4. TestPanel.tsx               (Slide-in test UI)      │
│  5. WorkflowMonitoring.tsx      (Execution logs page)   │
│  6. Node components (16 types)  (Custom React Flow)     │
│  7. ExecutionTimeline.tsx       (Chart component)       │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Backend (New Development)

```
┌─────────────────────────────────────────────────────────┐
│  NEW BACKEND ENDPOINTS (Week 1-2)                       │
├─────────────────────────────────────────────────────────┤
│  1. POST /workFlow/:id/execute       (Run workflow)     │
│  2. POST /workFlow/:id/test          (Dry-run test)     │
│  3. GET  /workFlow/:id/executions    (List executions)  │
│  4. GET  /execution/:id              (Get exec details) │
│  5. POST /execution/:id/retry        (Retry failed)     │
│  6. POST /workFlow/:id/validate      (Pre-publish check)│
│  7. WebSocket /workflow-updates      (Real-time)        │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Database (New Collections)

```
┌─────────────────────────────────────────────────────────┐
│  NEW MONGODB COLLECTIONS                                │
├─────────────────────────────────────────────────────────┤
│  1. workflow_executions      (Track each run)           │
│  2. execution_logs           (Step-by-step logs)        │
└─────────────────────────────────────────────────────────┘
```

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    wrrk.ai Frontend (React)                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Workflow Builder (New)                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ Node Library │  │ React Flow   │  │ Config Panel │ │  │
│  │  │   (Left)     │  │   Canvas     │  │   (Right)    │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  │                                                        │  │
│  │  Test Panel (Slide-in)                                │  │
│  │  Monitoring Page (New)                                │  │
│  └────────────────────────────────────────────────────────┘  │
│                              │                               │
│                    ┌─────────┴─────────┐                     │
│                    │  Axios + Socket.io │                    │
│                    └─────────┬─────────┘                     │
└──────────────────────────────┼───────────────────────────────┘
                               │ HTTP / WebSocket
┌──────────────────────────────┼───────────────────────────────┐
│                 BW_ConsumerService (NestJS)                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Existing Workflow APIs (Reuse)                        │  │
│  │  • POST /workFlow/create, /step, /publish             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  NEW: Workflow Execution Engine                        │  │
│  │  • POST /workFlow/:id/execute                          │  │
│  │  • POST /workFlow/:id/test                             │  │
│  │  • GET  /workFlow/:id/executions                       │  │
│  │  • WebSocket /workflow-updates                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                              │                               │
└──────────────────────────────┼───────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
         ┌──────────▼─────────┐  ┌───────▼────────────┐
         │  BW_BotCore        │  │  BW_VOICE          │
         │  (Python Flask)    │  │  (NestJS)          │
         │  ✅ All Agents     │  │  ✅ Voice actions  │
         │  ✅ All Utilities  │  │                    │
         └────────────────────┘  └────────────────────┘
                    │
         ┌──────────▼─────────┐
         │  MongoDB           │
         │  • workflows       │  ← Existing
         │  • workflowsteps   │  ← Existing
         │  • workflow_executions (NEW)
         │  • execution_logs      (NEW)
         └────────────────────┘
```

### 4.2 Request Flow: Create Workflow

```
1. User drags nodes on canvas
   → Frontend: Create workflow
   → POST /workFlow/create
   → Response: { workflowId, status: 'DRAFT' }

2. User configures node
   → Frontend: Save configuration
   → POST /workFlow/step
   → Response: Step created with config

3. User connects nodes
   → Frontend: Update nextStepId
   → PUT /workFlow/step/:wfId/:stepId
   → Request: { nextStepId: '...' }

4. User clicks "Test"
   → Frontend: Open test panel
   → POST /workFlow/:id/test
   → Request: { testData: {...} }
   → Response: { steps: [{ stepId, status, output, time }] }

5. User clicks "Publish"
   → Frontend: Validate + Publish
   → POST /workFlow/:id/validate  (NEW)
   → POST /workFlow/publish/:id   (EXISTING)
   → Response: { status: 'ACTIVE' }
```

### 4.3 Request Flow: Execute Workflow

```
1. Trigger received (WhatsApp message)
   → Webhook → BW_ConsumerService
   → Check if workflow exists for this trigger
   → POST /workFlow/:id/execute (NEW)

2. Execution Engine:
   → Load workflow + all steps
   → Execute step 1 (Trigger node)
     → Extract trigger data
   → Execute step 2 (Agent node)
     → Call BW_BotCore API
     → Parse response
   → Execute step 3 (Action node)
     → Call WhatsApp API
   → Save execution log
   → Emit WebSocket event

3. Frontend (if monitoring page open):
   → Receive WebSocket event
   → Update execution log UI
   → Show step-by-step progress
```

---

## 5. Frontend Architecture

### 5.1 Technology Stack

```
Core:
  - React 19 + TypeScript
  - Vite (build tool)
  - React Router v6

State Management:
  - Zustand (lightweight, simpler than Redux for new code)
  - React Query (server state, caching)

Canvas:
  - @xyflow/react (React Flow v12)

UI Components:
  - Existing: Tailwind CSS, MUI, Radix UI
  - New: Custom React Flow nodes

Real-time:
  - Socket.io-client v4.8
```

### 5.2 Component Structure

```
src/
├── pages/
│   ├── Dashboard.tsx                    ← Existing (extend)
│   ├── WorkflowBuilder.tsx              ← NEW
│   └── WorkflowMonitoring.tsx           ← NEW
│
├── components/
│   ├── workflow/                        ← NEW DIRECTORY
│   │   ├── WorkflowCanvas.tsx           # React Flow wrapper
│   │   ├── NodeLibrary.tsx              # Left panel
│   │   ├── ConfigPanel.tsx              # Right panel (dynamic)
│   │   ├── TestPanel.tsx                # Test mode
│   │   ├── nodes/                       # Custom node components
│   │   │   ├── TriggerNode.tsx
│   │   │   ├── AgentNode.tsx
│   │   │   ├── ActionNode.tsx
│   │   │   └── UtilityNode.tsx
│   │   └── config/                      # Config forms per node type
│   │       ├── WhatsAppTriggerConfig.tsx
│   │       ├── DecisionAgentConfig.tsx
│   │       └── ...
│   │
│   ├── monitoring/                      ← NEW DIRECTORY
│   │   ├── ExecutionList.tsx
│   │   ├── ExecutionDetail.tsx
│   │   ├── ExecutionTimeline.tsx
│   │   └── StepLog.tsx
│   │
│   └── ui/                              ← Existing (reuse)
│       ├── Button.tsx
│       ├── Input.tsx
│       └── ...
│
├── store/
│   ├── workflowStore.ts                 ← NEW (Zustand)
│   └── executionStore.ts                ← NEW (Zustand)
│
├── hooks/
│   ├── useWorkflow.ts                   ← NEW
│   ├── useExecution.ts                  ← NEW
│   └── useWebSocket.ts                  ← NEW
│
├── api/
│   └── services/
│       ├── workflowBuilderServices.ts   ← Existing (extend)
│       └── executionServices.ts         ← NEW
│
└── types/
    ├── workflow.types.ts                ← NEW
    └── execution.types.ts               ← NEW
```

### 5.3 React Flow Configuration

```typescript
// WorkflowCanvas.tsx
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node types
const nodeTypes = {
  trigger: TriggerNode,
  agent: AgentNode,
  action: ActionNode,
  utility: UtilityNode,
};

// Validation: prevent invalid connections
const isValidConnection = (connection: Connection) => {
  // Trigger can only connect to Agent/Action/Utility
  // Agent can have multiple outputs (Decision agent: 3 paths)
  // Action/Utility single output
  return true; // Add logic
};

export function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  return (
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
      <MiniMap />
    </ReactFlow>
  );
}
```

### 5.4 State Management

```typescript
// store/workflowStore.ts (Zustand)
import create from 'zustand';

interface WorkflowStore {
  // Current workflow
  workflow: Workflow | null;

  // Canvas state
  nodes: Node[];
  edges: Edge[];

  // Selected node
  selectedNode: Node | null;

  // Actions
  setWorkflow: (workflow: Workflow) => void;
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (edgeId: string) => void;
  selectNode: (nodeId: string | null) => void;

  // Persist to backend
  saveToBackend: () => Promise<void>;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflow: null,
  nodes: [],
  edges: [],
  selectedNode: null,

  setWorkflow: (workflow) => set({ workflow }),

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
    // Auto-save to backend (debounced)
    debouncedSave();
  },

  // ... other actions
}));
```

### 5.5 WebSocket Integration

```typescript
// hooks/useWebSocket.ts
import { useEffect } from 'react';
import io from 'socket.io-client';

export function useWorkflowUpdates(workflowId: string) {
  useEffect(() => {
    const socket = io(process.env.VITE_WS_URL, {
      auth: { token: localStorage.getItem('token') }
    });

    // Subscribe to workflow execution updates
    socket.emit('subscribe', { workflowId });

    socket.on('execution:started', (data) => {
      // Update UI: show "Running" status
    });

    socket.on('execution:step', (data) => {
      // Update UI: show step progress
    });

    socket.on('execution:completed', (data) => {
      // Update UI: show success
    });

    socket.on('execution:failed', (data) => {
      // Update UI: show error
    });

    return () => {
      socket.emit('unsubscribe', { workflowId });
      socket.disconnect();
    };
  }, [workflowId]);
}
```

---

## 6. Backend Architecture

### 6.1 New Module: Workflow Execution Engine

**Location:** `BW_ConsumerService/src/integrations/whatsapp/workFlows/execution/`

```
execution/
├── execution.controller.ts        # HTTP endpoints
├── execution.service.ts           # Business logic
├── execution.gateway.ts           # WebSocket gateway
├── execution-engine.service.ts    # Core execution logic
├── step-executor.service.ts       # Execute individual steps
├── schemas/
│   ├── execution.schema.ts
│   └── execution-log.schema.ts
└── dtos/
    ├── execute-workflow.dto.ts
    ├── test-workflow.dto.ts
    └── retry-execution.dto.ts
```

### 6.2 Execution Engine Logic

```typescript
// execution-engine.service.ts
@Injectable()
export class ExecutionEngineService {
  constructor(
    private stepExecutor: StepExecutorService,
    private executionGateway: ExecutionGateway,
    @InjectModel('workflow_executions') private executionModel,
    @InjectModel('execution_logs') private logModel,
  ) {}

  /**
   * Execute workflow
   * @param workflowId - Workflow to execute
   * @param triggerData - Data from trigger (e.g., WhatsApp message)
   * @returns Execution result
   */
  async executeWorkflow(
    workflowId: string,
    triggerData: Record<string, any>
  ): Promise<ExecutionResult> {
    // 1. Load workflow + all steps
    const workflow = await this.loadWorkflow(workflowId);
    const steps = await this.loadSteps(workflowId);

    // 2. Create execution record
    const execution = await this.createExecution(workflow, triggerData);

    // 3. Emit WebSocket: execution started
    this.executionGateway.emitExecutionStarted(execution);

    // 4. Execute steps sequentially
    let currentStepId = steps[0].stepId; // Start with first step
    let context = { ...triggerData }; // Initial context

    while (currentStepId) {
      const step = steps.find(s => s.stepId === currentStepId);

      try {
        // Execute step
        const result = await this.stepExecutor.execute(step, context);

        // Log step execution
        await this.logStepExecution(execution._id, step, result);

        // Emit WebSocket: step completed
        this.executionGateway.emitStepCompleted(execution._id, step, result);

        // Update context with step output
        context = { ...context, ...result.output };

        // Move to next step
        currentStepId = result.success ? step.nextStepId : null;

      } catch (error) {
        // Log error
        await this.logStepError(execution._id, step, error);

        // Emit WebSocket: step failed
        this.executionGateway.emitStepFailed(execution._id, step, error);

        // Stop execution
        break;
      }
    }

    // 5. Mark execution as completed/failed
    await this.completeExecution(execution._id);

    // 6. Emit WebSocket: execution completed
    this.executionGateway.emitExecutionCompleted(execution);

    return execution;
  }
}
```

### 6.3 Step Executor

```typescript
// step-executor.service.ts
@Injectable()
export class StepExecutorService {
  constructor(
    private httpService: HttpService,
    private whatsappService: WhatsappService,
  ) {}

  async execute(
    step: WorkflowStep,
    context: Record<string, any>
  ): Promise<StepResult> {
    const startTime = Date.now();

    let result: any;

    // Execute based on step type
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

    const duration = Date.now() - startTime;

    return {
      success: true,
      output: result,
      duration,
    };
  }

  private async executeAgent(step: WorkflowStep, context: any) {
    const { agentType, systemPrompt, memoryContext } = step.config;

    // Call BW_BotCoreFunctionalityService
    const response = await this.httpService.post(
      `${process.env.BOT_SERVICE_URL}/qna`,
      {
        question: context.message_text,
        uuid: this.getAgentUuid(agentType),
        chatHistory: context.chatHistory || [],
      }
    ).toPromise();

    return {
      agent_response: response.data.response,
    };
  }

  private async executeAction(step: WorkflowStep, context: any) {
    const { actionType, recipient, messageTemplate } = step.config;

    if (actionType === 'send_whatsapp') {
      // Replace variables in template
      const message = this.replaceVariables(messageTemplate, context);

      // Send WhatsApp message
      await this.whatsappService.sendMessage(
        recipient || context.phone_number,
        message
      );

      return {
        message_sent: true,
        message_id: 'whatsapp_msg_123',
      };
    }

    // ... other actions
  }

  private async executeUtility(step: WorkflowStep, context: any) {
    const { utilityType, inputText } = step.config;

    // Call BW_BotCoreFunctionalityService
    if (utilityType === 'sentiment') {
      const response = await this.httpService.post(
        `${process.env.BOT_SERVICE_URL}/sentiment-analysis`,
        { text: inputText || context.message_text }
      ).toPromise();

      return {
        sentiment: response.data.sentiment,
        sentiment_score: response.data.score,
      };
    }

    // ... other utilities
  }

  private replaceVariables(template: string, context: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }
}
```

### 6.4 Test Execution (Dry-Run)

```typescript
// execution.service.ts
async testWorkflow(
  workflowId: string,
  testData: Record<string, any>
): Promise<TestResult> {
  // Same as executeWorkflow but:
  // 1. Don't save to database
  // 2. Don't emit WebSocket events
  // 3. Return all step results in response

  const workflow = await this.loadWorkflow(workflowId);
  const steps = await this.loadSteps(workflowId);

  const results = [];
  let context = { ...testData };
  let currentStepId = steps[0].stepId;

  while (currentStepId) {
    const step = steps.find(s => s.stepId === currentStepId);

    try {
      const result = await this.stepExecutor.execute(step, context);

      results.push({
        stepId: step.stepId,
        stepType: step.stepType,
        status: 'success',
        output: result.output,
        duration: result.duration,
      });

      context = { ...context, ...result.output };
      currentStepId = step.nextStepId;

    } catch (error) {
      results.push({
        stepId: step.stepId,
        stepType: step.stepType,
        status: 'failed',
        error: error.message,
      });
      break;
    }
  }

  return {
    workflowId,
    testData,
    steps: results,
    totalDuration: results.reduce((sum, r) => sum + (r.duration || 0), 0),
  };
}
```

### 6.5 WebSocket Gateway

```typescript
// execution.gateway.ts
@WebSocketGateway({
  namespace: 'workflow-updates',
  cors: { origin: '*' }
})
export class ExecutionGateway {
  @WebSocketServer()
  server: Server;

  emitExecutionStarted(execution: Execution) {
    this.server
      .to(`workflow:${execution.workflowId}`)
      .emit('execution:started', {
        executionId: execution._id,
        workflowId: execution.workflowId,
        startedAt: execution.startedAt,
      });
  }

  emitStepCompleted(executionId: string, step: WorkflowStep, result: any) {
    this.server
      .to(`execution:${executionId}`)
      .emit('execution:step', {
        executionId,
        stepId: step.stepId,
        status: 'completed',
        output: result.output,
        duration: result.duration,
      });
  }

  emitStepFailed(executionId: string, step: WorkflowStep, error: any) {
    this.server
      .to(`execution:${executionId}`)
      .emit('execution:step', {
        executionId,
        stepId: step.stepId,
        status: 'failed',
        error: error.message,
      });
  }

  emitExecutionCompleted(execution: Execution) {
    this.server
      .to(`workflow:${execution.workflowId}`)
      .emit('execution:completed', {
        executionId: execution._id,
        workflowId: execution.workflowId,
        status: execution.status,
        completedAt: execution.completedAt,
      });
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { workflowId: string }) {
    client.join(`workflow:${payload.workflowId}`);
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { workflowId: string }) {
    client.leave(`workflow:${payload.workflowId}`);
  }
}
```

---

## 7. Database Design

### 7.1 Extended Workflow Schema (Add Position Metadata)

```typescript
// Extend existing Workflow schema
@Schema({ timestamps: true, collection: 'workflows' })
export class Workflow {
  // ... existing fields ...

  @Prop({ type: Object, required: false })
  canvasMetadata?: {
    zoom: number;
    x: number;
    y: number;
  };
}
```

### 7.2 Extended WorkflowStep Schema (Add Position)

```typescript
// Extend existing WorkflowStep schema
@Schema({ timestamps: true, collection: 'workflowsteps' })
export class WorkflowStep {
  // ... existing fields ...

  @Prop({ type: Object, required: false })
  position?: {
    x: number;
    y: number;
  };

  @Prop({ type: String, required: false })
  nodeType?: string; // 'trigger' | 'agent' | 'action' | 'utility'
}
```

### 7.3 NEW: Execution Schema

```typescript
// schemas/execution.schema.ts
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

  @Prop({ enum: ['running', 'completed', 'failed'], default: 'running' })
  status: string;

  @Prop({ type: Object, required: true })
  triggerData: Record<string, any>; // Data that triggered the workflow

  @Prop({ type: Object, required: false })
  finalOutput?: Record<string, any>; // Final result

  @Prop({ type: Number, required: false })
  totalDuration?: number; // Total execution time (ms)

  @Prop({ type: Date, default: Date.now })
  startedAt: Date;

  @Prop({ type: Date, required: false })
  completedAt?: Date;

  @Prop({ type: String, required: false })
  errorMessage?: string;
}

export const ExecutionSchema = SchemaFactory.createForClass(Execution);

// Index for fast queries
ExecutionSchema.index({ workflowId: 1, startedAt: -1 });
ExecutionSchema.index({ orgId: 1, userId: 1 });
```

### 7.4 NEW: Execution Log Schema

```typescript
// schemas/execution-log.schema.ts
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

  @Prop({ enum: ['running', 'completed', 'failed'], default: 'running' })
  status: string;

  @Prop({ type: Object, required: false })
  input?: Record<string, any>; // Input data to this step

  @Prop({ type: Object, required: false })
  output?: Record<string, any>; // Output data from this step

  @Prop({ type: Number, required: false })
  duration?: number; // Step execution time (ms)

  @Prop({ type: String, required: false })
  errorMessage?: string;

  @Prop({ type: Date, default: Date.now })
  startedAt: Date;

  @Prop({ type: Date, required: false })
  completedAt?: Date;
}

export const ExecutionLogSchema = SchemaFactory.createForClass(ExecutionLog);

// Index for fast queries
ExecutionLogSchema.index({ executionId: 1, stepOrder: 1 });
```

### 7.5 Database Indexes

```typescript
// Create indexes for performance
db.workflow_executions.createIndex({ workflowId: 1, startedAt: -1 });
db.workflow_executions.createIndex({ orgId: 1, userId: 1 });
db.workflow_executions.createIndex({ status: 1 });

db.execution_logs.createIndex({ executionId: 1, stepOrder: 1 });
db.execution_logs.createIndex({ status: 1 });
```

---

## 8. API Specifications

### 8.1 Workflow Execution APIs (NEW)

#### **Execute Workflow**
```http
POST /workFlow/:workflowId/execute
Authorization: Bearer <token>

Request Body:
{
  "triggerData": {
    "phone_number": "+919876543210",
    "message_text": "Hello, I need help",
    "message_timestamp": "2025-10-29T10:00:00Z"
  }
}

Response (200):
{
  "executionId": "67123abc...",
  "workflowId": "67001def...",
  "status": "running",
  "startedAt": "2025-10-29T10:00:00Z"
}
```

#### **Test Workflow (Dry-Run)**
```http
POST /workFlow/:workflowId/test
Authorization: Bearer <token>

Request Body:
{
  "testData": {
    "phone_number": "+919876543210",
    "message_text": "Test message"
  }
}

Response (200):
{
  "workflowId": "67001def...",
  "testData": { ... },
  "steps": [
    {
      "stepId": "step_1",
      "stepType": "trigger",
      "status": "success",
      "output": { "phone_number": "...", "message_text": "..." },
      "duration": 120
    },
    {
      "stepId": "step_2",
      "stepType": "agent",
      "status": "success",
      "output": { "agent_response": "..." },
      "duration": 2300
    },
    {
      "stepId": "step_3",
      "stepType": "action",
      "status": "success",
      "output": { "message_sent": true },
      "duration": 850
    }
  ],
  "totalDuration": 3270
}
```

#### **Get Workflow Executions**
```http
GET /workFlow/:workflowId/executions?page=1&limit=20
Authorization: Bearer <token>

Response (200):
{
  "executions": [
    {
      "executionId": "67123abc...",
      "workflowId": "67001def...",
      "status": "completed",
      "startedAt": "2025-10-29T10:00:00Z",
      "completedAt": "2025-10-29T10:00:05Z",
      "totalDuration": 5230,
      "triggerData": { ... }
    },
    // ... more
  ],
  "total": 345,
  "page": 1,
  "limit": 20
}
```

#### **Get Execution Details**
```http
GET /execution/:executionId
Authorization: Bearer <token>

Response (200):
{
  "executionId": "67123abc...",
  "workflowId": "67001def...",
  "status": "completed",
  "startedAt": "2025-10-29T10:00:00Z",
  "completedAt": "2025-10-29T10:00:05Z",
  "totalDuration": 5230,
  "triggerData": { ... },
  "logs": [
    {
      "stepId": "step_1",
      "stepType": "trigger",
      "stepOrder": 0,
      "status": "completed",
      "input": { ... },
      "output": { ... },
      "duration": 120,
      "startedAt": "...",
      "completedAt": "..."
    },
    // ... all steps
  ]
}
```

#### **Retry Failed Execution**
```http
POST /execution/:executionId/retry
Authorization: Bearer <token>

Response (200):
{
  "executionId": "67123new...",
  "workflowId": "67001def...",
  "status": "running",
  "startedAt": "2025-10-29T10:30:00Z"
}
```

#### **Validate Workflow**
```http
POST /workFlow/:workflowId/validate
Authorization: Bearer <token>

Response (200):
{
  "valid": true,
  "errors": []
}

OR

Response (400):
{
  "valid": false,
  "errors": [
    {
      "stepId": "step_2",
      "field": "systemPrompt",
      "message": "System prompt is required for agent nodes"
    },
    {
      "stepId": "step_3",
      "message": "Action node has no output connection"
    }
  ]
}
```

### 8.2 WebSocket Events

#### **Client → Server**
```typescript
// Subscribe to workflow updates
socket.emit('subscribe', { workflowId: '67001def...' });

// Subscribe to specific execution
socket.emit('subscribe:execution', { executionId: '67123abc...' });

// Unsubscribe
socket.emit('unsubscribe', { workflowId: '67001def...' });
```

#### **Server → Client**
```typescript
// Execution started
socket.on('execution:started', (data) => {
  // data: { executionId, workflowId, startedAt }
});

// Step completed
socket.on('execution:step', (data) => {
  // data: { executionId, stepId, status, output, duration }
});

// Execution completed
socket.on('execution:completed', (data) => {
  // data: { executionId, workflowId, status, completedAt }
});

// Execution failed
socket.on('execution:failed', (data) => {
  // data: { executionId, workflowId, error }
});
```

---

## 9. Real-time Architecture

### 9.1 WebSocket Flow

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Monitoring Page)                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │  1. useEffect(() => {                             │  │
│  │       const socket = io('/workflow-updates');     │  │
│  │       socket.emit('subscribe', { workflowId });   │  │
│  │     }, []);                                       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │ Socket.io
┌─────────────────────────▼───────────────────────────────┐
│  BW_ConsumerService                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ExecutionGateway (WebSocketGateway)             │  │
│  │  • Manages connections                            │  │
│  │  • Emits events to subscribed clients            │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────▼───────────────────────────┐  │
│  │  ExecutionEngineService                           │  │
│  │  • Executes workflow                              │  │
│  │  • Calls gateway.emitStepCompleted()             │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 9.2 Room-based Broadcasting

```typescript
// Users subscribe to workflow-specific rooms
socket.join(`workflow:${workflowId}`);

// When execution starts, broadcast to all subscribers
this.server
  .to(`workflow:${workflowId}`)
  .emit('execution:started', { ... });

// For detailed step logs, users can subscribe to execution-specific room
socket.join(`execution:${executionId}`);

this.server
  .to(`execution:${executionId}`)
  .emit('execution:step', { ... });
```

---

## 10. Node Type Mappings

### 10.1 Node Type → Backend Mapping

| Node Type | Frontend ID | Backend stepType | Backend API | Service |
|-----------|-------------|------------------|-------------|---------|
| **Triggers** |
| WhatsApp Message | `trigger_whatsapp` | `trigger` | N/A (passive) | Webhook |
| Email Received | `trigger_email` | `trigger` | N/A | Webhook |
| Voice Call | `trigger_voice` | `trigger` | N/A | Webhook |
| **Agents** |
| Conversational | `agent_conversational` | `agent` | POST /qna | BotCore |
| Decision | `agent_decision` | `agent` | POST /qna (Decorpot) | BotCore |
| Reasoning | `agent_reasoning` | `agent` | POST /qna | BotCore |
| **Actions** |
| Send WhatsApp | `action_whatsapp` | `action` | WhatsappService.sendMessage() | Consumer |
| Send Email | `action_email` | `action` | MailService.sendMail() | Consumer |
| Initiate Call | `action_call` | `action` | POST /twilio/outbound-call | BW_VOICE |
| Update CRM | `action_crm` | `action` | Decorpot/Shopify APIs | Consumer |
| **Utilities** |
| Text Generator | `utility_text_gen` | `utility` | POST /generate-answer | BotCore |
| Sentiment Calc | `utility_sentiment` | `utility` | POST /sentiment-analysis | BotCore |
| Intent Calc | `utility_intent` | `utility` | POST /intent | BotCore |
| Vuln Scanner | `utility_vulnerability` | `utility` | POST /vulnerability-analysis | BotCore |
| Reason Analyzer | `utility_reason` | `utility` | POST /reason-analysis | BotCore |
| Custom AI | `utility_custom` | `utility` | Configurable endpoint | BotCore |

### 10.2 Node Configuration Schema

```typescript
// Example: Decision Agent Node
{
  nodeId: "node_abc123",
  nodeType: "agent",
  config: {
    agentType: "decision",
    systemPrompt: "Analyze customer intent and decide...",
    memoryContext: [
      { type: "file", url: "s3://..." },
      { type: "url", url: "https://..." }
    ],
    responseFormat: "decision", // Fixed: Approve/Reject/Review
    variables: ["customer_name", "message_text", "phone_number"]
  },
  position: { x: 300, y: 200 },
  outputs: [
    { id: "approve", label: "Approve" },
    { id: "reject", label: "Reject" },
    { id: "review", label: "Review" }
  ]
}

// Example: Send WhatsApp Action
{
  nodeId: "node_def456",
  nodeType: "action",
  config: {
    actionType: "send_whatsapp",
    messageTemplate: "Hi {{customer_name}}, thanks for your interest...",
    recipient: "{{phone_number}}", // Use variable
    conditionalExecution: {
      enabled: true,
      condition: "{{intent_calc}} == 'high' AND {{sentiment}} == 'positive'"
    },
    fallbackAction: {
      type: "send_alert_admin",
      message: "Failed to send WhatsApp to {{phone_number}}"
    }
  },
  position: { x: 600, y: 200 }
}
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

```
Backend (Jest + NestJS Testing):
  ✅ execution-engine.service.spec.ts
  ✅ step-executor.service.spec.ts
  ✅ execution.gateway.spec.ts
  ✅ Variable replacement logic
  ✅ Validation logic

Frontend (Vitest + React Testing Library):
  ✅ WorkflowCanvas.test.tsx
  ✅ NodeLibrary.test.tsx
  ✅ ConfigPanel.test.tsx
  ✅ TestPanel.test.tsx
  ✅ useWorkflow.test.ts
```

### 11.2 Integration Tests

```
Backend:
  ✅ Create workflow → Add steps → Publish → Execute
  ✅ Test workflow with sample data
  ✅ WebSocket event emission
  ✅ Retry failed execution

Frontend:
  ✅ Drag-drop node → Configure → Save
  ✅ Connect nodes → Update nextStepId
  ✅ Test mode → See results
  ✅ Publish workflow → Success
```

### 11.3 E2E Tests (Playwright)

```
Critical User Flows:
  ✅ User creates workflow from scratch
  ✅ User adds WhatsApp trigger
  ✅ User adds Decision agent
  ✅ User adds Send WhatsApp action
  ✅ User connects nodes
  ✅ User tests workflow
  ✅ User publishes workflow
  ✅ User monitors execution
  ✅ User retries failed execution
```

---

## 12. Deployment Architecture

### 12.1 Production Setup

```
┌─────────────────────────────────────────────────────────┐
│  Load Balancer (AWS ALB / Nginx)                        │
│  • HTTPS termination                                    │
│  • WebSocket support                                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Kubernetes Cluster (EKS / GKE) or Docker Swarm         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Frontend (React)                                  │ │
│  │  • Served by Nginx                                 │ │
│  │  • Static files on CDN (CloudFront)               │ │
│  │  Replicas: 2                                       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  BW_ConsumerService (NestJS)                       │ │
│  │  • Workflow APIs + Execution Engine                │ │
│  │  • WebSocket Gateway                               │ │
│  │  Replicas: 3                                       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  BW_BotCoreFunctionalityService (Python)           │ │
│  │  • AI utilities                                    │ │
│  │  Replicas: 2                                       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  BW_VOICE (NestJS)                                 │ │
│  │  • Voice actions                                   │ │
│  │  Replicas: 2                                       │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Managed Services                                        │
│  • MongoDB Atlas (M30 cluster, 3 nodes)                 │
│  • Redis (ElastiCache) - WebSocket adapter             │
│  • S3 - File storage                                    │
└──────────────────────────────────────────────────────────┘
```

### 12.2 Environment Variables

```bash
# BW_ConsumerService
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb://...
JWT_SECRET_KEY=...
BOT_SERVICE_URL=http://bot-service:5000
VOICE_SERVICE_URL=http://voice-service:8001
REDIS_URL=redis://...

# Frontend
VITE_API_URL=https://api.wrrk.ai
VITE_WS_URL=wss://api.wrrk.ai/workflow-updates
```

### 12.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Run unit tests
      - Run integration tests

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Build Docker images
      - Push to ECR/Docker Hub
      - Tag as production

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - Update Kubernetes manifests
      - kubectl apply -f k8s/
      - Run smoke tests
```

---

## 13. Performance Considerations

### 13.1 Frontend Performance

```
Canvas Optimization:
  ✅ Virtualize nodes (only render visible)
  ✅ Debounce save operations (500ms)
  ✅ Memoize node components
  ✅ Use React.memo for expensive renders
  ✅ Lazy load config panels

Bundle Size:
  ✅ Code splitting (React.lazy)
  ✅ Tree shaking
  ✅ Compress assets
  ✅ Target: <500KB initial bundle
```

### 13.2 Backend Performance

```
Execution Engine:
  ✅ Parallel step execution where possible (future)
  ✅ Cache workflow + steps (Redis, 5 min TTL)
  ✅ Connection pooling (MongoDB, Redis)
  ✅ Timeout per step (30s default)

Database Queries:
  ✅ Indexes on: workflowId, executionId, status
  ✅ Projection: Only fetch required fields
  ✅ Pagination: Limit 20 per page

WebSocket:
  ✅ Redis adapter for multi-instance scaling
  ✅ Room-based broadcasting (not global)
  ✅ Disconnect idle connections (5 min timeout)
```

### 13.3 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Canvas load time | <2s (50 nodes) | Virtualization |
| Save workflow | <500ms | Debounced API calls |
| Test execution | <5s (3 steps) | Fast APIs |
| Real-time latency | <200ms | WebSocket |
| Execution throughput | 100 workflows/sec | Horizontal scaling |

---

## 14. Security Considerations

### 14.1 Authentication & Authorization

```
✅ JWT tokens (existing)
✅ Multi-tenancy (orgId isolation)
✅ Role-based access (RBAC)
✅ API rate limiting (100 req/min per user)
```

### 14.2 Workflow Execution Security

```
✅ Validate workflow before execution
✅ Timeout per step (30s default, configurable)
✅ Sanitize user inputs (prevent injection)
✅ Isolate execution context (no cross-workflow data leakage)
```

### 14.3 WebSocket Security

```
✅ Authenticate on connection (JWT in auth header)
✅ Authorize room subscriptions (check workflow ownership)
✅ Rate limit socket events (10 events/sec per connection)
```

---

## 15. Development Workflow

### 15.1 Git Workflow

```
main (production)
  ↑
develop (staging)
  ↑
feature/workflow-builder
feature/execution-engine
feature/monitoring
```

### 15.2 Branch Strategy

```
Day 1-7:
  - feature/workflow-builder (Frontend dev)
  - feature/execution-engine (Backend dev)

Day 8-14:
  - feature/monitoring (Frontend dev)
  - feature/test-mode (Full-stack dev)
  - Merge to develop → Test → Merge to main
```

### 15.3 Code Review Checklist

```
✅ Unit tests pass
✅ Integration tests pass
✅ Code follows existing patterns
✅ No hardcoded values
✅ Error handling implemented
✅ TypeScript types defined
✅ Documentation updated
```

---

## 16. Summary: What to Build

### 16.1 Week 1 (Foundation)

**Frontend (Dev 1 + Dev 2):**
```
✅ Project setup (Vite + React + TypeScript)
✅ WorkflowCanvas.tsx (React Flow)
✅ NodeLibrary.tsx (Left panel)
✅ Node components (16 types)
✅ Basic drag-drop
✅ Integration with existing workflow APIs
```

**Backend (Dev 3):**
```
✅ Execution module setup
✅ execution.service.ts
✅ execution-engine.service.ts
✅ step-executor.service.ts
✅ Database schemas (Execution, ExecutionLog)
✅ Basic execute endpoint
```

### 16.2 Week 2 (Complete)

**Frontend (Dev 1 + Dev 2):**
```
✅ ConfigPanel.tsx (dynamic forms)
✅ TestPanel.tsx (test mode)
✅ WorkflowMonitoring.tsx (logs page)
✅ WebSocket integration
✅ Error handling
✅ Polish UI/UX
```

**Backend (Dev 3):**
```
✅ Test endpoint (dry-run)
✅ Validation endpoint
✅ WebSocket gateway
✅ Execution logs API
✅ Retry execution
✅ Integration with existing services (BotCore, Voice)
```

**All Devs:**
```
✅ Integration testing
✅ E2E testing
✅ Bug fixes
✅ Documentation
✅ Deploy to staging
```

---

## Appendix A: Tech Stack Summary

```
Frontend:
  ✅ React 19 + TypeScript
  ✅ Vite
  ✅ React Flow (canvas)
  ✅ Zustand (state)
  ✅ React Query (server state)
  ✅ Socket.io-client (WebSocket)
  ✅ Tailwind CSS + MUI (UI)

Backend:
  ✅ NestJS 10 (TypeScript)
  ✅ MongoDB (Mongoose)
  ✅ Socket.io (WebSocket)
  ✅ Axios (HTTP client)
  ✅ JWT (auth)

Existing Services (Reuse):
  ✅ BW_BotCoreFunctionalityService (Python Flask) - AI
  ✅ BW_VOICE (NestJS) - Voice
  ✅ cron_Service (NestJS) - Scheduling

Infrastructure:
  ✅ MongoDB Atlas
  ✅ Redis (optional, for WebSocket scaling)
  ✅ AWS S3
  ✅ Docker + Kubernetes
```

---

## Appendix B: Folder Structure

```
wrrk.ai/
├── frontend/                           ← NEW (React app)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── WorkflowBuilder.tsx
│   │   │   └── WorkflowMonitoring.tsx
│   │   ├── components/
│   │   │   └── workflow/              ← NEW
│   │   ├── store/
│   │   │   └── workflowStore.ts       ← NEW
│   │   └── api/
│   │       └── services/
│   │           └── executionServices.ts ← NEW
│   └── package.json
│
├── BW_ConsumerService/                 ← EXISTING (extend)
│   ├── src/
│   │   └── integrations/
│   │       └── whatsapp/
│   │           └── workFlows/
│   │               ├── workFlow.service.ts      ← Existing (reuse)
│   │               ├── workFlow.controller.ts   ← Existing (extend)
│   │               └── execution/               ← NEW
│   │                   ├── execution.controller.ts
│   │                   ├── execution.service.ts
│   │                   ├── execution.gateway.ts
│   │                   ├── execution-engine.service.ts
│   │                   └── step-executor.service.ts
│   └── package.json
│
├── BW_BotCoreFunctionalityService/    ← EXISTING (reuse 100%)
├── BW_VOICE/                           ← EXISTING (reuse 100%)
└── APP.md                              ← App Experience Doc
└── TECH_ARCH.md                        ← This document
```

---

**Document End**

**Last Updated:** October 29, 2025
**Version:** 1.0
**Next Steps:** Create 2-week sprint plan with task breakdown
