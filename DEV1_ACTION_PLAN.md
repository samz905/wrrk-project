# Dev 1: Canvas & UX - Instruction Manual

**Your Role:** Canvas & User Experience Specialist
**Responsibility:** Build and polish the visual workflow canvas using React Flow
**Scope:** Drag-drop functionality, node connections, canvas controls, visual feedback, state management

---

## Overview

You are responsible for creating the visual canvas where users build their workflows. Your work is the foundation that Dev 2 (nodes), Dev 3 (execution), and Dev 4 (monitoring) will integrate with. The canvas must be intuitive, performant, and support 30 different node types.

**Key Technologies:**
- **React Flow** (@xyflow/react) - Visual canvas library
- **Zustand** - State management for canvas state
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** + **Yup** - Form handling (where needed)

---

## Prerequisites

Before you start building, make sure these are in place:

### 1. Project Structure Setup
```bash
cd BW_FE_Application

# Create folder structure
mkdir -p src/pages/workflow
mkdir -p src/components/workflow/canvas
mkdir -p src/store/workflow
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/utils
```

### 2. Install Dependencies
```bash
npm install @xyflow/react
npm install zustand
npm install react-toastify  # For notifications
```

### 3. Core Type Definitions

Create `src/types/workflow.types.ts`:

```typescript
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'agent' | 'action' | 'utility';
  position: { x: number; y: number };
  data: {
    label: string;
    nodeType: string; // e.g., 'trigger_whatsapp', 'action_shopify_create_order'
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
  id?: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: 'draft' | 'published';
  orgId: string;
  userId: string;
}
```

---

## Part 1: React Flow Canvas Setup

### What It Is
The canvas is the main drawing area where users drag nodes and connect them. It uses React Flow library which provides pan, zoom, and connection functionality out of the box.

### How to Build It

#### Step 1.1: Create the Canvas Component

Create `src/components/workflow/canvas/WorkflowCanvas.tsx`:

```typescript
import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import custom node components (Dev 2 will create these)
import TriggerNode from '../nodes/TriggerNode';
import AgentNode from '../nodes/AgentNode';
import ActionNode from '../nodes/ActionNode';
import UtilityNode from '../nodes/UtilityNode';

// Define node types mapping
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
  onNodesChange: onNodesChangeProp,
  onEdgesChange: onEdgesChangeProp,
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle node changes (position, selection, deletion)
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      // Notify parent component
      if (onNodesChangeProp) {
        const updatedNodes = nodes; // Get updated nodes after change
        onNodesChangeProp(updatedNodes);
      }
    },
    [onNodesChange, onNodesChangeProp, nodes]
  );

  // Handle edge changes (creation, deletion)
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      // Notify parent component
      if (onEdgesChangeProp) {
        const updatedEdges = edges;
        onEdgesChangeProp(updatedEdges);
      }
    },
    [onEdgesChange, onEdgesChangeProp, edges]
  );

  // Handle new connections
  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  return (
    <div className="w-full h-screen bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
```

#### Step 1.2: Test the Canvas

Create a test page `src/pages/workflow/WorkflowBuilderPage.tsx`:

```typescript
import WorkflowCanvas from '../../components/workflow/canvas/WorkflowCanvas';

export default function WorkflowBuilderPage() {
  return (
    <div className="h-screen">
      <WorkflowCanvas />
    </div>
  );
}
```

**How to Test:**
1. Run `npm start`
2. Navigate to the workflow builder page
3. You should see:
   - Grid background
   - Pan functionality (click and drag background)
   - Zoom controls (bottom-left buttons)
   - Mini-map (bottom-right)

**Troubleshooting:**
- If canvas doesn't render: Check React Flow import path (`@xyflow/react`, not `react-flow`)
- If styles are broken: Ensure `@xyflow/react/dist/style.css` is imported
- If pan/zoom doesn't work: Check canvas has width and height (use `w-full h-screen`)

---

## Part 2: Drag-and-Drop from Node Library

### What It Is
Users should be able to drag node types from a library panel (left sidebar) onto the canvas. When dropped, a new node is created at the drop position.

### How to Build It

#### Step 2.1: Set Up Zustand Store

Create `src/store/workflow/workflowStore.ts`:

```typescript
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: Partial<Node['data']>) => void;
  deleteNode: (nodeId: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  selectNode: (node: Node | null) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    })),

  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  selectNode: (node) => set({ selectedNode: node }),
}));
```

#### Step 2.2: Enable Drag from Node Library

Update the canvas to accept drops. Modify `WorkflowCanvas.tsx`:

```typescript
import { useCallback, useRef } from 'react';
import { useWorkflowStore } from '../../../store/workflow/workflowStore';

export default function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, setNodes, setEdges, addNode } = useWorkflowStore();

  // ... existing state ...

  // Handle drop event
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData('application/reactflow');

      if (!nodeType || !reactFlowBounds) return;

      // Parse the dragged data
      const nodeData = JSON.parse(nodeType);

      // Calculate position relative to canvas
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Create new node
      const newNode: Node = {
        id: `node_${Date.now()}`, // Generate unique ID
        type: nodeData.type, // 'trigger', 'agent', 'action', 'utility'
        position,
        data: {
          label: nodeData.label,
          nodeType: nodeData.nodeType, // e.g., 'trigger_whatsapp'
          config: {},
          configured: false,
        },
      };

      addNode(newNode);
    },
    [addNode, reactFlowWrapper]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-screen"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // ... rest of props
      >
        {/* ... */}
      </ReactFlow>
    </div>
  );
}
```

#### Step 2.3: Node Library Panel (Coordinate with Dev 2)

Dev 2 is responsible for building the node library panel, but you need to ensure drag-and-drop works. Here's what Dev 2's node library items should implement:

```typescript
// Example draggable node item (Dev 2 will implement this)
<div
  draggable
  onDragStart={(event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({
        type: 'trigger',
        nodeType: 'trigger_whatsapp',
        label: 'WhatsApp Message Trigger',
      })
    );
    event.dataTransfer.effectAllowed = 'move';
  }}
  className="cursor-move p-2 bg-white border rounded"
>
  WhatsApp Message Trigger
</div>
```

**Integration Point:** Ensure Dev 2 knows the expected data format for `dataTransfer.setData()`.

**How to Test:**
1. Dev 2 should have the node library panel ready
2. Drag a node from the library
3. Drop it on the canvas
4. A new node should appear at the drop position

**Troubleshooting:**
- Node doesn't appear: Check `onDrop` event is firing (add console.log)
- Position is wrong: Check `reactFlowBounds` calculation
- Drag doesn't work: Ensure `draggable={true}` on library items

---

## Part 3: Node Connection Validation

### What It Is
Not all nodes can connect to each other. You need to implement validation rules that prevent invalid connections (e.g., Action → Trigger should be blocked).

### How to Build It

#### Step 3.1: Connection Rules

Create `src/utils/connectionValidation.ts`:

```typescript
import { Connection, Node, Edge } from '@xyflow/react';

// Define valid connections
const CONNECTION_RULES: Record<string, string[]> = {
  trigger: ['agent', 'action', 'utility'],
  agent: ['agent', 'action', 'utility'],
  action: [], // Terminal nodes - can't connect to anything
  utility: ['agent', 'action', 'utility'],
};

export const isValidConnection = (
  connection: Connection,
  nodes: Node[]
): boolean => {
  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  const sourceType = sourceNode.type || '';
  const targetType = targetNode.type || '';

  // Check if connection is allowed
  return CONNECTION_RULES[sourceType]?.includes(targetType) || false;
};

// Detect circular dependencies (optional, for advanced validation)
export const hasCircularDependency = (
  connection: Connection,
  edges: Edge[]
): boolean => {
  const { source, target } = connection;

  // Build adjacency list
  const graph: Record<string, string[]> = {};
  edges.forEach((edge) => {
    if (!graph[edge.source]) graph[edge.source] = [];
    graph[edge.source].push(edge.target);
  });

  // Add new edge
  if (!graph[source]) graph[source] = [];
  graph[source].push(target);

  // DFS to detect cycle
  const visited = new Set<string>();
  const recStack = new Set<string>();

  const hasCycle = (node: string): boolean => {
    if (recStack.has(node)) return true; // Cycle detected
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  };

  return hasCycle(source);
};
```

#### Step 3.2: Integrate Validation into Canvas

Update `WorkflowCanvas.tsx`:

```typescript
import { isValidConnection } from '../../../utils/connectionValidation';

export default function WorkflowCanvas() {
  // ... existing code ...

  const onConnect: OnConnect = useCallback(
    (params) => {
      // Validate connection before adding
      if (!isValidConnection(params, nodes)) {
        toast.error('Invalid connection: Check node types');
        return;
      }

      setEdges((eds) => addEdge(params, eds));
      toast.success('Connection created');
    },
    [nodes, setEdges]
  );

  return (
    <ReactFlow
      // ... other props
      isValidConnection={(connection) => isValidConnection(connection, nodes)}
      onConnect={onConnect}
    >
      {/* ... */}
    </ReactFlow>
  );
}
```

**How to Test:**
1. Create two nodes on canvas (e.g., WhatsApp Trigger and Decision Agent)
2. Try connecting them - should work
3. Create an Action node (e.g., Send WhatsApp)
4. Try connecting Action to Trigger - should be blocked with error toast
5. Try connecting Trigger to Action - should work

**Troubleshooting:**
- All connections blocked: Check CONNECTION_RULES object has correct types
- Invalid connections still allowed: Ensure `isValidConnection` is passed to ReactFlow
- No error message: Add `react-toastify` and configure ToastContainer

---

## Part 4: Config Panel Integration

### What It Is
When a user clicks a node, a configuration panel should open on the right side. Dev 2 is building the config forms, but you need to:
1. Detect when a node is clicked
2. Pass the selected node to Dev 2's config panel
3. Update the node when configuration is saved

### How to Build It

#### Step 4.1: Node Selection Handler

Update `WorkflowCanvas.tsx` to handle node clicks:

```typescript
export default function WorkflowCanvas() {
  const { selectNode } = useWorkflowStore();

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      selectNode(node);
    },
    [selectNode]
  );

  return (
    <ReactFlow
      // ... other props
      onNodeClick={onNodeClick}
    >
      {/* ... */}
    </ReactFlow>
  );
}
```

#### Step 4.2: Config Panel Container

Create `src/components/workflow/canvas/WorkflowBuilder.tsx` (main layout):

```typescript
import { useState } from 'react';
import WorkflowCanvas from './WorkflowCanvas';
import ConfigPanel from '../config/ConfigPanel'; // Dev 2 will create this
import { useWorkflowStore } from '../../../store/workflow/workflowStore';

export default function WorkflowBuilder() {
  const { selectedNode, updateNode } = useWorkflowStore();

  const handleConfigSave = (config: Record<string, any>) => {
    if (!selectedNode) return;

    updateNode(selectedNode.id, {
      config,
      configured: true,
    });

    toast.success('Configuration saved');
  };

  return (
    <div className="flex h-screen">
      {/* Canvas */}
      <div className="flex-1">
        <WorkflowCanvas />
      </div>

      {/* Config Panel (right sidebar) */}
      {selectedNode && (
        <div className="w-96 bg-white border-l shadow-lg overflow-y-auto">
          <ConfigPanel
            node={selectedNode}
            onSave={handleConfigSave}
            onClose={() => useWorkflowStore.getState().selectNode(null)}
          />
        </div>
      )}
    </div>
  );
}
```

**Integration Point:** Dev 2 will build `ConfigPanel` component. Ensure they receive:
- `node`: The selected node object
- `onSave`: Callback with config data
- `onClose`: Callback to close panel

**How to Test:**
1. Click any node on canvas
2. Config panel should open on the right
3. (Once Dev 2 completes) Fill the form and save
4. Node should update with `configured: true`

---

## Part 5: Canvas Controls & UX Polish

### What It Is
Add user-friendly controls and visual feedback to make the canvas intuitive.

### Features to Implement

#### Feature 5.1: Toolbar with Canvas Actions

Create `src/components/workflow/canvas/CanvasToolbar.tsx`:

```typescript
import { useReactFlow } from '@xyflow/react';

export default function CanvasToolbar() {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-2 flex gap-2">
      <button
        onClick={() => zoomIn()}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        title="Zoom In"
      >
        +
      </button>
      <button
        onClick={() => zoomOut()}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        title="Zoom Out"
      >
        -
      </button>
      <button
        onClick={() => fitView()}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        title="Fit View"
      >
        Fit
      </button>
    </div>
  );
}
```

Add to canvas:

```typescript
export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <div className="relative w-full h-screen">
        <CanvasToolbar />
        <ReactFlow>{/* ... */}</ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
```

#### Feature 5.2: Node Deletion

Allow users to delete nodes by pressing `Delete` or `Backspace`:

```typescript
import { useKeyPress } from '../../../hooks/useKeyPress'; // Create this hook

export default function WorkflowCanvas() {
  const { selectedNode, deleteNode } = useWorkflowStore();

  useKeyPress(['Delete', 'Backspace'], () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
      toast.info('Node deleted');
    }
  });

  // ... rest of component
}
```

Create the hook `src/hooks/useKeyPress.ts`:

```typescript
import { useEffect } from 'react';

export const useKeyPress = (keys: string[], callback: () => void) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keys, callback]);
};
```

#### Feature 5.3: Visual Feedback for Configured Nodes

Update node rendering to show configured status. Coordinate with Dev 2 on node component styling:

```typescript
// Example for TriggerNode (Dev 2 will implement)
export default function TriggerNode({ data }: { data: any }) {
  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 ${
        data.configured
          ? 'bg-green-50 border-green-500'
          : 'bg-gray-50 border-gray-300'
      }`}
    >
      {data.configured && (
        <span className="text-green-600 text-xs">✓</span>
      )}
      <p>{data.label}</p>
    </div>
  );
}
```

---

## Part 6: Save & Load Workflows

### What It Is
Allow users to save their canvas state (nodes, edges) to the backend and load existing workflows.

### How to Build It

#### Step 6.1: Save Workflow

Create API service `src/api/services/workflowService.ts`:

```typescript
import axiosInstance from '../axiosInstance';
import { Workflow } from '../../types/workflow.types';

export const saveWorkflow = async (workflow: Workflow) => {
  try {
    // 1. Create or update workflow
    const { data: workflowData } = await axiosInstance.post(
      '/workFlow/create',
      {
        orgId: workflow.orgId,
        userId: workflow.userId,
        name: workflow.name,
      }
    );

    const workflowId = workflowData.workflowId;

    // 2. Save each node as a step
    for (const node of workflow.nodes) {
      await axiosInstance.post('/workFlow/step', {
        workflowId,
        stepId: node.id,
        stepType: node.type,
        nodeType: node.data.nodeType,
        config: node.data.config,
        position: node.position,
      });
    }

    // 3. Save connections (update nextStepId for each edge)
    for (const edge of workflow.edges) {
      await axiosInstance.put(
        `/workFlow/step/${workflowId}/${edge.source}`,
        {
          nextStepId: edge.target,
        }
      );
    }

    return { workflowId };
  } catch (error) {
    console.error('Failed to save workflow:', error);
    throw error;
  }
};
```

#### Step 6.2: Add Save Button

Update `WorkflowBuilder.tsx`:

```typescript
import { saveWorkflow } from '../../../api/services/workflowService';

export default function WorkflowBuilder() {
  const { nodes, edges } = useWorkflowStore();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const workflow: Workflow = {
        name: 'My Workflow', // Get from user input
        nodes,
        edges,
        status: 'draft',
        orgId: 'user-org-id', // Get from auth context
        userId: 'user-id', // Get from auth context
      };

      const result = await saveWorkflow(workflow);
      toast.success(`Workflow saved! ID: ${result.workflowId}`);
    } catch (error) {
      toast.error('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Save button */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">Workflow Builder</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
      </div>

      {/* Canvas and Config Panel */}
      <div className="flex flex-1">
        {/* ... existing layout */}
      </div>
    </div>
  );
}
```

#### Step 6.3: Load Workflow

```typescript
export const loadWorkflow = async (workflowId: string) => {
  try {
    // Fetch workflow and steps from backend
    const { data: workflow } = await axiosInstance.get(
      `/workFlow/${workflowId}`
    );
    const { data: steps } = await axiosInstance.get(
      `/workFlow/${workflowId}/steps`
    );

    // Transform backend data to React Flow format
    const nodes = steps.map((step: any) => ({
      id: step.stepId,
      type: step.stepType,
      position: step.position || { x: 0, y: 0 },
      data: {
        label: step.label || step.nodeType,
        nodeType: step.nodeType,
        config: step.config || {},
        configured: !!step.config && Object.keys(step.config).length > 0,
      },
    }));

    // Reconstruct edges from nextStepId
    const edges = steps
      .filter((step: any) => step.nextStepId)
      .map((step: any) => ({
        id: `e${step.stepId}-${step.nextStepId}`,
        source: step.stepId,
        target: step.nextStepId,
      }));

    return { nodes, edges, workflow };
  } catch (error) {
    console.error('Failed to load workflow:', error);
    throw error;
  }
};
```

**Integration Point:** Backend APIs (`POST /workFlow/create`, `POST /workFlow/step`, etc.) are managed by Dev 3. Ensure API contracts are clear.

**How to Test:**
1. Create a workflow with 3-4 nodes and connections
2. Click "Save Draft"
3. Check MongoDB to verify workflow and steps are saved
4. Reload the page
5. Load the workflow by ID
6. Canvas should restore with all nodes and connections

---

## Part 7: Validation Visualization

### What It Is
When a user clicks "Publish", validation runs on the backend (Dev 3's responsibility). If there are errors, you need to visually highlight problematic nodes on the canvas.

### How to Build It

#### Step 7.1: Validation Error Highlighting

```typescript
export default function WorkflowCanvas() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update nodes to show error state
  const nodesWithErrors = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      hasError: validationErrors.includes(node.id),
    },
  }));

  return (
    <ReactFlow
      nodes={nodesWithErrors}
      // ... other props
    />
  );
}
```

Coordinate with Dev 2 to update node components:

```typescript
// TriggerNode example
export default function TriggerNode({ data }: { data: any }) {
  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 ${
        data.hasError
          ? 'bg-red-50 border-red-500 animate-pulse'
          : data.configured
          ? 'bg-green-50 border-green-500'
          : 'bg-gray-50 border-gray-300'
      }`}
    >
      {/* ... */}
    </div>
  );
}
```

#### Step 7.2: Validation Modal

When user clicks "Publish", show validation results in a modal (before publishing):

```typescript
import { useState } from 'react';
import { validateWorkflow } from '../../../api/services/workflowService';

export default function WorkflowBuilder() {
  const [validationResult, setValidationResult] = useState<any>(null);

  const handlePublish = async () => {
    // Step 1: Validate
    const result = await validateWorkflow(workflowId);

    if (!result.valid) {
      // Show errors in modal
      setValidationResult(result);
      return;
    }

    // Step 2: Publish if valid
    await publishWorkflow(workflowId);
    toast.success('Workflow published!');
  };

  return (
    <>
      <button onClick={handlePublish}>Publish</button>

      {validationResult && !validationResult.valid && (
        <ValidationModal
          errors={validationResult.errors}
          onClose={() => setValidationResult(null)}
          onHighlightNode={(nodeId) => {
            // Scroll to node and highlight it
            const node = nodes.find((n) => n.id === nodeId);
            if (node) {
              // Use React Flow's fitView with specific node
            }
          }}
        />
      )}
    </>
  );
}
```

---

## Part 8: Performance Optimization

### What It Is
Ensure the canvas remains responsive even with 50+ nodes.

### How to Optimize

#### Optimization 8.1: React Flow Performance Settings

```typescript
export default function WorkflowCanvas() {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      // Performance optimizations
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      minZoom={0.2}
      maxZoom={4}
      nodesDraggable={true}
      nodesConnectable={true}
      elementsSelectable={true}
      selectNodesOnDrag={false} // Prevent accidental selection
      panOnDrag={[1, 2]} // Pan with middle or right mouse button
      fitViewOptions={{ padding: 0.2 }}
    >
      {/* ... */}
    </ReactFlow>
  );
}
```

#### Optimization 8.2: Memoization

Use React memoization to prevent unnecessary re-renders:

```typescript
import { memo } from 'react';

const TriggerNode = memo(({ data }: { data: any }) => {
  // ... component logic
});

export default TriggerNode;
```

**How to Test Performance:**
1. Create a test with 50 nodes
2. Measure render time (use Chrome DevTools Performance tab)
3. Target: Initial render <2 seconds, drag operations <16ms (60 FPS)

---

## Common Issues & Troubleshooting

### Issue: "Canvas not rendering"
**Solution:**
- Check React Flow CSS is imported: `import '@xyflow/react/dist/style.css'`
- Ensure canvas has explicit height: `h-screen` or `height: 600px`

### Issue: "Drag-and-drop not working"
**Solution:**
- Verify `onDrop` and `onDragOver` are implemented
- Check `dataTransfer.getData('application/reactflow')` format
- Ensure draggable items have `draggable={true}`

### Issue: "Nodes disappear after drop"
**Solution:**
- Check Zustand store is properly updating
- Verify `addNode` function is called
- Use React DevTools to inspect store state

### Issue: "Connections create duplicates"
**Solution:**
- Each edge needs a unique `id` field
- Use format: `e${source}-${target}` for consistency

### Issue: "Canvas state not persisting"
**Solution:**
- Ensure save API calls complete successfully (check network tab)
- Verify backend stores position data correctly
- Check load function transforms data properly

---

## Integration Checklist with Other Devs

### With Dev 2 (Nodes & Config):
- [ ] Agree on drag-and-drop data format
- [ ] Ensure node components accept `hasError` and `configured` props
- [ ] Confirm config panel receives `node`, `onSave`, `onClose` props
- [ ] Coordinate on node visual styling (icons, colors, borders)

### With Dev 3 (Execution Engine):
- [ ] Confirm API endpoints for save/load workflows
- [ ] Agree on workflow data structure (nodes/steps mapping)
- [ ] Ensure validation endpoint returns node IDs with errors
- [ ] Coordinate on authentication (JWT token handling)

### With Dev 4 (Monitoring):
- [ ] No direct integration needed
- [ ] Monitoring is a separate page/component

---

## Testing Checklist

Before marking your work as complete, test all these scenarios:

**Canvas Basics:**
- [ ] Canvas renders with grid background
- [ ] Pan works (click and drag)
- [ ] Zoom works (controls and mouse wheel)
- [ ] Mini-map shows all nodes

**Drag-and-Drop:**
- [ ] Can drag nodes from library to canvas
- [ ] Nodes appear at correct drop position
- [ ] Multiple nodes can be dropped

**Connections:**
- [ ] Can connect compatible node types
- [ ] Invalid connections are blocked
- [ ] Connection shows visual feedback on hover
- [ ] Edges can be deleted

**Node Operations:**
- [ ] Click node to select it
- [ ] Selected node shows config panel
- [ ] Config panel closes when clicking canvas
- [ ] Delete key removes selected node
- [ ] Node shows "configured" indicator after saving config

**Save/Load:**
- [ ] Save workflow creates correct API calls
- [ ] Workflow persists to database
- [ ] Load workflow restores all nodes and edges
- [ ] Node positions are preserved

**Validation:**
- [ ] Invalid nodes are highlighted
- [ ] Validation errors show in modal
- [ ] Can't publish invalid workflow

**Performance:**
- [ ] Canvas with 50 nodes loads in <2 seconds
- [ ] Dragging nodes is smooth (no lag)
- [ ] Zooming is responsive

---

## Code Templates

### Template: Basic Custom Node

```typescript
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = memo(({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-md">
      <Handle type="target" position={Position.Top} />
      <div className="text-sm font-medium">{data.label}</div>
      {data.configured && <span className="text-xs text-green-600">✓</span>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export default CustomNode;
```

### Template: API Call with Error Handling

```typescript
const handleSave = async () => {
  try {
    setLoading(true);
    const result = await saveWorkflow(workflow);
    toast.success('Workflow saved!');
    return result;
  } catch (error) {
    console.error('Save failed:', error);
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
    } else {
      toast.error('Failed to save workflow. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
```

---

## Final Notes

- **Focus on UX:** Your job is to make the canvas intuitive. Test with real users if possible.
- **Coordinate early:** Meet with Dev 2 daily to ensure node components integrate smoothly.
- **Performance matters:** Test with large workflows (50+ nodes) frequently.
- **Ask for help:** If React Flow behavior is confusing, check their docs or ask the team lead.

**Resources:**
- React Flow Docs: https://reactflow.dev
- Zustand Docs: https://zustand-demo.pmnd.rs/
- Sprint Plan: `SPRINT.md` (for your specific tasks)
- Tech Arch: `TECH_ARCH.md` (for node type specifications)
