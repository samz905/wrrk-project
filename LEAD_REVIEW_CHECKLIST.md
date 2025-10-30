# Lead Developer - Daily Review Checklist

**Your Role:** Team Lead, Unblock, Review, Decide
**Purpose:** Know exactly what to check each day to keep the sprint on track

---

## Daily Routine (Every Day)

### Morning (9:00 AM - 9:30 AM)

#### 1. Check Jira Board
- [ ] Open Jira, view sprint board
- [ ] Count cards in each column:
  - To Do: _____
  - In Progress: _____
  - In Review: _____
  - Done: _____
- [ ] Red flags:
  - More than 3 cards in "In Review" → Priority: Review PRs
  - Card stuck in "In Progress" > 2 days → Priority: Unblock
  - Cards not moving → Priority: Check with team

---

#### 2. Stand-Up Meeting (15 min)

**Format:**
- Dev 1 (Canvas & UX): What did you do? What are you doing? Blockers?
- Dev 2 (Nodes & Config): What did you do? What are you doing? Blockers?
- Dev 3 (Execution Engine): What did you do? What are you doing? Blockers?
- Dev 4 (Monitoring): What did you do? What are you doing? Blockers?
- You: Share your focus for today

**Take Notes:**
- Blockers: ___________________________________________
- Risks: ___________________________________________
- Need help with: ___________________________________________

**Immediate Actions:**
- If blocker → Unblock right after standup
- If risk → Add to risk log
- If need help → Schedule 30min pair session

---

### Mid-Morning (10:00 AM - 12:00 PM)

#### 3. Code Review PRs (Top Priority)

**Goal:** Review all PRs within 2 hours of submission

**For Each PR:**

**Step 1: Quick Check (2 min)**
- [ ] Title clear? (e.g., "[WRKFLW-10] Add node library panel")
- [ ] Description filled?
- [ ] Tests passing? (Green checkmark)
- [ ] No merge conflicts?

**Step 2: Code Review (5-10 min per PR)**
- [ ] Read the code (don't just skim)
- [ ] Check for:
  - No `any` types in TypeScript
  - No console.log (except intentional logging)
  - No hardcoded values (API URLs, secrets)
  - Error handling present
  - Logical correctness
  - Code follows existing patterns

**Step 3: Test Locally (5 min per PR)**
- [ ] Checkout branch: `git checkout feature/WRKFLW-10`
- [ ] Install deps: `npm install` (if needed)
- [ ] Run: `npm start` or `npm run dev`
- [ ] Test the feature manually:
  - Does it work as expected?
  - Try edge cases (empty, null, invalid)
  - Check UI (if frontend)

**Step 4: Approve or Request Changes**
- [ ] ✅ **Approve** if all checks pass
- [ ] 🔄 **Request Changes** with specific comments
  - Be clear: "Please fix X because Y"
  - Be kind: "Good work! Just one small thing..."

**Auto-Approve Rules:**
- Small changes (<50 lines) + tests pass → Quick approve
- Large changes (>200 lines) → Request walkthrough

---

### Afternoon (2:00 PM - 5:00 PM)

#### 4. Pair Programming / Unblocking (As Needed)

**If Someone is Stuck:**
- [ ] Schedule 30-min pair session
- [ ] Screen share, walk through problem
- [ ] Don't solve for them, guide them
- [ ] If still stuck after 30 min → You code, they watch

**Common Blockers & Solutions:**
- **"React Flow not working"** → Check nodeTypes mapping, check imports
- **"API returning 500"** → Check backend logs, check payload format
- **"Tests failing"** → Read error message carefully, check test data
- **"Don't know how to do X"** → Share example code, point to docs

---

#### 5. End-of-Day Check (5:00 PM - 5:30 PM)

**Review Progress:**
- [ ] Update Jira (move cards to Done)
- [ ] Check today's goals (from daily milestones below)
  - ✅ Achieved?
  - ❌ Not achieved? Why? Adjust tomorrow.
- [ ] Review tomorrow's plan

**Communicate with Team:**
- [ ] Send quick message: "Great work today! Tomorrow we'll focus on X."
- [ ] If behind schedule: "We're a bit behind. Let's prioritize X tomorrow."

---

## Day-by-Day Review Checklist

---

## Day 1 (Monday): Setup & Foundation

### Morning Check
- [ ] **Dev 1:** Created folder structure?
  - Check: `src/components/workflow/` exists
  - Check: `src/types/workflow.types.ts` exists
- [ ] **Dev 2:** Node library folder structure ready?
  - Check: `src/components/workflow/nodes/` exists
  - Check: Node component templates prepared
- [ ] **Dev 3:** Created schemas?
  - Check: `execution.schema.ts` and `execution-log.schema.ts` exist
  - Run: `npm run build` (should compile without errors)
- [ ] **Dev 4:** Monitoring page structure created?
  - Check: `src/pages/workflow/monitoring/` exists
  - Check: Initial layout component created

### Afternoon Check
- [ ] **Dev 1:** React Flow canvas renders?
  - Test: Open browser → Canvas shows grid
  - Test: Pan/zoom works
- [ ] **Dev 2:** Node library panel shows 30 nodes?
  - Test: See all 4 categories (Triggers, Agents, Actions, Utilities)
  - Test: Search works (type "whatsapp" → filters)
  - Test: All 30 nodes listed (16 original + 14 Shopify)
- [ ] **Dev 3:** Schemas registered in module?
  - Check: MongoDB collections created
- [ ] **Dev 4:** Monitoring page route works?
  - Test: Navigate to `/workflows/123/monitoring`
  - Test: Basic layout renders

### End-of-Day Go/No-Go
**Go if:**
- ✅ Canvas renders
- ✅ Node library shows 30 nodes
- ✅ Schemas in DB
- ✅ Monitoring page accessible

**No-Go if:**
- ❌ React Flow not loading → Priority: Debug tomorrow morning
- ❌ Schemas have errors → Priority: Fix schemas
- ❌ Node library incomplete → Dev 2 priority tomorrow

**Tomorrow's Focus:**
- Dev 1: Drag-drop functionality
- Dev 2: Start node components
- Dev 3: Execution engine core
- Dev 4: Execution list UI

---

## Day 2 (Tuesday): Drag-Drop & Core Components

### Morning Check
- [ ] **Dev 1:** Drag-drop working?
  - Test: Drag node from library → Drop on canvas → Node appears
  - Test: Node has unique ID
  - Test: Node positioned correctly
- [ ] **Dev 2:** First 5 node components done?
  - Check: Visual components for 5 most common nodes
  - Test: Nodes render with correct icons/labels
- [ ] **Dev 3:** Execution engine skeleton exists?
  - Check: `execution-engine.service.ts` created
  - Check: `executeWorkflow()` method exists
- [ ] **Dev 4:** Execution list fetches data?
  - Test: Table loads mock/real data
  - Check: API call to `GET /workFlow/123/executions`

### Afternoon Check
- [ ] **Dev 1:** Node connections work?
  - Test: Drag from output handle → Input handle → Edge created
  - Test: Invalid connections blocked (Trigger → Trigger should fail)
- [ ] **Dev 1:** Config panel opens?
  - Test: Click node → Right panel opens
  - Test: Panel shows node info
- [ ] **Dev 2:** 10 node components done?
  - Test: All triggers + agents rendered
- [ ] **Dev 3:** Step executor skeleton exists?
  - Check: `step-executor.service.ts` created
  - Check: Has handlers for trigger, agent, action, utility
- [ ] **Dev 4:** Execution filters work?
  - Test: Filter by status (completed, failed, in_progress)
  - Test: Filter by date range

### End-of-Day Go/No-Go
**Go if:**
- ✅ Drag-drop works
- ✅ Nodes connect
- ✅ 10 node components done
- ✅ Execution engine exists
- ✅ Monitoring table shows data

**No-Go if:**
- ❌ Drag-drop buggy → Priority: Fix tomorrow
- ❌ Execution engine not started → Pair with Dev 3
- ❌ Dev 2 behind on components → Adjust targets

**Tomorrow's Focus:**
- Dev 1: Connection validation logic
- Dev 2: Complete all 30 node components
- Dev 3: Implement node type handlers
- Dev 4: Execution details view

---

## Day 3 (Wednesday): Connections & Node Handlers

### Morning Check
- [ ] **Dev 1:** Connection validation works?
  - Test: Try all invalid connections (should be blocked)
  - Test: Try all valid connections (should work)
- [ ] **Dev 2:** All 30 node components done?
  - Check: All nodes render on canvas correctly
  - Test: Each node has proper styling
- [ ] **Dev 2:** Started config forms (at least 5)?
  - Test: WhatsApp Trigger, Email Trigger, Voice Trigger config forms
  - Test: Conversational Agent, Decision Agent config forms
- [ ] **Dev 3:** At least 4 node types work in execution?
  - Test: Execute workflow with WhatsApp Trigger
  - Test: Execute workflow with Conversational Agent
- [ ] **Dev 4:** Execution details view works?
  - Test: Click execution → See step-by-step details
  - Test: Each step shows status, timestamp, logs

### Afternoon Check
- [ ] **Dev 1:** Config panel routes to correct form?
  - Test: Click WhatsApp Trigger → See WhatsApp config form
  - Test: Click Decision Agent → See Decision Agent config form
- [ ] **Dev 2:** 10 config forms done?
  - Check: All trigger and agent config forms complete
- [ ] **Dev 3:** Agent calls BotCore?
  - Check logs: See API call to `http://bot-service:5000/qna`
  - Check: Response parsed correctly
- [ ] **Dev 4:** Retry functionality skeleton exists?
  - Check: Retry button appears for failed executions
  - Test: Click retry (can be mock at this stage)

### End-of-Day Go/No-Go
**Go if:**
- ✅ Connections work
- ✅ All 30 node components done
- ✅ 10 config forms done
- ✅ At least 4 node types execute
- ✅ Execution details show correctly

**No-Go if:**
- ❌ Connection validation broken → Priority: Fix tomorrow
- ❌ BotCore integration failing → Priority: Debug API calls
- ❌ Dev 2 behind on forms → Pair to unblock

**Tomorrow's Focus:**
- Dev 1: Canvas polish (pan, zoom, fit view)
- Dev 2: Complete remaining 20 config forms
- Dev 3: Complete all 30 node type handlers
- Dev 4: Implement retry functionality

---

## Day 4 (Thursday): Config Forms & Node Types

### Morning Check
- [ ] **Dev 1:** Canvas controls work?
  - Test: Pan, zoom, fit view buttons
  - Test: Keyboard shortcuts (if implemented)
- [ ] **Dev 2:** 15 config forms done?
  - Test: All triggers, agents, 4-5 actions
  - Test: Forms validate (required fields)
- [ ] **Dev 3:** 12 node types work in execution?
  - Test: All triggers (8 total: 3 original + 5 Shopify)
  - Test: All agents (3)
  - Test: 1 action node
- [ ] **Dev 4:** Retry functionality works?
  - Test: Click retry on failed execution
  - Check: New execution created

### Afternoon Check
- [ ] **Dev 1:** State management solid?
  - Test: Canvas state persists correctly
  - Test: Undo/redo (if implemented)
- [ ] **Dev 2:** 20 config forms done?
  - Check: All triggers, agents, half of actions
  - Test: Variable insertion working in forms
- [ ] **Dev 3:** 18 node types work?
  - Test: All triggers, agents, 7-8 actions
  - Check: Shopify nodes executing correctly
- [ ] **Dev 4:** Dashboard analytics added?
  - Check: Total executions count
  - Check: Success/failure rate chart (basic)

### End-of-Day Go/No-Go
**Go if:**
- ✅ 20 config forms done
- ✅ 18 node types work
- ✅ Canvas fully functional
- ✅ Retry works

**No-Go if:**
- ❌ Dev 2 stuck on forms → Pair tomorrow morning
- ❌ Dev 3 stuck on Shopify integrations → Debug together
- ❌ Critical canvas bugs → Dev 1 priority

**Tomorrow's Focus:**
- Dev 1: Integration support, JWT auth setup
- Dev 2: Finish all 30 config forms
- Dev 3: Finish all 30 node types + validation
- Dev 4: Polish monitoring dashboard

---

## Day 5 (Friday): Complete All Forms & Types

### Morning Check
- [ ] **Dev 1:** Integration with APIs started?
  - Test: Save workflow calls backend API
  - Check: JWT token added to requests
- [ ] **Dev 2:** All 30 config forms done?
  - Test each form: Fill, validate, save
  - Check: All 16 original + 14 Shopify forms
- [ ] **Dev 3:** All 30 node types work?
  - Test simple workflow with each type
  - Test: All Shopify nodes execute correctly
- [ ] **Dev 4:** Monitoring dashboard complete?
  - Test: All filters work
  - Test: Execution details show all steps
  - Test: Retry works for all failure types

### Afternoon Check
- [ ] **Dev 1:** Canvas integration complete?
  - Test: Save/load workflow from DB
  - Test: Canvas state syncs with backend
- [ ] **Dev 2:** Variable insertion works?
  - Test: Click "Insert Variable" → Select variable → {{variable}} inserted
- [ ] **Dev 2:** Form validation works?
  - Test: Submit empty form → See errors
  - Test: Submit valid form → Success
- [ ] **Dev 3:** Validation endpoint works?
  - Test: `/workFlow/123/validate` returns errors for incomplete workflow
  - Test: Detects all error types (unconfigured, orphan, circular, no trigger)

### End-of-Day Go/No-Go
**Go if:**
- ✅ All 30 forms done
- ✅ All 30 node types work
- ✅ Validation works
- ✅ Monitoring dashboard complete

**No-Go if:**
- ❌ Forms incomplete → Critical priority Monday
- ❌ Node types failing → Debug Monday morning
- ❌ Major integration issues → Emergency session

**Week 1 Retrospective:**
- What went well?
- What was hard?
- Are we on track for Week 2?
- Adjust Week 2 plan if needed

---

## Day 6 (Monday): Validation & Full Integration

### Morning Check
- [ ] **Dev 1:** Canvas validation UI done?
  - Test: Validation highlights problematic nodes
  - Test: Error tooltips show on invalid nodes
- [ ] **Dev 2:** ValidationModal component done?
  - Test: Click "Publish" → Modal shows validation results
  - Test: Shows clear error messages with "Highlight node" buttons
- [ ] **Dev 3:** Enhanced validation logic done?
  - Test: `POST /workFlow/123/validate` with incomplete workflow
  - Check: Returns specific errors (unconfigured nodes, orphan nodes, no trigger)
  - Test: Validation detects circular dependencies
- [ ] **Dev 4:** Monitoring polling mechanism works?
  - Test: Execution list auto-refreshes
  - Check: Configurable refresh interval

### Afternoon Check
- [ ] **All Devs:** Full integration testing started?
  - Test: Create workflow via API with JWT auth
  - Test: Add steps with real node configs (all 30 types)
  - Test: Publish workflow after validation passes
  - Test: Execute published workflow
  - Test: Monitor execution in dashboard
  - Check: Document any integration issues
- [ ] **Dev 1:** UI polish improvements?
  - Test: Loading states show during API calls
  - Test: Error toasts appear on failures
- [ ] **Dev 2:** Config panel polish done?
  - Test: Smooth transitions between forms
  - Test: Unsaved changes warning works

### End-of-Day Go/No-Go
**Go if:**
- ✅ Validation catches all workflow issues
- ✅ ValidationModal provides clear feedback
- ✅ Full integration working end-to-end
- ✅ All 4 devs' work integrates smoothly

**No-Go if:**
- ❌ Validation not working → Priority: Fix tomorrow
- ❌ Critical integration issues → All-hands debugging
- ❌ Integration bugs between dev areas → Coordinate resolution

**Tomorrow's Focus:**
- Dev 1: Publish workflow functionality
- Dev 2: Final UI polish
- Dev 3: Execution engine optimization
- Dev 4: Monitoring performance optimization

---

## Day 7 (Tuesday): Publish & Polish

### Morning Check
- [ ] **Dev 1:** Publish workflow works?
  - Test: Click "Publish" after validation passes
  - Check: Workflow status changes to "PUBLISHED"
  - Test: Published workflow appears in workflow list
- [ ] **Dev 2:** All UI polish complete?
  - Test: Consistent styling across all components
  - Test: Responsive design works
  - Test: Accessibility (keyboard navigation, ARIA labels)
- [ ] **Dev 3:** Publish endpoint fully integrated?
  - Test: `POST /workFlow/123/publish`
  - Check: Workflow becomes executable
  - Check: Can trigger published workflow
- [ ] **Dev 4:** Monitoring dashboard polish complete?
  - Test: Dashboard loads quickly (large datasets)
  - Test: Export functionality (CSV/JSON) if implemented
  - Test: Search/filter performance

### Afternoon Check
- [ ] **Dev 1:** Canvas performance optimized?
  - Test: Canvas with 50 nodes loads <2 seconds
  - Test: Drag-drop remains smooth with many nodes
- [ ] **Dev 2:** Config forms performance optimized?
  - Test: Form switching is instantaneous
  - Test: Large forms (many fields) remain responsive
- [ ] **Dev 3:** Execution engine handles edge cases?
  - Test: Workflow with 20+ steps executes correctly
  - Test: Parallel branches execute correctly
  - Test: Error handling works for all node types
- [ ] **Dev 4:** Real-time updates work?
  - Test: Monitoring shows execution progress in real-time
  - Test: Step status updates without manual refresh

### End-of-Day Go/No-Go
**Go if:**
- ✅ Publish workflow works end-to-end
- ✅ All UI polished and performant
- ✅ Monitoring dashboard complete and optimized
- ✅ No P0 bugs

**No-Go if:**
- ❌ Publish broken → Critical priority tomorrow
- ❌ Performance issues → Optimization session tomorrow
- ❌ P0 bugs exist → Fix tomorrow

**Tomorrow's Focus:**
- Multi-tenancy verification
- Security review
- E2E testing preparation

---

## Day 8 (Wednesday): Security & Multi-tenancy

### Morning Check
- [ ] **You:** Security review completed?
  - Check: All sensitive data encrypted
  - Check: No secrets in frontend code
  - Review: Rate limiting on critical endpoints
- [ ] **Dev 1:** JWT auth fully integrated?
  - Check: `axiosInstance` adds JWT token to headers
  - Test: API call without token → 401 error
  - Test: Token refresh works
- [ ] **Dev 2:** XSS prevention in place?
  - Check: All user input sanitized
  - Test: Config forms handle malicious input safely
- [ ] **Dev 3:** Multi-tenancy works?
  - Test: User A cannot see User B's workflows
  - Check: All queries filter by `orgId` and `userId`
  - Test: Workflow execution isolated per tenant
- [ ] **Dev 4:** Monitoring respects multi-tenancy?
  - Test: Users only see their own executions
  - Test: Admin users see all executions (if applicable)

### Afternoon Check
- [ ] **All Devs:** E2E test suite written?
  - Check: `e2e/workflow-builder.spec.ts` exists
  - Test cases cover: Create, Configure, Validate, Publish, Execute, Monitor
  - Test cases for all 30 node types
- [ ] **Dev 1:** Canvas saves/loads correctly?
  - Test: Save workflow → Reload page → Canvas restored
  - Test: Node positions preserved
- [ ] **Dev 2:** Config data persists correctly?
  - Test: Configure node → Save → Reload → Config restored
- [ ] **Dev 3:** Execution logs secure?
  - Check: Sensitive data not logged (passwords, tokens)
  - Test: Logs include necessary debug info

### End-of-Day Go/No-Go
**Go if:**
- ✅ JWT auth works
- ✅ Multi-tenancy secure and verified
- ✅ E2E test suite written
- ✅ No security vulnerabilities

**No-Go if:**
- ❌ Multi-tenancy broken → CRITICAL, fix immediately
- ❌ Auth failing → Priority: Debug tonight/tomorrow
- ❌ Security issues found → Fix before proceeding

**Tomorrow's Focus:**
- Run E2E tests
- Bug fixing
- Performance verification

---

## Day 9 (Thursday): E2E Testing & Bug Fixing

### Morning Check
- [ ] **You:** E2E test suite ready?
  - Check: `e2e/workflow-builder.spec.ts` complete
  - Run: `npx playwright test`
  - Check: All test scenarios covered
- [ ] **All Devs:** Run E2E tests in parallel?
  - Dev 1: Run canvas-focused E2E tests
  - Dev 2: Run node/config-focused E2E tests
  - Dev 3: Run execution-focused E2E tests
  - Dev 4: Run monitoring-focused E2E tests

### Afternoon Check
- [ ] **All:** E2E tests pass?
  - Test: Complete user journey (create → configure → validate → publish → execute → monitor)
  - Test: All 30 node types work in workflows
  - If fails → Debug together, fix immediately

### Bug Triage (Continuous)
**For Each Bug:**
- Severity:
  - **P0 (Critical):** Blocks core functionality → Fix today
  - **P1 (High):** Major issue, workaround exists → Fix tomorrow
  - **P2 (Medium):** Minor issue → Post-MVP
- Assign to appropriate dev based on area
- Set deadline

**Common Bugs & Fixes:**
- "Canvas crashes on drop" → Dev 1: Check nodeTypes mapping
- "API returns 500" → Dev 3: Check payload format, check logs
- "Validation errors not showing" → Dev 1/3: Check API response format
- "Config not saving" → Dev 2: Check Zustand state update
- "Shopify nodes not executing" → Dev 3: Check Shopify API integration
- "Monitoring not showing logs" → Dev 4: Check logs fetching logic

### All-Hands Bug Bash (2-4 PM)
- [ ] **All Devs:** Test everything manually
  - Create workflows with different node combinations
  - Test edge cases and error scenarios
  - Document all found bugs with reproduction steps
- [ ] **You:** Prioritize and assign bugs
  - Critical bugs assigned immediately
  - Non-critical bugs deferred or assigned for tomorrow

### End-of-Day Go/No-Go
**Go if:**
- ✅ E2E test passes
- ✅ Zero P0 bugs
- ✅ <5 P1 bugs (fixable tomorrow)

**No-Go if:**
- ❌ E2E test fails on critical path → Fix tonight/early tomorrow
- ❌ Multiple P0 bugs exist → Emergency session

**Tomorrow's Focus:**
- Fix remaining P1 bugs
- Performance verification
- Deploy to staging
- Demo preparation

---

## Day 10 (Friday): Deploy & Demo

### Morning Check (Bug Fixes)
- [ ] **All Devs:** P1 bugs fixed?
  - Dev 1: Canvas/UX bugs resolved
  - Dev 2: Node/Config bugs resolved
  - Dev 3: Execution engine bugs resolved
  - Dev 4: Monitoring bugs resolved
- [ ] **All:** Final testing done?
  - Test: All 30 node types work
  - Test: Complete workflows execute (including Shopify nodes)
  - Test: Monitoring shows correct data
  - Test: Multi-tenancy verified

### Performance Verification (10-11 AM)
- [ ] **You & Dev 1:** Canvas performance acceptable?
  - Test: Canvas with 50 nodes loads <2 seconds
  - Test: Drag-drop remains smooth
  - Test: Connection rendering performant
- [ ] **You & Dev 3:** API performance acceptable?
  - Test: API responses <500ms (without LLM)
  - Test: Execution engine handles concurrent workflows
  - Test: Database queries optimized
- [ ] **You & Dev 4:** Monitoring performance acceptable?
  - Test: Dashboard loads with 1000+ executions
  - Test: Filtering/search responsive

### Deploy to Staging (11 AM - 12 PM)
- [ ] **You:** Deployed to staging?
  - Check: Staging URL works
  - Test: Smoke test all endpoints
  - Verify: Environment variables correct
  - Verify: Database connected
  - Verify: All services running (BotCore, Voice, Shopify integration)

### Demo Preparation (2:00 PM - 4:00 PM)
- [ ] **You:** Demo workflows created?
  - Workflow 1: WhatsApp → Conversational Agent → Send WhatsApp (simple)
  - Workflow 2: Shopify Order Created → Decision Agent → Create Order → Send WhatsApp (complex)
  - Workflow 3: Multi-step workflow showing all node categories
- [ ] **You:** Demo script written?
  - Introduction (30 sec)
  - Canvas demo (2 min): Drag-drop, connect nodes
  - Configuration demo (2 min): Configure 3-4 different node types
  - Validation demo (1 min): Show validation catching errors
  - Publish & Execute (2 min): Publish workflow, trigger execution
  - Monitoring demo (2 min): View execution logs, show retry
  - Q&A (5 min)
- [ ] **Dev 1:** Screenshots/recording prepared?
  - Record screen capture of demo flow
  - Take screenshots of key features
  - Prepare backup demo (in case live demo fails)

### End-of-Sprint Retrospective (4:30 PM)

**What went well?**
- ___________________________________________
- ___________________________________________

**What was challenging?**
- ___________________________________________
- ___________________________________________

**What would we do differently?**
- ___________________________________________
- ___________________________________________

**Celebration!** 🎉
- Team delivered MVP in 2 weeks!
- Take screenshot of completed Jira board
- Share wins with stakeholders

---

## Code Review Checklist (Use for Every PR)

### Quick Check (2 min)
- [ ] PR title format: `[WRKFLW-XX] Description`
- [ ] PR description filled
- [ ] No merge conflicts
- [ ] Tests passing (green checkmark)

### Code Quality (5 min)
- [ ] No `any` types (TypeScript)
- [ ] No `console.log` (except logging)
- [ ] No hardcoded values (URLs, credentials)
- [ ] Error handling present (`try-catch`)
- [ ] Follows existing patterns
- [ ] Comments for complex logic

### Functional Check (5 min)
- [ ] Checkout branch
- [ ] Run locally
- [ ] Test the feature:
  - Does it work?
  - Edge cases (empty, null, invalid)?
  - UI looks correct (if frontend)?

### Approve or Request Changes
- [ ] ✅ **Approve** if all pass
- [ ] 🔄 **Request Changes** with clear comments

---

## Unblocking Strategies

### If Dev 1 (Canvas & UX) Stuck:

**Common Issues:**
1. **"React Flow not working"**
   - Check: `import ReactFlow from '@xyflow/react'` (not `react-flow`)
   - Check: `nodeTypes` object correct
   - Check: Nodes have `type` field matching `nodeTypes` key

2. **"Connection validation not working"**
   - Check: `isValidConnection` function logic
   - Check: Handle types match expected values
   - Check: Edge validation rules correct

3. **"Canvas state not persisting"**
   - Check: Zustand store configured correctly
   - Check: State updates trigger re-render
   - Check: Save/load logic correct

**Solution:**
- Pair for 30 min
- Share screen, walk through code
- Point to React Flow docs/examples

---

### If Dev 2 (Nodes & Config) Stuck:

**Common Issues:**
1. **"Config form not saving"**
   - Check: `onSave` prop passed correctly
   - Check: Zustand state updated
   - Check: Node `data.config` field structure

2. **"Form validation not working"**
   - Check: Yup schema defined correctly
   - Check: Form validation triggered on submit
   - Check: Error messages displayed

3. **"Too many forms, falling behind"**
   - Solution: Create reusable form components
   - Use form templates/generators
   - Prioritize most common node types first

**Solution:**
- Pair for 30 min
- Share reusable component patterns
- Help create form templates

---

### If Dev 3 (Execution Engine) Stuck:

**Common Issues:**
1. **"API returns 500"**
   - Check: Request payload format
   - Check: Backend logs (`console.log` or logging)
   - Check: Database connection

2. **"Integration with BotCore failing"**
   - Check: BotCore running (`http://localhost:5000` accessible)
   - Check: Request format matches BotCore API
   - Check: Response format parsed correctly

3. **"Shopify integration not working"**
   - Check: Shopify API credentials configured
   - Check: Webhook endpoints registered
   - Check: API version compatibility

4. **"Workflow execution stuck"**
   - Check: Step executor handling all node types
   - Check: Context passing between steps
   - Check: Error handling doesn't block execution

**Solution:**
- Check logs together
- Test API with Postman/curl
- Review API documentation

---

### If Dev 4 (Monitoring) Stuck:

**Common Issues:**
1. **"Execution list not loading"**
   - Check: API endpoint returning data
   - Check: Response format matches expected structure
   - Check: Table component configured correctly

2. **"Filters not working"**
   - Check: Query parameters sent correctly
   - Check: Backend filtering logic working
   - Check: State management for filter values

3. **"Real-time updates not working"**
   - Check: Polling interval configured
   - Check: API called on interval
   - Check: State updates trigger re-render

**Solution:**
- Pair for 30 min
- Test API responses with browser dev tools
- Review state management logic

---

## Risk Management

### High-Risk Areas (Monitor Daily)

**1. React Flow Integration (Dev 1)**
- **Risk:** Unfamiliar API, complex canvas state management
- **Mitigation:** Dev 1 spends extra time on docs, you pair if stuck
- **Check Daily:** Canvas works, drag-drop works, connections work, state persists

**2. Execution Engine Complexity (Dev 3)**
- **Risk:** Sequential execution with context passing is complex, 30 node types to handle
- **Mitigation:** Clear architecture, TDD, frequent testing, incremental implementation
- **Check Daily:** Execute simple workflow, check logs, verify Shopify integrations

**3. 30 Config Forms (Dev 2 - HIGHEST RISK)**
- **Risk:** MASSIVE amount of repetitive work (110 hours estimated)
- **Mitigation:** Reuse components aggressively, use templates, form generators
- **Check Daily:** Count completed forms (target: 6 per day), adjust if falling behind
- **Contingency:** If Dev 2 falls >2 days behind, Dev 1 helps with simpler forms

**4. Integration Coordination (All Devs)**
- **Risk:** 4 devs working on tightly coupled system, integration issues
- **Mitigation:** Daily integration checks, clear API contracts, frequent communication
- **Check Daily:** All components integrate smoothly, no breaking changes

**5. Shopify Integration (Dev 3)**
- **Risk:** External API dependencies, webhook setup, authentication
- **Mitigation:** Leverage existing Shopify service, test with Shopify test environment
- **Check Daily:** Shopify nodes execute correctly, webhooks received

**6. Monitoring Performance (Dev 4)**
- **Risk:** Large datasets, real-time updates may cause performance issues
- **Mitigation:** Pagination, lazy loading, optimized queries
- **Check Daily:** Dashboard loads quickly with sample data

---

## Daily Sign-Off Criteria

### Green Light (All Good)
- ✅ All PRs reviewed
- ✅ Today's goals achieved (see daily milestones)
- ✅ Zero blockers
- ✅ Team morale high

### Yellow Light (Watch Closely)
- ⚠️ 1 blocker exists but workaround found
- ⚠️ Slightly behind schedule but can catch up
- ⚠️ 1-2 P1 bugs, fixing tomorrow

**Action:** Monitor closely tomorrow, adjust if needed

### Red Light (Intervention Needed)
- 🔴 Multiple blockers, no workarounds
- 🔴 >1 day behind schedule
- 🔴 P0 bugs exist
- 🔴 Team morale low

**Action:**
- Call emergency team meeting
- Re-prioritize (cut scope if needed)
- All hands on deck to fix blocker

---

## Success Indicators (Check Weekly)

### Week 1 (End of Day 5)
- [ ] ✅ Canvas works (drag-drop, connections, state management)
- [ ] ✅ All 30 config forms done (16 original + 14 Shopify)
- [ ] ✅ All 30 node types implemented in execution engine
- [ ] ✅ All 30 node components render on canvas
- [ ] ✅ Monitoring dashboard basic functionality works
- [ ] ✅ Simple workflow executes end-to-end

**If not achieved:**
- If <25 forms done: Dev 1 helps Dev 2 with remaining forms
- If execution engine incomplete: Prioritize most common node types
- Adjust Week 2 plan, cut nice-to-haves (variable insertion, advanced validation)

### Week 2 (End of Day 10)
- [ ] ✅ Validation works (catches all error types)
- [ ] ✅ Monitoring dashboard complete with all features
- [ ] ✅ Integration with existing APIs works (JWT, multi-tenancy)
- [ ] ✅ All 30 node types work in real workflows
- [ ] ✅ Shopify integration verified (triggers and actions)
- [ ] ✅ E2E test passes (covers all major flows)
- [ ] ✅ Performance acceptable (canvas <2s, API <500ms)
- [ ] ✅ Deployed to staging
- [ ] ✅ Demo-ready

**If not achieved:** Emergency sprint review, extend by 1-2 days if critical

---

## Emergency Procedures

### If Critical Blocker Occurs

**Step 1: Stop and Assess (15 min)**
- What's blocked?
- Who's blocked?
- What's the impact?

**Step 2: All-Hands Debug (1 hour max)**
- Everyone stops current work
- Focus on blocker together
- Screen share, debug live

**Step 3: Escalate or Cut Scope**
- If can't fix in 1 hour → Escalate (get help from outside)
- If not critical → Cut from MVP

---

### If Falling Behind Schedule

**Day 3 Check:**
- If <50% of Week 1 goals achieved → Yellow alert
  - Action: Work extra 2 hours/day (Days 4-5)

**Day 5 Check:**
- If <70% of Week 1 goals achieved → Red alert
  - Action: Emergency team meeting, cut scope

**Day 8 Check:**
- If <50% of Week 2 goals achieved → Red alert
  - Action: Cut nice-to-haves (e.g., variable insertion, polling refresh)

---

## Communication Templates

### Daily Update to Stakeholders (Optional)

**Format:**
```
Sprint Day X/10 Update:
✅ Completed: [List]
🚧 In Progress: [List]
⏭️ Tomorrow: [List]
⚠️ Risks: [List or "None"]

Overall Status: 🟢 On Track / 🟡 Slight Delay / 🔴 Behind
```

### End-of-Week Update

**Format:**
```
Week 1 Complete!

Achievements:
- Canvas working (drag-drop, connections)
- 16 config forms done
- 16 node types implemented
- Simple workflow executes

Week 2 Focus:
- Validation
- Monitoring dashboard
- Integration & deploy

Status: 🟢 On track for 2-week delivery
```

---

## Final Checklist (Day 10 Evening)

### MVP Acceptance Criteria
- [ ] User can create new workflow
- [ ] User can drag all 30 node types onto canvas (16 original + 14 Shopify)
- [ ] User can connect nodes visually with validation
- [ ] User can configure each node type (all 30 forms work)
- [ ] User can save workflow (persists to DB)
- [ ] User can validate workflow before publish (catches all error types)
- [ ] User can publish workflow
- [ ] User can monitor executions with step-by-step logs
- [ ] User can retry failed executions
- [ ] Workflows execute correctly for all 30 node types
- [ ] Shopify nodes work (5 triggers + 9 actions)
- [ ] Canvas renders <2 seconds for 50 nodes
- [ ] API responses <500ms (without LLM)
- [ ] Multi-tenant isolation verified (users can't see each other's workflows)
- [ ] JWT authentication works
- [ ] E2E test passes (covers all major flows)
- [ ] Deployed to staging
- [ ] Demo prepared

**If all checked:** ✅ **MVP COMPLETE! Ship it!** 🚀

---

## Post-MVP (After Demo)

### Collect Feedback
- What worked?
- What didn't?
- What to improve?

### Plan Next Sprint
- Bug fixes from MVP
- New features
- Performance improvements

---

**Lead with confidence! You got this! 🚀**
