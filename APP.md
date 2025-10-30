# **wrrk.ai - App Experience Document**
## Visual Workflow Builder for Sales & Marketing Automation

**Version:** 1.0
**Product:** wrrk.ai MVP (Visual Workflow Builder)
**Scope:** 2-week MVP with 3 developers
**Last Updated:** October 29, 2025

---

## 1. Product Overview

### 1.1 What is wrrk.ai?

**wrrk.ai** is a visual workflow builder that enables anyone to create powerful sales and marketing automation workflows without writing code. Users drag and drop components (Triggers, Agents, Actions, Utilities) onto a canvas, connect them visually, and publish workflows that run automatically.

**Core Philosophy:** Simple. Lovable. Complete.
- **Simple:** Clean UI, intuitive drag-drop, zero learning curve
- **Lovable:** Delightful interactions, instant feedback, beautiful design
- **Complete:** Everything needed to build, test, monitor, and run workflows

### 1.2 Target Users (MVP)

1. **Marketing Managers** - Create lead nurturing campaigns
2. **Sales Teams** - Automate follow-ups and qualification
3. **Customer Success** - Build engagement workflows
4. **Small Business Owners** - DIY automation without developers

### 1.3 Core Value Proposition

> "From idea to live workflow in 10 minutes"

- **Visual First:** See your workflow, understand it instantly
- **Pre-built Components:** 50+ ready-to-use nodes
- **Test Before Live:** Validate with sample data
- **Monitor Everything:** Know exactly what's happening

---

## 2. Design Principles

### 2.1 Simplicity Over Features
- One clear action per screen
- No hidden menus or nested navigation
- Obvious next steps
- Minimal clicks to achieve goals

### 2.2 Visual Clarity
- Use color to communicate state (draft/live/error)
- Icons for every node type
- Clear visual hierarchy
- Generous whitespace

### 2.3 Progressive Disclosure
- Show basics first, advanced options on demand
- Don't overwhelm with all configuration options at once
- Smart defaults for everything

### 2.4 Instant Feedback
- Real-time validation
- Clear error messages with solutions
- Success states that feel good
- Loading states that inform

---

## 3. App Structure & Navigation

### 3.1 Primary Navigation (Left Sidebar - Collapsed by default)

```
┌─────────────────────────────────────────┐
│ [wrrk.ai logo]                          │
│                                          │
│ 🏠 Home                                  │
│ ⚡ Workflows                             │
│ 🔗 Integrations                          │
│ 📊 Activity Log                          │
│                                          │
│ ─────────────────                        │
│ ⚙️  Settings                             │
│ 👤 Profile                               │
│                                          │
│ [Upgrade to Pro]                         │
└─────────────────────────────────────────┘
```

### 3.2 User Journey Map

```
Sign Up → Connect Accounts → Create Workflow → Test → Publish → Monitor
   ↓            ↓                  ↓            ↓       ↓         ↓
Welcome     Integrations       Builder       Test    Live    Dashboard
 Page          Page            Page        Panel   Status   Metrics
```

---

## 4. Page-by-Page Experience

### 4.1 Authentication Pages

#### **4.1.1 Landing Page (Public)**
**URL:** `/`

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  [wrrk.ai logo]              [Login]  [Sign Up]          │
└──────────────────────────────────────────────────────────┘

           Build workflows visually.
           Automate everything.

    [Animated workflow canvas preview showing nodes connecting]

         [Get Started Free] [Watch Demo]

┌────────────────────────────────────────────────────────────┐
│  "We converted 800 dead leads with one workflow"           │
│  — Interior Design Company                                  │
└────────────────────────────────────────────────────────────┘

      [3-step visual: Build → Test → Automate]
```

**Purpose:** Clear value prop, low friction signup

---

#### **4.1.2 Sign Up Page**
**URL:** `/signup`

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│                                                       │
│              Create your wrrk.ai account              │
│                                                       │
│    [Email input]                                      │
│    [Password input]                                   │
│    [Full Name input]                                  │
│                                                       │
│    ☐ I agree to Terms of Service                     │
│                                                       │
│    [Create Account]                                   │
│                                                       │
│    Already have an account? [Log in]                 │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Post-Signup Flow:**
1. Email verification (OTP)
2. Redirect to **Onboarding Page**

---

#### **4.1.3 Onboarding Page** (One-time after signup)
**URL:** `/onboarding`

**Step 1: Connect Your First Account**
```
┌────────────────────────────────────────────────────────┐
│                                                         │
│         Let's connect your communication channels       │
│                                                         │
│    [WhatsApp Business]  [coming soon: Email]            │
│    [Voice/Phone]                                        │
│                                                         │
│    [Skip for now]                                       │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Step 2: Choose a Template or Start Fresh**
```
┌────────────────────────────────────────────────────────┐
│                                                         │
│         How would you like to start?                    │
│                                                         │
│    ┌─────────────────┐  ┌─────────────────┐           │
│    │  Start from      │  │  Browse          │           │
│    │  Blank Canvas    │  │  Templates       │           │
│    │                  │  │                  │           │
│    │  [Create]        │  │  [Explore]       │           │
│    └─────────────────┘  └─────────────────┘           │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Outcome:** User lands on Dashboard

---

### 4.2 Dashboard (Home)

**URL:** `/dashboard`

**Purpose:** Central command center showing all workflows, metrics, and quick actions

**Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│  [Sidebar] │  Dashboard                     [Search] [Profile]   │
├────────────┼──────────────────────────────────────────────────────┤
│            │                                                       │
│            │  ┌──────────────────────────────────────────────┐   │
│            │  │  Quick Stats                                  │   │
│            │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │   │
│            │  │  │   12    │ │   8     │ │  2,450  │        │   │
│            │  │  │ Active  │ │ Running │ │  Leads  │        │   │
│            │  │  └─────────┘ └─────────┘ └─────────┘        │   │
│            │  └──────────────────────────────────────────────┘   │
│            │                                                       │
│            │  Your Workflows              [+ New Workflow]        │
│            │                                                       │
│            │  ┌────────────────────────────────────────────┐     │
│            │  │ 🟢 Lead Follow-up Campaign                  │     │
│            │  │ Running • 345 executions • 92% success      │     │
│            │  │ Last run: 2 mins ago                        │     │
│            │  │                        [View] [Edit] [•••]  │     │
│            │  └────────────────────────────────────────────┘     │
│            │                                                       │
│            │  ┌────────────────────────────────────────────┐     │
│            │  │ ⚪ Dead Lead Reactivation                   │     │
│            │  │ Draft • Not published                       │     │
│            │  │ Last edited: 1 hour ago                     │     │
│            │  │                        [View] [Edit] [•••]  │     │
│            │  └────────────────────────────────────────────┘     │
│            │                                                       │
│            │  ┌────────────────────────────────────────────┐     │
│            │  │ 🔴 Customer Support Triage                  │     │
│            │  │ Error • Last run failed                     │     │
│            │  │ Last run: 15 mins ago                       │     │
│            │  │                        [View] [Edit] [•••]  │     │
│            │  └────────────────────────────────────────────┘     │
│            │                                                       │
│            │  Recent Activity                                     │
│            │  ┌────────────────────────────────────────────┐     │
│            │  │ • Lead Follow-up Campaign executed          │     │
│            │  │   2 mins ago                                │     │
│            │  │ • WhatsApp message sent to +91 98765...    │     │
│            │  │   5 mins ago                                │     │
│            │  │ • Dead Lead Reactivation saved             │     │
│            │  │   1 hour ago                                │     │
│            │  └────────────────────────────────────────────┘     │
│            │                                                       │
└────────────┴───────────────────────────────────────────────────────┘
```

**Key Elements:**

1. **Quick Stats Cards**
   - Total Active Workflows
   - Currently Running
   - Total Leads/Actions processed today

2. **Workflows List**
   - **Status indicator:**
     - 🟢 Green = Live & running
     - ⚪ Gray = Draft
     - 🔴 Red = Error state
     - ⏸️ Paused = User paused
   - **Metadata:** Status, execution count, success rate, last run
   - **Actions:** View metrics, Edit, Delete, Duplicate, Pause/Resume

3. **Recent Activity Feed**
   - Real-time log of workflow executions
   - Clickable to see details

**Interactions:**
- Click workflow card → Navigate to **Workflow Detail Page**
- Click "Edit" → Navigate to **Workflow Builder**
- Click "+ New Workflow" → Navigate to **Workflow Builder** (blank canvas)

---

### 4.3 Workflow Builder (The Core Experience)

**URL:** `/workflows/builder/:workflowId`

**Purpose:** Visual canvas where users drag-drop nodes, connect them, and configure workflows

#### **4.3.1 Layout Overview**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [← Back]  Untitled Workflow        [Test] [Save Draft] [Publish]            │
├──────────┬──────────────────────────────────────────────────────────┬────────┤
│          │                                                           │        │
│  NODES   │              CANVAS (React Flow)                         │ CONFIG │
│          │                                                           │        │
│  Search  │   ┌─────────┐                                            │        │
│  [____]  │   │ Trigger │                                            │        │
│          │   │ WhatsApp│                                            │        │
│ Triggers │   │ Message │                                            │        │
│  • WhatsApp   └────┬────┘                                           │        │
│  • Email          │                                                 │        │
│  • Voice          │                                                 │        │
│              ┌────▼────┐                                            │        │
│ Agents   │   │  Agent  │                                            │        │
│  • Conversational │ Decision│                                       │        │
│  • Decision       └────┬────┘                                       │        │
│  • Reasoning           │                                            │        │
│                   ┌────▼────┐                                       │        │
│ Actions  │        │ Action  │                                       │        │
│  • Send WhatsApp  │Send WhatsApp                                   │        │
│  • Send Email     └─────────┘                                      │        │
│  • Make Call                                                        │        │
│  • Update CRM                                                       │        │
│                                                                      │        │
│ Utilities│                                                           │        │
│  • Text Gen                                                          │        │
│  • Sentiment                                                         │        │
│  • Intent                                                            │        │
│  • Custom AI                                                         │        │
│          │                                                           │        │
└──────────┴───────────────────────────────────────────────────────────┴────────┘
```

#### **4.3.2 Left Panel: Node Library**

**Structure:**
```
┌─────────────────────────┐
│  Nodes                  │
│  [Search nodes...]      │
│                         │
│  ▼ Triggers (3)         │
│    • WhatsApp Message   │
│    • Email Received     │
│    • Voice Call         │
│                         │
│  ▼ Agents (3)           │
│    • Conversational     │
│    • Decision           │
│    • Reasoning          │
│                         │
│  ▼ Actions (4)          │
│    • Send WhatsApp      │
│    • Send Email         │
│    • Initiate Call      │
│    • Update CRM         │
│                         │
│  ▼ Utilities (6)        │
│    • Text Generator     │
│    • Sentiment Calc     │
│    • Intent Calc        │
│    • Vuln Scanner       │
│    • Reason Analyzer    │
│    • Custom AI Utility  │
│                         │
└─────────────────────────┘
```

**Interactions:**
- Drag node from library → Drop on canvas → Node appears
- Hover node → Show tooltip with description
- Search box filters nodes in real-time

---

#### **4.3.3 Center Panel: Canvas (React Flow)**

**Features:**

1. **Node Rendering**
   - Each node shows:
     - Icon (identifying node type)
     - Label/Name
     - Status indicator (configured/unconfigured)
     - Connection ports (top input, bottom output)

2. **Connection Lines**
   - Drag from output port → Input port → Creates edge
   - Curved lines (Bezier curves)
   - Animated flow when workflow is running
   - Color-coded:
     - Gray = inactive
     - Blue = active path
     - Green = success path
     - Red = error path

3. **Canvas Controls**
   - Zoom in/out (mouse wheel or +/- buttons)
   - Pan (click-drag on empty space)
   - Fit to view button
   - Minimap (bottom-right corner)

4. **Node States**
   - **Unconfigured:** Gray border, warning icon
   - **Configured:** Blue border, checkmark icon
   - **Running:** Pulsing blue glow
   - **Success:** Green glow (in test/execution view)
   - **Error:** Red glow with error icon

5. **Multi-select & Actions**
   - Cmd/Ctrl + Click → Select multiple nodes
   - Delete key → Remove selected nodes
   - Right-click node → Context menu (Duplicate, Delete, Configure)

---

#### **4.3.4 Right Panel: Configuration Panel**

**State 1: No Node Selected**
```
┌────────────────────────┐
│  Configuration         │
│                        │
│  Select a node to      │
│  configure it          │
│                        │
│  [Visual hint icon]    │
│                        │
└────────────────────────┘
```

**State 2: Node Selected (Example: WhatsApp Trigger)**
```
┌─────────────────────────────────┐
│  WhatsApp Message Trigger       │
│  [×] Close                       │
│  ─────────────────────────       │
│                                  │
│  Trigger Type                    │
│  [Dropdown: WhatsApp Message ▼] │
│                                  │
│  Select Account *                │
│  [Dropdown: +91 98765... ▼]     │
│                                  │
│  Trigger Conditions              │
│  ☑ Keyword match                 │
│    Keywords: [______]            │
│                                  │
│  ☐ Message status                │
│  ☐ Seen within time              │
│  ☐ From specific user            │
│                                  │
│  ─────────────────────────       │
│  [Cancel]  [Save Configuration]  │
│                                  │
└─────────────────────────────────┘
```

**State 3: Node Selected (Example: Decision Agent)**
```
┌─────────────────────────────────┐
│  Decision Agent                  │
│  [×] Close                       │
│  ─────────────────────────       │
│                                  │
│  System Prompt *                 │
│  [Large text area]               │
│  "Analyze the customer intent..."│
│                                  │
│  Memory Context                  │
│  [+ Add file] [+ Add URL]        │
│  • customer-data.pdf [×]         │
│                                  │
│  Decision Outputs (fixed)        │
│  • Approve                       │
│  • Reject                        │
│  • Review                        │
│                                  │
│  Available Variables             │
│  {{customer_name}}               │
│  {{message_text}}                │
│  {{phone_number}}                │
│  [Copy]                          │
│                                  │
│  ─────────────────────────       │
│  [Cancel]  [Save Configuration]  │
│                                  │
└─────────────────────────────────┘
```

**State 4: Node Selected (Example: Send WhatsApp Action)**
```
┌─────────────────────────────────┐
│  Send WhatsApp Message           │
│  [×] Close                       │
│  ─────────────────────────       │
│                                  │
│  Message Template *              │
│  [Text area with variable chips] │
│  "Hi {{customer_name}}, we..."   │
│                                  │
│  Insert Variable                 │
│  [Dropdown: Select variable ▼]   │
│                                  │
│  Recipient *                     │
│  ⦿ Use trigger phone number      │
│  ○ Custom: [___________]         │
│                                  │
│  Conditional Execution           │
│  ☑ Only if conditions met        │
│    {{intent_calc}} == 'high'     │
│    AND                           │
│    [+ Add condition]             │
│                                  │
│  Fallback Actions                │
│  If message fails:               │
│  [Dropdown: Send alert to admin ▼]│
│                                  │
│  ─────────────────────────       │
│  [Cancel]  [Save Configuration]  │
│                                  │
└─────────────────────────────────┘
```

**Configuration Panel Principles:**
- **Required fields marked with \***
- **Smart defaults for everything**
- **Variable insertion with autocomplete**
- **Inline validation** (show errors immediately)
- **Preview where possible** (e.g., message preview)

---

#### **4.3.5 Top Action Bar**

```
┌──────────────────────────────────────────────────────────┐
│ [← Back]  Lead Follow-up Workflow ✏️                     │
│                                                           │
│           [💾 Save Draft]  [🧪 Test]  [🚀 Publish]       │
└──────────────────────────────────────────────────────────┘
```

**Buttons:**

1. **← Back**
   - Returns to Dashboard
   - If unsaved changes → Show "Save before leaving?" modal

2. **Save Draft**
   - Saves workflow without publishing
   - Shows toast: "Draft saved successfully"
   - Keyboard shortcut: Cmd/Ctrl + S

3. **Test**
   - Opens **Test Panel** (slide-in from right)
   - See section 4.3.6

4. **Publish**
   - Validates workflow (all nodes configured, no errors)
   - If errors → Show error list with "Fix" buttons
   - If valid → Show publish modal:
     ```
     ┌────────────────────────────────┐
     │  Publish Workflow?             │
     │                                │
     │  This will activate your       │
     │  workflow and start processing │
     │  real triggers.                │
     │                                │
     │  [Cancel]  [Publish & Go Live] │
     └────────────────────────────────┘
     ```
   - After publish → Redirect to **Workflow Detail Page**

---

#### **4.3.6 Test Panel (Slide-in Overlay)**

**Trigger:** Click "Test" button in top action bar

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│                                         [×] Close Test Panel  │
│  Test Your Workflow                                          │
│  ─────────────────────────────────────                       │
│                                                               │
│  Step 1: Provide Test Data                                   │
│                                                               │
│  Trigger: WhatsApp Message                                   │
│  Phone Number: [+91 _____________]                           │
│  Message Text: [___________________]                         │
│                                                               │
│  [+ Add more test data]                                      │
│                                                               │
│  ──────────────────────────────────                          │
│                                                               │
│  [Run Test]                                                  │
│                                                               │
│  ──────────────────────────────────                          │
│                                                               │
│  Test Results:                                               │
│                                                               │
│  ✅ Step 1: WhatsApp Trigger  (0.1s)                        │
│     Input: +91 9876543210, "Hello"                          │
│                                                               │
│  ✅ Step 2: Decision Agent  (2.3s)                          │
│     Decision: Approve                                        │
│     Confidence: 0.92                                         │
│                                                               │
│  ✅ Step 3: Send WhatsApp  (0.8s)                           │
│     Message sent to +91 9876543210                          │
│     Status: Delivered                                        │
│                                                               │
│  Total execution time: 3.2s                                  │
│                                                               │
│  [View Full Logs]  [Run Another Test]                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Interactions:**
- User fills test data
- Click "Run Test" → Workflow executes on canvas with visual feedback
  - Nodes light up sequentially
  - Data flows through connections (animated)
  - Each node shows execution time
- Results panel shows step-by-step output
- **If error occurs:**
  ```
  ❌ Step 2: Decision Agent  (failed)
     Error: Missing system prompt
     [Fix Configuration]
  ```
- Click "Fix Configuration" → Opens config panel for that node

---

### 4.4 Workflow Detail & Monitoring Page

**URL:** `/workflows/:workflowId`

**Purpose:** Monitor live workflow executions with detailed logs and metrics

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [← Back]  Lead Follow-up Workflow          [Edit] [Pause] [•••] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │  Status    │ │ Executions │ │ Success    │ │  Avg Time  │  │
│  │  🟢 Live   │ │    345     │ │    92%     │ │   2.4s     │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Execution Timeline (Last 24 hours)                       │  │
│  │ [Line chart showing executions over time]                │  │
│  │  • Green = Success                                       │  │
│  │  • Red = Failed                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Execution Logs                         [Filter] [Search] [⟳]  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ✅ Execution #345                    2 mins ago           │  │
│  │    Trigger: WhatsApp from +91 9876...                    │  │
│  │    3 steps completed • 2.1s total                        │  │
│  │    [View Details ▼]                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ✅ Execution #344                    8 mins ago           │  │
│  │    Trigger: WhatsApp from +91 9988...                    │  │
│  │    3 steps completed • 2.8s total                        │  │
│  │    [View Details ▼]                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ❌ Execution #343                    15 mins ago          │  │
│  │    Trigger: WhatsApp from +91 9123...                    │  │
│  │    Failed at Step 2: Decision Agent                      │  │
│  │    Error: API timeout                                    │  │
│  │    [View Details ▼] [Retry]                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### **4.4.1 Expanded Execution Details**

**Trigger:** Click "View Details ▼" on any execution

```
┌──────────────────────────────────────────────────────────────┐
│ ✅ Execution #345                    2 mins ago               │
│    Trigger: WhatsApp from +91 9876543210                     │
│    3 steps completed • 2.1s total                            │
│    [View Details ▲]                                          │
│                                                               │
│    ┌─────────────────────────────────────────────────────┐  │
│    │ Step-by-Step Execution                              │  │
│    │                                                      │  │
│    │ 1️⃣ WhatsApp Message Trigger  (0.1s)  ✅             │  │
│    │    Input Data:                                      │  │
│    │    • Phone: +91 9876543210                          │  │
│    │    • Message: "I'm interested in your product"      │  │
│    │    • Timestamp: 2:45 PM                             │  │
│    │                                                      │  │
│    │ 2️⃣ Decision Agent  (1.8s)  ✅                       │  │
│    │    AI Analysis:                                     │  │
│    │    • Intent: high_purchase_intent                   │  │
│    │    • Sentiment: positive                            │  │
│    │    • Decision: Approve                              │  │
│    │    • Confidence: 0.92                               │  │
│    │                                                      │  │
│    │ 3️⃣ Send WhatsApp Message  (0.2s)  ✅               │  │
│    │    Message sent:                                    │  │
│    │    "Hi there! Thanks for your interest. Our team..."│  │
│    │    Status: Delivered ✓                              │  │
│    │    Message ID: wamid.HBgLM...                       │  │
│    │                                                      │  │
│    └─────────────────────────────────────────────────────┘  │
│                                                               │
│    [View Raw JSON] [Export Log]                              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Real-time updates** (WebSocket connection)
- **Step-by-step execution trail** with timing
- **Data flow visibility** (see what data passed between nodes)
- **Error details** with actionable fix suggestions
- **Retry button** for failed executions
- **Export logs** (JSON, CSV)

---

### 4.5 Integrations Page

**URL:** `/integrations`

**Purpose:** Connect external accounts (WhatsApp, Email, Voice, CRMs)

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Integrations                                        │
├───────────┼──────────────────────────────────────────────────────┤
│           │                                                       │
│           │  Connect your apps to use in workflows               │
│           │                                                       │
│           │  Communication Channels                              │
│           │  ┌──────────────┐  ┌──────────────┐                 │
│           │  │  WhatsApp    │  │  Email       │                 │
│           │  │  [Logo]      │  │  [Logo]      │                 │
│           │  │  ✅ Connected│  │  Not connected│                │
│           │  │  2 accounts  │  │  [Connect]   │                 │
│           │  └──────────────┘  └──────────────┘                 │
│           │                                                       │
│           │  ┌──────────────┐                                    │
│           │  │  Voice/Phone │                                    │
│           │  │  [Logo]      │                                    │
│           │  │  ✅ Connected│                                    │
│           │  │  1 account   │                                    │
│           │  └──────────────┘                                    │
│           │                                                       │
│           │  CRM & Business Tools                                │
│           │  ┌──────────────┐  ┌──────────────┐                 │
│           │  │  Shopify     │  │  Salesforce  │                 │
│           │  │  [Logo]      │  │  [Logo]      │                 │
│           │  │  Not connected│  │  Not connected│                │
│           │  │  [Connect]   │  │  [Connect]   │                 │
│           │  └──────────────┘  └──────────────┘                 │
│           │                                                       │
│           │  ┌──────────────┐                                    │
│           │  │  Custom API  │                                    │
│           │  │  [+]         │                                    │
│           │  │  [Add Custom]│                                    │
│           │  └──────────────┘                                    │
│           │                                                       │
└───────────┴───────────────────────────────────────────────────────┘
```

#### **4.5.1 Connect WhatsApp Flow**

**Trigger:** Click "Connect" on WhatsApp card

```
┌────────────────────────────────────────────────────┐
│  Connect WhatsApp Business                         │
│  ─────────────────────────────────                 │
│                                                     │
│  Phone Number ID *                                 │
│  [_________________________]                       │
│                                                     │
│  Access Token *                                    │
│  [_________________________]                       │
│                                                     │
│  Business Account ID *                             │
│  [_________________________]                       │
│                                                     │
│  Verify Token (for webhooks)                       │
│  [Auto-generated: wrrk_abc123]  [Copy]             │
│                                                     │
│  [Need help?] [Meta Business Setup Guide]          │
│                                                     │
│  [Cancel]  [Connect Account]                       │
│                                                     │
└────────────────────────────────────────────────────┘
```

**After Connection:**
- Success toast: "WhatsApp account connected!"
- Account appears in integrations list
- Available in workflow builder trigger/action dropdowns

---

### 4.6 Activity Log Page

**URL:** `/activity`

**Purpose:** Global feed of all workflow activities across all workflows

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Activity Log              [Filter] [Search] [⟳]    │
├───────────┼──────────────────────────────────────────────────────┤
│           │                                                       │
│           │  Today                                                │
│           │  • Workflow "Lead Follow-up" executed                │
│           │    2 mins ago • Success                              │
│           │                                                       │
│           │  • WhatsApp message sent to +91 9876...             │
│           │    5 mins ago • Lead Follow-up Campaign              │
│           │                                                       │
│           │  • Workflow "Dead Lead Reactivation" saved as draft  │
│           │    1 hour ago                                        │
│           │                                                       │
│           │  • WhatsApp account connected                        │
│           │    2 hours ago • +91 98765...                        │
│           │                                                       │
│           │  Yesterday                                            │
│           │  • Workflow "Support Triage" published               │
│           │    Yesterday at 4:30 PM                              │
│           │                                                       │
│           │  • 45 workflow executions                            │
│           │    Yesterday • 42 success, 3 failed                  │
│           │                                                       │
└───────────┴───────────────────────────────────────────────────────┘
```

---

### 4.7 Settings Page

**URL:** `/settings`

**Purpose:** User profile, organization settings, billing

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Settings                                            │
├───────────┼──────────────────────────────────────────────────────┤
│           │                                                       │
│           │  [Profile] [Organization] [Billing] [API Keys]       │
│           │                                                       │
│           │  Profile                                              │
│           │  ──────────────────                                  │
│           │                                                       │
│           │  Full Name                                           │
│           │  [John Doe____________]                              │
│           │                                                       │
│           │  Email                                               │
│           │  [john@example.com____]                              │
│           │                                                       │
│           │  Password                                            │
│           │  [Change Password]                                   │
│           │                                                       │
│           │  [Save Changes]                                      │
│           │                                                       │
└───────────┴───────────────────────────────────────────────────────┘
```

---

## 5. Node Type Specifications

### 5.1 Trigger Nodes

#### **5.1.1 WhatsApp Message Trigger**

**Visual:**
```
┌─────────────────┐
│  📱 WhatsApp    │
│  Message        │
│  ⚪ (indicator) │
└────────┬────────┘
         ↓ (output)
```

**Configuration Fields:**
- **Trigger Type:** WhatsApp Message (fixed)
- **Select Account:** Dropdown of connected WhatsApp numbers
- **Trigger Conditions:**
  - ☐ Keyword match (text input for keywords)
  - ☐ Message status (sent/delivered/read/failed)
  - ☐ Seen within time (time range picker)
  - ☐ From specific user (phone number input)

**Output Variables:**
- `{{phone_number}}` - Sender's phone
- `{{message_text}}` - Message content
- `{{message_timestamp}}` - When received
- `{{message_id}}` - WhatsApp message ID

---

#### **5.1.2 Email Received Trigger**

**Visual:**
```
┌─────────────────┐
│  ✉️  Email      │
│  Received       │
│  ⚪ (indicator) │
└────────┬────────┘
         ↓
```

**Configuration:**
- **Email Account:** Connected email
- **Conditions:**
  - Subject contains
  - From address
  - Has attachment

**Output Variables:**
- `{{email_from}}`, `{{email_subject}}`, `{{email_body}}`

---

#### **5.1.3 Voice Call Trigger**

**Visual:**
```
┌─────────────────┐
│  📞 Voice Call  │
│  Received       │
│  ⚪             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **Phone Number:** Connected phone
- **Conditions:** From specific caller, business hours only

**Output Variables:**
- `{{caller_number}}`, `{{call_duration}}`, `{{call_transcript}}`

---

### 5.2 Agent Nodes

#### **5.2.1 Conversational Agent**

**Visual:**
```
         ↓ (input)
┌─────────────────┐
│  🤖 Conversational
│  Agent          │
│  ✅             │
└────────┬────────┘
         ↓ (output)
```

**Configuration:**
- **System Prompt:** Large text area
- **Memory Context:** File/URL uploads
- **Response Format:**
  - ⦿ Freeform Text
  - ○ Structured JSON
  - ○ Numeric Score (0-100)
- **Variables:** Available for use in prompts

**Output Variables:**
- `{{agent_response}}` - AI's response

---

#### **5.2.2 Decision Agent**

**Visual:**
```
         ↓
┌─────────────────┐
│  ⚖️  Decision   │
│  Agent          │
│  ✅             │
└───┬─────┬───┬───┘
    ↓     ↓   ↓
 Approve Reject Review
```

**Configuration:**
- **System Prompt**
- **Memory Context**
- **Output:** Fixed 3 options (Approve/Reject/Review)

**Output Variables:**
- `{{decision}}` - "Approve" | "Reject" | "Review"
- `{{confidence}}` - 0.0 to 1.0

**Special:** Has 3 output ports (one per decision path)

---

#### **5.2.3 Reasoning Agent**

**Visual:**
```
         ↓
┌─────────────────┐
│  🧠 Reasoning   │
│  Agent          │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **System Prompt**
- **Memory Context**
- **Response Format:** Same as Conversational

**Output Variables:**
- `{{reasoning}}` - Detailed reasoning
- `{{conclusion}}` - Final conclusion

---

### 5.3 Action Nodes

#### **5.3.1 Send WhatsApp Message**

**Visual:**
```
         ↓
┌─────────────────┐
│  📱 Send        │
│  WhatsApp       │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **Message Template:** Text area with variable insertion
- **Recipient:**
  - ⦿ Use trigger phone number
  - ○ Custom phone number
- **Conditional Execution:**
  - Expression builder: `{{var}} == 'value' AND ...`
- **Fallback Actions:**
  - If message fails: [Dropdown]
    - Create support ticket
    - Retry after delay
    - Send alert to admin
    - Send default response

**Output Variables:**
- `{{message_status}}` - "sent" | "delivered" | "read" | "failed"
- `{{message_id}}`

---

#### **5.3.2 Send Email**

**Visual:**
```
         ↓
┌─────────────────┐
│  ✉️  Send Email │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **To, Subject, Body** (with variables)
- **Conditional execution**
- **Fallback actions**

---

#### **5.3.3 Initiate Call**

**Visual:**
```
         ↓
┌─────────────────┐
│  📞 Make Call   │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **Voice Agent:** Dropdown of configured agents
- **Phone Number:** Variable or custom
- **Conditional execution**

---

#### **5.3.4 Update CRM**

**Visual:**
```
         ↓
┌─────────────────┐
│  📊 Update CRM  │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **CRM System:** Dropdown (Decorpot, Shopify, Salesforce)
- **Action:** Create/Update/Delete
- **Fields:** Dynamic form based on CRM

---

### 5.4 Utility Nodes

#### **5.4.1 Text Generator**

**Visual:**
```
         ↓
┌─────────────────┐
│  📝 Text        │
│  Generator      │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **System Prompt:** What to generate
- **AI Model:** GPT-4o, GPT-4o-mini, Claude
- **Temperature:** Slider (0-1)
- **Variables:** Available

**Output:** `{{generated_text}}`

---

#### **5.4.2 Sentiment Calculator**

**Visual:**
```
         ↓
┌─────────────────┐
│  😊 Sentiment   │
│  Calculator     │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **Input Text:** Variable to analyze (e.g., `{{message_text}}`)

**Output:**
- `{{sentiment}}` - "positive" | "negative" | "neutral"
- `{{sentiment_score}}` - -1.0 to 1.0

---

#### **5.4.3 Intent Calculator**

**Visual:**
```
         ↓
┌─────────────────┐
│  🎯 Intent      │
│  Calculator     │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **Input Text**

**Output:**
- `{{intent}}` - "complaint" | "feedback" | "inquiry" | "sales_lead" | "other"
- `{{confidence}}`

---

#### **5.4.4 Vulnerability Scanner**

**Visual:**
```
         ↓
┌─────────────────┐
│  🛡️  Vulnerability
│  Scanner        │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **Input Text**

**Output:**
- `{{vulnerabilities}}` - Array of potential issues
- `{{risk_level}}` - "low" | "medium" | "high"

---

#### **5.4.5 Reason Analyzer**

**Visual:**
```
         ↓
┌─────────────────┐
│  🔍 Reason      │
│  Analyzer       │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **Input Text**

**Output:**
- `{{reason}}` - Core issue extracted (<20 words)

---

#### **5.4.6 Custom AI Utility**

**Visual:**
```
         ↓
┌─────────────────┐
│  ⚙️  Custom AI  │
│  Utility        │
│  ✅             │
└────────┬────────┘
         ↓
```

**Configuration:**
- **System Prompt:** Custom instructions
- **AI Model**
- **Temperature**
- **Variables**

**Output:**
- `{{custom_output}}`

---

## 6. Key User Flows

### 6.1 Creating a Workflow (Happy Path)

```
1. User clicks "+ New Workflow" from Dashboard
2. Lands on Workflow Builder (blank canvas)
3. Drags "WhatsApp Message Trigger" to canvas
4. Clicks node → Right panel opens
5. Configures: Selects account, sets keyword match
6. Clicks "Save Configuration"
7. Drags "Decision Agent" to canvas
8. Connects Trigger → Agent (drag from output to input)
9. Configures Agent: Writes system prompt, adds memory file
10. Drags "Send WhatsApp" action
11. Connects Agent "Approve" output → Action
12. Configures Action: Writes message template with variables
13. Clicks "Save Draft" → Toast: "Draft saved"
14. Clicks "Test" → Test panel opens
15. Enters test phone number and message
16. Clicks "Run Test" → Canvas animates execution
17. Test results show success
18. Clicks "Publish"
19. Validates workflow → No errors
20. Confirms publish modal
21. Redirects to Workflow Detail page
22. Sees "🟢 Live" status
```

**Time to complete:** ~10 minutes

---

### 6.2 Monitoring a Failed Execution

```
1. User receives notification: "Workflow execution failed"
2. Clicks notification → Opens Workflow Detail page
3. Sees execution #343 marked red with error
4. Clicks "View Details ▼"
5. Sees step-by-step log: Failed at "Decision Agent"
6. Error message: "API timeout - OpenAI service unavailable"
7. Clicks "Retry" → Workflow re-executes
8. Execution succeeds
9. User reviews logs to confirm
```

---

### 6.3 Connecting an Integration

```
1. User on Dashboard, realizes WhatsApp not connected
2. Clicks "🔗 Integrations" in sidebar
3. Lands on Integrations page
4. Clicks "Connect" on WhatsApp card
5. Modal opens with connection form
6. Goes to Meta Business Manager, copies credentials
7. Pastes Phone Number ID, Access Token, Business Account ID
8. Clicks "Connect Account"
9. Backend validates → Success
10. Account appears as "✅ Connected"
11. Returns to Workflow Builder
12. WhatsApp account now appears in trigger dropdown
```

---

## 7. Mobile Responsiveness

**MVP Focus:** Desktop-first (workflow building is complex on mobile)

**Mobile Support (Post-MVP):**
- Dashboard: View workflows, see metrics
- Workflow Detail: Monitor executions
- Integrations: Connect accounts
- **No mobile workflow builder** (too complex for MVP)

---

## 8. Empty States & Onboarding

### 8.1 Empty Dashboard

```
┌───────────────────────────────────────────┐
│                                            │
│       [Illustration of workflow nodes]     │
│                                            │
│     You don't have any workflows yet       │
│                                            │
│  Build your first workflow in minutes      │
│                                            │
│         [+ Create Your First Workflow]     │
│                                            │
│         or  [Browse Templates]             │
│                                            │
└───────────────────────────────────────────┘
```

---

### 8.2 Empty Integrations

```
┌───────────────────────────────────────────┐
│                                            │
│       [Illustration of connections]        │
│                                            │
│     Connect your first account             │
│                                            │
│  Link WhatsApp, Email, or Phone to start   │
│  automating your workflows                 │
│                                            │
│         [Connect WhatsApp]                 │
│                                            │
└───────────────────────────────────────────┘
```

---

## 9. Error States & Validation

### 9.1 Node Configuration Errors

**Example: Missing required field**
```
┌─────────────────────────────────┐
│  WhatsApp Message Trigger       │
│  [×] Close                       │
│  ─────────────────────────       │
│                                  │
│  Select Account *                │
│  [Dropdown: Select account ▼]   │
│  ⚠️ This field is required       │
│                                  │
└─────────────────────────────────┘
```

**Node visual state:**
- Red border around node
- ⚠️ icon in top-right corner
- Tooltip on hover: "Configuration incomplete"

---

### 9.2 Workflow Publish Errors

**Example: Unconnected nodes**
```
┌────────────────────────────────────────┐
│  Can't Publish Workflow                │
│                                         │
│  Fix these errors before publishing:    │
│                                         │
│  ⚠️ "Send Email" node is not configured │
│     [Fix]                               │
│                                         │
│  ⚠️ "Agent" node has no output connection
│     [Fix]                               │
│                                         │
│  [Close]                                │
└────────────────────────────────────────┘
```

Click "Fix" → Canvas scrolls to node + opens config panel

---

### 9.3 Execution Errors

**In Workflow Detail page:**
```
❌ Execution #343                    15 mins ago
   Failed at Step 2: Decision Agent
   Error: OpenAI API timeout (504)

   Suggested Actions:
   • [Retry Execution]
   • [Check OpenAI Status]
   • [Configure Fallback]
```

---

## 10. Success States & Delightful Moments

### 10.1 After Publish

```
┌─────────────────────────────────────────┐
│  🎉 Workflow Published!                 │
│                                          │
│  "Lead Follow-up Campaign" is now live   │
│  and will start processing triggers.     │
│                                          │
│  [View Dashboard] [Monitor Executions]   │
└─────────────────────────────────────────┘
```

---

### 10.2 Test Success

**In Test Panel:**
```
✅ Test Completed Successfully!

All 3 steps executed without errors.
Total time: 2.3s

[Run Another Test] [Publish Workflow]
```

---

### 10.3 Execution Milestone

**Toast notification:**
```
🎊 Milestone Reached!
Your workflow has processed 1,000 executions
```

---

## 11. Technical Considerations for UI

### 11.1 React Flow Configuration

**Library:** `@xyflow/react` (React Flow)

**Key Features to Implement:**
- Custom node components (one per node type)
- Connection validation (prevent invalid connections)
- Auto-layout (optional, for initial template placement)
- Minimap & controls
- Zoom/pan with smooth animations
- Undo/redo (Cmd+Z, Cmd+Shift+Z)

**Performance:**
- Virtualization for 100+ nodes
- Debounced save on canvas changes
- Optimistic UI updates

---

### 11.2 Real-time Updates (WebSocket)

**Use Cases:**
- Live execution monitoring (Workflow Detail page)
- Workflow status changes
- New execution logs
- Test execution progress

**Implementation:**
- Socket.io connection on workflow detail page
- Reconnection logic
- Optimistic updates with fallback to polling

---

### 11.3 State Management

**Recommendations:**
- **Zustand** or **Redux Toolkit** for global state
- **React Query** for server state (workflows, executions, integrations)
- **Local state** for canvas interactions

**Key State:**
- Current workflow (nodes, edges)
- User integrations
- Execution logs
- Test panel state

---

## 12. Post-MVP: Workflow Marketplace

### 12.1 Marketplace Pages (Future)

**URL:** `/marketplace`

**Browse Workflows:**
```
┌─────────────────────────────────────────────────────────┐
│ Workflow Marketplace         [Search] [Filter] [Sort]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Popular Workflows                                       │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │ Dead Lead        │  │ Cart Abandonment │           │
│  │ Reactivation     │  │ Recovery         │           │
│  │                  │  │                  │           │
│  │ ⭐ 4.8 (124)     │  │ ⭐ 4.9 (89)      │           │
│  │ $49              │  │ $79              │           │
│  │                  │  │                  │           │
│  │ [Preview] [Buy]  │  │ [Preview] [Buy]  │           │
│  └──────────────────┘  └──────────────────┘           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Sell Workflow:**
- User clicks "Sell this workflow" on any live workflow
- Sets price, description, category
- Submits for review
- After approval, listed on marketplace

---

## 13. Design System & Styling

### 13.1 Color Palette

**Primary Colors:**
- **Brand Blue:** `#0066FF` (CTAs, active states)
- **Success Green:** `#00C853` (live workflows, success)
- **Error Red:** `#FF3B30` (failed executions, errors)
- **Warning Orange:** `#FF9500` (warnings, draft)
- **Neutral Gray:** `#8E8E93` (secondary text, borders)

**Node Colors:**
- **Trigger:** `#5E35B1` (Purple)
- **Agent:** `#1E88E5` (Blue)
- **Action:** `#43A047` (Green)
- **Utility:** `#FDD835` (Yellow)

---

### 13.2 Typography

**Font:** `Inter` (clean, modern, readable)

**Hierarchy:**
- H1: 32px bold (page titles)
- H2: 24px bold (section headers)
- H3: 18px semibold (card titles)
- Body: 14px regular
- Small: 12px regular (metadata)

---

### 13.3 Spacing

**8px grid system:**
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

---

### 13.4 Component Library

**Leverage existing BotWot UI components:**
- Button (variants: primary, secondary, ghost, danger)
- Input, Textarea, Select, Checkbox, Toggle
- Modal, Toast, Dropdown
- Table, Card, Badge, Avatar
- Loader, Skeleton

**New Components to Build:**
- Node (custom React Flow node)
- Canvas Controls (zoom, fit, minimap)
- Test Panel (slide-in drawer)
- Execution Timeline (chart)
- Variable Chip (for {{variable}} insertion)

---

## 14. Accessibility (a11y)

**MVP Considerations:**
- **Keyboard navigation:** Tab through form fields, Esc to close modals
- **Focus indicators:** Visible focus rings on all interactive elements
- **ARIA labels:** Proper labeling for screen readers
- **Color contrast:** WCAG AA compliance
- **Alt text:** All icons and images

**Canvas Accessibility:**
- Keyboard shortcuts for canvas actions (see section 15)
- Announce node connections to screen readers
- Accessible node configuration panel

---

## 15. Keyboard Shortcuts

**Global:**
- `Cmd/Ctrl + S` - Save draft
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo
- `Esc` - Close modals/panels
- `/` - Focus search

**Canvas:**
- `Delete` / `Backspace` - Delete selected nodes
- `Cmd/Ctrl + A` - Select all nodes
- `Cmd/Ctrl + C` - Copy nodes
- `Cmd/Ctrl + V` - Paste nodes
- `Cmd/Ctrl + D` - Duplicate selected nodes
- `Space + Drag` - Pan canvas
- `+` / `-` - Zoom in/out
- `0` - Fit to view

---

## 16. Success Metrics for MVP

### 16.1 Product Metrics

- **Time to First Workflow:** <15 minutes from signup
- **Workflow Publish Rate:** >60% of created workflows get published
- **Test Adoption:** >80% of users test before publishing
- **Execution Success Rate:** >90% of executions complete successfully

### 16.2 User Experience Metrics

- **Canvas Interactions:** Average 8-12 nodes per workflow
- **Configuration Time:** <2 minutes per node
- **Error Resolution Time:** <5 minutes from error to fix
- **Return Rate:** >70% of users return within 7 days

### 16.3 Technical Metrics

- **Canvas Load Time:** <2 seconds for 50-node workflow
- **Real-time Latency:** <200ms for execution updates
- **API Response Time:** <500ms (p95)
- **Uptime:** >99.5%

---

## 17. Open Questions for Development

1. **Variable Syntax:** Use `{{variable}}` or `${variable}`?
   - **Recommendation:** `{{variable}}` (more visual, familiar from templates)

2. **Node Limit:** Max nodes per workflow for MVP?
   - **Recommendation:** 50 nodes (can increase post-MVP)

3. **Concurrent Executions:** How many workflows can run in parallel?
   - **Recommendation:** 10 concurrent executions per workflow (queue excess)

4. **Data Retention:** How long to keep execution logs?
   - **Recommendation:** 30 days for MVP (configurable later)

5. **Workflow Versioning:** Support version history?
   - **Recommendation:** Not for MVP (add post-MVP with rollback)

---

## 18. 2-Week Development Roadmap

### **Week 1: Foundation & Builder**

**Day 1-2: Setup & Authentication**
- [ ] Project setup (Next.js/React + Tailwind)
- [ ] Auth pages (signup, login, onboarding)
- [ ] Dashboard layout with sidebar
- [ ] Integrations page (connect WhatsApp)

**Day 3-5: Workflow Builder Core**
- [ ] React Flow canvas integration
- [ ] Left panel: Node library with drag-drop
- [ ] Right panel: Configuration panel (dynamic based on node type)
- [ ] Node components (Trigger, Agent, Action, Utility)
- [ ] Connection logic & validation
- [ ] Save/load workflow (API integration)

**Day 6-7: Node Configuration**
- [ ] Configuration forms for all 16 node types
- [ ] Variable insertion UI (autocomplete)
- [ ] Conditional execution builder
- [ ] Validation & error states

---

### **Week 2: Testing, Monitoring & Polish**

**Day 8-9: Test & Publish**
- [ ] Test panel implementation
- [ ] Test execution flow (dry-run with sample data)
- [ ] Publish workflow flow
- [ ] Workflow validation before publish

**Day 10-11: Monitoring & Execution**
- [ ] Workflow detail page
- [ ] Execution logs with step-by-step details
- [ ] Real-time updates (WebSocket)
- [ ] Execution timeline chart
- [ ] Retry failed execution

**Day 12-13: Polish & Error Handling**
- [ ] Error states & validation messages
- [ ] Success states & delightful animations
- [ ] Empty states
- [ ] Loading states & skeletons
- [ ] Toast notifications

**Day 14: Testing & Launch Prep**
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deploy to staging

---

## 19. Conclusion

This App Experience Document provides a complete blueprint for building **wrrk.ai**'s MVP - a visual workflow builder that is:

✅ **Simple:** Intuitive drag-drop, clear UI, minimal complexity
✅ **Lovable:** Beautiful design, delightful interactions, instant feedback
✅ **Complete:** Everything needed to build, test, monitor, and run workflows

**Next Steps:**
1. **Review & approve this document**
2. **Create technical architecture document** (backend APIs, database schemas, React Flow implementation)
3. **Start development** following the 2-week roadmap

**Post-MVP Priorities:**
- Workflow marketplace
- More node types (loops, conditions, webhooks)
- Collaboration features (team workflows)
- Advanced monitoring (analytics, alerts)

---

**Document prepared for:** wrrk.ai Team
**Date:** October 29, 2025
**Version:** 1.0 (MVP Specification)
