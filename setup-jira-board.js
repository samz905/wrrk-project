const https = require('https');
require('dotenv').config();

// Jira Configuration - Load from environment variables
const JIRA_CONFIG = {
  domain: process.env.JIRA_DOMAIN || 'wrrk-ai.atlassian.net',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY || 'SCRUM',
  issueTypes: {
    epic: process.env.JIRA_ISSUE_TYPE_EPIC || '10001',
    story: process.env.JIRA_ISSUE_TYPE_STORY || '10004',
    task: process.env.JIRA_ISSUE_TYPE_TASK || '10003',
    subtask: process.env.JIRA_ISSUE_TYPE_SUBTASK || '10002'
  }
};

// Validate required environment variables
if (!JIRA_CONFIG.email || !JIRA_CONFIG.apiToken) {
  console.error('❌ Error: JIRA_EMAIL and JIRA_API_TOKEN environment variables are required.');
  console.error('Please create a .env file with these variables. See .env.example for reference.');
  process.exit(1);
}

// Epic and Story Data Structure (parsed from SPRINT.md)
const EPICS = [
  {
    name: 'Canvas & Drag-Drop 🎨',
    description: 'Users can drag nodes onto a canvas and connect them visually',
    storyPoints: 21,
    owner: 'Dev 1 (Canvas & UX Specialist)',
    stories: [
      {
        name: 'Setup React Flow Canvas',
        description: 'As a developer, I want to set up the React Flow canvas infrastructure, so that we have a foundation for the visual builder',
        storyPoints: 5,
        assignee: 'Dev 1',
        priority: 'Highest',
        acceptanceCriteria: [
          'React Flow installed and configured',
          'Canvas component renders with pan/zoom',
          'Background grid visible',
          'Controls (zoom in/out, fit view) working'
        ],
        tasks: [
          { name: 'Install @xyflow/react package', estimate: '1h' },
          { name: 'Create WorkflowCanvas.tsx component', estimate: '2h' },
          { name: 'Configure canvas controls (Background, Controls, MiniMap hidden)', estimate: '1h' },
          { name: 'Set up Zustand store for canvas state (nodes, edges)', estimate: '2h' },
          { name: 'Test: Canvas renders, pan/zoom works', estimate: '0.5h' }
        ]
      },
      {
        name: 'Build Node Library Panel',
        description: 'As a user, I want to see all available node types in a left panel, so that I can drag them onto the canvas',
        storyPoints: 5,
        assignee: 'Dev 2',
        priority: 'Highest',
        acceptanceCriteria: [
          'Left panel shows 30 node types in categories',
          '30 node types displayed with icons and labels',
          'Search box filters nodes in real-time',
          'Collapsible categories'
        ],
        tasks: [
          { name: 'Create NodeLibrary.tsx component', estimate: '2h' },
          { name: 'Define node type data structure (name, icon, category, description)', estimate: '1h' },
          { name: 'Implement search filter logic', estimate: '1h' },
          { name: 'Add category collapse/expand', estimate: '1h' },
          { name: 'Style panel (Tailwind CSS)', estimate: '1h' },
          { name: 'Test: All 30 nodes display, search works', estimate: '0.5h' }
        ]
      },
      {
        name: 'Implement Drag-Drop from Library to Canvas',
        description: 'As a user, I want to drag nodes from the library onto the canvas, so that I can start building my workflow',
        storyPoints: 8,
        assignee: 'Dev 1',
        priority: 'Highest',
        acceptanceCriteria: [
          'Drag node from library → Drop on canvas → Node appears',
          'Node has unique ID (generated)',
          'Node positioned at drop location',
          'Node shows visual feedback during drag'
        ],
        tasks: [
          { name: 'Implement drag handler on library nodes', estimate: '2h' },
          { name: 'Implement drop handler on canvas', estimate: '2h' },
          { name: 'Generate unique node IDs (uuid)', estimate: '0.5h' },
          { name: 'Add node to Zustand store on drop', estimate: '1h' },
          { name: 'Add visual feedback (drag ghost)', estimate: '1h' },
          { name: 'Test: Drag-drop adds node to canvas', estimate: '0.5h' }
        ]
      },
      {
        name: 'Enable Node Connections',
        description: 'As a user, I want to connect nodes by dragging from output to input, so that I can define the workflow sequence',
        storyPoints: 8,
        assignee: 'Dev 1',
        priority: 'Highest',
        acceptanceCriteria: [
          'Drag from output port → Input port → Creates edge',
          'Invalid connections prevented',
          'Edge stored in Zustand',
          'Visual feedback (animated edge during drag)'
        ],
        tasks: [
          { name: 'Define connection validation rules', estimate: '1h' },
          { name: 'Implement onConnect handler', estimate: '2h' },
          { name: 'Add edge to Zustand store', estimate: '1h' },
          { name: 'Style edges (curved lines, colors by node type)', estimate: '1h' },
          { name: 'Implement connection validation', estimate: '2h' },
          { name: 'Test: Valid connections work, invalid connections blocked', estimate: '1h' }
        ]
      },
      {
        name: 'Create Custom Node Components',
        description: 'As a developer, I want to create custom React Flow node components for each type, so that nodes display correctly with icons, labels, and ports',
        storyPoints: 5,
        assignee: 'Dev 2',
        priority: 'High',
        acceptanceCriteria: [
          '4 node component types created',
          'Each shows icon, label, status indicator',
          'Input/output ports positioned correctly',
          'Node styles match design'
        ],
        tasks: [
          { name: 'Create TriggerNode.tsx component', estimate: '1h' },
          { name: 'Create AgentNode.tsx component', estimate: '1h' },
          { name: 'Create ActionNode.tsx component', estimate: '1h' },
          { name: 'Create UtilityNode.tsx component', estimate: '1h' },
          { name: 'Add node type mapping (nodeTypes object)', estimate: '0.5h' },
          { name: 'Test: Nodes render with correct styles', estimate: '0.5h' }
        ]
      }
    ]
  },
  {
    name: 'Node Library & Components 📦',
    description: 'All 30 node types display correctly with visual indicators',
    storyPoints: 25,
    owner: 'Dev 2 (Nodes & Config Specialist)',
    stories: [
      {
        name: 'Build Configuration Panel Layout',
        description: 'As a user, I want to see a configuration panel when I select a node, so that I can configure its parameters',
        storyPoints: 3,
        assignee: 'Dev 2',
        priority: 'Highest',
        acceptanceCriteria: [
          'Right panel opens when node selected',
          'Panel closes when node deselected or close button clicked',
          'Panel header shows node name and type',
          'Panel content is scrollable'
        ],
        tasks: [
          { name: 'Create ConfigPanel.tsx component', estimate: '1h' },
          { name: 'Wire up node selection (click → select in Zustand)', estimate: '1h' },
          { name: 'Show/hide panel based on selectedNode state', estimate: '0.5h' },
          { name: 'Style panel layout (header, body, footer)', estimate: '1h' },
          { name: 'Test: Panel opens/closes correctly', estimate: '0.5h' }
        ]
      }
    ]
  },
  {
    name: 'Configuration System ⚙️',
    description: 'Users can configure each node type with specific parameters',
    storyPoints: 34,
    owner: 'Dev 2 (Nodes & Config Specialist)',
    stories: [
      {
        name: 'Implement Dynamic Configuration Forms (16 Original + 14 Shopify)',
        description: 'As a user, I want to see a form specific to the selected node type, so that I can configure its parameters',
        storyPoints: 21,
        assignee: 'Dev 2',
        priority: 'Highest',
        acceptanceCriteria: [
          'Form fields dynamically rendered based on node type',
          '30 configuration forms (16 original + 14 Shopify)',
          'Fields: Text input, textarea, dropdown, checkbox, radio, file upload',
          'Form state managed locally',
          'All Shopify forms included'
        ],
        tasks: [
          { name: 'Define configuration schema for each node type', estimate: '3h', assignee: 'Dev 1' },
          { name: 'Create WhatsAppTriggerConfig.tsx', estimate: '1h' },
          { name: 'Create EmailTriggerConfig.tsx', estimate: '1h' },
          { name: 'Create VoiceTriggerConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyOrderCreatedConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyOrderFulfilledConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyOrderDeliveredConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyOrderCancelledConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyTimeReminderConfig.tsx', estimate: '1.5h' },
          { name: 'Create ConversationalAgentConfig.tsx', estimate: '1.5h' },
          { name: 'Create DecisionAgentConfig.tsx', estimate: '1.5h' },
          { name: 'Create ReasoningAgentConfig.tsx', estimate: '1.5h' },
          { name: 'Create SendWhatsAppConfig.tsx', estimate: '1h' },
          { name: 'Create SendEmailConfig.tsx', estimate: '1h' },
          { name: 'Create InitiateCallConfig.tsx', estimate: '1h' },
          { name: 'Create UpdateCRMConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyGetProductConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyGetAllProductsConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyGetOrderConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyAuthCustomerConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyGetShopConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyCreateOrderConfig.tsx', estimate: '2h' },
          { name: 'Create ShopifyConfirmOrderConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyCancelOrderConfig.tsx', estimate: '1h' },
          { name: 'Create ShopifyUpdateAddressConfig.tsx', estimate: '1h' },
          { name: 'Create TextGeneratorConfig.tsx', estimate: '1h' },
          { name: 'Create SentimentCalcConfig.tsx', estimate: '0.5h' },
          { name: 'Create IntentCalcConfig.tsx', estimate: '0.5h' },
          { name: 'Create VulnScannerConfig.tsx', estimate: '0.5h' },
          { name: 'Create ReasonAnalyzerConfig.tsx', estimate: '0.5h' },
          { name: 'Create CustomAIUtilityConfig.tsx', estimate: '1h' },
          { name: 'Create config form router (switch based on node type)', estimate: '1h' },
          { name: 'Test: Each config form renders correctly', estimate: '2h' }
        ]
      },
      {
        name: 'Add Variable Insertion UI',
        description: 'As a user, I want to insert variables (e.g., {{phone_number}}) into text fields, so that I can use dynamic data from previous steps',
        storyPoints: 3,
        assignee: 'Dev 2',
        priority: 'High',
        acceptanceCriteria: [
          '"Insert Variable" dropdown in text fields',
          'Lists available variables from previous steps',
          'Clicking variable inserts {{variable_name}} at cursor'
        ],
        tasks: [
          { name: 'Create VariableInserter component', estimate: '2h' },
          { name: 'Compute available variables (trace back from current node)', estimate: '2h' },
          { name: 'Insert variable at cursor position', estimate: '1h' },
          { name: 'Test: Variable insertion works', estimate: '0.5h' }
        ]
      },
      {
        name: 'Implement Form Validation',
        description: 'As a user, I want to see validation errors when I miss required fields, so that I can fix my configuration',
        storyPoints: 3,
        assignee: 'Dev 2',
        priority: 'Highest',
        acceptanceCriteria: [
          'Required fields marked with *',
          'Validation runs on blur and on save',
          'Error messages displayed inline',
          'Node shows error indicator if misconfigured'
        ],
        tasks: [
          { name: 'Add validation schema (Yup or Zod)', estimate: '2h' },
          { name: 'Implement inline validation', estimate: '1h' },
          { name: 'Update node visual state (red border if error)', estimate: '1h' },
          { name: 'Test: Validation catches errors', estimate: '1h' }
        ]
      },
      {
        name: 'Save Configuration to Node',
        description: 'As a user, I want my configuration to save when I click "Save", so that my settings persist',
        storyPoints: 3,
        assignee: 'Dev 2',
        priority: 'Highest',
        acceptanceCriteria: [
          '"Save Configuration" button in panel',
          'Configuration saved to node data (Zustand)',
          'Node marked as "configured" (visual indicator)',
          'Auto-save on blur (optional, nice-to-have)'
        ],
        tasks: [
          { name: 'Implement save handler (update node in Zustand)', estimate: '1h' },
          { name: 'Update node visual state (checkmark if configured)', estimate: '0.5h' },
          { name: 'Add success toast notification', estimate: '0.5h' },
          { name: 'Test: Configuration persists after save', estimate: '1h' }
        ]
      }
    ]
  },
  {
    name: 'Workflow Execution Engine 🚀',
    description: 'Workflows execute correctly with all 30 node types',
    storyPoints: 29,
    owner: 'Dev 3 (Execution Engine Specialist)',
    stories: [
      {
        name: 'Design Execution Engine Architecture',
        description: 'As a developer, I want to design the execution engine architecture, so that workflows execute correctly',
        storyPoints: 5,
        assignee: 'Dev 3',
        priority: 'Highest',
        acceptanceCriteria: [
          'Execution flow documented (sequential step processing)',
          'Context passing strategy defined',
          'Error handling strategy defined',
          'Database schemas created (workflow_executions, execution_logs)'
        ],
        tasks: [
          { name: 'Document execution flow', estimate: '1h', assignee: 'Dev 1' },
          { name: 'Create execution.schema.ts (Execution model)', estimate: '1h' },
          { name: 'Create execution-log.schema.ts (ExecutionLog model)', estimate: '1h' },
          { name: 'Create indexes (workflowId, executionId, status)', estimate: '0.5h' },
          { name: 'Review schema with team', estimate: '0.5h', assignee: 'Dev 1' }
        ]
      },
      {
        name: 'Build Execution Engine Core',
        description: 'As a developer, I want to build the core execution engine, so that workflows can execute step-by-step',
        storyPoints: 8,
        assignee: 'Dev 3',
        priority: 'Highest',
        acceptanceCriteria: [
          'ExecutionEngineService class created',
          'executeWorkflow() method implemented',
          'Sequential step execution (load step → execute → move to next)',
          'Context passing (output of step N becomes input of step N+1)',
          'Error handling (stop on error, log error)'
        ],
        tasks: [
          { name: 'Create execution-engine.service.ts', estimate: '1h' },
          { name: 'Implement loadWorkflow() (fetch from DB)', estimate: '1h' },
          { name: 'Implement loadSteps() (fetch all steps)', estimate: '1h' },
          { name: 'Implement executeWorkflow() (main loop)', estimate: '3h' },
          { name: 'Implement context passing logic', estimate: '1h' },
          { name: 'Implement error handling (try-catch, log)', estimate: '1h' },
          { name: 'Test: Execute simple workflow (Trigger → Action)', estimate: '1h' }
        ]
      },
      {
        name: 'Implement Step Executor for All 30 Node Types',
        description: 'As a developer, I want to implement step-specific execution logic, so that each node type executes correctly',
        storyPoints: 13,
        assignee: 'Dev 3',
        priority: 'Highest',
        acceptanceCriteria: [
          'StepExecutorService class created',
          'execute() method routes to correct handler based on stepType',
          'Handlers for all 30 node types (8 triggers + 3 agents + 13 actions + 6 utilities)',
          'Variable replacement ({{var}} → actual value)',
          'Shopify integration working'
        ],
        tasks: [
          { name: 'Create step-executor.service.ts', estimate: '1h' },
          { name: 'Implement execute() method (routing logic)', estimate: '1h' },
          { name: 'Implement executeTrigger() for 8 triggers', estimate: '2h' },
          { name: 'Implement executeAgent() for 3 agents (call BotCore API)', estimate: '2h' },
          { name: 'Implement executeAction() for 13 actions (4 original + 9 Shopify)', estimate: '4h' },
          { name: 'Implement executeUtility() for 6 utilities (call BotCore utility APIs)', estimate: '2h' },
          { name: 'Implement replaceVariables() helper', estimate: '1h' },
          { name: 'Implement Shopify API integration', estimate: '3h' },
          { name: 'Test: Each of 30 node types executes correctly', estimate: '3h' }
        ]
      },
      {
        name: 'Create Execute Workflow API Endpoint',
        description: 'As a user, I want to execute a workflow via API, so that my published workflows can run',
        storyPoints: 3,
        assignee: 'Dev 3',
        priority: 'Highest',
        acceptanceCriteria: [
          'POST /workFlow/:id/execute endpoint created',
          'Accepts triggerData in request body',
          'Returns executionId and status',
          'Saves execution record to DB'
        ],
        tasks: [
          { name: 'Create execution.controller.ts', estimate: '1h' },
          { name: 'Implement POST /workFlow/:id/execute', estimate: '2h' },
          { name: 'Integrate with ExecutionEngineService', estimate: '1h' },
          { name: 'Test: API endpoint works', estimate: '1h' }
        ]
      }
    ]
  },
  {
    name: 'Validation & Publish ✅',
    description: 'Users can validate workflows before publishing to catch errors early',
    storyPoints: 13,
    owner: 'Dev 3 (lead), Dev 1 & Dev 2 (support)',
    stories: [
      {
        name: 'Implement Workflow Validation',
        description: 'As a user, I want to validate my workflow before publishing, so that I catch errors early',
        storyPoints: 5,
        assignee: 'Dev 3',
        priority: 'High',
        acceptanceCriteria: [
          'POST /workFlow/:id/validate endpoint',
          'Checks: All nodes configured, no orphan nodes, valid connections, at least one trigger',
          'Returns list of errors (if any)',
          '"Publish" button disabled if validation fails'
        ],
        tasks: [
          { name: 'Implement validateWorkflow() method', estimate: '2h' },
          { name: 'Create POST /workFlow/:id/validate endpoint', estimate: '1h' },
          { name: 'Call validation on "Publish" click', estimate: '0.5h', assignee: 'Dev 2' },
          { name: 'Display validation errors in modal', estimate: '1h', assignee: 'Dev 2' },
          { name: 'Test: Validation catches errors', estimate: '1h' }
        ]
      },
      {
        name: 'Implement Publish Workflow',
        description: 'As a user, I want to publish my workflow after validation passes, so that it becomes executable',
        storyPoints: 3,
        assignee: 'Dev 3',
        priority: 'Highest',
        acceptanceCriteria: [
          'POST /workFlow/:id/publish endpoint',
          'Workflow status changes to PUBLISHED',
          'Only validated workflows can be published',
          'Published workflows are executable'
        ],
        tasks: [
          { name: 'Implement POST /workFlow/:id/publish endpoint', estimate: '2h' },
          { name: 'Add workflow status transition logic', estimate: '1h' },
          { name: 'Test: Publish workflow works', estimate: '1h' }
        ]
      }
    ]
  },
  {
    name: 'Monitoring Dashboard 📊',
    description: 'Users can monitor workflow executions with detailed logs',
    storyPoints: 29,
    owner: 'Dev 4 (Monitoring Dashboard Specialist)',
    stories: [
      {
        name: 'Create Monitoring Page Layout',
        description: 'As a user, I want a monitoring page to see all executions, so that I can track workflow performance',
        storyPoints: 5,
        assignee: 'Dev 4',
        priority: 'High',
        acceptanceCriteria: [
          'Monitoring page accessible from workflow detail',
          'Shows execution list (table)',
          'Columns: executionId, status, startedAt, duration',
          'Filters: status (all/completed/failed), date range'
        ],
        tasks: [
          { name: 'Create WorkflowMonitoring.tsx page', estimate: '2h' },
          { name: 'Create execution list table', estimate: '3h' },
          { name: 'Add filters (status, date range)', estimate: '2h' },
          { name: 'Add "View Details" button per execution', estimate: '1h' },
          { name: 'Style page', estimate: '1h' },
          { name: 'Test: Page renders, filters work', estimate: '1h' }
        ]
      },
      {
        name: 'Implement Get Executions API',
        description: 'As a developer, I want an API to fetch workflow executions, so that the monitoring page can display them',
        storyPoints: 3,
        assignee: 'Dev 3',
        priority: 'High',
        acceptanceCriteria: [
          'GET /workFlow/:id/executions endpoint',
          'Supports pagination (page, limit)',
          'Supports filters (status, dateRange)',
          'Returns execution list with metadata'
        ],
        tasks: [
          { name: 'Implement GET /workFlow/:id/executions', estimate: '2h' },
          { name: 'Add pagination', estimate: '1h' },
          { name: 'Add filters (status, dateRange)', estimate: '1h' },
          { name: 'Test: Endpoint returns executions', estimate: '1h' }
        ]
      },
      {
        name: 'Build Execution Detail View',
        description: 'As a user, I want to see step-by-step details of an execution, so that I can debug failures',
        storyPoints: 8,
        assignee: 'Dev 4',
        priority: 'High',
        acceptanceCriteria: [
          'Click "View Details" → Expands execution row',
          'Shows step-by-step logs: stepId, status, input, output, duration',
          'Failed steps show error message',
          '"View Raw JSON" button (optional)',
          '"Retry" button for failed executions'
        ],
        tasks: [
          { name: 'Create ExecutionDetail component', estimate: '3h' },
          { name: 'Fetch execution logs (GET /execution/:id)', estimate: '1h' },
          { name: 'Display step-by-step logs (list)', estimate: '2h' },
          { name: 'Add "Retry" button', estimate: '1h' },
          { name: 'Style detail view', estimate: '1h' },
          { name: 'Test: Detail view renders correctly', estimate: '1h' }
        ]
      },
      {
        name: 'Implement Get Execution Details API',
        description: 'As a developer, I want an API to fetch execution details with logs, so that the detail view can display them',
        storyPoints: 3,
        assignee: 'Dev 3',
        priority: 'High',
        acceptanceCriteria: [
          'GET /execution/:id endpoint',
          'Returns execution record + all step logs',
          'Step logs ordered by stepOrder'
        ],
        tasks: [
          { name: 'Implement GET /execution/:id', estimate: '2h' },
          { name: 'Join execution + logs (MongoDB aggregation or multiple queries)', estimate: '1h' },
          { name: 'Test: Endpoint returns correct data', estimate: '1h' }
        ]
      },
      {
        name: 'Implement Retry Failed Execution',
        description: 'As a user, I want to retry a failed execution, so that I can recover from transient errors',
        storyPoints: 3,
        assignee: 'Dev 3',
        priority: 'Medium',
        acceptanceCriteria: [
          'POST /execution/:id/retry endpoint',
          'Creates new execution with same triggerData',
          'Returns new executionId'
        ],
        tasks: [
          { name: 'Implement POST /execution/:id/retry', estimate: '2h' },
          { name: 'Fetch original execution triggerData', estimate: '0.5h' },
          { name: 'Call executeWorkflow() with same data', estimate: '0.5h' },
          { name: 'Test: Retry creates new execution', estimate: '1h' }
        ]
      },
      {
        name: 'Add Polling Refresh',
        description: 'As a user, I want the monitoring page to refresh automatically, so that I see new executions without manual refresh',
        storyPoints: 2,
        assignee: 'Dev 4',
        priority: 'Medium',
        acceptanceCriteria: [
          'Page polls GET /workFlow/:id/executions every 5 seconds',
          '"Refresh" button for manual refresh',
          'Stop polling when user navigates away'
        ],
        tasks: [
          { name: 'Implement polling with setInterval', estimate: '1h' },
          { name: 'Add manual "Refresh" button', estimate: '0.5h' },
          { name: 'Clean up interval on unmount', estimate: '0.5h' },
          { name: 'Test: Polling updates list', estimate: '1h' }
        ]
      }
    ]
  },
  {
    name: 'Integration & Testing ✨',
    description: 'End-to-end integration with existing BotWot backend + bug fixes',
    storyPoints: 21,
    owner: 'All Developers',
    stories: [
      {
        name: 'Integrate with Existing Workflow APIs',
        description: 'As a developer, I want to use existing BotWot workflow APIs, so that we don\'t duplicate backend logic',
        storyPoints: 5,
        assignee: 'Dev 1',
        priority: 'Highest',
        acceptanceCriteria: [
          'POST /workFlow/create called on canvas save',
          'POST /workFlow/step called to save each node',
          'PUT /workFlow/step/:wfId/:stepId called to update nextStepId',
          'POST /workFlow/publish/:id called on publish'
        ],
        tasks: [
          { name: 'Document API integration points', estimate: '1h' },
          { name: 'Implement saveWorkflow() (calls POST /workFlow/create)', estimate: '2h', assignee: 'Dev 2' },
          { name: 'Implement saveStep() (calls POST /workFlow/step)', estimate: '2h', assignee: 'Dev 2' },
          { name: 'Implement updateStep() (calls PUT /workFlow/step)', estimate: '1h', assignee: 'Dev 2' },
          { name: 'Implement publishWorkflow() (calls POST /workFlow/publish)', estimate: '1h', assignee: 'Dev 2' },
          { name: 'Test: Workflow saved correctly to DB', estimate: '1h' }
        ]
      },
      {
        name: 'Implement JWT Auth Integration',
        description: 'As a developer, I want to use existing JWT auth, so that only authenticated users can access the builder',
        storyPoints: 3,
        assignee: 'Dev 1',
        priority: 'Highest',
        acceptanceCriteria: [
          'All API calls include JWT token (Authorization: Bearer <token>)',
          '401 responses redirect to login',
          'User context (userId, orgId) available in frontend'
        ],
        tasks: [
          { name: 'Configure axios interceptor (add JWT to headers)', estimate: '1h' },
          { name: 'Handle 401 responses (redirect to login)', estimate: '1h' },
          { name: 'Fetch user context on app load', estimate: '0.5h' },
          { name: 'Test: Auth works, 401 redirects', estimate: '1h' }
        ]
      },
      {
        name: 'Add Multi-Tenant Isolation',
        description: 'As a developer, I want to ensure workflows are isolated by orgId, so that organizations don\'t see each other\'s data',
        storyPoints: 3,
        assignee: 'Dev 3',
        priority: 'Highest',
        acceptanceCriteria: [
          'All queries filter by userId + orgId',
          'All workflow creation includes orgId',
          'Test: User A can\'t access User B\'s workflows'
        ],
        tasks: [
          { name: 'Add orgId filter to all queries', estimate: '2h' },
          { name: 'Add orgId to workflow creation', estimate: '0.5h' },
          { name: 'Test: Multi-tenancy works', estimate: '1h' }
        ]
      },
      {
        name: 'Write E2E Test',
        description: 'As a developer, I want an E2E test for the complete user journey, so that we ensure everything works together',
        storyPoints: 5,
        assignee: 'Dev 1',
        priority: 'High',
        acceptanceCriteria: [
          'E2E test using Playwright or Cypress',
          'Test flow: Login → Create workflow → Add nodes → Connect → Configure → Test → Publish → Monitor'
        ],
        tasks: [
          { name: 'Setup Playwright/Cypress', estimate: '1h' },
          { name: 'Write E2E test script', estimate: '4h' },
          { name: 'Run test, fix issues', estimate: '2h' }
        ]
      },
      {
        name: 'Bug Fixes & Refinements',
        description: 'As a team, I want to fix bugs discovered during testing, so that the MVP is stable',
        storyPoints: 5,
        assignee: 'All Devs',
        priority: 'Highest',
        acceptanceCriteria: [
          'Zero critical bugs',
          'Zero P0 bugs blocking release',
          'All E2E tests pass'
        ],
        tasks: [
          { name: 'Triage bugs from testing', estimate: '2h' },
          { name: 'Fix critical bugs', estimate: '8h' },
          { name: 'Fix high-priority bugs', estimate: '8h' },
          { name: 'Retest after fixes', estimate: '2h' }
        ]
      }
    ]
  }
];

// Helper function to make HTTPS requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.apiToken}`).toString('base64');

    const requestOptions = {
      hostname: JIRA_CONFIG.domain,
      path: options.path,
      method: options.method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Function to create an epic
async function createEpic(epic, epicIndex) {
  console.log(`\n📦 Creating Epic ${epicIndex + 1}/7: ${epic.name}`);

  const epicData = {
    fields: {
      project: {
        key: JIRA_CONFIG.projectKey
      },
      summary: epic.name,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: epic.description
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `\n\nOwner: ${epic.owner}`
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Story Points: ${epic.storyPoints}`
              }
            ]
          }
        ]
      },
      issuetype: {
        id: JIRA_CONFIG.issueTypes.epic
      }
    }
  };

  try {
    const result = await makeRequest(
      {
        path: '/rest/api/3/issue',
        method: 'POST'
      },
      epicData
    );
    console.log(`✅ Created Epic: ${result.key} - ${epic.name}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create epic: ${error.message}`);
    throw error;
  }
}

// Function to create a story
async function createStory(story, epicKey, storyIndex, totalStories) {
  console.log(`  📝 Creating Story ${storyIndex + 1}/${totalStories}: ${story.name}`);

  // Build acceptance criteria as description content
  const acceptanceCriteriaContent = story.acceptanceCriteria.map(criteria => ({
    type: 'listItem',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: criteria
          }
        ]
      }
    ]
  }));

  const storyData = {
    fields: {
      project: {
        key: JIRA_CONFIG.projectKey
      },
      summary: story.name,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: story.description
              }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [
              {
                type: 'text',
                text: 'Acceptance Criteria:'
              }
            ]
          },
          {
            type: 'bulletList',
            content: acceptanceCriteriaContent
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `\n\nAssignee: ${story.assignee}`
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Priority: ${story.priority}`
              }
            ]
          }
        ]
      },
      issuetype: {
        id: JIRA_CONFIG.issueTypes.story
      },
      parent: {
        key: epicKey
      }
    }
  };

  // Add story points if field exists
  if (story.storyPoints) {
    storyData.fields['customfield_10016'] = story.storyPoints; // Story Points field (may vary)
  }

  try {
    const result = await makeRequest(
      {
        path: '/rest/api/3/issue',
        method: 'POST'
      },
      storyData
    );
    console.log(`    ✅ Created Story: ${result.key} - ${story.name}`);
    return result;
  } catch (error) {
    console.error(`    ❌ Failed to create story: ${error.message}`);
    // Continue with other stories even if one fails
    return null;
  }
}

// Function to create a subtask
async function createSubtask(task, parentKey, taskIndex, totalTasks) {
  console.log(`      ⚙️  Creating Task ${taskIndex + 1}/${totalTasks}: ${task.name}`);

  const taskData = {
    fields: {
      project: {
        key: JIRA_CONFIG.projectKey
      },
      summary: task.name,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Estimate: ${task.estimate}`
              }
            ]
          }
        ]
      },
      issuetype: {
        id: JIRA_CONFIG.issueTypes.subtask
      },
      parent: {
        key: parentKey
      }
    }
  };

  // Add assignee if specified
  if (task.assignee) {
    taskData.fields.description.content.push({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: `Assignee: ${task.assignee}`
        }
      ]
    });
  }

  try {
    const result = await makeRequest(
      {
        path: '/rest/api/3/issue',
        method: 'POST'
      },
      taskData
    );
    console.log(`        ✅ Created Task: ${result.key}`);
    return result;
  } catch (error) {
    console.error(`        ❌ Failed to create task: ${error.message}`);
    return null;
  }
}

// Main function to set up the entire board
async function setupJiraBoard() {
  console.log('🚀 Starting Jira Board Setup for Visual Workflow Builder MVP');
  console.log(`📍 Project: ${JIRA_CONFIG.projectKey}`);
  console.log(`🌐 Domain: ${JIRA_CONFIG.domain}`);
  console.log(`📊 Setting up ${EPICS.length} epics with full detail (stories + tasks)\n`);

  try {
    for (let i = 0; i < EPICS.length; i++) {
      const epic = EPICS[i];

      // Create epic
      const epicResult = await createEpic(epic, i);

      if (!epicResult) continue;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create stories under this epic
      for (let j = 0; j < epic.stories.length; j++) {
        const story = epic.stories[j];
        const storyResult = await createStory(story, epicResult.key, j, epic.stories.length);

        if (!storyResult) continue;

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Create tasks (subtasks) under this story
        if (story.tasks && story.tasks.length > 0) {
          for (let k = 0; k < story.tasks.length; k++) {
            const task = story.tasks[k];
            await createSubtask(task, storyResult.key, k, story.tasks.length);

            // Small delay
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }

      console.log(`\n✅ Completed Epic ${i + 1}/7: ${epic.name}\n`);
    }

    console.log('\n🎉 Jira Board Setup Complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - ${EPICS.length} Epics created`);
    console.log(`   - ${EPICS.reduce((sum, e) => sum + e.stories.length, 0)} Stories created`);
    console.log(`   - ${EPICS.reduce((sum, e) => sum + e.stories.reduce((s, story) => s + (story.tasks ? story.tasks.length : 0), 0), 0)} Tasks created`);
    console.log(`\n🔗 View your board at: https://${JIRA_CONFIG.domain}/jira/software/c/projects/${JIRA_CONFIG.projectKey}/boards`);

  } catch (error) {
    console.error('\n❌ Error setting up Jira board:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupJiraBoard();
