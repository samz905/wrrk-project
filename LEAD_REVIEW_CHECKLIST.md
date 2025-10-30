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
- Dev 2 (Frontend): What did you do? What are you doing? Blockers?
- Dev 3 (Backend): What did you do? What are you doing? Blockers?
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
- [ ] **Dev 2:** Created folder structure?
  - Check: `src/components/workflow/` exists
  - Check: `src/types/workflow.types.ts` exists
- [ ] **Dev 3:** Created schemas?
  - Check: `execution.schema.ts` and `execution-log.schema.ts` exist
  - Run: `npm run build` (should compile without errors)

### Afternoon Check
- [ ] **Dev 2:** React Flow canvas renders?
  - Test: Open browser → Canvas shows grid
  - Test: Pan/zoom works
- [ ] **Dev 2:** Node library panel shows 16 nodes?
  - Test: See all 4 categories (Triggers, Agents, Actions, Utilities)
  - Test: Search works (type "whatsapp" → filters)
- [ ] **Dev 3:** Schemas registered in module?
  - Check: MongoDB collections created

### End-of-Day Go/No-Go
**Go if:**
- ✅ Canvas renders
- ✅ Node library shows nodes
- ✅ Schemas in DB

**No-Go if:**
- ❌ React Flow not loading → Priority: Debug tomorrow morning
- ❌ Schemas have errors → Priority: Fix schemas

**Tomorrow's Focus:**
- Dev 2: Drag-drop + node components
- Dev 3: Execution engine core

---

## Day 2 (Tuesday): Drag-Drop & Execution Engine

### Morning Check
- [ ] **Dev 2:** Drag-drop working?
  - Test: Drag node from library → Drop on canvas → Node appears
  - Test: Node has unique ID
  - Test: Node positioned correctly
- [ ] **Dev 3:** Execution engine skeleton exists?
  - Check: `execution-engine.service.ts` created
  - Check: `executeWorkflow()` method exists

### Afternoon Check
- [ ] **Dev 2:** Node connections work?
  - Test: Drag from output handle → Input handle → Edge created
  - Test: Invalid connections blocked (Trigger → Trigger should fail)
- [ ] **Dev 2:** Config panel opens?
  - Test: Click node → Right panel opens
- [ ] **Dev 3:** Step executor skeleton exists?
  - Check: `step-executor.service.ts` created
  - Check: Has handlers for trigger, agent, action, utility

### End-of-Day Go/No-Go
**Go if:**
- ✅ Drag-drop works
- ✅ Nodes connect
- ✅ Execution engine exists

**No-Go if:**
- ❌ Drag-drop buggy → Priority: Fix tomorrow
- ❌ Execution engine not started → Pair with Dev 3

**Tomorrow's Focus:**
- Dev 2: Config panel + form router
- Dev 3: Implement node type handlers

---

## Day 3 (Wednesday): Connections & Node Handlers

### Morning Check
- [ ] **Dev 2:** Connection validation works?
  - Test: Try all invalid connections (should be blocked)
  - Test: Try all valid connections (should work)
- [ ] **Dev 3:** At least 4 node types work?
  - Test: Execute workflow with WhatsApp Trigger
  - Test: Execute workflow with Conversational Agent

### Afternoon Check
- [ ] **Dev 2:** Config panel routes to correct form?
  - Test: Click WhatsApp Trigger → See WhatsApp config form
  - Test: Click Decision Agent → See Decision Agent config form
- [ ] **Dev 3:** Agent calls BotCore?
  - Check logs: See API call to `http://bot-service:5000/qna`
  - Check: Response parsed correctly

### End-of-Day Go/No-Go
**Go if:**
- ✅ Connections work
- ✅ Config panel shows correct form
- ✅ At least 4 node types work

**No-Go if:**
- ❌ Connection validation broken → Priority: Fix
- ❌ BotCore integration failing → Priority: Debug API calls

**Tomorrow's Focus:**
- Dev 2: Start building all 16 config forms
- Dev 3: Complete all 16 node type handlers

---

## Day 4 (Thursday): Config Forms & Node Types

### Morning Check
- [ ] **Dev 2:** 4 config forms done?
  - Test: WhatsApp Trigger, Email Trigger, Voice Trigger, Conversational Agent
  - Test: Forms validate (required fields)
- [ ] **Dev 3:** 8 node types work?
  - Test: All triggers (3) + all agents (3) + 2 actions

### Afternoon Check
- [ ] **Dev 2:** 8 config forms done?
  - Check: All triggers, agents, 2 actions
- [ ] **Dev 3:** 12 node types work?
  - Test: All triggers, agents, actions

### End-of-Day Go/No-Go
**Go if:**
- ✅ 8 config forms done
- ✅ 12 node types work

**No-Go if:**
- ❌ Dev 2 stuck on forms → Pair tomorrow morning
- ❌ Dev 3 stuck on integrations → Debug together

**Tomorrow's Focus:**
- Dev 2: Finish all 16 config forms
- Dev 3: Finish all 16 node types + validation

---

## Day 5 (Friday): Complete All Forms & Types

### Morning Check
- [ ] **Dev 2:** All 16 config forms done?
  - Test each form: Fill, validate, save
- [ ] **Dev 3:** All 16 node types work?
  - Test simple workflow with each type

### Afternoon Check
- [ ] **Dev 2:** Variable insertion works?
  - Test: Click "Insert Variable" → Select variable → {{variable}} inserted
- [ ] **Dev 2:** Form validation works?
  - Test: Submit empty form → See errors
  - Test: Submit valid form → Success
- [ ] **Dev 3:** Validation endpoint works?
  - Test: `/workFlow/123/validate` returns errors for incomplete workflow

### End-of-Day Go/No-Go
**Go if:**
- ✅ All 16 forms done
- ✅ All 16 node types work
- ✅ Validation works

**No-Go if:**
- ❌ Forms incomplete → Work over weekend (last resort)
- ❌ Node types failing → Debug over weekend

**Week 1 Retrospective:**
- What went well?
- What was hard?
- Adjust Week 2 plan if needed

---

## Day 6 (Monday): Test Mode

### Morning Check
- [ ] **Dev 2:** Test panel UI done?
  - Test: Click "Test" button → Panel slides in
  - Test: Input form shows correct fields
- [ ] **Dev 3:** Test endpoint works?
  - Test: `POST /workFlow/123/test` with test data
  - Check: Returns step-by-step results (no DB save)

### Afternoon Check
- [ ] **Dev 2:** Test results display?
  - Test: Run test → See results (✅ or ❌ for each step)
  - Test: Expand step → See input/output data
- [ ] **Both:** End-to-end test works?
  - Test: Create workflow → Configure → Test → See results

### End-of-Day Go/No-Go
**Go if:**
- ✅ Test mode works end-to-end

**No-Go if:**
- ❌ Test endpoint failing → Priority: Fix tomorrow

**Tomorrow's Focus:**
- Dev 2: Monitoring page
- Dev 3: Get executions API

---

## Day 7 (Tuesday): Monitoring Dashboard

### Morning Check
- [ ] **Dev 2:** Monitoring page layout done?
  - Test: Navigate to `/workflows/123/monitoring`
  - Test: See table with columns
- [ ] **Dev 3:** Get executions endpoint works?
  - Test: `GET /workFlow/123/executions?status=completed`
  - Check: Returns list of executions

### Afternoon Check
- [ ] **Dev 2:** Execution list loads?
  - Test: Executions show in table
  - Test: Filters work (status, date range)
- [ ] **Dev 2:** Can expand to see details?
  - Test: Click "View Details" → See step-by-step logs
- [ ] **Dev 3:** Get details endpoint works?
  - Test: `GET /execution/abc123`
  - Check: Returns execution + logs

### End-of-Day Go/No-Go
**Go if:**
- ✅ Monitoring page shows executions
- ✅ Can view details

**No-Go if:**
- ❌ Monitoring page broken → Priority: Fix tomorrow

**Tomorrow's Focus:**
- Integration with existing APIs
- JWT auth

---

## Day 8 (Wednesday): Integration & Auth

### Morning Check
- [ ] **You:** API integration doc done?
  - Check: `docs/API_INTEGRATION.md` exists
  - Check: Dev 2 understands how to call existing APIs
- [ ] **You:** JWT auth configured?
  - Check: `axiosInstance` adds JWT token to headers
  - Test: API call without token → 401 error

### Afternoon Check
- [ ] **Dev 2:** Save workflow works?
  - Test: Create workflow → Click "Save Draft"
  - Check: Workflow saved to MongoDB (check DB)
  - Check: Steps saved with correct data
- [ ] **Dev 2:** Publish workflow works?
  - Test: Click "Publish" → Workflow status changes to "PUBLISHED"
- [ ] **Dev 3:** Multi-tenancy works?
  - Test: User A cannot see User B's workflows
  - Check: All queries filter by `orgId` and `userId`

### End-of-Day Go/No-Go
**Go if:**
- ✅ Integration works
- ✅ JWT auth works
- ✅ Multi-tenancy secure

**No-Go if:**
- ❌ Integration failing → Priority: Debug tomorrow
- ❌ Multi-tenancy broken → CRITICAL, fix immediately

**Tomorrow's Focus:**
- E2E testing
- Bug fixing

---

## Day 9 (Thursday): E2E Testing & Bugs

### Morning Check
- [ ] **You:** E2E test written?
  - Check: `e2e/workflow-builder.spec.ts` exists
  - Run: `npx playwright test`
  - Check: Test passes or fails with clear errors

### Afternoon Check
- [ ] **All:** E2E test passes?
  - Test: Complete user journey (create → test → publish → monitor)
  - If fails → Debug together

### Bug Triage (Continuous)
**For Each Bug:**
- Severity:
  - **P0 (Critical):** Blocks core functionality → Fix today
  - **P1 (High):** Major issue, workaround exists → Fix tomorrow
  - **P2 (Medium):** Minor issue → Post-MVP
- Assign to dev
- Set deadline

**Common Bugs & Fixes:**
- "Canvas crashes on drop" → Check nodeTypes mapping
- "API returns 500" → Check payload format, check logs
- "Test results not showing" → Check WebSocket/polling
- "Config not saving" → Check Zustand state update

### End-of-Day Go/No-Go
**Go if:**
- ✅ E2E test passes
- ✅ Zero P0 bugs

**No-Go if:**
- ❌ E2E test fails → Fix tomorrow
- ❌ P0 bugs exist → Fix tomorrow

**Tomorrow's Focus:**
- Final polish
- Performance check
- Deploy

---

## Day 10 (Friday): Deploy & Demo

### Morning Check
- [ ] **All:** Final testing done?
  - Test: All 16 node types work
  - Test: Complete workflows execute
  - Test: Monitoring shows correct data

### Afternoon Check
- [ ] **You:** Performance acceptable?
  - Test: Canvas with 50 nodes loads <2 seconds
  - Test: API responses <500ms (without LLM)
- [ ] **You:** Deployed to staging?
  - Check: Staging URL works
  - Test: Smoke test all endpoints

### Demo Preparation (4:00 PM)
- [ ] Demo workflow created
- [ ] Demo script written
- [ ] Screenshots/recording prepared

### End-of-Sprint Retrospective (5:00 PM)

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

### If Dev 2 (Frontend) Stuck:

**Common Issues:**
1. **"React Flow not working"**
   - Check: `import ReactFlow from '@xyflow/react'` (not `react-flow`)
   - Check: `nodeTypes` object correct
   - Check: Nodes have `type` field matching `nodeTypes` key

2. **"Config form not saving"**
   - Check: `onSave` prop passed correctly
   - Check: Zustand state updated
   - Check: Node `data.config` field

3. **"Styles not working"**
   - Check: Tailwind CSS configured
   - Check: Classes correct (no typos)

**Solution:**
- Pair for 30 min
- Share screen, walk through code
- Point to working example

---

### If Dev 3 (Backend) Stuck:

**Common Issues:**
1. **"API returns 500"**
   - Check: Request payload format
   - Check: Backend logs (`console.log` or logging)
   - Check: Database connection

2. **"Integration with BotCore failing"**
   - Check: BotCore running (`http://localhost:5000` accessible)
   - Check: Request format matches BotCore API
   - Check: Response format parsed correctly

3. **"Tests failing"**
   - Read error message carefully
   - Check: Test data correct
   - Check: Mocks configured

**Solution:**
- Check logs together
- Test API with Postman/curl
- Review API documentation

---

## Risk Management

### High-Risk Areas (Monitor Daily)

**1. React Flow Integration**
- **Risk:** Unfamiliar API
- **Mitigation:** Dev 2 spends extra time on docs, you pair if stuck
- **Check Daily:** Canvas works, drag-drop works, connections work

**2. Execution Engine Complexity**
- **Risk:** Sequential execution with context passing is complex
- **Mitigation:** Clear architecture, TDD, frequent testing
- **Check Daily:** Execute simple workflow, check logs

**3. 16 Config Forms**
- **Risk:** Lots of repetitive work
- **Mitigation:** Reuse components, use templates
- **Check Daily:** Count completed forms, adjust if falling behind

**4. Integration with Existing APIs**
- **Risk:** Undocumented quirks
- **Mitigation:** Document early, test early
- **Check Daily:** Save/load works, data persists correctly

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
- [ ] ✅ Canvas works (drag-drop, connections)
- [ ] ✅ All 16 config forms done
- [ ] ✅ All 16 node types implemented
- [ ] ✅ Simple workflow executes end-to-end

**If not achieved:** Adjust Week 2 plan, cut nice-to-haves

### Week 2 (End of Day 10)
- [ ] ✅ Test mode works
- [ ] ✅ Monitoring dashboard works
- [ ] ✅ Integration with existing APIs works
- [ ] ✅ E2E test passes
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
- Test mode
- Monitoring dashboard
- Integration & deploy

Status: 🟢 On track for 2-week delivery
```

---

## Final Checklist (Day 10 Evening)

### MVP Acceptance Criteria
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
- [ ] Canvas renders <2 seconds for 50 nodes
- [ ] API responses <500ms (without LLM)
- [ ] Multi-tenant isolation verified
- [ ] E2E test passes
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
