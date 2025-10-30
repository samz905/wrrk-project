# Dev 2 (Frontend Specialist) - Action Plan

**Role:** Frontend Developer, React Flow, UI Components
**Total Time:** 90 hours over 10 days (8-10h/day)
**Focus:** Canvas, nodes, configuration forms, monitoring UI

---

## Your Responsibilities

1. ✅ **React Flow Canvas** (drag-drop, connections)
2. ✅ **Node Library Panel** (16 node types)
3. ✅ **16 Custom Node Components**
4. ✅ **16 Configuration Forms**
5. ✅ **Test Panel UI**
6. ✅ **Monitoring Dashboard**

---

## Day 1: Canvas Foundation (Monday)

**Time:** 9 hours
**Goal:** React Flow canvas working with basic drag-drop

### Morning (4h): React Flow Setup

#### Task 1.1: Install Dependencies (30 min)

```bash
cd BW_FE_Application

# Install React Flow
npm install @xyflow/react

# Install other dependencies
npm install zustand  # State management
npm install react-hook-form  # Form handling
npm install yup  # Validation
npm install @headlessui/react  # UI components
npm install uuid  # Generate IDs
```

**Test:** `npm start` should work without errors

---

#### Task 1.2: Create WorkflowCanvas Component (2h)

Create file: `src/components/workflow/canvas/WorkflowCanvas.tsx`

```typescript
import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// We'll create these node components later
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

interface WorkflowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
}

export default function WorkflowCanvas({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  // When nodes change, notify parent
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChangeInternal(changes);
      if (onNodesChange) {
        onNodesChange(nodes);
      }
    },
    [onNodesChangeInternal, onNodesChange, nodes]
  );

  // When edges change, notify parent
  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChangeInternal(changes);
      if (onEdgesChange) {
        onEdgesChange(edges);
      }
    },
    [onEdgesChangeInternal, onEdgesChange, edges]
  );

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

**Test:** Import in a test page, should render empty canvas with grid

---

#### Task 1.3: Create Node Library Panel (1.5h)

Create file: `src/components/workflow/NodeLibrary.tsx`

```typescript
import { useState } from 'react';

export interface NodeTypeInfo {
  id: string;
  type: 'trigger' | 'agent' | 'action' | 'utility';
  label: string;
  icon: string; // Emoji or icon class
  description: string;
}

const nodeTypes: NodeTypeInfo[] = [
  // Triggers
  { id: 'trigger_whatsapp', type: 'trigger', label: 'WhatsApp Message', icon: '📱', description: 'Triggered when WhatsApp message received' },
  { id: 'trigger_email', type: 'trigger', label: 'Email Received', icon: '✉️', description: 'Triggered when email received' },
  { id: 'trigger_voice', type: 'trigger', label: 'Voice Call', icon: '📞', description: 'Triggered when phone call received' },

  // Agents
  { id: 'agent_conversational', type: 'agent', label: 'Conversational Agent', icon: '🤖', description: 'AI chatbot for conversations' },
  { id: 'agent_decision', type: 'agent', label: 'Decision Agent', icon: '⚖️', description: 'AI decision maker (Approve/Reject/Review)' },
  { id: 'agent_reasoning', type: 'agent', label: 'Reasoning Agent', icon: '🧠', description: 'AI reasoning and analysis' },

  // Actions
  { id: 'action_whatsapp', type: 'action', label: 'Send WhatsApp', icon: '📱', description: 'Send WhatsApp message' },
  { id: 'action_email', type: 'action', label: 'Send Email', icon: '✉️', description: 'Send email message' },
  { id: 'action_call', type: 'action', label: 'Initiate Call', icon: '📞', description: 'Make outbound phone call' },
  { id: 'action_crm', type: 'action', label: 'Update CRM', icon: '📊', description: 'Update CRM record' },

  // Utilities
  { id: 'utility_text_gen', type: 'utility', label: 'Text Generator', icon: '📝', description: 'Generate text with AI' },
  { id: 'utility_sentiment', type: 'utility', label: 'Sentiment Calculator', icon: '😊', description: 'Analyze sentiment' },
  { id: 'utility_intent', type: 'utility', label: 'Intent Calculator', icon: '🎯', description: 'Detect user intent' },
  { id: 'utility_vulnerability', type: 'utility', label: 'Vulnerability Scanner', icon: '🛡️', description: 'Scan for vulnerabilities' },
  { id: 'utility_reason', type: 'utility', label: 'Reason Analyzer', icon: '🔍', description: 'Extract core reason' },
  { id: 'utility_custom', type: 'utility', label: 'Custom AI Utility', icon: '⚙️', description: 'Custom AI utility' },
];

interface NodeLibraryProps {
  onNodeDrag: (nodeType: NodeTypeInfo) => void;
}

export default function NodeLibrary({ onNodeDrag }: NodeLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    trigger: true,
    agent: true,
    action: true,
    utility: true,
  });

  const filteredNodes = nodeTypes.filter((node) =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedNodes = {
    trigger: filteredNodes.filter((n) => n.type === 'trigger'),
    agent: filteredNodes.filter((n) => n.type === 'agent'),
    action: filteredNodes.filter((n) => n.type === 'action'),
    utility: filteredNodes.filter((n) => n.type === 'utility'),
  };

  const toggleCategory = (category: keyof typeof expandedCategories) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Nodes</h3>

      {/* Search */}
      <input
        type="text"
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
      />

      {/* Categories */}
      {Object.entries(groupedNodes).map(([category, nodes]) => (
        <div key={category} className="mb-4">
          <button
            onClick={() => toggleCategory(category as any)}
            className="flex items-center justify-between w-full text-left font-medium mb-2"
          >
            <span className="capitalize">{category}s ({nodes.length})</span>
            <span>{expandedCategories[category as keyof typeof expandedCategories] ? '▼' : '▶'}</span>
          </button>

          {expandedCategories[category as keyof typeof expandedCategories] && (
            <div className="space-y-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', JSON.stringify(node));
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  className="p-2 border border-gray-300 rounded cursor-move hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{node.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{node.label}</div>
                      <div className="text-xs text-gray-500">{node.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Test:** Panel renders, search works, categories collapse/expand

---

### Afternoon (5h): Drag-Drop Implementation

#### Task 1.4: Integrate Drag-Drop (3h)

Create main workflow builder page: `src/pages/workflow/WorkflowBuilder.tsx`

```typescript
import { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactFlow, { Node, Edge, ReactFlowInstance } from '@xyflow/react';
import NodeLibrary from '../../components/workflow/NodeLibrary';
import WorkflowCanvas from '../../components/workflow/canvas/WorkflowCanvas';

export default function WorkflowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  // Handle drop on canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      if (!reactFlowInstance || !reactFlowBounds) return;

      // Convert screen coordinates to flow coordinates
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: uuidv4(),
        type: nodeData.type,
        position,
        data: {
          label: nodeData.label,
          nodeType: nodeData.id,
          config: {},
          configured: false,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <NodeLibrary onNodeDrag={() => {}} />

      {/* Canvas */}
      <div
        ref={reactFlowWrapper}
        className="flex-1"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <WorkflowCanvas
          initialNodes={nodes}
          initialEdges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
        />
      </div>

      {/* Right Panel - Config Panel (we'll add later) */}
      <div className="w-96 border-l border-gray-200 bg-white p-4">
        <p className="text-gray-500">Select a node to configure</p>
      </div>
    </div>
  );
}
```

**Test:** Drag node from library, drop on canvas, node appears

---

#### Task 1.5: Create Basic Node Components (2h)

Create 4 base node components. Start with TriggerNode:

`src/components/workflow/nodes/TriggerNode.tsx`

```typescript
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export default memo(({ data }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-purple-100 border-2 border-purple-400">
      <div className="flex items-center">
        <div className="mr-2 text-2xl">📱</div>
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          {data.configured ? (
            <div className="text-xs text-green-600">✓ Configured</div>
          ) : (
            <div className="text-xs text-red-600">⚠ Not configured</div>
          )}
        </div>
      </div>

      {/* Output handle */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
```

Copy and modify for other node types:
- `AgentNode.tsx` - blue background (`bg-blue-100 border-blue-400`)
- `ActionNode.tsx` - green background (`bg-green-100 border-green-400`)
- `UtilityNode.tsx` - yellow background (`bg-yellow-100 border-yellow-400`)

Add input handles where needed (all except triggers need input).

**Test:** Nodes render with correct colors

**End of Day 1 Check:**
- [ ] Canvas renders
- [ ] Can drag nodes from library
- [ ] Nodes drop on canvas
- [ ] Nodes have correct colors

---

## Day 2: Node Connections & Config Panel (Tuesday)

**Time:** 9 hours
**Goal:** Nodes can connect, config panel opens

### Morning (4h): Node Connections

#### Task 2.1: Add Connection Handles (1h)

Update node components to have input/output handles:

```typescript
// AgentNode.tsx (example)
<div className="px-4 py-2 shadow-md rounded-md bg-blue-100 border-2 border-blue-400">
  {/* Input handle */}
  <Handle type="target" position={Position.Top} />

  <div className="flex items-center">
    {/* ... node content ... */}
  </div>

  {/* Output handle */}
  <Handle type="source" position={Position.Bottom} />
</div>
```

**Special case - Decision Agent has 3 outputs:**

```typescript
// DecisionAgentNode.tsx
<div className="relative">
  <Handle type="target" position={Position.Top} />

  {/* Node content */}

  {/* 3 output handles */}
  <Handle type="source" position={Position.Bottom} id="approve" style={{ left: '25%' }} />
  <Handle type="source" position={Position.Bottom} id="reject" style={{ left: '50%' }} />
  <Handle type="source" position={Position.Bottom} id="review" style={{ left: '75%' }} />
</div>
```

---

#### Task 2.2: Implement Connection Validation (2h)

Create validation utility: `src/utils/connectionValidation.ts`

```typescript
import { Connection, Node, Edge } from '@xyflow/react';

export const isValidConnection = (
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
): boolean => {
  const { source, target } = connection;

  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);

  if (!sourceNode || !targetNode) return false;

  const sourceType = sourceNode.type;
  const targetType = targetNode.type;

  // Define valid connections
  const validConnections: Record<string, string[]> = {
    trigger: ['agent', 'action', 'utility'],
    agent: ['agent', 'action', 'utility'],
    action: [], // Terminal nodes
    utility: ['agent', 'action', 'utility'],
  };

  // Check if this connection is valid
  if (!validConnections[sourceType || '']?.includes(targetType || '')) {
    return false;
  }

  // Prevent connecting to same node
  if (source === target) {
    return false;
  }

  // Prevent duplicate connections
  const existingEdge = edges.find(
    (e) => e.source === source && e.target === target
  );
  if (existingEdge) {
    return false;
  }

  return true;
};
```

Add to WorkflowCanvas:

```typescript
import { isValidConnection } from '../../../utils/connectionValidation';

// In component:
<ReactFlow
  // ... other props ...
  isValidConnection={(connection) => isValidConnection(connection, nodes, edges)}
/>
```

**Test:** Try invalid connections (Trigger → Trigger), should be blocked

---

#### Task 2.3: Style Connections (1h)

Add custom edge styling:

```typescript
// In WorkflowCanvas.tsx
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: { stroke: '#6366f1', strokeWidth: 2 },
};

<ReactFlow
  // ... other props ...
  defaultEdgeOptions={defaultEdgeOptions}
/>
```

**Test:** Connections have smooth curves and blue color

---

### Afternoon (5h): Configuration Panel

#### Task 2.4: Create Config Panel Layout (2h)

Create `src/components/workflow/ConfigPanel.tsx`:

```typescript
import { X } from 'lucide-react'; // Icon library

interface ConfigPanelProps {
  selectedNode: any | null;
  onClose: () => void;
  onSave: (config: any) => void;
}

export default function ConfigPanel({ selectedNode, onClose, onSave }: ConfigPanelProps) {
  if (!selectedNode) {
    return (
      <div className="w-96 border-l border-gray-200 bg-white p-4">
        <p className="text-gray-500 text-center mt-8">Select a node to configure</p>
      </div>
    );
  }

  return (
    <div className="w-96 border-l border-gray-200 bg-white p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{selectedNode.data.label}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Config Form - dynamic based on node type */}
      <div>
        {/* We'll add config forms here */}
        <p>Node Type: {selectedNode.data.nodeType}</p>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave({})}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
```

---

#### Task 2.5: Wire Up Node Selection (1h)

In WorkflowBuilder.tsx:

```typescript
const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);

// Add node click handler
const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
  setSelectedNode(node);
}, []);

// In WorkflowCanvas:
<ReactFlow
  // ... other props ...
  onNodeClick={onNodeClick}
/>

// In Config Panel:
<ConfigPanel
  selectedNode={selectedNode}
  onClose={() => setSelectedNode(null)}
  onSave={(config) => {
    // Update node with config
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode?.id
          ? { ...n, data: { ...n.data, config, configured: true } }
          : n
      )
    );
    setSelectedNode(null);
  }}
/>
```

**Test:** Click node, config panel opens

---

#### Task 2.6: Create Dynamic Form Router (2h)

Create `src/components/workflow/config/ConfigFormRouter.tsx`:

```typescript
import WhatsAppTriggerConfig from './WhatsAppTriggerConfig';
import EmailTriggerConfig from './EmailTriggerConfig';
// Import all 16 config forms...

interface ConfigFormRouterProps {
  nodeType: string;
  initialConfig: any;
  onSave: (config: any) => void;
}

export default function ConfigFormRouter({ nodeType, initialConfig, onSave }: ConfigFormRouterProps) {
  switch (nodeType) {
    case 'trigger_whatsapp':
      return <WhatsAppTriggerConfig initialConfig={initialConfig} onSave={onSave} />;
    case 'trigger_email':
      return <EmailTriggerConfig initialConfig={initialConfig} onSave={onSave} />;
    // ... all 16 cases
    default:
      return <div>Unknown node type: {nodeType}</div>;
  }
}
```

**Test:** Different node types load different forms (even if empty for now)

**End of Day 2 Check:**
- [ ] Nodes can connect
- [ ] Invalid connections blocked
- [ ] Config panel opens on click
- [ ] Form router ready

---

## Day 3-5: Configuration Forms (Wednesday-Friday)

**Time:** 8h/day = 24 hours total
**Goal:** All 16 configuration forms complete

### Strategy

Create one config form per hour (each form takes ~1-1.5 hours).

---

### Example Config Form Template

Use this template for all forms:

```typescript
// src/components/workflow/config/WhatsAppTriggerConfig.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  accountId: yup.string().required('WhatsApp account is required'),
  keywordMatch: yup.string(),
  conditions: yup.object(),
});

interface ConfigFormProps {
  initialConfig: any;
  onSave: (config: any) => void;
}

export default function WhatsAppTriggerConfig({ initialConfig, onSave }: ConfigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialConfig || {},
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      {/* Account Select */}
      <div>
        <label className="block text-sm font-medium mb-1">
          WhatsApp Account <span className="text-red-500">*</span>
        </label>
        <select
          {...register('accountId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select account...</option>
          <option value="account1">+91 98765 43210</option>
          <option value="account2">+91 98765 54321</option>
        </select>
        {errors.accountId && (
          <p className="text-red-500 text-xs mt-1">{errors.accountId.message}</p>
        )}
      </div>

      {/* Keyword Match */}
      <div>
        <label className="block text-sm font-medium mb-1">Keyword Match</label>
        <input
          {...register('keywordMatch')}
          type="text"
          placeholder='e.g., "help", "support"'
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Conditions */}
      <div>
        <label className="block text-sm font-medium mb-1">Trigger Conditions</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" {...register('conditions.keywordMatch')} className="mr-2" />
            <span className="text-sm">Keyword match</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" {...register('conditions.messageStatus')} className="mr-2" />
            <span className="text-sm">Message status</span>
          </label>
        </div>
      </div>

      {/* Submit (handled by parent) */}
    </form>
  );
}
```

---

### Day 3 Forms (8 forms)

1. **WhatsAppTriggerConfig** (1h)
2. **EmailTriggerConfig** (1h)
3. **VoiceTriggerConfig** (1h)
4. **ConversationalAgentConfig** (1.5h) - Has textarea for system prompt, KB selector
5. **DecisionAgentConfig** (1.5h) - Similar to conversational but fixed outputs
6. **ReasoningAgentConfig** (1h)
7. **SendWhatsAppConfig** (1.5h) - Has message template with variable insertion
8. **SendEmailConfig** (1.5h)

**Test each:** Fill form, click save (handled by parent ConfigPanel)

---

### Day 4 Forms (4 actions + 2 utilities)

9. **InitiateCallConfig** (1h)
10. **UpdateCRMConfig** (1.5h) - CRM system selector, dynamic fields
11. **TextGeneratorConfig** (1h)
12. **SentimentCalcConfig** (30 min) - Just input text field
13. **IntentCalcConfig** (30 min) - Just input text field
14. **VulnScannerConfig** (30 min)

Continue pattern...

---

### Day 5 Forms (Finish remaining)

15. **ReasonAnalyzerConfig** (30 min)
16. **CustomAIUtilityConfig** (1h)

**Also on Day 5:**
- Add variable insertion UI component (2h)
- Add form validation polish (2h)
- Test all 16 forms (2h)

**End of Day 5 Check:**
- [ ] All 16 config forms done
- [ ] Validation works for all
- [ ] Forms save to node data

---

## Day 6: Test Panel (Monday)

**Time:** 7 hours
**Goal:** Test panel UI complete

### Task 6.1: Create Test Panel Component (3h)

`src/components/workflow/test/TestPanel.tsx`:

```typescript
import { useState } from 'react';
import { X } from 'lucide-react';

interface TestPanelProps {
  workflowId: string;
  triggerType: string;
  onClose: () => void;
}

export default function TestPanel({ workflowId, triggerType, onClose }: TestPanelProps) {
  const [testData, setTestData] = useState<any>({});
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async () => {
    setIsRunning(true);
    try {
      const response = await fetch(`/api/workFlow/${workflowId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testData }),
      });
      const results = await response.json();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Test Workflow</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Test Data Input */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Step 1: Provide Test Data</h4>
          {triggerType === 'trigger_whatsapp' && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Phone Number"
                value={testData.phone_number || ''}
                onChange={(e) => setTestData({ ...testData, phone_number: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                placeholder="Message Text"
                value={testData.message_text || ''}
                onChange={(e) => setTestData({ ...testData, message_text: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
          )}
          {/* Add other trigger types... */}
        </div>

        {/* Run Test Button */}
        <button
          onClick={runTest}
          disabled={isRunning}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isRunning ? 'Running...' : 'Run Test'}
        </button>

        {/* Test Results */}
        {testResults && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Test Results</h4>
            <div className="space-y-2">
              {testResults.steps?.map((step: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 border rounded ${
                    step.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {step.status === 'success' ? '✅' : '❌'} Step {index + 1}: {step.stepType}
                    </span>
                    <span className="text-xs text-gray-500">{step.duration}ms</span>
                  </div>
                  {step.output && (
                    <pre className="text-xs mt-2 overflow-x-auto">
                      {JSON.stringify(step.output, null, 2)}
                    </pre>
                  )}
                  {step.error && <p className="text-red-600 text-sm mt-2">{step.error}</p>}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Total time: {testResults.totalDuration}ms</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Task 6.2: Add Test Button to Top Bar (1h)

In WorkflowBuilder.tsx:

```typescript
const [showTestPanel, setShowTestPanel] = useState(false);

// Add to UI:
<div className="absolute top-4 right-4 flex gap-2">
  <button onClick={() => setShowTestPanel(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
    🧪 Test
  </button>
  <button className="px-4 py-2 bg-gray-600 text-white rounded">
    💾 Save Draft
  </button>
  <button className="px-4 py-2 bg-green-600 text-white rounded">
    🚀 Publish
  </button>
</div>

{showTestPanel && (
  <TestPanel
    workflowId={workflowId}
    triggerType={nodes[0]?.data.nodeType}
    onClose={() => setShowTestPanel(false)}
  />
)}
```

**Test:** Click Test button, panel slides in

**End of Day 6 Check:**
- [ ] Test panel opens
- [ ] Can input test data
- [ ] Run test calls API
- [ ] Results display

---

## Day 7: Monitoring Page (Tuesday)

**Time:** 9 hours
**Goal:** Monitoring dashboard complete

### Task 7.1: Create Monitoring Page (3h)

`src/pages/workflow/WorkflowMonitoring.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function WorkflowMonitoring() {
  const { workflowId } = useParams();
  const [executions, setExecutions] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', dateRange: '7d' });

  useEffect(() => {
    fetchExecutions();
  }, [workflowId, filters]);

  const fetchExecutions = async () => {
    const response = await fetch(
      `/api/workFlow/${workflowId}/executions?status=${filters.status}&dateRange=${filters.dateRange}`
    );
    const data = await response.json();
    setExecutions(data.executions);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Workflow Monitoring</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>

        <button onClick={fetchExecutions} className="px-4 py-2 bg-blue-600 text-white rounded">
          Refresh
        </button>
      </div>

      {/* Execution Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Execution ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Started At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {executions.map((execution: any) => (
              <ExecutionRow key={execution.executionId} execution={execution} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Task 7.2: Create Execution Row with Expandable Details (3h)

```typescript
function ExecutionRow({ execution }: { execution: any }) {
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    if (!expanded) {
      const response = await fetch(`/api/execution/${execution.executionId}`);
      const data = await response.json();
      setLogs(data.logs);
    }
    setExpanded(!expanded);
  };

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm">{execution.executionId}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={execution.status} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          {new Date(execution.startedAt).toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          {execution.totalDuration}ms
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <button onClick={loadLogs} className="text-blue-600 hover:underline">
            {expanded ? 'Hide Details ▲' : 'View Details ▼'}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="px-6 py-4 bg-gray-50">
            <ExecutionDetails logs={logs} />
          </td>
        </tr>
      )}
    </>
  );
}
```

### Task 7.3: Create Execution Details Component (2h)

```typescript
function ExecutionDetails({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Step-by-Step Execution</h4>
      {logs.map((log, index) => (
        <div
          key={index}
          className={`p-3 border rounded ${
            log.status === 'completed' ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {log.status === 'completed' ? '✅' : '❌'} {log.stepType}
            </span>
            <span className="text-xs text-gray-500">{log.duration}ms</span>
          </div>

          {/* Input/Output */}
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-blue-600">Show data</summary>
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-xs font-medium">Input:</p>
                <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.input, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium">Output:</p>
                <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.output, null, 2)}
                </pre>
              </div>
            </div>
          </details>

          {log.errorMessage && (
            <p className="text-red-600 text-sm mt-2">{log.errorMessage}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Task 7.4: Add Polling Refresh (1h)

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchExecutions();
  }, 5000); // Poll every 5 seconds

  return () => clearInterval(interval);
}, [workflowId, filters]);
```

**End of Day 7 Check:**
- [ ] Monitoring page renders
- [ ] Execution list loads
- [ ] Can expand to see details
- [ ] Polling refreshes automatically

---

## Day 8: Polish & Variable Insertion (Wednesday)

**Time:** 8 hours

### Task 8.1: Create Variable Insertion Component (3h)

`src/components/workflow/VariableInserter.tsx`:

```typescript
import { useState } from 'react';

interface VariableInserterProps {
  availableVariables: string[];
  onInsert: (variable: string) => void;
}

export default function VariableInserter({ availableVariables, onInsert }: VariableInserterProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-sm text-blue-600 hover:underline"
      >
        Insert Variable
      </button>

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg">
          {availableVariables.map((variable) => (
            <button
              key={variable}
              onClick={() => {
                onInsert(`{{${variable}}}`);
                setShowDropdown(false);
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              {variable}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

Add to text/textarea fields in config forms.

### Task 8.2: UI Polish (3h)

- Add loading spinners
- Add error toasts
- Improve spacing/padding
- Add hover states
- Test responsive design (even though desktop-first)

### Task 8.3: Accessibility (2h)

- Add aria-labels
- Test keyboard navigation (Tab, Enter, Esc)
- Ensure focus visible
- Test with screen reader (basic)

**End of Day 8 Check:**
- [ ] Variable insertion works
- [ ] UI looks polished
- [ ] Basic accessibility works

---

## Day 9-10: Bug Fixes & Final Testing (Thursday-Friday)

**Time:** 8h/day

### Task 9.1: Test All 16 Node Types (4h)

For each node type:
1. Drag to canvas
2. Configure
3. Connect
4. Test
5. Verify results

### Task 9.2: Edge Cases (2h)

- Empty workflow (no nodes)
- Disconnected nodes (orphans)
- Circular connections
- Missing required fields
- Invalid data

### Task 9.3: Cross-browser Testing (2h)

Test in:
- Chrome
- Firefox
- Safari (if Mac available)

### Task 9.4: Bug Fixes (All remaining time)

Fix any issues found during testing.

**End of Day 10 Check:**
- [ ] All features working
- [ ] No critical bugs
- [ ] Cross-browser tested
- [ ] Ready for demo

---

## Testing Checklist (Use Daily)

**For Each Component:**
- [ ] Component renders without crashing
- [ ] Props are correctly typed
- [ ] Handles errors gracefully
- [ ] Loading states work
- [ ] User interactions work (click, type, drag)
- [ ] Styles look correct
- [ ] Responsive (basic)

---

## Common Mistakes to Avoid

1. **Forgetting to handle loading states** - Always show spinner
2. **Not validating forms** - Use Yup validation
3. **Hardcoding values** - Use props/config
4. **Ignoring TypeScript errors** - Fix all red squiggles
5. **Not testing edge cases** - Empty, null, undefined
6. **Poor error messages** - Be specific and helpful
7. **Inconsistent styling** - Stick to Tailwind classes

---

## Resources

- React Flow Docs: https://reactflow.dev
- React Hook Form: https://react-hook-form.com
- Tailwind CSS: https://tailwindcss.com
- Yup Validation: https://github.com/jquense/yup

---

**You got this! Build amazing UIs! 🎨**
