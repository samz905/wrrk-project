# wrrk.ai Visual Workflow Builder - MVP Sprint Plan

**Version:** 1.0
**Sprint Duration:** 2 weeks (10 working days)
**Sprint Goal:** Deliver a production-ready visual workflow builder with all 16 node types, full monitoring, and existing BotWot integration
**Team:** 3 developers (1 lead + 2 devs)
**Start Date:** [INSERT DATE]
**End Date:** [INSERT DATE]

---

## Table of Contents

1. [Sprint Overview](#sprint-overview)
2. [Team Allocation](#team-allocation)
3. [Epics](#epics)
4. [User Stories & Tasks](#user-stories--tasks)
5. [Daily Milestones](#daily-milestones)
6. [TDD Strategy](#tdd-strategy)
7. [Risk Management](#risk-management)
8. [Definition of Done](#definition-of-done)

---

## Sprint Overview

### Sprint Goal
Build a visual workflow builder that allows users to:
- Drag and drop 16 node types onto a canvas
- Connect nodes visually to create workflows
- Configure each node with specific parameters
- Test workflows with sample data
- Publish workflows for execution
- Monitor workflow executions with step-by-step logs

### Key Decisions (80/20 Principle)

**In Scope:**
- ✅ All 16 node types (3 triggers, 3 agents, 4 actions, 6 utilities)
- ✅ React Flow canvas with drag-drop
- ✅ Dynamic configuration panels for each node type
- ✅ Workflow save/load (integrate with existing BotWot APIs)
- ✅ Test mode with dry-run execution
- ✅ Publish workflow with validation
- ✅ Full monitoring dashboard with step-by-step execution logs
- ✅ Polling-based updates (refresh to see new executions)
- ✅ Reuse existing JWT auth + multi-tenant system

**Out of Scope (Post-MVP):**
- ❌ Real-time WebSocket updates (using polling instead)
- ❌ Undo/redo functionality
- ❌ Canvas minimap
- ❌ Real-time canvas animations during execution
- ❌ Workflow versioning
- ❌ Keyboard shortcuts
- ❌ Collaborative editing
- ❌ Advanced canvas features (auto-layout, smart routing)
- ❌ Workflow marketplace (future phase)

### Success Metrics
- [ ] 16 node types fully implemented and tested
- [ ] User can create, test, publish, and monitor a workflow end-to-end
- [ ] Zero critical bugs preventing core functionality
- [ ] All APIs integrated with existing BotWot backend
- [ ] 70%+ unit test coverage for critical paths
- [ ] E2E test for complete user journey

---

## Team Allocation

### Developer Roles

**Dev 1 (Lead - You):**
- Architecture & technical decisions
- Critical path implementation (execution engine, React Flow setup)
- Code review (all PRs)
- Risk management & unblocking

**Dev 2 (Frontend Specialist):**
- React Flow canvas & node library
- Node components (16 types)
- Configuration panels (dynamic forms)
- Monitoring dashboard UI

**Dev 3 (Backend Specialist):**
- Execution engine (workflow execution logic)
- Step executor (node-specific logic)
- Test mode API (dry-run)
- Execution logs API

### Work Distribution (Hours Estimate)

| Epic | Dev 1 (Lead) | Dev 2 (Frontend) | Dev 3 (Backend) | Total Hours |
|------|--------------|------------------|-----------------|-------------|
| Epic 1: Canvas & Nodes | 10h | 25h | 0h | 35h |
| Epic 2: Configuration | 5h | 30h | 0h | 35h |
| Epic 3: Execution Engine | 5h | 0h | 25h | 30h |
| Epic 4: Test & Validation | 5h | 5h | 10h | 20h |
| Epic 5: Monitoring | 5h | 20h | 10h | 35h |
| Epic 6: Integration & Polish | 15h | 10h | 10h | 35h |
| **Total** | **45h** | **90h** | **55h** | **190h** |

**Buffer:** 10-20 hours for unplanned issues, testing, refinement

---

## Epics

### Epic 1: Visual Canvas & Node Library 🎨
**Goal:** Users can drag nodes onto a canvas and connect them visually

**Acceptance Criteria:**
- [ ] React Flow canvas renders with pan/zoom
- [ ] Left panel shows 16 node types in categories
- [ ] Drag-drop from library to canvas works
- [ ] Nodes can be connected (output → input)
- [ ] Invalid connections are prevented
- [ ] Canvas state persists (save/load)

**Story Points:** 21

---

### Epic 2: Node Configuration System ⚙️
**Goal:** Users can configure each node type with specific parameters

**Acceptance Criteria:**
- [ ] Right panel opens when node is selected
- [ ] Dynamic forms based on node type
- [ ] Variable insertion (autocomplete)
- [ ] Form validation (required fields, format checks)
- [ ] Configuration saves to node data

**Story Points:** 21

---

### Epic 3: Workflow Execution Engine 🚀
**Goal:** Workflows execute correctly with all node types

**Acceptance Criteria:**
- [ ] Execute workflow endpoint (`POST /workFlow/:id/execute`)
- [ ] Step-by-step execution with context passing
- [ ] All 16 node types execute correctly
- [ ] Error handling and logging
- [ ] Execution records saved to database

**Story Points:** 21

---

### Epic 4: Test & Validation 🧪
**Goal:** Users can test workflows before publishing

**Acceptance Criteria:**
- [ ] Test panel UI (slide-in drawer)
- [ ] Test data input form
- [ ] Dry-run execution (no DB save, no side effects)
- [ ] Step-by-step results display
- [ ] Error highlighting and fix suggestions

**Story Points:** 13

---

### Epic 5: Monitoring & Execution Logs 📊
**Goal:** Users can monitor workflow executions with detailed logs

**Acceptance Criteria:**
- [ ] Monitoring page with execution list
- [ ] Filters (status, date range)
- [ ] Expandable execution details (step-by-step)
- [ ] Retry failed execution
- [ ] Polling-based refresh

**Story Points:** 21

---

### Epic 6: Integration & Polish ✨
**Goal:** End-to-end integration with existing BotWot backend + bug fixes

**Acceptance Criteria:**
- [ ] JWT auth integration
- [ ] Multi-tenant isolation (orgId, userId)
- [ ] Integration with existing workflow APIs
- [ ] E2E test (create → test → publish → monitor)
- [ ] Bug fixes from testing
- [ ] Performance optimization

**Story Points:** 13

---

## User Stories & Tasks

---

## 📦 EPIC 1: Visual Canvas & Node Library

### Story 1.1: Setup React Flow Canvas (5 pts)
**As a** developer
**I want** to set up the React Flow canvas infrastructure
**So that** we have a foundation for the visual builder

**Acceptance Criteria:**
- [ ] React Flow installed and configured
- [ ] Canvas component renders with pan/zoom
- [ ] Background grid visible
- [ ] Controls (zoom in/out, fit view) working

**Tasks:**
- **[DEV2-01]** Install @xyflow/react package (1h)
- **[DEV2-02]** Create WorkflowCanvas.tsx component (2h)
- **[DEV2-03]** Configure canvas controls (Background, Controls, MiniMap hidden) (1h)
- **[DEV2-04]** Set up Zustand store for canvas state (nodes, edges) (2h)
- **[DEV2-05]** Test: Canvas renders, pan/zoom works (0.5h)

**TDD:**
- Write test: Canvas component renders without crashing
- Write test: Pan and zoom interactions work

**Assigned:** Dev 2
**Dependencies:** None
**Priority:** P0 (Critical Path)

---

### Story 1.2: Build Node Library Panel (5 pts)
**As a** user
**I want** to see all available node types in a left panel
**So that** I can drag them onto the canvas

**Acceptance Criteria:**
- [ ] Left panel shows 4 categories: Triggers, Agents, Actions, Utilities
- [ ] 16 node types displayed with icons and labels
- [ ] Search box filters nodes in real-time
- [ ] Collapsible categories

**Tasks:**
- **[DEV2-06]** Create NodeLibrary.tsx component (2h)
- **[DEV2-07]** Define node type data structure (name, icon, category, description) (1h)
- **[DEV2-08]** Implement search filter logic (1h)
- **[DEV2-09]** Add category collapse/expand (1h)
- **[DEV2-10]** Style panel (Tailwind CSS) (1h)
- **[DEV2-11]** Test: All 16 nodes display, search works (0.5h)

**TDD:**
- Write test: Search filters nodes correctly
- Write test: Category expand/collapse works

**Assigned:** Dev 2
**Dependencies:** None
**Priority:** P0

---

### Story 1.3: Implement Drag-Drop from Library to Canvas (8 pts)
**As a** user
**I want** to drag nodes from the library onto the canvas
**So that** I can start building my workflow

**Acceptance Criteria:**
- [ ] Drag node from library → Drop on canvas → Node appears
- [ ] Node has unique ID (generated)
- [ ] Node positioned at drop location
- [ ] Node shows visual feedback during drag

**Tasks:**
- **[DEV2-12]** Implement drag handler on library nodes (2h)
- **[DEV2-13]** Implement drop handler on canvas (2h)
- **[DEV2-14]** Generate unique node IDs (uuid) (0.5h)
- **[DEV2-15]** Add node to Zustand store on drop (1h)
- **[DEV2-16]** Add visual feedback (drag ghost) (1h)
- **[DEV2-17]** Test: Drag-drop adds node to canvas (0.5h)

**TDD:**
- Write test: Dragging node creates new node on canvas
- Write test: Node has unique ID
- Write test: Node positioned at drop coordinates

**Assigned:** Dev 2
**Dependencies:** Story 1.1, Story 1.2
**Priority:** P0

---

### Story 1.4: Enable Node Connections (8 pts)
**As a** user
**I want** to connect nodes by dragging from output to input
**So that** I can define the workflow sequence

**Acceptance Criteria:**
- [ ] Drag from output port → Input port → Creates edge
- [ ] Invalid connections prevented (e.g., trigger can't connect to another trigger)
- [ ] Edge stored in Zustand
- [ ] Visual feedback (animated edge during drag)

**Tasks:**
- **[DEV2-18]** Define connection validation rules (1h)
- **[DEV2-19]** Implement onConnect handler (2h)
- **[DEV2-20]** Add edge to Zustand store (1h)
- **[DEV2-21]** Style edges (curved lines, colors by node type) (1h)
- **[DEV2-22]** Implement connection validation (2h)
- **[DEV2-23]** Test: Valid connections work, invalid connections blocked (1h)

**TDD:**
- Write test: Valid connection creates edge
- Write test: Invalid connection shows error
- Write test: Edge stored in state

**Assigned:** Dev 2
**Dependencies:** Story 1.3
**Priority:** P0

---

### Story 1.5: Create Custom Node Components (5 pts)
**As a** developer
**I want** to create custom React Flow node components for each type
**So that** nodes display correctly with icons, labels, and ports

**Acceptance Criteria:**
- [ ] 4 node component types: TriggerNode, AgentNode, ActionNode, UtilityNode
- [ ] Each shows icon, label, status indicator (configured/unconfigured)
- [ ] Input/output ports (handles) positioned correctly
- [ ] Node styles match design (colors by type)

**Tasks:**
- **[DEV2-24]** Create TriggerNode.tsx component (1h)
- **[DEV2-25]** Create AgentNode.tsx component (1h)
- **[DEV2-26]** Create ActionNode.tsx component (1h)
- **[DEV2-27]** Create UtilityNode.tsx component (1h)
- **[DEV2-28]** Add node type mapping (nodeTypes object) (0.5h)
- **[DEV2-29]** Test: Nodes render with correct styles (0.5h)

**TDD:**
- Write test: Each node component renders correctly
- Write test: Node shows configured/unconfigured state

**Assigned:** Dev 2
**Dependencies:** Story 1.1
**Priority:** P1

---

## 📦 EPIC 2: Node Configuration System

### Story 2.1: Build Configuration Panel Layout (3 pts)
**As a** user
**I want** to see a configuration panel when I select a node
**So that** I can configure its parameters

**Acceptance Criteria:**
- [ ] Right panel opens when node selected
- [ ] Panel closes when node deselected or close button clicked
- [ ] Panel header shows node name and type
- [ ] Panel content is scrollable

**Tasks:**
- **[DEV2-30]** Create ConfigPanel.tsx component (1h)
- **[DEV2-31]** Wire up node selection (click → select in Zustand) (1h)
- **[DEV2-32]** Show/hide panel based on selectedNode state (0.5h)
- **[DEV2-33]** Style panel layout (header, body, footer) (1h)
- **[DEV2-34]** Test: Panel opens/closes correctly (0.5h)

**TDD:**
- Write test: Panel opens when node selected
- Write test: Panel closes when deselected

**Assigned:** Dev 2
**Dependencies:** Story 1.3
**Priority:** P0

---

### Story 2.2: Implement Dynamic Configuration Forms (13 pts)
**As a** user
**I want** to see a form specific to the selected node type
**So that** I can configure its parameters

**Acceptance Criteria:**
- [ ] Form fields dynamically rendered based on node type
- [ ] 16 configuration forms (one per node type)
- [ ] Fields: Text input, textarea, dropdown, checkbox, radio, file upload
- [ ] Form state managed locally

**Tasks:**
- **[DEV1-01]** Define configuration schema for each node type (3h)
- **[DEV2-35]** Create WhatsAppTriggerConfig.tsx (1h)
- **[DEV2-36]** Create EmailTriggerConfig.tsx (1h)
- **[DEV2-37]** Create VoiceTriggerConfig.tsx (1h)
- **[DEV2-38]** Create ConversationalAgentConfig.tsx (1.5h)
- **[DEV2-39]** Create DecisionAgentConfig.tsx (1.5h)
- **[DEV2-40]** Create ReasoningAgentConfig.tsx (1.5h)
- **[DEV2-41]** Create SendWhatsAppConfig.tsx (1h)
- **[DEV2-42]** Create SendEmailConfig.tsx (1h)
- **[DEV2-43]** Create InitiateCallConfig.tsx (1h)
- **[DEV2-44]** Create UpdateCRMConfig.tsx (1h)
- **[DEV2-45]** Create TextGeneratorConfig.tsx (1h)
- **[DEV2-46]** Create SentimentCalcConfig.tsx (0.5h)
- **[DEV2-47]** Create IntentCalcConfig.tsx (0.5h)
- **[DEV2-48]** Create VulnScannerConfig.tsx (0.5h)
- **[DEV2-49]** Create ReasonAnalyzerConfig.tsx (0.5h)
- **[DEV2-50]** Create CustomAIUtilityConfig.tsx (1h)
- **[DEV2-51]** Create config form router (switch based on node type) (1h)
- **[DEV2-52]** Test: Each config form renders correctly (1h)

**TDD:**
- Write test: Config form renders for each node type
- Write test: Form fields match schema

**Assigned:** Dev 1 (schema), Dev 2 (forms)
**Dependencies:** Story 2.1
**Priority:** P0

---

### Story 2.3: Add Variable Insertion UI (3 pts)
**As a** user
**I want** to insert variables (e.g., {{phone_number}}) into text fields
**So that** I can use dynamic data from previous steps

**Acceptance Criteria:**
- [ ] "Insert Variable" dropdown in text fields
- [ ] Lists available variables from previous steps
- [ ] Clicking variable inserts {{variable_name}} at cursor

**Tasks:**
- **[DEV2-53]** Create VariableInserter component (2h)
- **[DEV2-54]** Compute available variables (trace back from current node) (2h)
- **[DEV2-55]** Insert variable at cursor position (1h)
- **[DEV2-56]** Test: Variable insertion works (0.5h)

**TDD:**
- Write test: Available variables computed correctly
- Write test: Variable inserted at cursor

**Assigned:** Dev 2
**Dependencies:** Story 2.2
**Priority:** P1

---

### Story 2.4: Implement Form Validation (3 pts)
**As a** user
**I want** to see validation errors when I miss required fields
**So that** I can fix my configuration

**Acceptance Criteria:**
- [ ] Required fields marked with *
- [ ] Validation runs on blur and on save
- [ ] Error messages displayed inline
- [ ] Node shows error indicator if misconfigured

**Tasks:**
- **[DEV2-57]** Add validation schema (Yup or Zod) (2h)
- **[DEV2-58]** Implement inline validation (1h)
- **[DEV2-59]** Update node visual state (red border if error) (1h)
- **[DEV2-60]** Test: Validation catches errors (1h)

**TDD:**
- Write test: Required fields validated
- Write test: Error messages displayed

**Assigned:** Dev 2
**Dependencies:** Story 2.2
**Priority:** P0

---

### Story 2.5: Save Configuration to Node (3 pts)
**As a** user
**I want** my configuration to save when I click "Save"
**So that** my settings persist

**Acceptance Criteria:**
- [ ] "Save Configuration" button in panel
- [ ] Configuration saved to node data (Zustand)
- [ ] Node marked as "configured" (visual indicator)
- [ ] Auto-save on blur (optional, nice-to-have)

**Tasks:**
- **[DEV2-61]** Implement save handler (update node in Zustand) (1h)
- **[DEV2-62]** Update node visual state (checkmark if configured) (0.5h)
- **[DEV2-63]** Add success toast notification (0.5h)
- **[DEV2-64]** Test: Configuration persists after save (1h)

**TDD:**
- Write test: Save updates node data
- Write test: Node marked as configured

**Assigned:** Dev 2
**Dependencies:** Story 2.2
**Priority:** P0

---

## 📦 EPIC 3: Workflow Execution Engine

### Story 3.1: Design Execution Engine Architecture (5 pts)
**As a** developer
**I want** to design the execution engine architecture
**So that** workflows execute correctly

**Acceptance Criteria:**
- [ ] Execution flow documented (sequential step processing)
- [ ] Context passing strategy defined
- [ ] Error handling strategy defined
- [ ] Database schemas created (workflow_executions, execution_logs)

**Tasks:**
- **[DEV1-02]** Document execution flow (1h)
- **[DEV3-01]** Create execution.schema.ts (Execution model) (1h)
- **[DEV3-02]** Create execution-log.schema.ts (ExecutionLog model) (1h)
- **[DEV3-03]** Create indexes (workflowId, executionId, status) (0.5h)
- **[DEV1-03]** Review schema with team (0.5h)

**TDD:**
- Write test: Schemas validate correctly

**Assigned:** Dev 1 (lead), Dev 3
**Dependencies:** None
**Priority:** P0

---

### Story 3.2: Build Execution Engine Core (8 pts)
**As a** developer
**I want** to build the core execution engine
**So that** workflows can execute step-by-step

**Acceptance Criteria:**
- [ ] ExecutionEngineService class created
- [ ] executeWorkflow() method implemented
- [ ] Sequential step execution (load step → execute → move to next)
- [ ] Context passing (output of step N becomes input of step N+1)
- [ ] Error handling (stop on error, log error)

**Tasks:**
- **[DEV3-04]** Create execution-engine.service.ts (1h)
- **[DEV3-05]** Implement loadWorkflow() (fetch from DB) (1h)
- **[DEV3-06]** Implement loadSteps() (fetch all steps) (1h)
- **[DEV3-07]** Implement executeWorkflow() (main loop) (3h)
- **[DEV3-08]** Implement context passing logic (1h)
- **[DEV3-09]** Implement error handling (try-catch, log) (1h)
- **[DEV3-10]** Test: Execute simple workflow (Trigger → Action) (1h)

**TDD:**
- Write test: executeWorkflow() runs all steps
- Write test: Context passed correctly
- Write test: Execution stops on error

**Assigned:** Dev 3
**Dependencies:** Story 3.1
**Priority:** P0

---

### Story 3.3: Implement Step Executor (8 pts)
**As a** developer
**I want** to implement step-specific execution logic
**So that** each node type executes correctly

**Acceptance Criteria:**
- [ ] StepExecutorService class created
- [ ] execute() method routes to correct handler based on stepType
- [ ] Handlers for: trigger, agent, action, utility
- [ ] Variable replacement ({{var}} → actual value)

**Tasks:**
- **[DEV3-11]** Create step-executor.service.ts (1h)
- **[DEV3-12]** Implement execute() method (routing logic) (1h)
- **[DEV3-13]** Implement executeTrigger() (extract trigger data) (1h)
- **[DEV3-14]** Implement executeAgent() (call BW_BotCore API) (2h)
- **[DEV3-15]** Implement executeAction() (call WhatsApp/Email/Voice API) (2h)
- **[DEV3-16]** Implement executeUtility() (call BW_BotCore utility APIs) (2h)
- **[DEV3-17]** Implement replaceVariables() helper (1h)
- **[DEV3-18]** Test: Each step type executes correctly (2h)

**TDD:**
- Write test: executeTrigger() extracts data
- Write test: executeAgent() calls BotCore API
- Write test: replaceVariables() works

**Assigned:** Dev 3
**Dependencies:** Story 3.2
**Priority:** P0

---

### Story 3.4: Create Execute Workflow API Endpoint (3 pts)
**As a** user
**I want** to execute a workflow via API
**So that** my published workflows can run

**Acceptance Criteria:**
- [ ] POST /workFlow/:id/execute endpoint created
- [ ] Accepts triggerData in request body
- [ ] Returns executionId and status
- [ ] Saves execution record to DB

**Tasks:**
- **[DEV3-19]** Create execution.controller.ts (1h)
- **[DEV3-20]** Implement POST /workFlow/:id/execute (2h)
- **[DEV3-21]** Integrate with ExecutionEngineService (1h)
- **[DEV3-22]** Test: API endpoint works (1h)

**TDD:**
- Write test: Endpoint returns executionId
- Write test: Execution record saved to DB

**Assigned:** Dev 3
**Dependencies:** Story 3.2, Story 3.3
**Priority:** P0

---

### Story 3.5: Implement Execution Logging (3 pts)
**As a** developer
**I want** to log each step execution
**So that** users can debug workflows

**Acceptance Criteria:**
- [ ] Each step execution logged to execution_logs collection
- [ ] Log includes: stepId, status, input, output, duration, error (if any)
- [ ] Logs queryable by executionId

**Tasks:**
- **[DEV3-23]** Implement logStepExecution() method (1h)
- **[DEV3-24]** Call logging after each step (0.5h)
- **[DEV3-25]** Implement logStepError() for failures (0.5h)
- **[DEV3-26]** Test: Logs saved correctly (1h)

**TDD:**
- Write test: Step execution logged
- Write test: Error logged on failure

**Assigned:** Dev 3
**Dependencies:** Story 3.2
**Priority:** P0

---

## 📦 EPIC 4: Test & Validation

### Story 4.1: Build Test Panel UI (5 pts)
**As a** user
**I want** a test panel where I can input sample data
**So that** I can test my workflow

**Acceptance Criteria:**
- [ ] "Test" button in top action bar
- [ ] Test panel slides in from right
- [ ] Form to input test data (based on trigger type)
- [ ] "Run Test" button
- [ ] Results panel below

**Tasks:**
- **[DEV2-65]** Create TestPanel.tsx component (2h)
- **[DEV2-66]** Add "Test" button to top bar (0.5h)
- **[DEV2-67]** Implement slide-in animation (1h)
- **[DEV2-68]** Create test data input form (dynamic based on trigger) (2h)
- **[DEV2-69]** Style panel (1h)
- **[DEV2-70]** Test: Panel opens/closes (0.5h)

**TDD:**
- Write test: Test panel renders
- Write test: Form fields match trigger type

**Assigned:** Dev 2
**Dependencies:** Story 1.3
**Priority:** P1

---

### Story 4.2: Implement Test Execution API (5 pts)
**As a** developer
**I want** a dry-run API endpoint
**So that** workflows can be tested without side effects

**Acceptance Criteria:**
- [ ] POST /workFlow/:id/test endpoint created
- [ ] Accepts testData in request body
- [ ] Executes workflow WITHOUT saving to DB
- [ ] Returns step-by-step results (no DB writes, no external side effects)

**Tasks:**
- **[DEV3-27]** Implement testWorkflow() method (similar to executeWorkflow but no DB save) (3h)
- **[DEV3-28]** Create POST /workFlow/:id/test endpoint (1h)
- **[DEV3-29]** Mock external API calls (optional, or use real but idempotent) (2h)
- **[DEV3-30]** Test: Test mode doesn't save to DB (1h)

**TDD:**
- Write test: Test execution doesn't save
- Write test: Returns step results

**Assigned:** Dev 3
**Dependencies:** Story 3.2, Story 3.3
**Priority:** P1

---

### Story 4.3: Display Test Results (3 pts)
**As a** user
**I want** to see step-by-step test results
**So that** I can verify my workflow works

**Acceptance Criteria:**
- [ ] Results show each step: stepId, status (success/failed), output, duration
- [ ] Success steps show green checkmark
- [ ] Failed steps show red X and error message
- [ ] Total execution time displayed

**Tasks:**
- **[DEV2-71]** Create TestResults component (2h)
- **[DEV2-72]** Display step-by-step results (list) (1h)
- **[DEV2-73]** Style results (colors, icons) (1h)
- **[DEV2-74]** Add "Run Another Test" button (0.5h)
- **[DEV2-75]** Test: Results display correctly (0.5h)

**TDD:**
- Write test: Results render for each step
- Write test: Failed steps show error

**Assigned:** Dev 2
**Dependencies:** Story 4.1, Story 4.2
**Priority:** P1

---

### Story 4.4: Implement Workflow Validation (3 pts)
**As a** user
**I want** to validate my workflow before publishing
**So that** I catch errors early

**Acceptance Criteria:**
- [ ] POST /workFlow/:id/validate endpoint
- [ ] Checks: All nodes configured, no orphan nodes, valid connections
- [ ] Returns list of errors (if any)
- [ ] "Publish" button disabled if validation fails

**Tasks:**
- **[DEV3-31]** Implement validateWorkflow() method (2h)
- **[DEV3-32]** Create POST /workFlow/:id/validate endpoint (1h)
- **[DEV2-76]** Call validation on "Publish" click (0.5h)
- **[DEV2-77]** Display validation errors in modal (1h)
- **[DEV3-33]** Test: Validation catches errors (1h)

**TDD:**
- Write test: Validation detects misconfigured nodes
- Write test: Validation detects orphan nodes

**Assigned:** Dev 3 (backend), Dev 2 (frontend)
**Dependencies:** Story 2.5
**Priority:** P1

---

## 📦 EPIC 5: Monitoring & Execution Logs

### Story 5.1: Create Monitoring Page Layout (5 pts)
**As a** user
**I want** a monitoring page to see all executions
**So that** I can track workflow performance

**Acceptance Criteria:**
- [ ] Monitoring page accessible from workflow detail
- [ ] Shows execution list (table)
- [ ] Columns: executionId, status, startedAt, duration
- [ ] Filters: status (all/completed/failed), date range

**Tasks:**
- **[DEV2-78]** Create WorkflowMonitoring.tsx page (2h)
- **[DEV2-79]** Create execution list table (3h)
- **[DEV2-80]** Add filters (status, date range) (2h)
- **[DEV2-81]** Add "View Details" button per execution (1h)
- **[DEV2-82]** Style page (1h)
- **[DEV2-83]** Test: Page renders, filters work (1h)

**TDD:**
- Write test: Execution list renders
- Write test: Filters work correctly

**Assigned:** Dev 2
**Dependencies:** None
**Priority:** P1

---

### Story 5.2: Implement Get Executions API (3 pts)
**As a** developer
**I want** an API to fetch workflow executions
**So that** the monitoring page can display them

**Acceptance Criteria:**
- [ ] GET /workFlow/:id/executions endpoint
- [ ] Supports pagination (page, limit)
- [ ] Supports filters (status, dateRange)
- [ ] Returns execution list with metadata

**Tasks:**
- **[DEV3-34]** Implement GET /workFlow/:id/executions (2h)
- **[DEV3-35]** Add pagination (1h)
- **[DEV3-36]** Add filters (status, dateRange) (1h)
- **[DEV3-37]** Test: Endpoint returns executions (1h)

**TDD:**
- Write test: Pagination works
- Write test: Filters work

**Assigned:** Dev 3
**Dependencies:** Story 3.5
**Priority:** P1

---

### Story 5.3: Build Execution Detail View (8 pts)
**As a** user
**I want** to see step-by-step details of an execution
**So that** I can debug failures

**Acceptance Criteria:**
- [ ] Click "View Details" → Expands execution row
- [ ] Shows step-by-step logs: stepId, status, input, output, duration
- [ ] Failed steps show error message
- [ ] "View Raw JSON" button (optional)
- [ ] "Retry" button for failed executions

**Tasks:**
- **[DEV2-84]** Create ExecutionDetail component (3h)
- **[DEV2-85]** Fetch execution logs (GET /execution/:id) (1h)
- **[DEV2-86]** Display step-by-step logs (list) (2h)
- **[DEV2-87]** Add "Retry" button (1h)
- **[DEV2-88]** Style detail view (1h)
- **[DEV2-89]** Test: Detail view renders correctly (1h)

**TDD:**
- Write test: Step logs render
- Write test: Retry button works

**Assigned:** Dev 2
**Dependencies:** Story 5.1, Story 5.2
**Priority:** P1

---

### Story 5.4: Implement Get Execution Details API (3 pts)
**As a** developer
**I want** an API to fetch execution details with logs
**So that** the detail view can display them

**Acceptance Criteria:**
- [ ] GET /execution/:id endpoint
- [ ] Returns execution record + all step logs
- [ ] Step logs ordered by stepOrder

**Tasks:**
- **[DEV3-38]** Implement GET /execution/:id (2h)
- **[DEV3-39]** Join execution + logs (MongoDB aggregation or multiple queries) (1h)
- **[DEV3-40]** Test: Endpoint returns correct data (1h)

**TDD:**
- Write test: Endpoint returns execution + logs
- Write test: Logs ordered correctly

**Assigned:** Dev 3
**Dependencies:** Story 3.5
**Priority:** P1

---

### Story 5.5: Implement Retry Failed Execution (3 pts)
**As a** user
**I want** to retry a failed execution
**So that** I can recover from transient errors

**Acceptance Criteria:**
- [ ] POST /execution/:id/retry endpoint
- [ ] Creates new execution with same triggerData
- [ ] Returns new executionId

**Tasks:**
- **[DEV3-41]** Implement POST /execution/:id/retry (2h)
- **[DEV3-42]** Fetch original execution's triggerData (0.5h)
- **[DEV3-43]** Call executeWorkflow() with same data (0.5h)
- **[DEV3-44]** Test: Retry creates new execution (1h)

**TDD:**
- Write test: Retry creates new execution
- Write test: New execution uses same trigger data

**Assigned:** Dev 3
**Dependencies:** Story 3.4
**Priority:** P2

---

### Story 5.6: Add Polling Refresh (2 pts)
**As a** user
**I want** the monitoring page to refresh automatically
**So that** I see new executions without manual refresh

**Acceptance Criteria:**
- [ ] Page polls GET /workFlow/:id/executions every 5 seconds
- [ ] "Refresh" button for manual refresh
- [ ] Stop polling when user navigates away

**Tasks:**
- **[DEV2-90]** Implement polling with setInterval (1h)
- **[DEV2-91]** Add manual "Refresh" button (0.5h)
- **[DEV2-92]** Clean up interval on unmount (0.5h)
- **[DEV2-93]** Test: Polling updates list (1h)

**TDD:**
- Write test: Polling fetches new executions
- Write test: Interval cleaned up on unmount

**Assigned:** Dev 2
**Dependencies:** Story 5.2
**Priority:** P2

---

## 📦 EPIC 6: Integration & Polish

### Story 6.1: Integrate with Existing Workflow APIs (5 pts)
**As a** developer
**I want** to use existing BotWot workflow APIs
**So that** we don't duplicate backend logic

**Acceptance Criteria:**
- [ ] POST /workFlow/create (existing API) called on canvas save
- [ ] POST /workFlow/step (existing API) called to save each node
- [ ] PUT /workFlow/step/:wfId/:stepId (existing API) called to update nextStepId
- [ ] POST /workFlow/publish/:id (existing API) called on publish

**Tasks:**
- **[DEV1-04]** Document API integration points (1h)
- **[DEV2-94]** Implement saveWorkflow() (calls POST /workFlow/create) (2h)
- **[DEV2-95]** Implement saveStep() (calls POST /workFlow/step) (2h)
- **[DEV2-96]** Implement updateStep() (calls PUT /workFlow/step) (1h)
- **[DEV2-97]** Implement publishWorkflow() (calls POST /workFlow/publish) (1h)
- **[DEV2-98]** Test: Workflow saved correctly to DB (1h)

**TDD:**
- Write test: saveWorkflow() creates workflow in DB
- Write test: saveStep() creates step in DB

**Assigned:** Dev 1 (lead), Dev 2
**Dependencies:** Story 1.4, Story 2.5
**Priority:** P0

---

### Story 6.2: Implement JWT Auth Integration (3 pts)
**As a** developer
**I want** to use existing JWT auth
**So that** only authenticated users can access the builder

**Acceptance Criteria:**
- [ ] All API calls include JWT token (Authorization: Bearer <token>)
- [ ] 401 responses redirect to login
- [ ] User context (userId, orgId) available in frontend

**Tasks:**
- **[DEV1-05]** Configure axios interceptor (add JWT to headers) (1h)
- **[DEV1-06]** Handle 401 responses (redirect to login) (1h)
- **[DEV1-07]** Fetch user context on app load (0.5h)
- **[DEV1-08]** Test: Auth works, 401 redirects (1h)

**TDD:**
- Write test: JWT added to requests
- Write test: 401 redirects to login

**Assigned:** Dev 1
**Dependencies:** None
**Priority:** P0

---

### Story 6.3: Add Multi-Tenant Isolation (3 pts)
**As a** developer
**I want** to ensure workflows are isolated by orgId
**So that** organizations don't see each other's data

**Acceptance Criteria:**
- [ ] All queries filter by userId + orgId
- [ ] All workflow creation includes orgId
- [ ] Test: User A can't access User B's workflows

**Tasks:**
- **[DEV3-45]** Add orgId filter to all queries (2h)
- **[DEV3-46]** Add orgId to workflow creation (0.5h)
- **[DEV3-47]** Test: Multi-tenancy works (1h)

**TDD:**
- Write test: Queries filtered by orgId
- Write test: Cross-org access blocked

**Assigned:** Dev 3
**Dependencies:** Story 6.2
**Priority:** P0

---

### Story 6.4: Write E2E Test (5 pts)
**As a** developer
**I want** an E2E test for the complete user journey
**So that** we ensure everything works together

**Acceptance Criteria:**
- [ ] E2E test using Playwright or Cypress
- [ ] Test flow: Login → Create workflow → Add nodes → Connect → Configure → Test → Publish → Monitor

**Tasks:**
- **[DEV1-09]** Setup Playwright/Cypress (1h)
- **[DEV1-10]** Write E2E test script (4h)
- **[DEV1-11]** Run test, fix issues (2h)

**TDD:**
- E2E test IS the test

**Assigned:** Dev 1
**Dependencies:** All previous stories
**Priority:** P1

---

### Story 6.5: Bug Fixes & Refinements (5 pts)
**As a** team
**I want** to fix bugs discovered during testing
**So that** the MVP is stable

**Acceptance Criteria:**
- [ ] Zero critical bugs
- [ ] Zero P0 bugs blocking release
- [ ] All E2E tests pass

**Tasks:**
- **[ALL-01]** Triage bugs from testing (2h)
- **[ALL-02]** Fix critical bugs (8h)
- **[ALL-03]** Fix high-priority bugs (8h)
- **[ALL-04]** Retest after fixes (2h)

**TDD:**
- Write regression tests for fixed bugs

**Assigned:** All devs
**Dependencies:** Story 6.4
**Priority:** P0

---

### Story 6.6: Performance Optimization (3 pts)
**As a** developer
**I want** to optimize performance
**So that** the app is fast and responsive

**Acceptance Criteria:**
- [ ] Canvas renders <2 seconds for 50 nodes
- [ ] API responses <500ms (without LLM calls)
- [ ] Test execution <5 seconds (3 steps)

**Tasks:**
- **[DEV2-99]** Memoize node components (React.memo) (1h)
- **[DEV2-100]** Debounce save operations (0.5h)
- **[DEV3-48]** Add DB indexes (workflowId, executionId, status) (0.5h)
- **[DEV1-12]** Load test (50 nodes, 100 concurrent requests) (2h)
- **[DEV1-13]** Profile and optimize bottlenecks (2h)

**TDD:**
- Write performance tests (load time, API response time)

**Assigned:** Dev 1 (lead), Dev 2, Dev 3
**Dependencies:** Story 6.5
**Priority:** P2

---

## Daily Milestones

### Week 1: Foundation & Core Functionality

#### Day 1 (Monday)
**Focus:** Setup + Canvas Foundation

**Goals:**
- [ ] React Flow canvas renders
- [ ] Node library panel built
- [ ] Execution engine architecture documented

**Assignments:**
- **Dev 1:** Setup project, document execution flow, review schemas
- **Dev 2:** Stories 1.1, 1.2 (Canvas setup, Node library)
- **Dev 3:** Story 3.1 (Execution schemas)

**End-of-Day Check:** Canvas renders, node library shows 16 nodes, schemas created

---

#### Day 2 (Tuesday)
**Focus:** Drag-Drop + Node Components

**Goals:**
- [ ] Drag-drop from library to canvas works
- [ ] Custom node components render
- [ ] Execution engine core started

**Assignments:**
- **Dev 1:** Review code, unblock issues
- **Dev 2:** Stories 1.3, 1.5 (Drag-drop, Node components)
- **Dev 3:** Story 3.2 (Execution engine core)

**End-of-Day Check:** Can drag nodes onto canvas, nodes render with correct styles, execution engine skeleton exists

---

#### Day 3 (Wednesday)
**Focus:** Node Connections + Step Executor

**Goals:**
- [ ] Node connections work (drag output → input)
- [ ] Step executor implemented
- [ ] Configuration panel layout built

**Assignments:**
- **Dev 1:** Define node config schemas (Story 2.2)
- **Dev 2:** Stories 1.4, 2.1 (Node connections, Config panel)
- **Dev 3:** Story 3.3 (Step executor)

**End-of-Day Check:** Can connect nodes, config panel opens, step executor routes to handlers

---

#### Day 4 (Thursday)
**Focus:** Configuration Forms (Part 1)

**Goals:**
- [ ] 8 config forms implemented (Triggers + Agents)
- [ ] Execute workflow API created

**Assignments:**
- **Dev 1:** Code review, architecture decisions
- **Dev 2:** Story 2.2 (Config forms: Triggers, Agents - 8 forms)
- **Dev 3:** Stories 3.4, 3.5 (Execute API, Logging)

**End-of-Day Check:** All trigger + agent config forms work, execute API exists

---

#### Day 5 (Friday)
**Focus:** Configuration Forms (Part 2) + Validation

**Goals:**
- [ ] All 16 config forms implemented
- [ ] Form validation working
- [ ] Save configuration to node works

**Assignments:**
- **Dev 1:** Test end-to-end flow (create → configure → save)
- **Dev 2:** Story 2.2 (Config forms: Actions, Utilities - 8 forms), Stories 2.4, 2.5
- **Dev 3:** Test execution engine with real APIs

**End-of-Day Check:** All config forms complete, validation works, configurations save

**Week 1 Retrospective:** Review progress, adjust Week 2 plan if needed

---

### Week 2: Testing, Monitoring & Integration

#### Day 6 (Monday)
**Focus:** Test Mode

**Goals:**
- [ ] Test panel UI built
- [ ] Test execution API implemented
- [ ] Test results display

**Assignments:**
- **Dev 1:** Code review, integration planning
- **Dev 2:** Stories 4.1, 4.3 (Test panel, Test results)
- **Dev 3:** Story 4.2 (Test execution API)

**End-of-Day Check:** Can test workflow with sample data, see step-by-step results

---

#### Day 7 (Tuesday)
**Focus:** Validation + Monitoring Page

**Goals:**
- [ ] Workflow validation implemented
- [ ] Monitoring page layout built
- [ ] Get executions API implemented

**Assignments:**
- **Dev 1:** Review validation logic
- **Dev 2:** Stories 4.4 (Validation UI), 5.1 (Monitoring page)
- **Dev 3:** Stories 4.4 (Validation API), 5.2 (Get executions API)

**End-of-Day Check:** Validation catches errors, monitoring page shows executions

---

#### Day 8 (Wednesday)
**Focus:** Monitoring Details + Integration

**Goals:**
- [ ] Execution detail view built
- [ ] Get execution details API
- [ ] Integration with existing workflow APIs

**Assignments:**
- **Dev 1:** Story 6.1 (API integration), Story 6.2 (JWT auth)
- **Dev 2:** Stories 5.3 (Execution detail), 2.3 (Variable insertion)
- **Dev 3:** Stories 5.4, 5.5 (Get details API, Retry API)

**End-of-Day Check:** Can view execution details, retry failed executions, workflows save to existing DB

---

#### Day 9 (Thursday)
**Focus:** E2E Testing + Bug Fixes

**Goals:**
- [ ] E2E test written and passing
- [ ] Multi-tenant isolation verified
- [ ] Critical bugs fixed

**Assignments:**
- **Dev 1:** Stories 6.4 (E2E test), 6.5 (Bug triage)
- **Dev 2:** Story 6.5 (Frontend bug fixes), Story 5.6 (Polling)
- **Dev 3:** Story 6.3 (Multi-tenancy), Story 6.5 (Backend bug fixes)

**End-of-Day Check:** E2E test passes, no critical bugs

---

#### Day 10 (Friday)
**Focus:** Polish + Performance + Deploy

**Goals:**
- [ ] All bugs fixed
- [ ] Performance optimized
- [ ] MVP deployed to staging
- [ ] Demo-ready

**Assignments:**
- **Dev 1:** Story 6.6 (Performance), final review, deploy
- **Dev 2:** UI polish, final bug fixes
- **Dev 3:** API optimization, final bug fixes

**End-of-Day Check:** MVP deployed, demo prepared, all tests passing

**Week 2 Retrospective + Demo:** Demo to stakeholders, collect feedback

---

## TDD Strategy

### Test-Driven Development Principles

**Philosophy:** Write tests first, then implementation

**Coverage Goals:**
- **Unit Tests:** 70%+ coverage for critical paths
- **Integration Tests:** 100% coverage for API endpoints
- **E2E Tests:** 100% coverage for user journey

---

### Unit Tests (Jest + React Testing Library)

**Frontend Tests:**

```typescript
// Example: NodeLibrary.test.tsx
describe('NodeLibrary', () => {
  it('renders all 16 node types', () => {
    render(<NodeLibrary />);
    expect(screen.getAllByRole('listitem')).toHaveLength(16);
  });

  it('filters nodes based on search input', () => {
    render(<NodeLibrary />);
    const searchInput = screen.getByPlaceholderText('Search nodes...');
    fireEvent.change(searchInput, { target: { value: 'WhatsApp' } });
    expect(screen.getAllByRole('listitem')).toHaveLength(2); // WhatsApp Trigger, Send WhatsApp
  });

  it('allows dragging node from library', () => {
    render(<NodeLibrary />);
    const node = screen.getByText('WhatsApp Message Trigger');
    fireEvent.dragStart(node);
    expect(node).toHaveAttribute('draggable', 'true');
  });
});
```

**Backend Tests:**

```typescript
// Example: execution-engine.service.spec.ts
describe('ExecutionEngineService', () => {
  it('executes workflow step-by-step', async () => {
    const workflow = createMockWorkflow();
    const result = await service.executeWorkflow(workflow.id, { phone: '+1234567890' });
    expect(result.status).toBe('completed');
    expect(result.steps).toHaveLength(3);
  });

  it('stops execution on step failure', async () => {
    const workflow = createMockWorkflowWithFailingStep();
    const result = await service.executeWorkflow(workflow.id, {});
    expect(result.status).toBe('failed');
    expect(result.steps).toHaveLength(2); // Stopped at step 2
  });

  it('passes context between steps', async () => {
    const workflow = createMockWorkflow();
    const result = await service.executeWorkflow(workflow.id, { phone: '+1234567890' });
    expect(result.steps[1].input).toEqual(result.steps[0].output);
  });
});
```

---

### Integration Tests (Supertest + Jest)

**API Tests:**

```typescript
// Example: execution.controller.spec.ts
describe('POST /workFlow/:id/execute', () => {
  it('executes workflow and returns executionId', async () => {
    const workflow = await createTestWorkflow();
    const response = await request(app)
      .post(`/workFlow/${workflow.id}/execute`)
      .send({ triggerData: { phone: '+1234567890' } })
      .expect(200);

    expect(response.body).toHaveProperty('executionId');
    expect(response.body.status).toBe('running');
  });

  it('returns 404 if workflow not found', async () => {
    await request(app)
      .post('/workFlow/invalid-id/execute')
      .send({ triggerData: {} })
      .expect(404);
  });

  it('saves execution record to database', async () => {
    const workflow = await createTestWorkflow();
    const response = await request(app)
      .post(`/workFlow/${workflow.id}/execute`)
      .send({ triggerData: { phone: '+1234567890' } });

    const execution = await executionModel.findById(response.body.executionId);
    expect(execution).toBeDefined();
    expect(execution.workflowId).toBe(workflow.id);
  });
});
```

---

### E2E Tests (Playwright)

**Full User Journey:**

```typescript
// Example: workflow-builder.e2e.spec.ts
test('create, test, publish, and monitor workflow', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to workflow builder
  await page.click('text=New Workflow');
  await expect(page).toHaveURL(/\/workflows\/builder/);

  // Drag WhatsApp Trigger to canvas
  await page.dragAndDrop('text=WhatsApp Message Trigger', 'canvas');

  // Configure trigger
  await page.click('text=WhatsApp Message Trigger'); // Select node
  await page.selectOption('select[name="account"]', '+919876543210');
  await page.click('button:has-text("Save Configuration")');

  // Drag Decision Agent
  await page.dragAndDrop('text=Decision Agent', 'canvas');
  await page.click('text=Decision Agent');
  await page.fill('textarea[name="systemPrompt"]', 'Analyze customer intent...');
  await page.click('button:has-text("Save Configuration")');

  // Connect nodes
  await page.dragAndDrop('.trigger-output-handle', '.agent-input-handle');

  // Drag Send WhatsApp Action
  await page.dragAndDrop('text=Send WhatsApp', 'canvas');
  await page.click('text=Send WhatsApp');
  await page.fill('textarea[name="messageTemplate"]', 'Hi {{customer_name}}!');
  await page.click('button:has-text("Save Configuration")');

  // Connect agent to action
  await page.dragAndDrop('.agent-output-handle', '.action-input-handle');

  // Save workflow
  await page.click('button:has-text("Save Draft")');
  await expect(page.locator('text=Draft saved')).toBeVisible();

  // Test workflow
  await page.click('button:has-text("Test")');
  await page.fill('input[name="phone_number"]', '+919876543210');
  await page.fill('input[name="message_text"]', 'Hello, I need help');
  await page.click('button:has-text("Run Test")');

  // Wait for test results
  await expect(page.locator('text=Test Completed Successfully')).toBeVisible();
  await expect(page.locator('.step-result')).toHaveCount(3);

  // Publish workflow
  await page.click('button:has-text("Publish")');
  await page.click('button:has-text("Publish & Go Live")');
  await expect(page).toHaveURL(/\/workflows\/[a-z0-9]+/); // Redirected to monitoring

  // Check monitoring page
  await expect(page.locator('text=🟢 Live')).toBeVisible();
  await expect(page.locator('.execution-row')).toHaveCount(1); // Test execution

  // View execution details
  await page.click('button:has-text("View Details")');
  await expect(page.locator('.step-log')).toHaveCount(3);
  await expect(page.locator('text=WhatsApp Message Trigger')).toBeVisible();
  await expect(page.locator('text=Decision Agent')).toBeVisible();
  await expect(page.locator('text=Send WhatsApp')).toBeVisible();
});
```

---

### Test Execution Schedule

**Daily:**
- Run unit tests on every commit (pre-commit hook)
- Run integration tests on every PR (CI pipeline)

**End of Week 1:**
- Full unit + integration test suite
- Target: 70%+ coverage

**End of Week 2:**
- E2E test suite
- Full regression testing
- Target: All tests passing

---

## Risk Management

### High-Risk Areas

#### 1. React Flow Integration (Risk: High)
**Issue:** Team unfamiliar with React Flow API

**Mitigation:**
- Dev 2 spends Day 1 morning on React Flow docs
- Dev 1 reviews React Flow examples
- Allocate 2-hour buffer on Day 2 for React Flow issues

**Contingency:** If blocked, use simpler drag-drop library (react-dnd) - but loses visual polish

---

#### 2. Execution Engine Complexity (Risk: Medium)
**Issue:** Sequential execution with context passing is complex

**Mitigation:**
- Dev 3 starts early (Day 1)
- Dev 1 reviews architecture (Story 3.1)
- Write tests first (TDD)
- Allocate 4-hour buffer for debugging

**Contingency:** Simplify to single-step execution for MVP (no multi-step workflows) - but loses core value

---

#### 3. 16 Node Config Forms (Risk: Medium)
**Issue:** 16 forms is a lot of frontend work

**Mitigation:**
- Dev 2 focuses exclusively on forms (Days 4-5)
- Reuse components (DRY principle)
- Use form generator if possible (e.g., React Hook Form + schema)
- Dev 1 helps with complex forms (Decision Agent, Decorpot Agent)

**Contingency:** Cut to 8 nodes (1 of each category) - but loses production readiness

---

#### 4. Integration with Existing APIs (Risk: Medium)
**Issue:** Existing BotWot APIs may have undocumented quirks

**Mitigation:**
- Dev 1 documents API integration points early (Day 3)
- Test integration early (Day 8)
- Allocate 4-hour buffer for API issues

**Contingency:** Mock APIs for MVP demo - but can't deploy to production

---

#### 5. Testing Time Crunch (Risk: Medium)
**Issue:** Testing squeezed into last 2 days

**Mitigation:**
- Write tests throughout (TDD)
- E2E test starts Day 9 (not last minute)
- Dev 1 triages bugs continuously (not all at end)

**Contingency:** Cut E2E test, rely on manual QA - but higher bug risk

---

### Dependency Management

**Critical Path Dependencies:**

```
Canvas (1.1) → Drag-Drop (1.3) → Node Connections (1.4) → Config Panel (2.1) → Config Forms (2.2) → Validation (2.4) → Save (2.5) → Test Mode (4.1-4.3) → Publish → Execution (3.2-3.4) → Monitoring (5.1-5.4)
```

**Parallel Tracks:**

- **Frontend (Dev 2):** Canvas → Nodes → Config → Test UI → Monitoring UI
- **Backend (Dev 3):** Execution Engine → Step Executor → APIs → Logs
- **Integration (Dev 1):** Architecture → Auth → API Integration → E2E Test

**Blocker Protocol:**
- If Dev 2 blocked → Work on polish/styling
- If Dev 3 blocked → Work on test data/fixtures
- If Dev 1 blocked → Code review, documentation, planning

---

### Daily Standup Structure

**Format:** 15 minutes, 9:30 AM daily

**Questions:**
1. What did you complete yesterday?
2. What are you working on today?
3. Any blockers?

**Output:**
- Update Jira (move cards to "In Progress", "Done")
- Log blockers in shared doc
- Adjust assignments if needed

---

## Definition of Done

### Story-Level DoD

**A story is "Done" when:**
- [ ] Code written and committed to feature branch
- [ ] Unit tests written and passing (70%+ coverage for critical code)
- [ ] Code reviewed and approved by Dev 1
- [ ] Integrated with main/develop branch (no merge conflicts)
- [ ] Manual testing completed by dev
- [ ] No critical bugs
- [ ] Documentation updated (if applicable)

---

### Sprint-Level DoD

**The sprint is "Done" when:**
- [ ] All P0 stories completed
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] E2E test passing
- [ ] Zero critical bugs
- [ ] MVP deployed to staging
- [ ] Demo prepared for stakeholders
- [ ] Sprint retrospective completed

---

### MVP Acceptance Criteria

**The MVP is "Accepted" when:**

**Functional:**
- [ ] User can create new workflow
- [ ] User can drag all 16 node types onto canvas
- [ ] User can connect nodes visually
- [ ] User can configure each node type
- [ ] User can save workflow (persists to DB)
- [ ] User can test workflow with sample data
- [ ] User can publish workflow
- [ ] User can monitor executions with step-by-step logs
- [ ] User can retry failed executions
- [ ] Workflows execute correctly for all 16 node types

**Non-Functional:**
- [ ] Canvas renders <2 seconds for 50 nodes
- [ ] API responses <500ms (without LLM)
- [ ] Test execution <5 seconds (3 steps)
- [ ] Zero critical security issues
- [ ] Multi-tenant isolation verified

**Documentation:**
- [ ] API documentation (endpoints, schemas)
- [ ] Component documentation (key components)
- [ ] Deployment guide (how to run locally, deploy)

---

## Appendix: Jira Setup Guide

### Project Structure

**Project Name:** wrrk.ai Visual Workflow Builder
**Project Key:** WRKFLW
**Project Type:** Scrum

---

### Issue Hierarchy

```
Epic (e.g., WRKFLW-1)
  └── Story (e.g., WRKFLW-10)
       └── Task (e.g., WRKFLW-100)
```

---

### Issue Types

1. **Epic:** Major deliverable (6 total)
2. **Story:** User-facing feature (24 total)
3. **Task:** Technical implementation (~60 total)
4. **Bug:** Defect found during testing

---

### Custom Fields (Optional)

- **Developer:** Assigned dev (Dev 1, Dev 2, Dev 3)
- **Risk Level:** High, Medium, Low
- **Acceptance Criteria:** Text field (checkbox list)
- **TDD Required:** Yes/No

---

### Workflow States

1. **To Do:** Not started
2. **In Progress:** Currently working
3. **In Review:** Code review pending
4. **Testing:** Manual testing
5. **Done:** Completed

---

### Sprint Creation

**Sprint 1:** Week 1 (Days 1-5)
- Add Epics 1-3 stories
- Total: ~50 story points

**Sprint 2:** Week 2 (Days 6-10)
- Add Epics 4-6 stories
- Total: ~50 story points

---

### Story Point Scale (Fibonacci)

- **1 pt:** 1 hour
- **2 pts:** 2-3 hours
- **3 pts:** 4-6 hours
- **5 pts:** 1 day
- **8 pts:** 1.5 days
- **13 pts:** 2-3 days

---

### Labels

- `frontend`
- `backend`
- `integration`
- `critical-path` (P0 stories)
- `tdd-required`
- `risk-high`

---

## Appendix: Development Best Practices

### Code Quality Standards

**TypeScript:**
- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Explicit return types for functions
- Interfaces for all data structures

**React:**
- Functional components only
- Custom hooks for logic reuse
- React.memo for expensive components
- PropTypes or TypeScript interfaces for props

**NestJS:**
- DTOs for all request/response
- Dependency injection
- Exception filters for errors
- Validation pipes

---

### Code Review Checklist

**Before submitting PR:**
- [ ] Code follows style guide (ESLint/Prettier)
- [ ] Unit tests written and passing
- [ ] No console.log (use proper logging)
- [ ] No commented-out code
- [ ] No hardcoded values (use env vars)
- [ ] Documentation updated (if needed)

**Reviewer checks:**
- [ ] Logic is correct
- [ ] Edge cases handled
- [ ] No security vulnerabilities
- [ ] Performance acceptable
- [ ] Tests cover critical paths

---

### Git Workflow

**Branch Naming:**
- Feature: `feature/WRKFLW-10-node-library`
- Bugfix: `bugfix/WRKFLW-123-canvas-crash`
- Hotfix: `hotfix/critical-security-issue`

**Commit Messages:**
```
[WRKFLW-10] Add node library component

- Created NodeLibrary.tsx with 4 categories
- Implemented search filter
- Added unit tests
```

**PR Template:**
```markdown
## Story
WRKFLW-10: Build Node Library Panel

## Changes
- Created NodeLibrary.tsx
- Added search filter
- Styled panel

## Testing
- Unit tests: ✅ All passing
- Manual test: ✅ Works in Chrome, Firefox

## Screenshots
[Attach screenshot]

## Checklist
- [x] Tests written
- [x] Code reviewed
- [x] Documentation updated
```

---

### CI/CD Pipeline

**On PR:**
1. Lint (ESLint)
2. Type check (TypeScript)
3. Unit tests (Jest)
4. Build (Vite/NestJS)

**On Merge to Main:**
1. All PR checks
2. Integration tests
3. Build Docker image
4. Deploy to staging

---

## Conclusion

This sprint plan provides a comprehensive roadmap for delivering the wrrk.ai visual workflow builder MVP in 2 weeks. Key success factors:

1. **Clear priorities:** Focus on 16 nodes, full monitoring, existing auth
2. **80/20 principle:** Cut WebSocket, undo/redo, minimap, advanced features
3. **Parallel work:** Frontend, backend, integration tracks
4. **TDD throughout:** Tests written first, not last
5. **Daily milestones:** Clear goals for each day
6. **Risk mitigation:** Identified blockers, contingency plans
7. **Team collaboration:** Clear assignments, daily standups, code review

**Next Steps:**
1. Review this plan with team
2. Create Jira project and issues
3. Start Day 1 (Monday)!

**Good luck! 🚀**

---

**Document End**

**Version:** 1.0
**Last Updated:** [INSERT DATE]
**Next Review:** End of Week 1 Retrospective
