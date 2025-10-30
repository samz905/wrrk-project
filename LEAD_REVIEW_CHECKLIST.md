# Lead Developer - Review Checklist

**Purpose:** Strategic checkpoints to keep the 4-developer team coordinated and the sprint on track

---

## Daily Rituals

### Morning Standup (15 min)

**Format:**
- Dev 1 (Canvas & UX): Progress, current focus, blockers
- Dev 2 (Nodes & Config): Progress, current focus, blockers
- Dev 3 (Execution Engine): Progress, current focus, blockers
- Dev 4 (Monitoring): Progress, current focus, blockers

**Action Items:**
- [ ] Document blockers and assign resolution ownership
- [ ] Identify integration points that need coordination today
- [ ] Flag any scope/timeline risks

### PR Review Protocol

**Review SLA:** <2 hours from submission

**Review Checklist:**
- [ ] Title follows convention: `[EPIC-XX] Clear description`
- [ ] CI/CD passes (tests, build, lint)
- [ ] No `any` types, hardcoded secrets, or debug console.logs
- [ ] Error handling present for external calls
- [ ] Code follows established patterns
- [ ] Manually test the feature (not just code review)

**Approval Decision Tree:**
- Small changes (<50 lines) + green CI → Fast approve
- Large changes (>200 lines) → Request brief walkthrough
- Architecture changes → Team discussion required

### End-of-Day Status

- [ ] All PRs reviewed or timeline communicated
- [ ] Blockers resolved or escalated
- [ ] Tomorrow's integration points identified
- [ ] Sprint board updated (cards moved to correct columns)

---

## Integration Checkpoints

### Dev 1 (Canvas & UX) - Verification Points

**Canvas Foundation:**
- [ ] React Flow renders with grid background
- [ ] Pan, zoom, and minimap controls functional
- [ ] Drag-and-drop from node library creates nodes at correct positions
- [ ] Node connections respect validation rules (no invalid connections allowed)

**State Management:**
- [ ] Zustand store updates trigger UI re-renders correctly
- [ ] Canvas state persists (save → reload → state restored)
- [ ] Node selection triggers config panel correctly

**Integration with Dev 2:**
- [ ] All 30 node components render on canvas with correct styling
- [ ] Config panel opens with correct form for selected node type
- [ ] Config save updates node `configured` status and visual indicator

**Integration with Dev 3:**
- [ ] Save workflow API calls execute with correct payload structure
- [ ] Load workflow API correctly reconstructs canvas state
- [ ] JWT tokens included in all API requests
- [ ] Validation errors from backend highlight nodes on canvas

### Dev 2 (Nodes & Config) - Verification Points

**Node Library:**
- [ ] All 30 node types listed with correct categories
- [ ] Search filters nodes in real-time
- [ ] Drag data format matches what Dev 1's canvas expects
- [ ] Shopify nodes display "Shopify" badge

**Node Components:**
- [ ] All 30 node components render with correct colors (Triggers=Purple, Agents=Blue, Actions=Green, Utilities=Yellow)
- [ ] Decision Agent shows 3 output handles
- [ ] Configured nodes show green checkmark, unconfigured show warning
- [ ] Error state (red border, pulse animation) triggers correctly

**Configuration Forms:**
- [ ] All 30 config forms implement with reusable field components
- [ ] Form validation (Yup) catches required fields and invalid data
- [ ] Variable insertion component works across all forms
- [ ] Complex forms (Shopify Create Order) handle nested objects correctly

**Integration with Dev 3:**
- [ ] Config field names match what step executor expects
- [ ] Variable format `{{variable_name}}` is consistent
- [ ] Nested config structures (arrays, objects) serialize correctly

### Dev 3 (Execution Engine) - Verification Points

**Database Schemas:**
- [ ] Execution and ExecutionLog schemas registered in module
- [ ] MongoDB collections created with correct indexes
- [ ] Queries perform efficiently (<100ms for log retrieval)

**Execution Engine:**
- [ ] Sequential step execution with context passing works
- [ ] Failed steps mark execution as failed with clear error messages
- [ ] Execution duration calculated and logged correctly
- [ ] Multiple concurrent executions don't interfere with each other

**Step Executor - All 30 Node Types:**
- [ ] All 8 triggers (3 original + 5 Shopify) pass through data correctly
- [ ] All 3 agents call BotCore and parse responses
- [ ] All 13 actions (4 original + 9 Shopify) execute operations
- [ ] All 6 utilities call BotCore utility endpoints
- [ ] Variable replacement `{{var}}` works in all config fields

**External Service Integration:**
- [ ] BotCore service accessible and endpoints respond correctly
- [ ] Shopify API calls authenticate and return expected data
- [ ] WhatsApp/Email/Voice service stubs functional (or integrated)
- [ ] Error handling for service timeouts and failures

**API Endpoints:**
- [ ] `POST /workflow/execution/:workflowId` creates execution
- [ ] `GET /workflow/:workflowId/executions` returns paginated results with filters
- [ ] `GET /workflow/execution/:executionId/logs` returns ordered step logs
- [ ] `POST /workflow/execution/:executionId/retry` creates new execution
- [ ] `POST /workflow/:workflowId/validate` detects all error types
- [ ] `POST /workflow/:workflowId/publish` updates status correctly

**Integration with Dev 1:**
- [ ] Validation endpoint returns node IDs for highlighting errors
- [ ] Publish endpoint marks workflow as executable
- [ ] Multi-tenancy respected (orgId/userId filters work)

**Integration with Dev 4:**
- [ ] Execution logs include stepOrder, input, output, duration
- [ ] Status updates (running → completed/failed) persist correctly
- [ ] Retry creates new execution with identical trigger data

### Dev 4 (Monitoring) - Verification Points

**Execution List:**
- [ ] Table displays all executions with pagination
- [ ] Status filter (all/running/completed/failed) works
- [ ] Auto-refresh polls for updates without UI flicker
- [ ] Click execution opens details panel

**Execution Details:**
- [ ] Shows execution metadata (status, duration, timestamps)
- [ ] Step logs display in order with expand/collapse
- [ ] Input/output JSON formatted and readable
- [ ] Error messages displayed for failed steps
- [ ] Retry button appears only for failed executions and works

**Performance:**
- [ ] Dashboard loads with 1000+ executions in <2 seconds
- [ ] Filtering/search responsive
- [ ] Long JSON outputs don't break layout (horizontal scroll)

**Integration with Dev 3:**
- [ ] API responses match expected TypeScript interfaces
- [ ] Auto-refresh interval respects running executions
- [ ] Retry functionality creates new execution correctly

---

## Critical Integration Flows (Test End-to-End)

### Flow 1: Create → Configure → Validate → Publish
1. Dev 1's canvas: Drag 3 nodes (Trigger → Agent → Action), connect them
2. Dev 2's forms: Configure each node with valid data, save
3. Dev 1's canvas: Click "Publish" button
4. Dev 3's validation: Returns `{ valid: true, errors: [] }`
5. Dev 3's publish: Workflow status changes to "PUBLISHED"
6. Verify: Workflow appears as published in workflow list

### Flow 2: Trigger → Execute → Monitor
1. Dev 3's execution: Manually trigger published workflow
2. Dev 3's engine: Sequential execution of all steps
3. Dev 3's logs: Each step logged with input/output
4. Dev 4's monitoring: Execution appears in list with "completed" status
5. Dev 4's details: Click execution → See all step logs
6. Verify: Context passed correctly between steps, outputs match expectations

### Flow 3: Shopify Integration
1. Dev 2's forms: Configure Shopify Order Created trigger with account
2. Dev 3's executor: Shopify webhook triggers workflow execution
3. Dev 3's executor: Shopify action nodes (Get Order, Create Order) execute
4. Dev 4's monitoring: Execution shows Shopify node outputs
5. Verify: Shopify API calls authenticated, data retrieved correctly

### Flow 4: Validation Error Handling
1. Dev 1's canvas: Create workflow with unconfigured nodes
2. Dev 1's canvas: Click "Publish"
3. Dev 3's validation: Returns errors for unconfigured nodes
4. Dev 2's modal: ValidationModal displays errors
5. Dev 1's canvas: Nodes highlighted in red with error state
6. Verify: User can identify and fix validation errors

### Flow 5: Execution Failure & Retry
1. Dev 3's executor: Simulate step failure (e.g., BotCore timeout)
2. Dev 3's logs: Step marked as failed with error message
3. Dev 3's execution: Execution marked as failed
4. Dev 4's monitoring: Failed execution appears with error badge
5. Dev 4's retry: Click retry button
6. Dev 3's executor: New execution created with same trigger data
7. Verify: Retry executes successfully after issue resolved

---

## High-Risk Areas (Monitor Continuously)

### 1. Dev 2 Form Completion Rate (HIGHEST RISK)
**Risk:** 30 forms is massive workload (110 hours estimated)

**Monitoring:**
- Track completed forms daily (target: 3-4 forms/day)
- Review reusable component usage (should eliminate 50% of repetition)

**Mitigation:**
- If <25 forms done by Day 5: Dev 1 assists with simpler forms
- If form templates not being used: Schedule quick architecture review

### 2. React Flow Integration Complexity (Dev 1)
**Risk:** Unfamiliar library, complex state management

**Monitoring:**
- Canvas drag-drop working by Day 2
- Connection validation implemented by Day 3
- State persistence working by Day 4

**Mitigation:**
- If stuck >4 hours on React Flow issue: Review official examples together
- If state bugs persist: Consider simplifying state structure

### 3. Step Executor Completeness (Dev 3)
**Risk:** 30 node type handlers with external service integrations

**Monitoring:**
- Track implemented node types daily (target: 4-5 types/day Days 3-5)
- Test each node type as implemented (not batch testing)
- Verify Shopify API integration early (Day 3-4)

**Mitigation:**
- If <15 node types working by Day 4: Simplify complex nodes to MVP functionality
- If Shopify integration blocked: Use mock responses temporarily

### 4. Cross-Team Integration Bugs
**Risk:** 4 developers working on tightly coupled system

**Monitoring:**
- Run integration flow tests daily starting Day 4
- Monitor for breaking API changes
- Track integration bug count (should decrease after Day 6)

**Mitigation:**
- If integration bugs spike: Schedule focused integration session
- If API contracts unclear: Document endpoint contracts explicitly

### 5. Performance Degradation
**Risk:** Canvas with 50 nodes, monitoring with 1000+ executions

**Monitoring:**
- Canvas render time with 50 nodes (target: <2 seconds)
- API response time excluding LLM calls (target: <500ms)
- Monitoring dashboard load time (target: <2 seconds)

**Mitigation:**
- If performance targets missed by Day 7: Priority optimization session
- If queries slow: Review indexes, add database query optimization

---

## Sprint Health Indicators

### Week 1 Success Criteria (Day 5 EOD)
- [ ] Canvas drag-drop and connections fully functional
- [ ] ≥25 of 30 config forms completed
- [ ] ≥20 of 30 node types execute successfully
- [ ] All 30 node components render on canvas
- [ ] Monitoring dashboard shows executions and logs
- [ ] Simple 3-node workflow executes end-to-end

**If Not Met:**
- <25 forms: Dev 1 helps Dev 2 remainder of week
- <20 node types: Defer complex Shopify nodes to Week 2
- Simple workflow not executing: All-hands debug session Day 6 morning

### Week 2 Success Criteria (Day 10 EOD)
- [ ] All 30 node types working in real workflows
- [ ] Validation catches all error types (unconfigured, orphan, circular, no trigger)
- [ ] Publish workflow endpoint functional
- [ ] Monitoring dashboard complete with filters, retry, auto-refresh
- [ ] Multi-tenancy verified (users isolated)
- [ ] JWT authentication working
- [ ] E2E test suite passes
- [ ] Performance targets met (canvas <2s, API <500ms)
- [ ] Deployed to staging environment
- [ ] Demo workflows prepared

**If Not Met:**
- Validation/publish broken: Priority 1 fix
- E2E tests failing: Triage and fix critical path issues
- Performance issues: Emergency optimization session
- Deployment issues: Verify environment config, dependencies

---

## Code Review Standards

### Automatic Rejection Criteria
- TypeScript `any` types without justification comment
- Hardcoded API URLs, credentials, or environment-specific values
- Missing error handling on external API calls
- No tests for new functionality (backend)
- Merge conflicts unresolved

### Approval Criteria
- Code follows existing patterns and conventions
- Complex logic has explanatory comments
- Error messages are user-friendly and actionable
- Loading states implemented for async operations
- Edge cases handled (null, undefined, empty arrays)

### Architecture Change Review
If PR includes:
- New dependencies
- Database schema changes
- API endpoint changes
- State management pattern changes

Then: Require brief design discussion before coding or async approval from all affected devs

---

## Emergency Procedures

### Critical Blocker Protocol
**Definition:** Issue preventing any dev from continuing work for >2 hours

**Response:**
1. Identify blocker owner and impacted scope
2. Timebox debug session: 1 hour maximum
3. If unresolved: Cut scope or defer feature to post-MVP
4. Document decision and communicate to team

### Schedule Slippage Response

**Day 3 Check:**
- If <40% of Week 1 goals complete → Identify bottleneck and re-allocate resources

**Day 5 Check:**
- If <70% of Week 1 goals complete → Cut nice-to-have features (variable insertion UI, dashboard analytics, undo/redo)

**Day 8 Check:**
- If <50% of Week 2 goals complete → Emergency sprint review, extend timeline by 2-3 days or cut non-critical features

---

## MVP Acceptance Criteria (Final Checklist)

### User Workflows
- [ ] User can create workflow and drag all 30 node types onto canvas
- [ ] User can connect nodes visually with validation preventing invalid connections
- [ ] User can configure each node type (all 30 config forms functional)
- [ ] User can save workflow (persists to database)
- [ ] User can validate workflow (catches unconfigured, orphan, circular, no trigger)
- [ ] User can publish workflow (status changes to PUBLISHED)
- [ ] User can view all executions with filtering (status, pagination)
- [ ] User can view execution details with step-by-step logs
- [ ] User can retry failed executions

### Technical Requirements
- [ ] All 30 node types execute correctly in workflows
- [ ] Shopify integration works (5 triggers + 9 actions functional)
- [ ] Canvas renders <2 seconds with 50 nodes
- [ ] API responses <500ms (excluding LLM processing)
- [ ] Multi-tenant isolation verified (orgId/userId filtering works)
- [ ] JWT authentication enforced on all endpoints
- [ ] E2E test suite passes (covers critical user journeys)
- [ ] No P0 bugs exist
- [ ] Deployed to staging environment with all services running

### Demo Readiness
- [ ] 3 demo workflows prepared (simple, complex, Shopify-focused)
- [ ] Demo script documented (10 min walkthrough)
- [ ] Backup demo recording prepared (in case live demo fails)

**All checked?** ✅ **Ship it!** 🚀

---

## Post-Sprint Actions

### Retrospective Structure
**What Worked:** (3-5 specific examples)
**What Didn't:** (3-5 specific challenges)
**Process Improvements:** (2-3 actionable changes for next sprint)
**Technical Debt Created:** (Document for future sprints)

### Handoff Documentation
- Architecture decisions made during sprint
- Known limitations and workarounds
- Performance optimization opportunities identified
- Post-MVP feature backlog

---

**Lead with clarity and precision. Trust your team's expertise.**
