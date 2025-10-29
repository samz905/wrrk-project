# BotWot Platform - Unified Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** October 28, 2025
**Document Owner:** Product Management & Engineering
**Platform Type:** AI-Powered Conversational Engagement Platform

> **⚠️ SECURITY NOTICE:** This document does not contain any API keys, credentials, or sensitive configuration values. All sensitive information must be stored in secure secrets management systems (AWS Secrets Manager, HashiCorp Vault, etc.) and never committed to version control.

---

## 1. Executive Summary

### 1.1 Platform Overview

**BotWot** is a comprehensive, microservices-based AI conversational platform that enables organizations to deploy intelligent chatbots and voice agents across multiple channels (WhatsApp, Facebook, Instagram, Website, Phone). The platform combines advanced AI capabilities (RAG, multi-agent systems, voice AI) with multi-channel communication, marketing automation, CRM integrations, and real-time analytics to deliver seamless customer engagement experiences.

### 1.2 Core Value Proposition

- **Multi-Channel Engagement**: Unified conversational interface across WhatsApp, social media, web, and voice
- **AI-Powered Intelligence**: Advanced NLP, sentiment analysis, intent detection, and multi-agent orchestration
- **Marketing Automation**: Campaign management, scheduled posting, and competitive intelligence
- **Enterprise Integration**: Seamless connection with Shopify, Decorpot CRM, Aroflo, and custom APIs
- **Real-Time Analytics**: Comprehensive dashboards, conversation analytics, and performance tracking
- **Scalable Architecture**: Microservices design supporting horizontal scaling and high availability

### 1.3 Target Users

- **Business Organizations**: Companies seeking AI-driven customer engagement
- **End Customers**: Users interacting with bots via WhatsApp, social media, web, or phone
- **Human Agents**: Customer service representatives managing conversations
- **Administrators**: Platform admins configuring bots, managing users, and analyzing performance
- **Developers**: Integration teams consuming platform APIs

### 1.4 Key Differentiators

1. **Unified Platform**: Single platform for text and voice across 5+ channels
2. **Industry-Specific Agents**: Pre-built agents for travel, e-commerce, interior design
3. **Marketing Intelligence**: AI-powered competitive analysis and content optimization
4. **Voice AI Integration**: ElevenLabs-powered voice agents with telephony
5. **Flexible Deployment**: Multi-tenant SaaS with enterprise customization

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│  BW_FE_Application (React/TypeScript) - Web Dashboard & Widgets │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS / WebSocket
┌─────────────────────────────┴───────────────────────────────────┐
│                  API Gateway & Orchestration                     │
│        BW_ConsumerService (NestJS) - Port 3001                   │
│  • Multi-channel messaging (WhatsApp, FB, IG, Website)          │
│  • Bot profile & knowledge base management                       │
│  • Session management, analytics, payments                       │
│  • Integration hub (Shopify, Decorpot, Aroflo)                  │
└────────┬────────┬────────┬────────┬────────┬─────────┬──────────┘
         │        │        │        │        │         │
         │        │        │        │        │         │
         v        v        v        v        v         v
┌────────────┐┌────────┐┌─────────┐┌──────┐┌────────┐┌──────────┐
│ Bot AI     ││ Voice  ││ Cron    ││ Queue││ Meta   ││ Payments │
│ Service    ││ Service││ Service ││ Jobs ││ APIs   ││ Gateway  │
└────────────┘└────────┘└─────────┘└──────┘└────────┘└──────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services Layer                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ BW_BotCoreFunctionalityService (Python Flask) - Port 5000│  │
│  │ • Multi-agent AI (Travent, Shopify, Decorpot)            │  │
│  │ • RAG system (FAISS, ChromaDB)                            │  │
│  │ • Conversation intelligence (sentiment, intent, CSAT)    │  │
│  │ • Multimodal (STT, TTS, image analysis)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ BW_VOICE (NestJS Fastify) - Port 8001                    │  │
│  │ • Voice agent creation & management                       │  │
│  │ • ElevenLabs integration (STT, TTS, LLM)                 │  │
│  │ • Twilio telephony integration                           │  │
│  │ • Voice conversation analytics                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ cron_Service (NestJS) - Port 3000                        │  │
│  │ • WhatsApp campaign execution (every minute)              │  │
│  │ • Social media post scheduling (every 5 min)             │  │
│  │ • Session auto-close (every 10 sec)                      │  │
│  │ • Shopify order reminders, Decorpot lead follow-ups      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ queue-consumer-service (NestJS) - Port 3000              │  │
│  │ • Text-to-video generation (RabbitMQ: ttv)               │  │
│  │ • Marketing insights (RabbitMQ: worker_queue)            │  │
│  │ • Instagram/Facebook historical sync                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Data & Infrastructure Layer                  │
│  • MongoDB 6.0+ (40+ collections, multi-tenant)                 │
│  • RabbitMQ (async job queues)                                  │
│  • Redis (optional caching)                                     │
│  • AWS S3 (file storage: videos, images, docs, audio)          │
│  • Vector DBs: FAISS, ChromaDB (knowledge bases)               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    External Service Integrations                 │
│  • Azure OpenAI, AWS Bedrock (LLMs, embeddings)                │
│  • ElevenLabs (Voice AI), Twilio (Telephony)                   │
│  • Meta APIs (WhatsApp, Facebook, Instagram)                    │
│  • Shopify, Decorpot CRM, Aroflo (Business systems)            │
│  • Razorpay (Payments), NewsAPI, SerpAPI, Bright Data          │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Microservices Overview

| Service | Technology | Port | Primary Responsibility |
|---------|-----------|------|------------------------|
| **BW_FE_Application** | React/TypeScript | N/A | Web dashboard, widget embedding |
| **BW_ConsumerService** | NestJS 10 | 3001 | API gateway, orchestration hub |
| **BW_BotCoreFunctionalityService** | Python Flask 3 | 5000 | AI engine, RAG, agents |
| **BW_VOICE** | NestJS 11 (Fastify) | 8001 | Voice agent management |
| **cron_Service** | NestJS 10 | 3000 | Scheduled task automation |
| **queue-consumer-service** | NestJS | 3000 | Async background jobs |

### 2.3 Data Flow Patterns

#### 2.3.1 Text Conversation Flow
```
User (WhatsApp/Web/Social)
  → Meta API / WebSocket
  → BW_ConsumerService (session management)
  → BW_BotCoreFunctionalityService (AI response)
  → BW_ConsumerService (message formatting)
  → Meta API / WebSocket
  → User
```

#### 2.3.2 Voice Conversation Flow
```
User (Phone)
  → Twilio → ElevenLabs
  → BW_VOICE (conversation initialization)
  → ElevenLabs (STT → LLM → TTS)
  → Twilio → User
  → ElevenLabs Webhook → BW_VOICE (conversation analytics)
```

#### 2.3.3 Campaign Execution Flow
```
User (Schedule Campaign)
  → BW_ConsumerService (campaign creation)
  → MongoDB (campaign storage)
  → cron_Service (scheduled execution, every minute)
  → BW_ConsumerService (template fetch)
  → Meta WhatsApp API (bulk sending)
```

#### 2.3.4 Asynchronous Job Flow
```
User (Request Text-to-Video)
  → BW_ConsumerService (enqueue job)
  → RabbitMQ (ttv queue)
  → queue-consumer-service (AI processing)
  → External AI Service → S3 Upload
  → MongoDB (update status)
  → User notification
```

---

## 3. Core Features

### 3.1 Bot Management

#### 3.1.1 Text Bot Configuration
**Owner:** BW_ConsumerService

**Capabilities:**
- Create, edit, delete bot profiles
- Configure bot identity, tone (friendly/professional/casual), color, greeting
- Set word limits, support contact info, appointment scheduler links
- LLM provider selection (OpenAI, Azure, Bedrock)
- Conversational guidelines and agent goals
- Enable/disable bot smartness (contextual awareness)

**API Endpoints:**
- `POST /bot/createBotProfile` - Create bot with initial KB
- `PUT /bot/editBotProfile/:botId` - Update configuration
- `GET /bot/getBotProfile/:botId` - Retrieve details
- `GET /bot/getAllBots` - List all bots for user
- `PUT /bot/deleteBotProfile` - Soft delete

**Bot Configuration Schema:**
```typescript
BotProfile {
  botName: string
  botTone: 'friendly' | 'professional' | 'casual'
  botColor: string (hex)
  botURL: string
  botGreetingMessage: string
  botSmartness: boolean
  botIdentity: string
  supportNumber: string
  supportEmail: string
  wordLimitPerMessage: number
  status: 'ACTIVE' | 'INACTIVE'
  knowledgeBaseIds: ObjectId[]
  llmProvider: 'openai' | 'azure' | 'bedrock'
  agentsGoals: string[]
  conversationGuidelines: string[]
  agentRole: string
  appointmentSchedulerLink: string
}
```

#### 3.1.2 Voice Agent Configuration
**Owner:** BW_VOICE

**Capabilities:**
- Create, edit, delete voice agents
- Configure STT, LLM, TTS providers and models
- Set voice style, stability, clarity, speed
- Define system prompts, behavioral guidelines, greeting
- Configure pause handling, max call duration, end call phrases
- Enable call recording, interruption, sentiment analysis
- Custom function integration (webhooks)

**API Endpoints:**
- `POST /voice-agents` - Create voice agent
- `PATCH /voice-agents/:mongoId` - Update agent
- `GET /voice-agents` - List agents
- `DELETE /voice-agents/:id` - Delete agent
- `GET /voice-agents/voices` - List ElevenLabs voices

**Voice Agent Schema:**
```typescript
VoiceAgent {
  name: string
  agentType: 'ELEVEN_LABS' | 'CUSTOM'
  agentId: string (ElevenLabs ID)
  status: 'ACTIVE' | 'INACTIVE'
  languages: string[]
  sttConfig: { provider, model, language }
  llmConfig: { provider, model, temperature, maxTokens }
  ttsConfig: { provider, voice, voiceStyle, stability, clarity, speed }
  knowledgeBaseIds: string[]
  promptConfig: { systemPrompt, behavioralPrompt, greeting, fallbackMessage }
  pauseHandling: boolean
  maxCallDuration: number
  enableCallRecording: boolean
  enableSentimentAnalysis: boolean
  customFunctions: [{ name, description, endpoint }]
}
```

### 3.2 Knowledge Base Management

#### 3.2.1 Text Bot Knowledge Bases
**Owner:** BW_ConsumerService + BW_BotCoreFunctionalityService

**Supported Formats:**
- PDF (PyPDF2 extraction)
- DOCX (docx2txt)
- TXT (plain text)
- CSV, XLSX (pandas parsing)

**Processing Pipeline:**
1. Upload file to `/user/documents/upload` (BW_ConsumerService)
2. Forward to BW_BotCoreFunctionalityService `/upload`
3. Text extraction based on format
4. Chunking (1000 chars, 200 overlap)
5. Embedding generation (OpenAI text-embedding-ada-002)
6. Vector store (FAISS or ChromaDB)
7. S3 backup (`knowladgebase` bucket)

**API Endpoints:**
- `POST /user/documents/upload` - Upload KB file
- `GET /user/knowledgeBase` - List KBs
- `POST /bot/botProfile/:botId/appendKb` - Attach KB to bot
- `PATCH /bot/:botId/detachKB/:kbId` - Detach KB
- `DELETE /bot/:botId/deleteKB/:kbId` - Delete KB

**Query & Answer:**
- `POST /query` (BotCore) - Retrieve top-K relevant documents
- `POST /generate-answer` (BotCore) - RAG-powered answer generation with chat history

#### 3.2.2 Voice Agent Knowledge Bases
**Owner:** BW_VOICE

**Supported Formats:**
- PDF, DOCX, TXT, CSV, JSON, HTML, Markdown
- URL upload (ElevenLabs fetches content)

**Processing:**
1. Upload to ElevenLabs API (primary storage)
2. Backup to S3: `Voice_KBS/userid_{userId}/kb_{kbId}/{filename}`
3. SHA256 checksum generation
4. MongoDB metadata storage

**API Endpoints:**
- `POST /knowledge-bases` - Upload file or URL
- `GET /knowledge-bases` - List KBs with pagination
- `GET /knowledge-bases/search` - Search KB content
- `DELETE /knowledge-bases/:id` - Delete KB

### 3.3 Multi-Agent System (AI Specialization)

**Owner:** BW_BotCoreFunctionalityService

The platform includes industry-specific AI agents built with LangGraph:

#### 3.3.1 Travent Agent (Hotel Booking)
**Purpose:** Assist users with hotel search and booking in UAE

**Tools:**
- `hotels_finder` - Search hotels by location IDs (11 UAE locations)
- `hotel_availability_check` - Check availability by date range
- `prebook_tool` - Generate booking confirmation links

**Business Rules:**
- Date validation and automatic format conversion
- Location ID mapping for UAE cities
- Structured response formatting

#### 3.3.2 Shopify Agent (E-commerce)
**Purpose:** Handle product queries, order tracking, customer service

**Tools:**
- `all_products` - List products (up to 250, paginated)
- `product_details` - Get product info by ID
- `get_order_details` - Track order by name (e.g., NK/12345)
- `user_authentication` - Verify customer by email/phone
- `cancel_order` - Cancel pending orders
- `update_address` - Update delivery address

**Features:**
- Multi-language support (Hindi, Marathi, Gujarati)
- Rate limiting (1-second delay between requests)
- Response formatting (clean text output)

#### 3.3.3 Decorpot Agent (Interior Design CRM)
**Purpose:** Qualify leads and manage interior design project pipeline

**Tools:**
- `basic_query_decorpot` - Answer general design questions
- `get_lead` - Retrieve lead by phone number
- `update_lead` - Update project details and status

**Qualification Criteria:**
- Minimum budget: ₹3 lakhs (₹300,000)
- Scope: Must include full home or kitchen+bedroom (no standalone decor/civil)
- Timeline: Project start within 3 months

**Lead Lifecycle:**
```
UNREAL (initial inquiry) → REAL (qualified) → HOLD (paused)
```

**Agent Routing:**
- `POST /qna` - Legacy UUID-based routing
- `POST /qnaV1` - Agent ID-based routing
- `POST /qnaV2` - Multi-UUID smart routing (relevance scoring)

### 3.4 Multi-Channel Communication

#### 3.4.1 WhatsApp Integration
**Owner:** BW_ConsumerService

**Setup:**
- `POST /whatsapp/save` - Connect WhatsApp Business Account (Meta Graph API v21.0)
- Configure phone number ID, access token, business account ID
- Set AI enabled, manual mode whitelist, blocked users

**Messaging:**
- Text, image, video, audio, document messages
- Template messages (pre-approved by Meta)
- Interactive messages (buttons, lists, quick replies)
- Reactions

**Endpoints:**
- `POST /whatsapp/sendMessage` - Send text
- `POST /whatsapp/sendMedia` - Send media
- `POST /whatsapp/sendTemplate` - Send template
- `POST /whatsapp/markAsRead` - Mark as read

**Templates:**
- `GET /whatsapp/template` - List templates
- `POST /whatsapp/template` - Create & submit for approval
- `POST /whatsapp/template/sync` - Sync approved templates

**Campaigns:**
- `POST /whatsapp/campaign` - Create bulk campaign
- Multi-step workflows (abandoned cart, order confirmation, lead nurturing)
- Scheduled execution (cron_Service every minute)
- Batch processing (50 contacts per run)
- Retry logic (max 3 retries, 12-hour wait)

**Conversations & Sessions:**
- `GET /whatsapp/conversations` - List conversations with filters
- `GET /whatsapp/chats/:phoneNumber` - Chat history
- `GET /whatsapp/sessions` - Active/closed sessions
- Auto-close after 15 minutes inactivity (cron_Service)

#### 3.4.2 Facebook Integration
**Owner:** BW_ConsumerService + cron_Service

**Setup:**
- `POST /facebook/save` - Connect Facebook Page (Graph API v19.0)

**Post Management:**
- `POST /facebook/post` - Create post (text, image, video, carousel)
- `POST /facebook/schedule` - Schedule post
- Scheduled publishing (cron_Service every 5 minutes)

**Engagement:**
- DM inbox management
- Comment auto-replies (AI-powered or custom)
- Sentiment analysis on comments (cron_Service every 10 min)

**Sync Jobs (cron_Service):**
- Post sync (every 6 hours)
- Follower metrics (daily at 11 PM)
- Session auto-close (every 5 minutes)
- Inactivity warnings (every 2 minutes)

#### 3.4.3 Instagram Integration
**Owner:** BW_ConsumerService + cron_Service + queue-consumer-service

**Setup:**
- `POST /instagram/save` - Connect Instagram Business Account (Graph API v19.0)

**Post Management:**
- `POST /instagram/post` - Create post (single image/video)
- `POST /instagram/schedule` - Schedule post
- Publishing: Create media container → Publish (cron_Service every 5 min)

**Engagement:**
- Comment engagement (AI/manual/custom message)
- DM engagement (AI/manual/custom message)
- Engagement mode configuration

**Historical Sync:**
- Triggered via RabbitMQ (`instagram_historical_sync` queue)
- Fetches all posts with comments, likes
- Downloads media to S3: `instagram/{integrationId}/{postId}/{filename}`
- Creates engagement logs (TTL: 60 days)

**Sync Jobs (cron_Service):**
- Similar to Facebook (post sync, follower metrics, session auto-close, warnings)

#### 3.4.4 Website Chat Widget
**Owner:** BW_ConsumerService

**Features:**
- Embeddable JavaScript widget
- Customizable appearance (color, font, theme)
- Real-time WebSocket communication (Socket.io)
- Session management
- Agent handover support
- Analytics tracking

**Endpoints:**
- `POST /bot/widget/export` - Generate widget code
- `POST /bot/widget/track` - Track usage

**Session Management:**
- Auto-close after 15 minutes inactivity (cron_Service every 10 seconds)
- Synthetic feedback generation (`resolveQuery: true, satisfaction: 'Good'`) - Note: Creates fake metrics

### 3.5 Voice Communication (Telephony)

**Owner:** BW_VOICE

#### 3.5.1 Phone Number Registration
- `POST /twilio` - Register phone number with Twilio SID and auth token
- ElevenLabs phone creation
- Store mapping in MongoDB

**Providers:**
- Twilio (primary)
- Knowlarity (legacy)

#### 3.5.2 Inbound Calls
- Call routing to assigned voice agent
- Real-time STT → LLM → TTS processing via ElevenLabs
- Conversation recording (if enabled)

#### 3.5.3 Outbound Calls
- `POST /twilio/outbound-call` - Initiate call
- Use cases: Sales outreach, appointment reminders, surveys

#### 3.5.4 Conversation Analytics
**Webhook Processing:**
- ElevenLabs sends conversation data on completion
- Signature verification (HMAC SHA-256)
- Store transcript, audio URL, duration, success status

**AI Analysis (Azure OpenAI GPT-4o-mini):**
- Call summary (<100 words)
- Intent classification (top 3 with scores)
- Sales intelligence (lead interest, purchase intent, vulnerabilities, next actions)
- CSAT score (1-10)
- Sentiment (Positive/Neutral/Negative)
- Tone and speech insights (talk time, interruptions, pauses)
- Escalation detection

**Endpoints:**
- `POST /conversations/init` - Initialize conversation
- `POST /conversations/get` - Retrieve conversation by ID or agent
- `POST /webhook/elevenlabs` - Webhook receiver

### 3.6 Conversation Intelligence & Analytics

**Owner:** BW_BotCoreFunctionalityService

All analysis powered by Azure OpenAI GPT-4o-mini (JSON mode):

#### 3.6.1 Sentiment Analysis
- `POST /sentiment-analysis` - Distribution of positive/negative/neutral percentages
- Use case: Customer experience monitoring

#### 3.6.2 Emotion Detection
- `POST /emotion-analysis` - Dominant emotion (joy, sadness, anger, fear, surprise, disgust, normal)
- Use case: Escalation triggers

#### 3.6.3 Intent Classification
- `POST /intent` - Categories: Complaint, Feedback, Inquiry, Sales_Lead, Other
- Output: Primary intent with confidence score
- Use case: Conversation routing, prioritization

#### 3.6.4 Reason Extraction
- `POST /reason-analysis` - Core issue in <20 words
- Use case: Ticket summarization

#### 3.6.5 Sales Intelligence
- `POST /sales-intelligence` - Lead interest level, purchase intent signals, objections, next actions
- Use case: CRM enrichment, lead scoring

#### 3.6.6 Vulnerability Analysis
- `POST /vulnerability-analysis` - Identify potential complaints, dissatisfaction signals
- Use case: Proactive support, churn prevention

#### 3.6.7 Session Summarization
- `POST /session-summary` - Concise summary (<50 words)
- `POST /session-cause` - Primary cause (<20 words)
- `POST /session-suport-step` - 3 bullet point action items

#### 3.6.8 Smart Suggestions
- `POST /smart-suggestions` - AI-powered next-step recommendations for agents

#### 3.6.9 Auto-Response Scoring
- `POST /auto_response` - Quality score (1-10) + improvement suggestions
- Use case: Bot training, quality monitoring

### 3.7 Marketing & Campaign Management

#### 3.7.1 WhatsApp Campaigns
**Owner:** cron_Service + BW_ConsumerService

**Features:**
- Bulk messaging with approved templates
- Multi-step workflows (trigger-based, time-delayed)
- Contact list management (CSV upload to S3)
- Metrics tracking (sent, delivered, read, failed)

**Workflow Definition:**
```typescript
{
  maxFollowUps: number
  steps: [{
    name: string
    on: 'sent' | 'delivered' | 'read' | 'failed'
    waitMs: number
    templateId: ObjectId
    terminal: boolean
  }]
}
```

**Execution:**
- cron_Service runs every minute
- Processes 50 contacts per batch
- Retry failed messages (max 3 times, 12-hour intervals)

**Use Cases:**
- Abandoned cart recovery
- Order confirmation sequences
- Lead nurturing campaigns
- Customer feedback collection

#### 3.7.2 Social Media Scheduling
**Owner:** cron_Service

**Facebook & Instagram:**
- Schedule posts for future publication
- cron_Service publishes every 5 minutes
- Support for text, image, video, carousel posts

**Endpoints:**
- `POST /facebook/schedule` - Schedule Facebook post
- `POST /instagram/schedule` - Schedule Instagram post

#### 3.7.3 Marketing Intelligence
**Owner:** queue-consumer-service

**Data Sources:**
- NewsAPI (news articles)
- SerpAPI (Google Trends)
- Bright Data (social media scraping: Instagram, Twitter, LinkedIn)

**Analysis Pipeline (5 Steps):**
1. **News Fetching:** Fetch + summarize articles (OpenAI GPT-4o-mini)
2. **Trends Analysis:** Extract Google Trends data (interest over time)
3. **Geographical Activity:** Regional interest breakdown
4. **Social Media Scraping:** Follower counts, top posts, engagement metrics for company + competitors
5. **Insights & Actions Generation:** AI-powered competitive analysis

**Output:**
```typescript
{
  insights: [{ insight, gap, metrics, platform, gapPercentage }]
  actions: [{ action, steps, priority, expected_impact, timeline }]
  newsArticles: [...]
  trendsData: { interestOverTime }
  geographicalActivity: { interestByRegion }
  followerData: { company, competitors }
  brand_engagement_metrics: { totalEngagements, avgEngagement, engagementRate }
}
```

**Trigger:** Enqueued by BW_ConsumerService to RabbitMQ (`worker_queue`)

#### 3.7.4 Content Optimization
**Owner:** BW_BotCoreFunctionalityService

- `POST /optimize_post_content` - AI-optimized social media post with hashtags, tone adjustments
- `POST /get_audience_insight_score` - Audience demographics, interests, engagement patterns
- `POST /get_trends` - Industry trends, competitor activity

### 3.8 CRM & Business Integrations

#### 3.8.1 Decorpot (Interior Design CRM)
**Owner:** BW_ConsumerService + cron_Service

**Features:**
- Lead management (get, update, delete)
- Lead qualification (Unreal → Real → Hold)
- Campaign tracking (follow-up status, attempts)
- Automated follow-ups (cron_Service every 10 min)

**API Endpoints:**
- `GET /integration/decorpot/leads/:phoneNumber` - Get lead
- `PUT /integration/decorpot/leads/:leadId/status` - Update status
- `POST /integration/decorpot/leads/:leadId/interaction` - Log interaction
- `GET /integration/decorpot/leads/:leadId/history` - Lead history

**Follow-Up Automation:**
- Triggered for leads with `automationLead=true`, `followUpStatus` in ['Not Started', 'Day 1', 'Day 2', 'Day 3', 'Day 4']
- cron_Service batches 10 leads at a time
- POST to BW_ConsumerService `/integration/decorpot/follow-up`

**Lead Schema:**
```typescript
DecorpotLead {
  fullName, phoneNumber, email, location
  projectNeeds, projectNeedsType, threeLakhsSuits, startProjectBy
  leadType: 'Unreal' | 'Real' | 'Hold'
  automationLead: boolean
  campaignStatus, followUpStatus, followUpDay
  nextFollowupDate, campaignHistory
  rejectionReason, tags, metadata
}
```

#### 3.8.2 Shopify Integration
**Owner:** BW_ConsumerService + cron_Service

**Features:**
- Store connection
- Order tracking and management
- Order confirmation reminders (COD orders)
- Abandoned cart recovery
- Shipment notifications

**Order Reminder Flow (cron_Service every 10 minutes):**
1. Find draft COD orders not confirmed
2. Check Shopify API for fulfillment/cancellation status
3. Send reminders via WhatsApp (1st at 1 hour, 2nd at 6 hours)
4. Tag orders in Shopify (`first_reminder`, `second_reminder`)

**API Endpoints:**
- `POST /shopify/save` - Connect store
- `GET /shopify/orders` - List orders
- `POST /shopify/webhook` - Order webhooks (created, updated, fulfilled)

#### 3.8.3 Aroflo Integration
**Owner:** BW_ConsumerService

- `POST /integration/aroflo/sync` - Sync Aroflo data
- `GET /integration/aroflo/jobs` - Get jobs

### 3.9 AI Media Generation

#### 3.9.1 Text-to-Video
**Owner:** queue-consumer-service

**Process:**
1. User submits prompt + duration
2. BW_ConsumerService enqueues job to RabbitMQ (`ttv` queue)
3. queue-consumer-service processes:
   - POST to external AI service (configured via environment variable)
   - Poll for completion (every 20 seconds, max 20 minutes)
   - Download video
   - Upload to S3: `videos/{orgId}/{videoId}.mp4`
4. Update MongoDB: `status='completed'`, `videoUrl=<s3_url>`

**Timeframe:** 2-20 minutes per video

#### 3.9.2 Text-to-Image
**Owner:** BW_ConsumerService

- `POST /media-generation/text-to-image` - Generate image
- Similar workflow to text-to-video

#### 3.9.3 Prompt Enhancement
- `POST /media-generation/prompt/enhance` - Improve user prompt using LLM

### 3.10 Dashboard & Reporting

**Owner:** BW_ConsumerService + BW_VOICE

#### 3.10.1 Widget Management
- `POST /dashboard/createWidgets` - Define widget types
- `GET /dashboard/userWidgets` - User's dashboard configuration
- `POST /dashboard/analytics` - Get analytics data for widget

**Widget Types:**
- Conversation volume (line chart)
- Session resolution rate (pie chart)
- Average response time (gauge)
- Top intents (bar chart)
- Sentiment distribution (donut chart)
- Channel breakdown (stacked bar)

#### 3.10.2 Analytics Endpoints
- `POST /user/analytics/export` - Export report (Excel/CSV/PDF)
- `POST /marketing/whatsapp/dashboard` - Campaign metrics
- `POST /marketing/insights` - Marketing intelligence

**Dashboard Metrics:**
- Total conversations, active sessions, resolution rate
- Average satisfaction score, response time percentiles (p50, p90, p95)
- Channel distribution, bot vs agent handling ratio

#### 3.10.3 Voice Dashboard
**Owner:** BW_VOICE

- `GET /dashboard/conversations` - Conversation summaries with filters
- `GET /dashboard/conversations/call-volume` - Call volume metrics
- `GET /dashboard/conversations/engagement` - Engagement curve
- `GET /dashboard/conversations/:conversationId` - Full conversation details

**Metrics:**
- Total calls, successful calls, average duration, connect rate
- CSAT distribution, sentiment trends

### 3.11 User & Organization Management

**Owner:** BW_ConsumerService

#### 3.11.1 Multi-Tenancy
**Organization Schema:**
```typescript
Organization {
  name, admin_email, status
  voiceAgentLimit, currentlyUsedVoiceAgent
  voiceAgentKnowledgeBaseLimit, currentlyUsedVoiceAgentKnowledgeBase
  botCount, userLimit, knowledgeBaseCount
  subscriptionTier: 'BASE' | 'PRO' | 'ENTERPRISE'
}
```

#### 3.11.2 Role-Based Access Control
**Roles:**
- SUPERADMIN: Full access
- AGENT: Conversations and tasks
- MANAGER: Analytics, reports, user management
- CUSTOM: Custom permissions

**Module Access Mapping:**
```typescript
Modules:
1: User Management
2: Bot Configuration
2.1: Knowledge Base, 2.2: Widget Export, 2.3: Bot Customization
3: System Settings
4: Conversations
5: Analytics (5.1: Dashboard, 5.2: Reports, 5.3: Insights, 5.4: Export)
6: Payments (6.1: Subscription, 6.2: Billing)
7: WhatsApp Integration
8: Social Media (8.1: Facebook, 8.2: Instagram)
9: Marketing Campaigns
10: Engagement & Tasks
11: Live Chat
12: CRM Integrations
13: Media Generation (13.1: Text-to-Video)
```

#### 3.11.3 User Management
- `POST /user/signup` - Register with email + OTP
- `POST /user/login` - Login with JWT
- `GET /user/profile/:userId` - Get profile
- `PUT /user/update` - Update profile

**User Schema:**
```typescript
User {
  firstName, lastName, emailId, mobileNo
  password (bcrypt hashed), status, otp, otpVerified
  promptCount, totalPromptCount (API usage credits)
  knowledgeBaseUploadCount, botProfileCount
  orgID, roleId, deleted
}
```

### 3.12 Payments & Subscriptions

**Owner:** BW_ConsumerService

**Payment Gateway:** Razorpay

**Plan Tiers:**
```
BASE: $99/month
  - 1000 sessions, 5 users, 3 bots, 10 KBs

PRO: $299/month
  - 5000 sessions, 20 users, 10 bots, 50 KBs
  - Advanced analytics

ENTERPRISE: Custom pricing
  - Unlimited sessions, users, bots, KBs
  - Dedicated support, custom integrations
```

**API Endpoints:**
- `POST /payment/create` - Create payment order
- `POST /payment/capture/:id` - Capture payment
- `POST /payment/plan` - Create subscription plan (admin)
- `POST /payment/subscription/:planId` - Subscribe to plan

**Webhook:** Razorpay sends payment status updates (signature verification required)

---

## 4. Technical Specifications

### 4.1 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React, TypeScript | Latest | Web dashboard, widgets |
| **Backend** | NestJS | 10-11 | API gateway, services |
| **Backend** | Python Flask | 3.x | AI engine |
| **Database** | MongoDB | 6.0+ | Primary data store |
| **Message Queue** | RabbitMQ | 3.12+ | Async jobs |
| **Cache** | Redis | 7.x | Optional caching |
| **Real-Time** | Socket.io | 4.7.5 | WebSocket |
| **AI/ML** | Azure OpenAI | Latest | LLMs, embeddings |
| **AI/ML** | AWS Bedrock | Latest | Alternative LLM |
| **AI/ML** | OpenAI API | 4.x | STT, TTS, vision |
| **AI/ML** | ElevenLabs | 2.5.0 | Voice AI |
| **Vector DB** | FAISS, ChromaDB | Latest | Embeddings |
| **Cloud Storage** | AWS S3 | Latest | Files, media |
| **Orchestration** | LangChain, LangGraph | 0.3.x, 0.2.x | Agent framework |
| **Payments** | Razorpay | 2.9.4 | Payment processing |

### 4.2 External Service Integrations

#### 4.2.1 AI & ML Providers
| Service | Purpose | Authentication | Models |
|---------|---------|----------------|--------|
| Azure OpenAI | Chat, embeddings, analysis | API Key | gpt-4o, gpt-4o-mini, text-embedding-ada-002 |
| OpenAI | Audio (STT/TTS), vision | API Key | whisper-1, tts-1, gpt-4o |
| AWS Bedrock | Alternative LLM | AWS SDK | claude-3-sonnet |
| ElevenLabs | Voice AI (STT, LLM, TTS) | API Key | Conversational AI API |

#### 4.2.2 Communication Platforms
| Platform | API Version | Purpose | Rate Limits |
|----------|-------------|---------|-------------|
| WhatsApp Business API | v21.0 | Messaging, templates | 200 messages/day per phone |
| Facebook Graph API | v19.0 | Posts, comments, reactions | 200 calls/hour |
| Instagram Graph API | v19.0 | Posts, comments, DMs | 200 calls/hour |
| Twilio | Latest | Telephony | N/A |

#### 4.2.3 Business Systems
| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| Shopify | E-commerce operations | OAuth, Webhooks |
| Decorpot CRM | Interior design leads | Custom REST API |
| Aroflo | Job management | REST API |
| Razorpay | Payment processing | API, Webhooks |

#### 4.2.4 Data Providers
| Service | Purpose | API Key Required |
|---------|---------|-----------------|
| NewsAPI | News articles | Yes (hardcoded - security risk) |
| SerpAPI | Google Trends data | Yes (hardcoded - security risk) |
| Bright Data | Social media scraping | Yes (hardcoded - security risk) |

### 4.3 Database Architecture

**MongoDB Collections (40+ schemas):**

#### User & Organization
- `users`, `organizations`, `roles`, `modulemaps`

#### Bot & Knowledge Base
- `botprofiles`, `customerknowledgebases`, `botchatanalyses`

#### Voice
- `voiceagents`, `voiceknowledgebases`, `conversations_voice`, `telephonies`

#### Sessions & Conversations
- `user_sessions`, `whatsapp_sessions`, `whatsapp_conversations`
- `facebook_sessions`, `facebook_conversations`
- `instagram_sessions`, `instagram_conversations`

#### Integrations
- `integrations`, `whatsappintegrations`, `facebook_integrations`, `instagram_integrations`

#### Messaging & Campaigns
- `whatsapp_templates`, `whatsapp_campaigns`, `whatsapp_campaign_contacts`
- `whatsapp_user_profiles`, `user_medias`

#### Social Media
- `facebook_posts`, `instagram_posts`
- `facebook_post_schedules`, `instagram_post_schedules`
- `facebook_follower_logs`, `instagram_follower_logs`
- `facebook_postlike_log`, `instagram_postlike_log` (TTL: 60 days)

#### Marketing & Analytics
- `campaigns`, `conversation_analyses`, `marketing_insights`
- `engagement_task_managers`, `optimized_content_logs`, `engagement_reach_logs`
- `dashboard_widgets`, `userdashboardwidgets`

#### Payments
- `payments`, `plans`, `subscriptions`

#### CRM
- `decorpot_leads`, `decorpot_templates`, `loan_recovery_users`

#### E-commerce
- `shopify_accounts`, `shopify_orders`

#### Media Generation
- `text_to_videos`, `text_to_images`, `ocr_results`

#### Workflows
- `workflows`, `workflowsteps`

### 4.4 Vector Storage

**FAISS (Facebook AI Similarity Search):**
- Path: `embadings/{uuid}/`
- Files: `index.faiss`, `index.pkl`
- Embedding model: OpenAI text-embedding-ada-002

**ChromaDB:**
- Path: `chroma_db/chroma.sqlite3`
- Features: Collections, metadata filtering
- Preferred for new implementations

**S3 Backup:**
- Bucket: `knowladgebase` (text bots), `botwot-voice-knowledgebase` (voice agents)
- Purpose: Disaster recovery

### 4.5 Message Queue Architecture

**RabbitMQ Queues:**

| Queue Name | Purpose | Processing Time | Consumer |
|-----------|---------|-----------------|----------|
| `ttv` | Text-to-video generation | 2-20 minutes | queue-consumer-service |
| `worker_queue` | Marketing insights | 5-15 minutes | queue-consumer-service |
| `instagram_historical_sync` | Instagram post sync | 1-10 minutes | queue-consumer-service |
| `facebook_historical_sync` | Facebook post sync | 1-10 minutes | queue-consumer-service |

**Configuration:**
- Connection: `amqp://localhost:5672` (default)
- Prefetch: 1 message at a time
- Durable queues: Yes
- Manual acknowledgment: Yes

### 4.6 Cloud Storage (AWS S3)

**Buckets:**
- `messages-dump` - General file uploads
- `botwot-user-data-info` - Videos, audio files, social media images
- `knowladgebase` - Text bot knowledge bases
- `botwot-voice-knowledgebase` - Voice agent knowledge bases
- `botwot-voice-audiourl` - Voice conversation audio

**Path Structures:**
- Videos: `videos/{orgId}/{videoId}.mp4`
- Instagram: `instagram/{integrationId}/{postId}/{filename}`
- Facebook: `facebook/{integrationId}/{postId}/{filename}`
- Voice KBs: `Voice_KBS/userid_{userId}/kb_{kbId}/{filename}`

### 4.7 Authentication & Security

#### 4.7.1 JWT Authentication
**Strategy:** JWT with Bearer tokens

**Token Payload:**
```typescript
{
  userId: string
  emailId: string
  orgId: string
  roleId: string
}
```

**Configuration:**
- Secret: `JWT_SECRET_KEY` (environment variable)
- Algorithm: HS256
- Expiration: 60 minutes

**Guards:**
- All API endpoints (except webhooks) require JWT
- `@UseGuards(JwtAuthGuard)`

#### 4.7.2 Webhook Security
**WhatsApp/Facebook/Instagram:**
- Verification token check (GET request)
- Signature validation (POST request)

**Razorpay:**
- HMAC SHA-256 signature verification
- Raw body capture required

**ElevenLabs:**
- HMAC SHA-256 signature verification
- Header: `elevenlabs-signature`

#### 4.7.3 Organization Isolation
- All queries filtered by `userId` and `orgId`
- Prevents cross-org data access
- Row-level security via MongoDB queries

---

## 5. Critical Security Issues & Recommendations

### 5.1 Current Security Issues (HIGH PRIORITY)

#### 5.1.1 Hardcoded API Keys
**Location:** Source code files (multiple services)

**Issue:** API keys are hardcoded directly in source code instead of using environment variables or secure secrets management.

**Affected Services:**
- OpenAI API keys found in cron_Service and queue-consumer-service
- NewsAPI, SerpAPI, Bright Data API keys in queue-consumer-service
- Shopify tokens in BW_BotCoreFunctionalityService
- JWT tokens hardcoded in cron_Service (smart-analysis)

**Risk:** Complete API access compromise if source code is exposed

#### 5.1.2 Environment Variables in Repository
**File:** `.env` files committed to version control

**Issue:** Sensitive configuration files containing credentials are committed to Git repository.

**Exposed Information Types:**
- Database connection strings with credentials
- API keys and secrets
- JWT secret keys
- AWS access keys and secret keys
- Email account credentials
- Payment gateway keys (Razorpay)

**Risk:** Complete platform compromise if repository is accessed

#### 5.1.3 No API Rate Limiting
**Affected Services:** All services

**Risk:**
- API abuse
- DoS attacks
- Cost explosion (external API usage)

#### 5.1.4 CORS Too Permissive
**Configuration:** Allows all origins (development setup)

**Risk:** XSS attacks, CSRF

#### 5.1.5 No Authentication on Health Checks
**Endpoints:** `GET /` on all services

**Risk:** Information disclosure

### 5.2 Security Recommendations (IMMEDIATE ACTION REQUIRED)

#### 5.2.1 Secrets Management
1. **Migrate to AWS Secrets Manager or HashiCorp Vault**
   - All API keys
   - Database credentials
   - JWT secrets
   - Webhook secrets

2. **Remove .env from version control**
   - Add to .gitignore
   - Audit git history for exposed secrets
   - Rotate all compromised credentials

3. **Implement secret rotation**
   - Quarterly rotation for all keys
   - Automatic rotation for critical keys

#### 5.2.2 API Security
1. **Rate Limiting**
   - Implement per-user/org rate limits (e.g., 100 requests/minute)
   - Use Redis for distributed rate limiting
   - Add exponential backoff for failed requests

2. **CORS Configuration**
   - Whitelist specific domains in production
   - Use environment-specific CORS policies

3. **Input Validation**
   - Validate all user inputs
   - Sanitize file uploads (malware scanning)
   - Implement file size and type restrictions

#### 5.2.3 Network Security
1. **Private Network Deployment**
   - Deploy microservices in VPC
   - Use private network for inter-service communication
   - Firewall rules to restrict access

2. **TLS/SSL**
   - Enable TLS for all external communication
   - Use TLS for RabbitMQ connections
   - Use TLS for MongoDB connections

#### 5.2.4 Audit & Monitoring
1. **Audit Logging**
   - Log all API key usage
   - Log all user actions (create, update, delete)
   - Implement correlation IDs for request tracing

2. **Alerting**
   - Alert on authentication failures
   - Alert on unusual API usage patterns
   - Alert on secret access patterns

---

## 6. Performance & Scalability

### 6.1 Performance Characteristics

| Service | Average Response Time | Bottleneck |
|---------|----------------------|------------|
| BW_ConsumerService | 100-500ms | LLM calls (2-10s when used) |
| BW_BotCoreFunctionalityService | 2-5s | LLM processing |
| BW_VOICE | 100-300ms | ElevenLabs API (500-2000ms) |
| cron_Service | N/A | External API rate limits |
| queue-consumer-service | 2-20 minutes | External AI services |

### 6.2 Scalability Considerations

#### 6.2.1 Horizontal Scaling
**Stateless Services:**
- BW_ConsumerService (except WebSocket with session affinity)
- BW_BotCoreFunctionalityService (stateless)
- BW_VOICE (stateless)
- queue-consumer-service (worker pool)

**Challenges:**
- cron_Service: Risk of duplicate executions (need distributed locking)
- WebSocket: Requires session affinity in load balancer

**Recommendations:**
1. Deploy multiple instances behind load balancer
2. Use Redis for distributed locking (cron_Service)
3. Use Redis for session state (WebSocket)
4. Implement sticky sessions for WebSocket connections

#### 6.2.2 Database Optimization
**Indexes (Performance-Critical):**
- `users`: emailId (unique), orgId, roleId
- `botprofiles`: userId+orgId, status
- `whatsapp_conversations`: integrationId+createdAt, campaignId
- `whatsapp_sessions`: userPhoneNumber, sessionState, lastUserInteractionTime
- `decorpot_leads`: phoneNumber (unique), leadType+campaignStatus
- `voiceagents`: userId+orgId, status, agentId (unique)

**Recommendations:**
1. Connection pooling (default: 100 connections)
2. Read replicas for analytics queries
3. Data archival strategy (move old conversations to cold storage)

#### 6.2.3 Caching Strategy
**Recommended Caching:**
- Organization configurations (Redis, TTL: 1 hour)
- Bot profiles (Redis, TTL: 30 minutes)
- Voice list (Redis, TTL: 24 hours)
- LLM responses for common queries (Redis, TTL: 1 hour)
- Vector search results (Redis, TTL: 5 minutes)

**Not Implemented Yet**

#### 6.2.4 Queue Configuration
**Current:**
- Prefetch: 1 (ensures even distribution)
- Durable queues: Yes
- Manual acknowledgment: Yes

**Missing:**
- Dead Letter Queue (DLQ) for permanently failed messages
- Message TTL (messages live forever if not consumed)
- Priority queues

**Recommendations:**
1. Implement DLQ with max retry count (3 retries)
2. Set message TTL (24 hours)
3. Implement priority queues for urgent jobs

### 6.3 Current Bottlenecks

1. **External AI Services:**
   - Text-to-video: 2-20 minutes
   - Bright Data scraping: up to 1 minute polling

2. **Meta API Rate Limits:**
   - WhatsApp: 200 messages/day per phone
   - Facebook/Instagram: 200 calls/hour

3. **cron_Service High Frequency:**
   - 10-second interval (session auto-close) is CPU-intensive

4. **Sequential Processing:**
   - queue-consumer-service prefetch=1 (one message at a time)
   - Good for even distribution, but limits throughput

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target | Current Status |
|--------|--------|---------------|
| API Response Time (p95) | <500ms | ✅ 100-500ms (without LLM) |
| API Response Time (p95, with LLM) | <5s | ⚠️ 2-10s (dependent on LLM) |
| WebSocket Latency | <100ms | ✅ <50ms |
| Campaign Execution | <5 minutes | ⚠️ Depends on batch size |
| Voice Call Latency (STT) | <1s | ⚠️ 500-2000ms (ElevenLabs) |
| Database Query Time | <100ms | ✅ <100ms (with indexes) |

### 7.2 Availability

| Component | Target | Current Status |
|-----------|--------|---------------|
| API Uptime | 99.9% | ❌ No SLA monitoring |
| Database Uptime | 99.9% | ✅ MongoDB Atlas (managed) |
| Message Queue Uptime | 99.5% | ⚠️ Single instance (no HA) |
| External API Dependency | 95% | ⚠️ No fallback for critical APIs |

**Recommendations:**
1. Implement health checks with dependency status
2. Deploy RabbitMQ in cluster mode (high availability)
3. Implement circuit breaker for external APIs
4. Add fallback mechanisms for LLM failures

### 7.3 Scalability

| Metric | Target | Current Capacity |
|--------|--------|-----------------|
| Concurrent Users | 10,000+ | ⚠️ Not tested |
| Messages/Day | 1,000,000+ | ⚠️ Limited by Meta rate limits |
| Conversations/Day | 100,000+ | ⚠️ Not tested |
| Storage Growth | 1TB/month | ✅ S3 scalable |

### 7.4 Security

| Requirement | Status |
|------------|--------|
| Data Encryption at Rest | ⚠️ S3 only (MongoDB not configured) |
| Data Encryption in Transit | ⚠️ HTTPS only, no TLS for internal services |
| Secret Management | ❌ Hardcoded keys (CRITICAL) |
| Audit Logging | ❌ Not implemented |
| Rate Limiting | ❌ Not implemented |
| GDPR Compliance | ❌ No DPO, no data deletion workflow |
| HIPAA Compliance | ❌ Not compliant (if handling healthcare data) |

### 7.5 Monitoring & Observability

**Current State:**
- **Logging:** Console logging, some Winston (file-based)
- **Metrics:** None (no Prometheus/Grafana)
- **Tracing:** None (no distributed tracing)
- **Alerting:** None (no PagerDuty/Opsgenie)

**Recommendations:**
1. **Logging:**
   - Centralized logging (ELK stack or CloudWatch)
   - Structured JSON logging
   - Correlation IDs for request tracing

2. **Metrics:**
   - Prometheus + Grafana
   - Application metrics (request count, latency, error rate)
   - Business metrics (conversations, campaigns, calls)
   - Infrastructure metrics (CPU, memory, disk)

3. **Tracing:**
   - OpenTelemetry or Jaeger
   - Trace inter-service communication

4. **Alerting:**
   - Error rate > 5% in 5 minutes
   - Response time > 10 seconds (p95)
   - External API failures
   - Queue depth > 1000 messages
   - Database connection failures

---

## 8. Deployment & Operations

### 8.1 Deployment Architecture

**Recommended Production Setup:**

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer (AWS ALB)                 │
│              HTTPS → SSL Termination → Health Checks         │
└────────┬────────────────────────────────────────────────────┘
         │
         v
┌────────────────────────────────────────────────────────────┐
│                  Kubernetes Cluster (EKS)                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ BW_ConsumerService (3 replicas)                     │  │
│  │ CPU: 2 cores, Memory: 4GB                           │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ BW_BotCoreFunctionalityService (2 replicas)         │  │
│  │ CPU: 2 cores, Memory: 4GB                           │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ BW_VOICE (2 replicas)                               │  │
│  │ CPU: 2 cores, Memory: 2GB                           │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ cron_Service (1 replica with leader election)       │  │
│  │ CPU: 1 core, Memory: 1GB                            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ queue-consumer-service (5 replicas, worker pool)    │  │
│  │ CPU: 2 cores, Memory: 2GB                           │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Managed Services (AWS)                    │
│  • MongoDB Atlas (M30, 3-node replica set)                  │
│  • Amazon MQ (RabbitMQ, mq.m5.large)                        │
│  • ElastiCache (Redis, cache.m5.large)                      │
│  • S3 (versioning enabled, lifecycle policies)              │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Environment Variables (Consolidated)

**Required (All Services):**
```bash
# Server
NODE_ENV=production
PORT=<service_port>

# Database
DATABASE_URL=<mongodb_connection_string>

# Authentication
JWT_SECRET_KEY=<generate_secure_random_string>
API_KEY=<generate_secure_api_key>

# AWS
AWS_REGION=<aws_region>
AWS_ACCESS_KEY=<from_aws_iam>
AWS_SECRET_ACCESS_KEY=<from_aws_iam>

# Service URLs (Internal)
BOT_SERVICE_URL=http://bot-service:5000
BW_CONSUMER_SERVICE_URL=http://consumer-service:3001
```

**AI Services:**
```bash
# Azure OpenAI
AZURE_OPENAI_API_KEY=<from_azure_portal>
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com/
AZURE_OPENAI_API_VERSION=2023-06-01-preview
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=gpt-4o-mini

# OpenAI
OPENAI_API_KEY=<from_openai_dashboard>

# AWS Bedrock (optional)
AWS_BEDROCK_REGION=<aws_region>

# ElevenLabs
ELEVEN_LABS_API_KEY=<from_elevenlabs_dashboard>
ELEVENLABS_WEBHOOK_SECRET=<generate_secure_random_string>
ELEVEN_LABS_EMAIL_ID=<your_email>

# LangChain (optional)
LANGCHAIN_API_KEY=<from_langchain_platform>
```

**External Services:**
```bash
# RabbitMQ
RABBITMQ_URL=amqp://<username>:<password>@rabbitmq:5672

# Redis (optional)
REDIS_URL=redis://<username>:<password>@redis:6379

# Payments
RAZORPAY_KEY_ID=<from_razorpay_dashboard>
RAZORPAY_SECRET_KEY=<from_razorpay_dashboard>
RAZORPAY_WEBHOOK_SECRET=<from_razorpay_dashboard>

# Email
OFFICIAL_EMAIL=<company_email>
PASSWORD=<email_password>
```

**Security Note:** Never commit these values to Git. Use environment-specific configuration or secrets management tools (AWS Secrets Manager, HashiCorp Vault, etc.).

### 8.3 Docker Deployment

**All services include:**
- `Dockerfile` (multi-stage build)
- `docker-compose.yml` (local development)

**Example (BW_ConsumerService):**
```yaml
version: '3.8'
services:
  consumer-service:
    build: .
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
    depends_on:
      - mongodb
      - rabbitmq
      - redis
    restart: always
```

### 8.4 Operational Procedures

#### 8.4.1 Startup Checklist
1. Verify environment variables
2. Check MongoDB connectivity
3. Check RabbitMQ connectivity (if used)
4. Check Redis connectivity (if used)
5. Test external API connectivity (Meta, OpenAI, ElevenLabs)
6. Start services in order:
   - Database + Message Queue + Cache
   - Backend services (BotCore, Voice, Consumer)
   - Cron + Queue Consumer
   - Frontend
7. Verify health checks

#### 8.4.2 Monitoring Commands
```bash
# RabbitMQ Management UI
http://localhost:15672

# Check queue depth
rabbitmqadmin list queues

# MongoDB connection status
mongosh --eval "db.runCommand({ ping: 1 })"

# Service logs (Docker)
docker logs -f <container_name>

# Service logs (Kubernetes)
kubectl logs -f <pod_name>
```

#### 8.4.3 Backup & Recovery

**MongoDB:**
- Daily backups with point-in-time recovery
- Retention: 30 days
- Test restore quarterly

**S3:**
- Versioning enabled
- Lifecycle policies (move to Glacier after 90 days)
- Cross-region replication (disaster recovery)

**Configuration:**
- Store in version control (Git)
- Secrets in AWS Secrets Manager (not version control)

**RabbitMQ:**
- Message persistence enabled
- Queue definitions backed up

---

## 9. Future Enhancements & Roadmap

### 9.1 Short-Term (Q1 2026)

#### 9.1.1 Security Hardening (HIGHEST PRIORITY)
- [ ] Migrate all secrets to AWS Secrets Manager
- [ ] Implement API rate limiting
- [ ] Add CORS whitelisting
- [ ] Implement audit logging
- [ ] Enable TLS for internal services

#### 9.1.2 Testing & Quality
- [ ] Unit test coverage >70%
- [ ] Integration tests for critical flows
- [ ] E2E tests for user journeys
- [ ] Load testing (10,000 concurrent users)

#### 9.1.3 Monitoring & Observability
- [ ] Centralized logging (ELK or CloudWatch)
- [ ] Metrics collection (Prometheus + Grafana)
- [ ] Distributed tracing (OpenTelemetry)
- [ ] Alerting (PagerDuty)

### 9.2 Mid-Term (Q2-Q3 2026)

#### 9.2.1 Platform Features
- [ ] Multi-language UI localization
- [ ] Advanced workflow builder (visual, no-code)
- [ ] Custom agent builder (no-code)
- [ ] A/B testing for bot responses
- [ ] Real-time streaming responses (SSE or WebSocket)

#### 9.2.2 Voice Features
- [ ] Multi-language voice agents
- [ ] Automatic language detection
- [ ] Live transcription during calls
- [ ] Real-time sentiment tracking
- [ ] Agent assist (live suggestions)

#### 9.2.3 Analytics Enhancements
- [ ] Predictive analytics (churn, conversion)
- [ ] Real-time dashboards (WebSocket updates)
- [ ] Custom report builder
- [ ] Conversation quality scoring
- [ ] Agent performance benchmarking

#### 9.2.4 Integration Expansion
- [ ] Zoom integration
- [ ] Google Meet integration
- [ ] Microsoft Teams integration
- [ ] Salesforce CRM
- [ ] HubSpot CRM
- [ ] Zapier integration

### 9.3 Long-Term (Q4 2026 - 2027)

#### 9.3.1 AI Enhancements
- [ ] Custom model training (fine-tuning)
- [ ] Few-shot learning
- [ ] Multi-modal inputs (image + text)
- [ ] Graph-based knowledge representation
- [ ] Hybrid search (semantic + keyword)

#### 9.3.2 Enterprise Features
- [ ] Single Sign-On (SSO) - SAML, OAuth
- [ ] Advanced RBAC with custom policies
- [ ] White-labeling support
- [ ] Multi-region deployment
- [ ] GDPR, HIPAA, SOC 2 compliance

#### 9.3.3 Developer Platform
- [ ] Public API with SDKs (Python, JavaScript, Go)
- [ ] OpenAPI/Swagger documentation
- [ ] Developer portal with sandbox
- [ ] Webhook builder
- [ ] Custom function marketplace

#### 9.3.4 Advanced Automation
- [ ] Visual workflow builder
- [ ] Conditional branching (decision trees)
- [ ] External webhook triggers
- [ ] Event-driven automation
- [ ] Scheduled workflows (cron-like)

---

## 10. Open Questions & Risks

### 10.1 Technical Questions

1. **Scaling:** How to handle 1M+ daily messages across all channels?
   - Current bottleneck: Meta API rate limits (200 messages/day per WhatsApp number)
   - Solution: Multiple phone number provisioning, message prioritization

2. **Cost Optimization:** External API costs increasing—need rate limiting?
   - Current spend: Not tracked (NewsAPI, SerpAPI, Bright Data, OpenAI, ElevenLabs)
   - Solution: Implement budget alerts, cost tracking per org

3. **Latency:** Can we achieve <1 second response time for simple queries?
   - Current: 2-5 seconds with LLM calls
   - Solution: Caching, faster models (GPT-4o-mini), edge deployment

4. **Multi-tenancy:** How to isolate vector stores per organization at scale?
   - Current: Single FAISS/ChromaDB instance
   - Solution: Per-org vector DBs, Pinecone/Weaviate (managed)

5. **Reliability:** What happens if cron service crashes mid-execution?
   - Current: No distributed locking, risk of duplicate execution
   - Solution: Redis-based distributed locks, leader election

### 10.2 Compliance & Legal

1. **GDPR Compliance:** No data deletion workflow, no DPO
   - Risk: EU customer data handling
   - Solution: Implement data deletion API, appoint DPO

2. **HIPAA Compliance:** If handling healthcare data
   - Risk: Sensitive medical information
   - Solution: BAA with vendors, encryption, access controls

3. **Data Residency:** Multi-region support for data sovereignty
   - Risk: EU, India, US data residency laws
   - Solution: Regional deployments (AWS EU, India regions)

### 10.3 Business Risks

1. **Vendor Lock-in:**
   - ElevenLabs (voice AI): No alternative provider
   - Meta APIs (WhatsApp, FB, IG): Platform risk
   - Solution: Multi-provider strategy, abstraction layer

2. **API Rate Limits:**
   - WhatsApp: 200 messages/day
   - Facebook/Instagram: 200 calls/hour
   - Solution: Enterprise API tiers, bulk API usage

3. **External Service Downtime:**
   - OpenAI, ElevenLabs, Meta APIs
   - Solution: Circuit breaker, fallback mechanisms, status page

### 10.4 Security Risks (CRITICAL)

1. **Exposed API Keys:** See Section 5.1
   - **Immediate Action Required:** Rotate all keys, migrate to secrets manager

2. **No Audit Trail:**
   - Risk: Cannot investigate security incidents
   - Solution: Implement comprehensive audit logging

3. **No Rate Limiting:**
   - Risk: API abuse, cost explosion
   - Solution: Implement per-user/org rate limits

---

## 11. Key Performance Indicators (KPIs)

### 11.1 Technical KPIs

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| API Uptime | 99.9% | Health check monitoring |
| Response Time (p95) | <500ms | Application metrics |
| Response Time with LLM (p95) | <5s | Application metrics |
| Error Rate | <1% | Application metrics |
| Database Query Time (p95) | <100ms | MongoDB slow query log |
| Campaign Delivery Rate | >95% | Campaign metrics |
| Voice Call Success Rate | >90% | Voice conversation logs |

### 11.2 Business KPIs

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Monthly Active Users (MAU) | Growth tracking | User analytics |
| Conversations per Day | Growth tracking | Conversation logs |
| Average Session Duration | >3 minutes | Session analytics |
| Resolution Rate | >80% | Session feedback |
| Customer Satisfaction (CSAT) | >4.0/5.0 | User feedback, AI analysis |
| Lead Conversion Rate (Decorpot) | >20% | CRM analytics |
| Campaign Open Rate | >40% | Campaign metrics |
| Voice Call CSAT | >7/10 | Voice analytics |

### 11.3 Financial KPIs

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Cost per Conversation | <$0.10 | Cost tracking + conversation count |
| LLM API Cost per Month | Budget tracking | OpenAI, Azure usage |
| Voice API Cost per Call | <$0.50 | ElevenLabs usage |
| Infrastructure Cost per User | <$5/month | Cloud billing + user count |

---

## 12. Success Criteria

### 12.1 Platform Stability
- [ ] 99.9% uptime for 3 consecutive months
- [ ] Zero critical security incidents
- [ ] <1% error rate across all services

### 12.2 User Adoption
- [ ] 100+ organizations onboarded
- [ ] 1M+ conversations per month
- [ ] 10,000+ daily active users

### 12.3 Technical Excellence
- [ ] 70%+ unit test coverage
- [ ] 100% critical path integration tests
- [ ] <5s response time (p95) for all endpoints
- [ ] Comprehensive monitoring & alerting

### 12.4 Compliance & Security
- [ ] All secrets moved to secrets manager
- [ ] API rate limiting implemented
- [ ] Audit logging enabled
- [ ] GDPR compliance achieved (if serving EU)

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **RAG** | Retrieval-Augmented Generation - LLM technique combining retrieved documents with prompts |
| **Agent** | Autonomous AI system that can use tools to complete tasks |
| **Bot Profile** | Configuration of an AI chatbot instance |
| **Knowledge Base** | Collection of documents used for RAG |
| **Session** | Conversation between user and bot/agent |
| **Campaign** | Bulk messaging initiative with target audience |
| **Template** | Pre-approved message format (WhatsApp) |
| **Workflow** | Automated multi-step process |
| **Agent (Human)** | Human operator handling conversations |
| **Handover** | Transfer of conversation from AI to human (or vice versa) |
| **Lead** | Potential customer in CRM |
| **Organization** | Multi-tenant entity |
| **Role** | Permission set for users |
| **Module** | Feature area with access control |
| **Widget** | Embeddable web chat interface |
| **CSAT** | Customer Satisfaction Score (1-10 scale) |
| **STT** | Speech-to-Text |
| **TTS** | Text-to-Speech |
| **LLM** | Large Language Model |
| **FAISS** | Facebook AI Similarity Search - vector similarity library |
| **ChromaDB** | Open-source embedding database |
| **Vector Store** | Database optimized for storing and querying embeddings |
| **Embedding** | Vector representation of text for semantic search |
| **Sentiment** | Emotional tone (Positive/Neutral/Negative) |
| **Intent** | Purpose or goal of user utterance |
| **Telephony** | Phone system integration |

---

**Full API documentation:** See individual service PRDs for complete endpoint specifications.

---

## Appendix C: Contact & Support

**Documentation:**
- Individual service PRDs available in respective service folders:
  - [BW_BotCoreFunctionalityService/PRD.md](https://github.com/NiVa-Money/BW_BotCoreFunctionalityService/blob/main/PRD.md)
  - [BW_ConsumerService/PRD.md](https://github.com/NiVa-Money/BW_ConsumerService/blob/main/PRD.md)
  - [BW_VOICE/PRD.md](https://github.com/NiVa-Money/BW_VOICE/blob/dev/PRD.md)
  - [cron_Service/PRD.md](https://github.com/NiVa-Money/cron_Service/blob/main/PRD.md)
  - [queue-consumer-service/PRD.md](https://github.com/NiVa-Money/queue-consumer-service/blob/main/PRD.md)
  - [BW_FE_Application/PRD_BotWoT_Application.md](https://github.com/NiVa-Money/BW_FE_Application/blob/main/PRD_BotWoT_Application.md)

---

**Document End**

**Last Updated:** October 28, 2025
**Version:** 1.0
**Next Review:** January 28, 2026
