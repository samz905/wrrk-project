# Dev 2: Nodes & Configuration - Instruction Manual

**Your Role:** Nodes & Configuration Specialist
**Responsibility:** Build all node components and configuration forms
**Scope:** 30 node visual components + 30 configuration forms + Node library panel
**Work Volume:** 110 hours (MOST work among all devs - use reusable patterns!)

---

## Overview

You are responsible for creating the visual components that users see on the canvas AND all the configuration forms that appear when users click nodes. This is a large amount of work - you must prioritize creating reusable components and templates to avoid repetitive work.

**What You're Building:**
- **Node Library Panel** (left sidebar) - 30 node types organized by category
- **30 Node Components** - Visual appearance of nodes on canvas
- **30 Configuration Forms** - Right sidebar forms for each node type
- **Variable Insertion UI** - Component to help users insert variables
- **Form Validation** - Yup schemas for all forms

**Key Technologies:**
- **React** + **TypeScript**
- **React Hook Form** - Form state management
- **Yup** - Schema validation
- **Tailwind CSS** - Styling
- **@xyflow/react** - For node rendering (coordinates with Dev 1)

---

## Prerequisites

### 1. Dependencies Installation

```bash
cd BW_FE_Application

npm install react-hook-form
npm install yup @hookform/resolvers
npm install @headlessui/react  # For modals, dropdowns
npm install lucide-react  # For icons
```

### 2. Core Type Definitions

You'll need these types (coordinate with Dev 1):

```typescript
// src/types/workflow.types.ts (Dev 1 creates this)
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
```

### 3. Node Type Specifications

Refer to `TECH_ARCH.md` for complete list of all 30 node types:

**Original Nodes (16):**
- 3 Triggers: WhatsApp, Email, Voice
- 3 Agents: Conversational, Decision, Reasoning
- 4 Actions: Send WhatsApp, Send Email, Initiate Call, Update CRM
- 6 Utilities: Text Gen, Sentiment, Intent, Vulnerability, Reason, Custom AI

**Shopify Nodes (14):**
- 5 Triggers: Order Created, Fulfilled, Delivered, Cancelled, Time Reminder
- 9 Actions: Get Product, Get All Products, Get Order, Auth Customer, Get Shop, Create Order, Confirm Order, Cancel Order, Update Address

---

## Part 1: Node Library Panel

### What It Is

The left sidebar where users browse and drag nodes onto the canvas. Must show all 30 node types organized by categories (Triggers, Agents, Actions, Utilities).

### How to Build It

#### Step 1.1: Create Node Library Component

Create `src/components/workflow/NodeLibrary.tsx`:

```typescript
import { useState } from 'react';

export interface NodeTypeInfo {
  id: string;
  type: 'trigger' | 'agent' | 'action' | 'utility';
  label: string;
  icon: string;
  description: string;
  category?: string; // For Shopify nodes
}

// Define all 30 node types
const nodeTypes: NodeTypeInfo[] = [
  // --- TRIGGERS ---
  // Original Triggers
  {
    id: 'trigger_whatsapp',
    type: 'trigger',
    label: 'WhatsApp Message',
    icon: '📱',
    description: 'Triggered when WhatsApp message received',
  },
  {
    id: 'trigger_email',
    type: 'trigger',
    label: 'Email Received',
    icon: '✉️',
    description: 'Triggered when email received',
  },
  {
    id: 'trigger_voice',
    type: 'trigger',
    label: 'Voice Call',
    icon: '📞',
    description: 'Triggered when phone call received',
  },
  // Shopify Triggers
  {
    id: 'trigger_shopify_order_created',
    type: 'trigger',
    label: 'Shopify Order Created',
    icon: '🛒',
    description: 'Triggered when new Shopify order is created',
    category: 'Shopify',
  },
  {
    id: 'trigger_shopify_order_fulfilled',
    type: 'trigger',
    label: 'Shopify Order Fulfilled',
    icon: '📦',
    description: 'Triggered when order is fulfilled',
    category: 'Shopify',
  },
  {
    id: 'trigger_shopify_order_delivered',
    type: 'trigger',
    label: 'Shopify Order Delivered',
    icon: '✅',
    description: 'Triggered when order is delivered',
    category: 'Shopify',
  },
  {
    id: 'trigger_shopify_order_cancelled',
    type: 'trigger',
    label: 'Shopify Order Cancelled',
    icon: '❌',
    description: 'Triggered when order is cancelled',
    category: 'Shopify',
  },
  {
    id: 'trigger_shopify_time_reminder',
    type: 'trigger',
    label: 'Shopify Time Reminder',
    icon: '⏰',
    description: 'Triggered at specific time intervals',
    category: 'Shopify',
  },

  // --- AGENTS ---
  {
    id: 'agent_conversational',
    type: 'agent',
    label: 'Conversational Agent',
    icon: '🤖',
    description: 'AI chatbot for conversations',
  },
  {
    id: 'agent_decision',
    type: 'agent',
    label: 'Decision Agent',
    icon: '⚖️',
    description: 'AI decision maker (Approve/Reject/Review)',
  },
  {
    id: 'agent_reasoning',
    type: 'agent',
    label: 'Reasoning Agent',
    icon: '🧠',
    description: 'AI reasoning and analysis',
  },

  // --- ACTIONS ---
  // Original Actions
  {
    id: 'action_whatsapp',
    type: 'action',
    label: 'Send WhatsApp',
    icon: '📲',
    description: 'Send WhatsApp message',
  },
  {
    id: 'action_email',
    type: 'action',
    label: 'Send Email',
    icon: '📧',
    description: 'Send email message',
  },
  {
    id: 'action_call',
    type: 'action',
    label: 'Initiate Call',
    icon: '☎️',
    description: 'Make outbound phone call',
  },
  {
    id: 'action_crm',
    type: 'action',
    label: 'Update CRM',
    icon: '📊',
    description: 'Update CRM record',
  },
  // Shopify Actions
  {
    id: 'action_shopify_get_product',
    type: 'action',
    label: 'Get Product Details',
    icon: '🏷️',
    description: 'Fetch Shopify product information',
    category: 'Shopify',
  },
  {
    id: 'action_shopify_get_all_products',
    type: 'action',
    label: 'Get All Products',
    icon: '📦',
    description: 'Fetch all Shopify products',
    category: 'Shopify',
  },
  {
    id: 'action_shopify_get_order',
    type: 'action',
    label: 'Get Order Details',
    icon: '🧾',
    description: 'Fetch Shopify order information',
    category: 'Shopify',
  },
  {
    id: 'action_shopify_auth_customer',
    type: 'action',
    label: 'Authenticate Customer',
    icon: '🔐',
    description: 'Verify customer identity',
    category: 'Shopify',
  },
  {
    id: 'action_shopify_get_shop',
    type: 'action',
    label: 'Get Shop Info',
    icon: '🏪',
    description: 'Fetch Shopify store information',
    category: 'Shopify',
  },
  {
    id: 'action_shopify_create_order',
    type: 'action',
    label: 'Create Order',
    icon: '➕',
    description: 'Create new Shopify order',
    category: 'Shopify',
  },
  {
    id: 'action_shopify_confirm_order',
    type: 'action',
    label: 'Confirm Order',
    icon: '✔️',
    description: 'Confirm Shopify order',
    category: 'Shopify',
  },
  {
    id: 'action_shopify_cancel_order',
    type: 'action',
    label: 'Cancel Order',
    icon: '🚫',
    description: 'Cancel Shopify order',
    category: 'Shopify',
  },
  {
    id: 'action_shopify_update_address',
    type: 'action',
    label: 'Update Address',
    icon: '📍',
    description: 'Update shipping address',
    category: 'Shopify',
  },

  // --- UTILITIES ---
  {
    id: 'utility_text_gen',
    type: 'utility',
    label: 'Text Generator',
    icon: '📝',
    description: 'Generate text with AI',
  },
  {
    id: 'utility_sentiment',
    type: 'utility',
    label: 'Sentiment Calculator',
    icon: '😊',
    description: 'Analyze sentiment',
  },
  {
    id: 'utility_intent',
    type: 'utility',
    label: 'Intent Calculator',
    icon: '🎯',
    description: 'Detect user intent',
  },
  {
    id: 'utility_vulnerability',
    type: 'utility',
    label: 'Vulnerability Scanner',
    icon: '🛡️',
    description: 'Scan for vulnerabilities',
  },
  {
    id: 'utility_reason',
    type: 'utility',
    label: 'Reason Analyzer',
    icon: '🔍',
    description: 'Extract core reason',
  },
  {
    id: 'utility_custom',
    type: 'utility',
    label: 'Custom AI Utility',
    icon: '⚙️',
    description: 'Custom AI utility',
  },
];

export default function NodeLibrary() {
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 text-sm"
      />

      {/* Categories */}
      {Object.entries(groupedNodes).map(([category, nodes]) => (
        <div key={category} className="mb-4">
          <button
            onClick={() => toggleCategory(category as any)}
            className="flex items-center justify-between w-full text-left font-medium mb-2 text-sm"
          >
            <span className="capitalize">{category}s ({nodes.length})</span>
            <span className="text-gray-400">
              {expandedCategories[category as keyof typeof expandedCategories] ? '▼' : '▶'}
            </span>
          </button>

          {expandedCategories[category as keyof typeof expandedCategories] && (
            <div className="space-y-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      'application/reactflow',
                      JSON.stringify({
                        type: node.type,
                        nodeType: node.id,
                        label: node.label,
                      })
                    );
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  className="p-2 border border-gray-300 rounded cursor-move hover:bg-gray-50 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl flex-shrink-0">{node.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {node.label}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {node.description}
                      </div>
                      {node.category && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          {node.category}
                        </span>
                      )}
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

**Integration Point:** Dev 1's canvas expects `dataTransfer.getData('application/reactflow')` to contain `{ type, nodeType, label }`.

**How to Test:**
1. Render NodeLibrary in test page
2. Search should filter nodes
3. Categories should collapse/expand
4. Drag should work (check with Dev 1's canvas)

---

## Part 2: Node Visual Components

### What They Are

The visual appearance of nodes on the canvas. Each node needs to display:
- Icon and label
- Configured status indicator (green checkmark or red warning)
- Input/output handles for connections
- Error state (red border when validation fails)

### Reusable Pattern

**IMPORTANT:** Don't create 30 separate components from scratch. Use this base template and customize styling only.

#### Step 2.1: Create Base Node Template

Create `src/components/workflow/nodes/BaseNode.tsx`:

```typescript
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface BaseNodeProps extends NodeProps {
  bgColor: string; // e.g., 'bg-purple-100'
  borderColor: string; // e.g., 'border-purple-400'
  icon: string; // Emoji
  hasInput?: boolean; // Does this node have input handle?
  hasOutput?: boolean; // Does this node have output handle?
  multipleOutputs?: { id: string; label: string }[]; // For Decision Agent
}

export default memo(function BaseNode({
  data,
  bgColor,
  borderColor,
  icon,
  hasInput = true,
  hasOutput = true,
  multipleOutputs,
}: BaseNodeProps) {
  const hasError = data.hasError;
  const configured = data.configured;

  return (
    <div
      className={`relative px-4 py-2 shadow-md rounded-md border-2 transition-all ${
        hasError
          ? 'bg-red-50 border-red-500 animate-pulse'
          : configured
          ? `${bgColor.replace('100', '50')} ${borderColor}`
          : `${bgColor} border-gray-300`
      }`}
      style={{ minWidth: '180px' }}
    >
      {/* Input handle */}
      {hasInput && <Handle type="target" position={Position.Top} />}

      {/* Node content */}
      <div className="flex items-center gap-2">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-gray-900 truncate">{data.label}</div>
          <div className="text-xs mt-0.5">
            {hasError ? (
              <span className="text-red-600 font-medium">⚠ Error</span>
            ) : configured ? (
              <span className="text-green-600">✓ Configured</span>
            ) : (
              <span className="text-amber-600">⚙ Not configured</span>
            )}
          </div>
        </div>
      </div>

      {/* Output handle(s) */}
      {hasOutput && !multipleOutputs && (
        <Handle type="source" position={Position.Bottom} />
      )}
      {multipleOutputs && (
        <>
          {multipleOutputs.map((output, index) => (
            <Handle
              key={output.id}
              type="source"
              position={Position.Bottom}
              id={output.id}
              style={{
                left: `${((index + 1) / (multipleOutputs.length + 1)) * 100}%`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
});
```

#### Step 2.2: Create Specific Node Components

Now create specific nodes by configuring the base:

**Trigger Node** (`src/components/workflow/nodes/TriggerNode.tsx`):

```typescript
import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';

export default memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      bgColor="bg-purple-100"
      borderColor="border-purple-400"
      icon="⚡"
      hasInput={false} // Triggers don't have input
      hasOutput={true}
    />
  );
});
```

**Agent Node** (`src/components/workflow/nodes/AgentNode.tsx`):

```typescript
import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';

export default memo((props: NodeProps) => {
  // Special case: Decision Agent has 3 outputs
  const isDecisionAgent = props.data.nodeType === 'agent_decision';

  return (
    <BaseNode
      {...props}
      bgColor="bg-blue-100"
      borderColor="border-blue-400"
      icon="🤖"
      hasInput={true}
      hasOutput={!isDecisionAgent}
      multipleOutputs={
        isDecisionAgent
          ? [
              { id: 'approve', label: 'Approve' },
              { id: 'reject', label: 'Reject' },
              { id: 'review', label: 'Review' },
            ]
          : undefined
      }
    />
  );
});
```

**Action Node** (`src/components/workflow/nodes/ActionNode.tsx`):

```typescript
import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';

export default memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      bgColor="bg-green-100"
      borderColor="border-green-400"
      icon="✨"
      hasInput={true}
      hasOutput={false} // Actions are terminal nodes
    />
  );
});
```

**Utility Node** (`src/components/workflow/nodes/UtilityNode.tsx`):

```typescript
import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';

export default memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      bgColor="bg-yellow-100"
      borderColor="border-yellow-400"
      icon="🔧"
      hasInput={true}
      hasOutput={true}
    />
  );
});
```

**How to Test:**
1. Drag nodes onto canvas (work with Dev 1)
2. Verify colors: Triggers=Purple, Agents=Blue, Actions=Green, Utilities=Yellow
3. Check configured status changes color
4. Decision Agent should show 3 output handles

---

## Part 3: Configuration Forms

### Overview

This is your BIGGEST task - 30 configuration forms. To avoid repetition, use reusable components and templates.

### Reusable Form Components

#### Step 3.1: Create Reusable Field Components

Create `src/components/workflow/config/fields/TextField.tsx`:

```typescript
import { UseFormRegister, FieldError } from 'react-hook-form';

interface TextFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  required?: boolean;
  placeholder?: string;
  error?: FieldError;
  helperText?: string;
}

export default function TextField({
  label,
  name,
  register,
  required,
  placeholder,
  error,
  helperText,
}: TextFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
        type="text"
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
```

Create similar components for:
- `TextAreaField.tsx` (for long text like system prompts)
- `SelectField.tsx` (for dropdowns)
- `CheckboxField.tsx` (for boolean options)

#### Step 3.2: Config Form Template

Use this template for ALL 30 forms:

```typescript
// src/components/workflow/config/forms/WhatsAppTriggerConfig.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextField from '../fields/TextField';
import SelectField from '../fields/SelectField';

// Define validation schema
const schema = yup.object({
  accountId: yup.string().required('WhatsApp account is required'),
  keywordMatch: yup.string(),
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
      <SelectField
        label="WhatsApp Account"
        name="accountId"
        register={register}
        required
        error={errors.accountId}
        options={[
          { value: '', label: 'Select account...' },
          { value: 'account1', label: '+91 98765 43210' },
          { value: 'account2', label: '+91 98765 54321' },
        ]}
      />

      <TextField
        label="Keyword Match"
        name="keywordMatch"
        register={register}
        placeholder='e.g., "help", "support"'
        helperText="Leave empty to trigger on any message"
      />

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Save Configuration
      </button>
    </form>
  );
}
```

#### Step 3.3: Create Config Form Router

Create `src/components/workflow/config/ConfigFormRouter.tsx`:

```typescript
// Import all 30 config forms
import WhatsAppTriggerConfig from './forms/WhatsAppTriggerConfig';
import EmailTriggerConfig from './forms/EmailTriggerConfig';
// ... import all 30 forms

interface ConfigFormRouterProps {
  nodeType: string;
  initialConfig: any;
  onSave: (config: any) => void;
}

export default function ConfigFormRouter({
  nodeType,
  initialConfig,
  onSave,
}: ConfigFormRouterProps) {
  // Route to correct form based on nodeType
  switch (nodeType) {
    // Original Triggers
    case 'trigger_whatsapp':
      return <WhatsAppTriggerConfig initialConfig={initialConfig} onSave={onSave} />;
    case 'trigger_email':
      return <EmailTriggerConfig initialConfig={initialConfig} onSave={onSave} />;
    case 'trigger_voice':
      return <VoiceTriggerConfig initialConfig={initialConfig} onSave={onSave} />;

    // Shopify Triggers
    case 'trigger_shopify_order_created':
      return <ShopifyOrderCreatedConfig initialConfig={initialConfig} onSave={onSave} />;
    case 'trigger_shopify_order_fulfilled':
      return <ShopifyOrderFulfilledConfig initialConfig={initialConfig} onSave={onSave} />;
    // ... all 30 cases

    default:
      return (
        <div className="text-center text-gray-500 py-8">
          <p>Unknown node type: {nodeType}</p>
          <p className="text-xs mt-2">Configuration form not implemented</p>
        </div>
      );
  }
}
```

#### Step 3.4: Main Config Panel Container

Create `src/components/workflow/config/ConfigPanel.tsx`:

```typescript
import { X } from 'lucide-react';
import ConfigFormRouter from './ConfigFormRouter';

interface ConfigPanelProps {
  node: any | null;
  onSave: (config: any) => void;
  onClose: () => void;
}

export default function ConfigPanel({ node, onSave, onClose }: ConfigPanelProps) {
  if (!node) {
    return (
      <div className="w-96 border-l border-gray-200 bg-white p-4">
        <p className="text-gray-400 text-center mt-8 text-sm">
          Select a node to configure
        </p>
      </div>
    );
  }

  return (
    <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{node.data.label}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Node ID: {node.id}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Config Form */}
      <div className="p-4 flex-1 overflow-y-auto">
        <ConfigFormRouter
          nodeType={node.data.nodeType}
          initialConfig={node.data.config}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
```

---

## Part 4: Building All 30 Configuration Forms

### Strategy

**Prioritize by Similarity:**
Group similar forms together and reuse patterns. Start with simplest, then tackle complex ones.

### Form Building Order

#### Group 1: Simple Trigger Forms (3-4 hours)

These have similar fields: account selector, optional keyword/filter.

1. **WhatsAppTriggerConfig** (1h)
   - Fields: accountId (select), keywordMatch (text)

2. **EmailTriggerConfig** (1h)
   - Fields: emailAccount (select), subjectContains (text), fromAddress (text)

3. **VoiceTriggerConfig** (1h)
   - Fields: phoneNumber (select), businessHoursOnly (checkbox)

#### Group 2: Shopify Trigger Forms (6-8 hours)

4. **ShopifyOrderCreatedConfig** (1.5h)
   - Fields: shopifyAccount (select), orderTypes (multi-select), minOrderValue (number), autoConfirm (checkbox)

5. **ShopifyOrderFulfilledConfig** (1h)
   - Fields: shopifyAccount, notifyCustomer (checkbox)

6. **ShopifyOrderDeliveredConfig** (1h)
   - Similar to fulfilled

7. **ShopifyOrderCancelledConfig** (1h)
   - Fields: shopifyAccount, reason (select)

8. **ShopifyTimeReminderConfig** (1.5h)
   - Fields: shopifyAccount, interval (select: 1hr/6hr/12hr/18hr), message (textarea)

#### Group 3: Agent Forms (6-8 hours)

All agent forms are similar - system prompt + knowledge base.

9. **ConversationalAgentConfig** (2h)
   - Fields: systemPrompt (textarea), memoryContext (select), responseFormat (select)
   - Tip: Add character counter for system prompt

10. **DecisionAgentConfig** (2h)
    - Fields: systemPrompt (textarea), memoryContext (select)
    - Note: This agent has fixed outputs (Approve/Reject/Review)

11. **ReasoningAgentConfig** (1.5h)
    - Fields: systemPrompt (textarea), memoryContext (select)

#### Group 4: Simple Action Forms (4-5 hours)

12. **SendWhatsAppConfig** (2h)
    - Fields: messageTemplate (textarea with variable insertion), recipient (select), customRecipient (text)
    - IMPORTANT: Add variable insertion button (see Part 5)

13. **SendEmailConfig** (2h)
    - Fields: to (text), subject (text), body (textarea with variable insertion)

14. **InitiateCallConfig** (1h)
    - Fields: voiceAgent (select), phoneNumber (text with variable insertion)

#### Group 5: Complex Action Forms (5-6 hours)

15. **UpdateCRMConfig** (2h)
    - Fields: crmSystem (select), action (select), fields (textarea as JSON)
    - Tip: Add JSON validation

16. **ShopifyGetProductConfig** (1h)
    - Fields: shopifyAccount, productId (text), includeInventory (checkbox), includeImages (checkbox)

17. **ShopifyGetAllProductsConfig** (1h)
    - Fields: shopifyAccount, limit (number), collectionId (text - optional)

18. **ShopifyGetOrderConfig** (1h)
    - Fields: shopifyAccount, orderId (text with variable insertion)

19. **ShopifyAuthCustomerConfig** (1h)
    - Fields: shopifyAccount, email (text), phone (text)

20. **ShopifyGetShopConfig** (0.5h)
    - Fields: shopifyAccount only

21. **ShopifyCreateOrderConfig** (3h) - **MOST COMPLEX**
    - Fields:
      - shopifyAccount
      - customer (nested: email, firstName, lastName, phone)
      - lineItems (array of products)
      - shippingAddress (nested: address, city, state, zipcode)
      - paymentGateway (select)
    - Tip: Use nested form structure, consider JSON textarea as fallback

22. **ShopifyConfirmOrderConfig** (1h)
    - Fields: shopifyAccount, orderId (text)

23. **ShopifyCancelOrderConfig** (1h)
    - Fields: shopifyAccount, orderId (text), reason (select)

24. **ShopifyUpdateAddressConfig** (2h)
    - Fields: shopifyAccount, orderId (text), shippingAddress (nested)

#### Group 6: Utility Forms (3-4 hours)

Most utility forms are very simple - just input text field.

25. **TextGeneratorConfig** (1h)
    - Fields: systemPrompt (textarea), temperature (number slider)

26. **SentimentCalcConfig** (0.5h)
    - Fields: inputText (text with variable insertion)

27. **IntentCalcConfig** (0.5h)
    - Fields: inputText (text with variable insertion)

28. **VulnScannerConfig** (0.5h)
    - Fields: inputText (text with variable insertion)

29. **ReasonAnalyzerConfig** (0.5h)
    - Fields: inputText (text with variable insertion)

30. **CustomAIUtilityConfig** (1h)
    - Fields: systemPrompt (textarea), temperature (number)

**Total Estimated Time:** ~40-45 hours for all forms

---

## Part 5: Variable Insertion Component

### What It Is

A UI component that helps users insert dynamic variables into text fields (e.g., `{{customer_name}}`, `{{order_id}}`).

### How to Build It

Create `src/components/workflow/config/VariableInsertion.tsx`:

```typescript
import { useState } from 'react';
import { Code } from 'lucide-react';

interface VariableInsertionProps {
  onInsert: (variable: string) => void;
}

const availableVariables = [
  { key: 'phone_number', label: 'Phone Number', description: 'Customer phone number' },
  { key: 'customer_name', label: 'Customer Name', description: 'Customer full name' },
  { key: 'message_text', label: 'Message Text', description: 'Incoming message content' },
  { key: 'order_id', label: 'Order ID', description: 'Shopify order ID' },
  { key: 'product_name', label: 'Product Name', description: 'Product name' },
  { key: 'order_total', label: 'Order Total', description: 'Total order amount' },
  // Add more as needed
];

export default function VariableInsertion({ onInsert }: VariableInsertionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
      >
        <Code size={14} />
        Insert Variable
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {availableVariables.map((variable) => (
              <button
                key={variable.key}
                type="button"
                onClick={() => {
                  onInsert(`{{${variable.key}}}`);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-900">{variable.label}</div>
                <div className="text-xs text-gray-500">{variable.description}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

**Usage in Form:**

```typescript
// In SendWhatsAppConfig.tsx
import VariableInsertion from '../VariableInsertion';

export default function SendWhatsAppConfig({ initialConfig, onSave }: ConfigFormProps) {
  const { register, setValue, watch } = useForm(/* ... */);
  const messageTemplate = watch('messageTemplate');

  return (
    <form>
      <div>
        <label>Message Template</label>
        <textarea {...register('messageTemplate')} />

        {/* Variable insertion button */}
        <VariableInsertion
          onInsert={(variable) => {
            setValue('messageTemplate', (messageTemplate || '') + ' ' + variable);
          }}
        />
      </div>
    </form>
  );
}
```

---

## Part 6: Form Validation

### Validation Schemas

For each form, define a Yup schema. Common patterns:

```typescript
import * as yup from 'yup';

// Simple required field
accountId: yup.string().required('Account is required'),

// Optional text
keywordMatch: yup.string(),

// Email validation
email: yup.string().email('Invalid email').required('Email is required'),

// Number with range
temperature: yup.number().min(0).max(1).required(),

// Nested object
customer: yup.object({
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string(),
}),

// Array
lineItems: yup.array().of(
  yup.object({
    productId: yup.string().required(),
    quantity: yup.number().min(1).required(),
  })
).min(1, 'At least one item required'),
```

---

## Common Issues & Troubleshooting

### Issue: "Form doesn't save"
**Solution:**
- Check `onSubmit={handleSubmit(onSave)}` is on `<form>`
- Verify `onSave` prop is passed from ConfigPanel
- Check React Hook Form's `handleSubmit` is wrapping your onSave callback

### Issue: "Validation not working"
**Solution:**
- Ensure `yupResolver(schema)` is passed to `useForm`
- Check `errors` object in `formState`
- Verify field names in schema match `register('fieldName')`

### Issue: "Dropdown not loading options"
**Solution:**
- For dynamic options (accounts, etc.), fetch from API in `useEffect`
- Show loading state while fetching
- Handle error state if API fails

### Issue: "Variable insertion doesn't work"
**Solution:**
- Use `watch('fieldName')` to get current value
- Use `setValue('fieldName', newValue)` to update
- Ensure cursor position is maintained (advanced: use refs)

### Issue: "Too many forms, falling behind schedule"
**Solution:**
- Prioritize most common node types first
- Create more reusable components (DatePicker, NumberInput, etc.)
- Use JSON textarea as fallback for complex nested objects
- Ask team lead for help - Dev 1 can assist with simpler forms

---

## Integration Checklist

### With Dev 1 (Canvas):
- [ ] Node library drag data format agreed upon
- [ ] Node components render correctly on canvas
- [ ] Node visual states (configured, error, normal) work
- [ ] Config panel opens/closes correctly
- [ ] Config save updates node data

### With Dev 3 (Execution Engine):
- [ ] Config field names match backend expectations
- [ ] Variable format `{{variable_name}}` is correct
- [ ] Nested config objects (Shopify Create Order) structure agreed upon

### With Dev 4 (Monitoring):
- [ ] No direct integration needed

---

## Testing Checklist

**Node Library:**
- [ ] All 30 nodes listed correctly
- [ ] Search filters nodes
- [ ] Categories collapse/expand
- [ ] Drag-and-drop works
- [ ] Shopify nodes show "Shopify" tag

**Node Components:**
- [ ] Triggers: Purple, no input handle
- [ ] Agents: Blue, input + output handles
- [ ] Decision Agent: 3 output handles
- [ ] Actions: Green, input only (terminal)
- [ ] Utilities: Yellow, input + output
- [ ] Configured nodes show green checkmark
- [ ] Unconfigured nodes show amber warning
- [ ] Error nodes show red border and pulse

**Configuration Forms:**
- [ ] All 30 forms render correctly
- [ ] Required fields marked with *
- [ ] Validation shows errors
- [ ] Forms save data to node
- [ ] Variable insertion works
- [ ] Dropdowns load options
- [ ] Text areas have proper size
- [ ] Complex forms (Shopify Create Order) submit nested data correctly

---

## Code Templates

### Template: Textarea Field with Character Counter

```typescript
export default function TextAreaField({ label, name, register, maxLength }: any) {
  const value = useWatch({ name });

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium">{label}</label>
        {maxLength && (
          <span className="text-xs text-gray-500">
            {value?.length || 0} / {maxLength}
          </span>
        )}
      </div>
      <textarea
        {...register(name)}
        maxLength={maxLength}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}
```

### Template: Multi-Select Dropdown

```typescript
import { useState } from 'react';

export default function MultiSelectField({ label, name, options, register }: any) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="border border-gray-300 rounded-md p-2 space-y-1">
        {options.map((option: any) => (
          <label key={option.value} className="flex items-center">
            <input
              type="checkbox"
              value={option.value}
              {...register(name)}
              className="mr-2"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
```

---

## Time Management Tips

You have the MOST work among all devs. Here's how to stay on track:

1. **Use Templates:** Don't reinvent the wheel for each form
2. **Group Similar Forms:** Do all triggers together, all agents together
3. **Start Simple:** Build simplest forms first to build momentum
4. **Test As You Go:** Don't wait until all 30 are done to test
5. **Ask for Help:** If you're >2 days behind, Dev 1 can help with simpler forms
6. **JSON Fallback:** For very complex forms (Shopify Create Order), consider allowing JSON textarea input as alternative to nested form fields

**Daily Targets:**
- Days 1-2: Node library + node components (12h)
- Days 3-5: 15 configuration forms (25h)
- Days 6-7: Remaining 15 forms (25h)
- Days 8-9: Variable insertion, validation polish, testing (15h)
- Day 10: Bug fixes, final integration (8h)

---

## Final Notes

- **You have the most work** - prioritize ruthlessly
- **Reuse everything** - every hour saved on repetition helps
- **Coordinate with Dev 1 daily** - your work is tightly coupled
- **Test incrementally** - don't wait until day 10 to test
- **Communicate blockers early** - if falling behind, speak up

**Resources:**
- React Hook Form Docs: https://react-hook-form.com
- Yup Validation: https://github.com/jquense/yup
- Tailwind CSS: https://tailwindcss.com
- Sprint Plan: `SPRINT.md`
- Tech Arch: `TECH_ARCH.md`
