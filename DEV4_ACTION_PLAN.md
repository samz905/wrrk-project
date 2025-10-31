# Dev 4: Monitoring Dashboard - Instruction Manual

**Your Role:** Monitoring & Observability Specialist
**Responsibility:** Build complete monitoring dashboard for workflow executions
**Scope:** Execution list, execution details, step logs, filters, retry functionality

---

## Overview

You are responsible for giving users visibility into their workflow executions. Your dashboard is where users go to see if workflows are running successfully, debug failures, and retry failed executions.

**What You're Building:**
- **Execution List View** - Table showing all executions with status, time, duration
- **Execution Details View** - Step-by-step breakdown of a single execution
- **Filters & Search** - Filter by status, date range, search by ID
- **Retry Functionality** - Re-run failed executions
- **Real-time Updates** - Auto-refresh to show ongoing executions
- **Performance Dashboard** - Stats and analytics (optional enhancement)

**Key Technologies:**
- **React** + **TypeScript**
- **Tailwind CSS** - Styling
- **Axios** - API calls to backend (Dev 3's endpoints)
- **React Query** (or SWR) - Data fetching and caching
- **date-fns** or **Day.js** - Date formatting

---

## Prerequisites

### 1. Dependencies Installation

```bash
cd BW_FE_Application

npm install @tanstack/react-query  # Data fetching
npm install date-fns  # Date utilities
npm install lucide-react  # Icons (if not already installed)
```

### 1.1. React Query Setup

After installing React Query, you need to set up the QueryClientProvider in your app:

**Create Query Client** (`src/lib/queryClient.ts`):

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});
```

**Wrap App with Provider** (in `src/App.tsx` or `src/index.tsx`):

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app routes */}
    </QueryClientProvider>
  );
}

export default App;
```

### 2. API Endpoints (provided by Dev 3)

You'll be calling these endpoints:

```typescript
// Get executions for a workflow (paginated)
GET /workFlow/:workflowId/executions?status=completed&limit=50&offset=0

// Get single execution details
GET /workFlow/execution/:executionId

// Get step logs for execution
GET /workFlow/execution/:executionId/logs

// Retry failed execution
POST /workFlow/execution/:executionId/retry
```

### 3. Core Type Definitions

Create `src/types/execution.types.ts`:

```typescript
export interface Execution {
  _id: string;
  workflowId: string;
  orgId: string;
  userId: string;
  status: 'running' | 'completed' | 'failed';
  triggerData: Record<string, any>;
  finalOutput?: Record<string, any>;
  totalDuration?: number; // milliseconds
  startedAt: string; // ISO date string
  completedAt?: string; // ISO date string
  errorMessage?: string;
}

export interface ExecutionLog {
  _id: string;
  executionId: string;
  stepId: string;
  stepType: 'trigger' | 'agent' | 'action' | 'utility';
  nodeType: string; // e.g., 'trigger_whatsapp', 'action_shopify_create_order'
  stepOrder: number;
  status: 'running' | 'completed' | 'failed';
  input?: Record<string, any>;
  output?: Record<string, any>;
  duration?: number; // milliseconds
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
}

export interface ExecutionsResponse {
  success: boolean;
  data: {
    executions: Execution[];
    total: number;
    limit: number;
    offset: number;
  };
}
```

---

## Part 1: Execution List View

### What It Is

A table showing all executions for a workflow, with columns for status, start time, duration, and actions. Users can filter by status and pagination through results.

### How to Build It

#### Step 1.1: Create Monitoring Page Component

Create `src/pages/workflow/monitoring/WorkflowMonitoringPage.tsx`:

```typescript
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ExecutionList from '../../../components/workflow/monitoring/ExecutionList';
import ExecutionDetails from '../../../components/workflow/monitoring/ExecutionDetails';
import { getExecutions } from '../../../api/services/executionService';

export default function WorkflowMonitoringPage() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const limit = 20;

  // Fetch executions
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['executions', workflowId, statusFilter, page],
    queryFn: () =>
      getExecutions(workflowId!, {
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit,
        offset: page * limit,
      }),
    enabled: !!workflowId,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const executions = data?.data?.executions || [];
  const total = data?.data?.total || 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Workflow Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage workflow executions
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Execution List (Left) */}
        <div className="flex-1 overflow-auto">
          <ExecutionList
            executions={executions}
            isLoading={isLoading}
            selectedExecutionId={selectedExecutionId}
            onSelectExecution={setSelectedExecutionId}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            page={page}
            limit={limit}
            total={total}
            onPageChange={setPage}
            onRefresh={refetch}
          />
        </div>

        {/* Execution Details (Right) */}
        {selectedExecutionId && (
          <div className="w-1/2 border-l bg-white overflow-auto">
            <ExecutionDetails
              executionId={selectedExecutionId}
              onClose={() => setSelectedExecutionId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

#### Step 1.2: Create Execution List Component

Create `src/components/workflow/monitoring/ExecutionList.tsx`:

```typescript
import { format } from 'date-fns';
import { RefreshCw, Filter } from 'lucide-react';
import { Execution } from '../../../types/execution.types';
import StatusBadge from './StatusBadge';

interface ExecutionListProps {
  executions: Execution[];
  isLoading: boolean;
  selectedExecutionId: string | null;
  onSelectExecution: (id: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export default function ExecutionList({
  executions,
  isLoading,
  selectedExecutionId,
  onSelectExecution,
  statusFilter,
  onStatusFilterChange,
  page,
  limit,
  total,
  onPageChange,
  onRefresh,
}: ExecutionListProps) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Execution ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Started At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Loading executions...
                </td>
              </tr>
            ) : executions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No executions found
                </td>
              </tr>
            ) : (
              executions.map((execution) => (
                <tr
                  key={execution._id}
                  onClick={() => onSelectExecution(execution._id)}
                  className={`border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedExecutionId === execution._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <StatusBadge status={execution.status} />
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">
                    {execution._id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {format(new Date(execution.startedAt), 'MMM d, yyyy HH:mm:ss')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {execution.totalDuration
                      ? `${(execution.totalDuration / 1000).toFixed(2)}s`
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectExecution(execution._id);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of{' '}
            {total} executions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Step 1.3: Create Status Badge Component

Create `src/components/workflow/monitoring/StatusBadge.tsx`:

```typescript
import { CheckCircle, XCircle, Loader } from 'lucide-react';

interface StatusBadgeProps {
  status: 'running' | 'completed' | 'failed';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    running: {
      label: 'Running',
      icon: Loader,
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      iconClassName: 'animate-spin',
    },
    completed: {
      label: 'Completed',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-700 border-green-200',
      iconClassName: '',
    },
    failed: {
      label: 'Failed',
      icon: XCircle,
      className: 'bg-red-100 text-red-700 border-red-200',
      iconClassName: '',
    },
  };

  const { label, icon: Icon, className, iconClassName } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full ${className}`}
    >
      <Icon size={12} className={iconClassName} />
      {label}
    </span>
  );
}
```

**How to Test:**
1. Create test executions with different statuses
2. Verify table displays all executions
3. Test filters (all, running, completed, failed)
4. Check pagination works
5. Verify auto-refresh updates data every 5 seconds

---

## Part 2: Execution Details View

### What It Is

Detailed view of a single execution showing step-by-step logs, input/output for each step, and error messages if any.

### How to Build It

#### Step 2.1: Create Execution Details Component

Create `src/components/workflow/monitoring/ExecutionDetails.tsx`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { X, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import {
  getExecution,
  getExecutionLogs,
  retryExecution,
} from '../../../api/services/executionService';
import StatusBadge from './StatusBadge';
import StepLogCard from './StepLogCard';

interface ExecutionDetailsProps {
  executionId: string;
  onClose: () => void;
}

export default function ExecutionDetails({
  executionId,
  onClose,
}: ExecutionDetailsProps) {
  // Fetch execution details
  const { data: executionData } = useQuery({
    queryKey: ['execution', executionId],
    queryFn: () => getExecution(executionId),
    refetchInterval: (data) => {
      // Auto-refresh if execution is still running
      return data?.data?.status === 'running' ? 2000 : false;
    },
  });

  // Fetch execution logs
  const { data: logsData, refetch: refetchLogs } = useQuery({
    queryKey: ['execution-logs', executionId],
    queryFn: () => getExecutionLogs(executionId),
    refetchInterval: (data) => {
      // Auto-refresh if any step is still running
      const hasRunningSteps = data?.data?.some((log: any) => log.status === 'running');
      return hasRunningSteps ? 2000 : false;
    },
  });

  const execution = executionData?.data;
  const logs = logsData?.data || [];

  const handleRetry = async () => {
    if (execution?.status !== 'failed') return;

    const confirmed = window.confirm(
      'Are you sure you want to retry this failed execution?'
    );
    if (!confirmed) return;

    try {
      await retryExecution(executionId);
      alert('Execution retried successfully!');
      refetchLogs();
    } catch (error) {
      alert('Failed to retry execution');
    }
  };

  if (!execution) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading execution details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Execution Details
            </h2>
            <p className="text-sm text-gray-500 font-mono mt-1">
              {executionId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Execution Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <StatusBadge status={execution.status} />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={14} />
            <span>
              Started: {format(new Date(execution.startedAt), 'MMM d, yyyy HH:mm:ss')}
            </span>
          </div>

          {execution.totalDuration && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} />
              <span>
                Duration: {(execution.totalDuration / 1000).toFixed(2)}s
              </span>
            </div>
          )}

          {execution.errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle size={16} className="text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">
                  {execution.errorMessage}
                </p>
              </div>
            </div>
          )}

          {execution.status === 'failed' && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={14} />
              Retry Execution
            </button>
          )}
        </div>
      </div>

      {/* Step Logs */}
      <div className="flex-1 overflow-auto p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Execution Steps ({logs.length})
        </h3>
        <div className="space-y-3">
          {logs.map((log: any) => (
            <StepLogCard key={log._id} log={log} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### Step 2.2: Create Step Log Card Component

Create `src/components/workflow/monitoring/StepLogCard.tsx`:

```typescript
import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ExecutionLog } from '../../../types/execution.types';
import StatusBadge from './StatusBadge';

interface StepLogCardProps {
  log: ExecutionLog;
}

export default function StepLogCard({ log }: StepLogCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="text-sm font-medium text-gray-900">
            Step {log.stepOrder + 1}: {log.nodeType}
          </span>
          <StatusBadge status={log.status} />
        </div>
        <div className="text-sm text-gray-500">
          {log.duration ? `${log.duration}ms` : '-'}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 py-3 bg-gray-50 border-t space-y-3">
          {/* Timestamps */}
          <div className="text-xs text-gray-600">
            <p>Started: {format(new Date(log.startedAt), 'HH:mm:ss.SSS')}</p>
            {log.completedAt && (
              <p>Completed: {format(new Date(log.completedAt), 'HH:mm:ss.SSS')}</p>
            )}
          </div>

          {/* Input */}
          {log.input && Object.keys(log.input).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Input:</p>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                {JSON.stringify(log.input, null, 2)}
              </pre>
            </div>
          )}

          {/* Output */}
          {log.output && Object.keys(log.output).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Output:</p>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                {JSON.stringify(log.output, null, 2)}
              </pre>
            </div>
          )}

          {/* Error Message */}
          {log.errorMessage && (
            <div>
              <p className="text-xs font-semibold text-red-700 mb-1">Error:</p>
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {log.errorMessage}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

**How to Test:**
1. Click an execution from the list
2. Details panel should open on the right
3. Verify all execution info is displayed
4. Click steps to expand/collapse
5. Check input/output JSON is formatted correctly
6. Test retry button on failed executions

---

## Part 3: API Service Layer

### What It Is

Service functions to call Dev 3's backend endpoints with proper error handling.

### How to Build It

Create `src/api/services/executionService.ts`:

```typescript
import axiosInstance from '../axiosInstance';

export const getExecutions = async (
  workflowId: string,
  options: { status?: string; limit?: number; offset?: number }
) => {
  const params = new URLSearchParams();
  if (options.status) params.append('status', options.status);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());

  const response = await axiosInstance.get(
    `/workFlow/${workflowId}/executions?${params.toString()}`
  );
  return response.data;
};

export const getExecution = async (executionId: string) => {
  const response = await axiosInstance.get(`/workFlow/execution/${executionId}`);
  return response.data;
};

export const getExecutionLogs = async (executionId: string) => {
  const response = await axiosInstance.get(
    `/workFlow/execution/${executionId}/logs`
  );
  return response.data;
};

export const retryExecution = async (executionId: string) => {
  const response = await axiosInstance.post(
    `/workFlow/execution/${executionId}/retry`
  );
  return response.data;
};
```

---

## Part 4: Story 5.6 - Polling & Auto-Refresh

**Tasks from SPRINT.md:**
- **[DEV4-01]** Implement polling with setInterval (1h)
- **[DEV4-02]** Add manual "Refresh" button (0.5h)
- **[DEV4-03]** Clean up interval on unmount (0.5h)
- **[DEV4-04]** Test: Polling updates list (1h)

### What It Is

Automatic refresh functionality that keeps the monitoring dashboard up-to-date without manual user intervention. This is critical for monitoring running workflows and seeing new executions as they happen.

### Why It's Important

Users need to see:
- **Running executions** updating in real-time (status changes from running → completed/failed)
- **New executions** appearing automatically when workflows are triggered
- **Step progress** updating as the workflow executes

Without polling, users would need to manually refresh the page constantly, which is a poor user experience.

### How to Build It

#### Step 4.1: Implement Auto-Refresh in Execution List

The execution list should automatically refresh every 5 seconds to check for new executions.

**Implementation (already in Part 1 code, but here's the breakdown):**

```typescript
// In WorkflowMonitoringPage.tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['executions', workflowId, statusFilter, page],
  queryFn: () => getExecutions(workflowId!, { ... }),
  enabled: !!workflowId,
  refetchInterval: 5000, // ← This is the polling interval (5 seconds)
});
```

**Key Points:**
- `refetchInterval: 5000` tells React Query to re-fetch data every 5 seconds
- Runs automatically in the background
- Uses the same query function, so no additional code needed
- Works even when user is not actively interacting with the page

#### Step 4.2: Implement Conditional Auto-Refresh in Execution Details

For execution details, we want faster updates (2 seconds) when executions are still running, but no polling when they're completed.

**Implementation:**

```typescript
// In ExecutionDetails.tsx
const { data: executionData } = useQuery({
  queryKey: ['execution', executionId],
  queryFn: () => getExecution(executionId),
  refetchInterval: (data) => {
    // Only poll if execution is still running
    return data?.data?.status === 'running' ? 2000 : false;
  },
});

const { data: logsData } = useQuery({
  queryKey: ['execution-logs', executionId],
  queryFn: () => getExecutionLogs(executionId),
  refetchInterval: (data) => {
    // Only poll if any step is still running
    const hasRunningSteps = data?.data?.some((log: any) => log.status === 'running');
    return hasRunningSteps ? 2000 : false;
  },
});
```

**Key Points:**
- `refetchInterval` can be a function that returns a number or `false`
- `false` means "stop polling"
- This saves API calls when executions are complete
- 2 seconds is faster than 5 seconds for better real-time feel

#### Step 4.3: Manual Refresh Button

Users should also have a manual refresh button for immediate updates.

**Implementation (already in ExecutionList.tsx):**

```typescript
<button
  onClick={onRefresh}
  disabled={isLoading}
  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
>
  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
  Refresh
</button>
```

**Key Points:**
- Calls the `refetch()` function from React Query
- Shows spinning icon during refresh
- Disabled while loading to prevent double-requests

#### Step 4.4: Cleanup on Unmount

React Query handles cleanup automatically, but it's important to understand what happens:

**Automatic Behavior:**
- When component unmounts, polling stops automatically
- No memory leaks
- No need for manual `clearInterval()`

**Manual Cleanup (if using setInterval instead of React Query):**

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 5000);

  return () => clearInterval(interval); // ← Cleanup
}, [refetch]);
```

**Why React Query is Better:**
- Handles cleanup automatically
- Prevents refetching when window is not focused (saves API calls)
- Deduplicates requests if multiple components request same data
- Built-in error handling and retry logic

### Testing Checklist

**Auto-Refresh:**
- [ ] Execution list refreshes every 5 seconds
- [ ] New executions appear automatically
- [ ] Status badges update (running → completed/failed)
- [ ] Page doesn't flicker during refresh (React Query caching)

**Conditional Refresh:**
- [ ] Execution details refresh every 2 seconds when status = running
- [ ] Polling stops when status = completed or failed
- [ ] Step logs update in real-time during execution

**Manual Refresh:**
- [ ] Refresh button triggers immediate update
- [ ] Button shows spinning icon during refresh
- [ ] Button is disabled during refresh

**Cleanup:**
- [ ] Navigate away from page → polling stops (check Network tab)
- [ ] No console errors about memory leaks
- [ ] No excessive API calls after unmount

**Performance:**
- [ ] Polling doesn't slow down UI
- [ ] Page remains responsive during refresh
- [ ] Network tab shows requests every 5 seconds (not more)

### Performance Considerations

**Balancing Freshness vs. Performance:**

| Interval | Use Case | Trade-offs |
|----------|----------|------------|
| 2 seconds | Active running executions | Fresh data, but more API load |
| 5 seconds | General monitoring | Good balance |
| 10+ seconds | Low-priority updates | Saves API calls, but feels slow |

**Best Practices:**
1. **Use conditional polling** - Only poll when data is changing
2. **Stop polling when window is inactive** - React Query does this by default
3. **Use caching** - React Query prevents unnecessary re-renders
4. **Monitor API load** - If 100 users are polling every 5s, that's 20 requests/second

**Optimization Example:**

```typescript
refetchInterval: (data) => {
  // If completed/failed, stop polling
  if (data?.data?.status !== 'running') return false;

  // If page is hidden, slow down polling
  if (document.hidden) return 30000; // 30 seconds

  // Normal polling
  return 2000;
}
```

### Common Issues & Troubleshooting

**Issue: "Polling not working"**
- **Check:** Is `refetchInterval` set correctly?
- **Check:** Is component mounted? (Polling stops on unmount)
- **Check:** Is there a network error blocking requests?
- **Debug:** Open React Query DevTools to inspect query state

**Issue: "Too many API requests"**
- **Solution:** Increase `refetchInterval` from 2s to 5s
- **Solution:** Add conditional polling (stop when data is complete)
- **Solution:** Use `refetchOnWindowFocus: false` if needed

**Issue: "UI flickers during refresh"**
- **Solution:** React Query should prevent this with caching
- **Check:** Are you clearing data before refetch? (Don't do this)
- **Solution:** Use `keepPreviousData: true` in query options

**Issue: "Polling continues after navigation"**
- **Check:** Is component properly unmounting?
- **Debug:** Check Network tab - should stop after unmount
- **Solution:** React Query handles this automatically, might be a bug

---

## Part 5: Optional Enhancements

### Enhancement 5.1: Dashboard Analytics

Add summary stats at the top of the monitoring page:

```typescript
export default function DashboardStats({ workflowId }: { workflowId: string }) {
  const { data } = useQuery({
    queryKey: ['execution-stats', workflowId],
    queryFn: async () => {
      const [completed, failed, running] = await Promise.all([
        getExecutions(workflowId, { status: 'completed', limit: 1 }),
        getExecutions(workflowId, { status: 'failed', limit: 1 }),
        getExecutions(workflowId, { status: 'running', limit: 1 }),
      ]);

      return {
        completed: completed.data.total,
        failed: failed.data.total,
        running: running.data.total,
        total: completed.data.total + failed.data.total + running.data.total,
      };
    },
  });

  const stats = data || { completed: 0, failed: 0, running: 0, total: 0 };
  const successRate =
    stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Executions" value={stats.total} color="blue" />
      <StatCard label="Completed" value={stats.completed} color="green" />
      <StatCard label="Failed" value={stats.failed} color="red" />
      <StatCard label="Success Rate" value={`${successRate}%`} color="purple" />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div
      className={`p-4 border rounded-lg ${colors[color as keyof typeof colors]}`}
    >
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
```

### Enhancement 5.2: Search by Execution ID

Add search input to find specific execution:

```typescript
const [searchTerm, setSearchTerm] = useState('');

// Filter executions by ID
const filteredExecutions = executions.filter((execution) =>
  execution._id.includes(searchTerm)
);
```

### Enhancement 5.3: Export Execution Logs

Add button to download execution logs as JSON:

```typescript
const exportLogs = (execution: Execution, logs: ExecutionLog[]) => {
  const data = {
    execution,
    logs,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `execution-${execution._id}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## Common Issues & Troubleshooting

### Issue: "Auto-refresh not working"
**Solution:**
- Check `refetchInterval` is set correctly in useQuery
- Verify component isn't unmounting/remounting
- Use React DevTools to inspect query state

### Issue: "Pagination broken"
**Solution:**
- Ensure `offset` is calculated correctly: `page * limit`
- Check backend returns correct `total` count
- Verify `totalPages` calculation is correct

### Issue: "Long JSON in logs breaks layout"
**Solution:**
- Add `overflow-x-auto` to pre tags
- Set `max-width` on containers
- Consider truncating very large JSON objects

### Issue: "Retry button doesn't work"
**Solution:**
- Check execution status is 'failed'
- Verify backend retry endpoint is working (test with Postman)
- Ensure JWT token is included in request

---

## Integration Checklist

### With Dev 1 (Canvas):
- [ ] No direct integration needed

### With Dev 2 (Nodes & Config):
- [ ] No direct integration needed

### With Dev 3 (Execution Engine):
- [ ] GET /workflow/:workflowId/executions returns correct format
- [ ] GET /execution/:executionId returns execution details
- [ ] GET /execution/:executionId/logs returns step logs in order
- [ ] POST /execution/:executionId/retry creates new execution
- [ ] API endpoints require JWT authentication

---

## Testing Checklist

**Execution List:**
- [ ] Table displays all executions
- [ ] Status badge colors are correct
- [ ] Timestamps format correctly
- [ ] Duration shows in seconds
- [ ] Click row opens details panel
- [ ] Filters work (all, running, completed, failed)
- [ ] Pagination works correctly
- [ ] Auto-refresh updates data every 5 seconds

**Execution Details:**
- [ ] Panel opens on the right
- [ ] Execution info displays correctly
- [ ] Step logs show in order (stepOrder 0, 1, 2, ...)
- [ ] Expand/collapse steps works
- [ ] Input/output JSON is formatted
- [ ] Error messages display for failed steps
- [ ] Retry button appears only for failed executions
- [ ] Retry button creates new execution

**Performance:**
- [ ] Table loads quickly with 50+ executions
- [ ] Step log expansion is smooth
- [ ] Auto-refresh doesn't cause UI flicker
- [ ] Large JSON objects don't break layout

**Responsive Design:**
- [ ] Layout works on different screen sizes
- [ ] Table is scrollable horizontally if needed
- [ ] Details panel can be closed

---

## Code Templates

### Template: Loading State

```typescript
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="ml-3 text-gray-600">Loading...</p>
    </div>
  );
}
```

### Template: Empty State

```typescript
if (executions.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">No executions found</p>
      <p className="text-gray-400 text-sm mt-2">
        Executions will appear here once the workflow is triggered
      </p>
    </div>
  );
}
```

### Template: Error State

```typescript
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-800 font-medium">Failed to load executions</p>
      <p className="text-red-600 text-sm mt-1">{error.message}</p>
      <button
        onClick={refetch}
        className="mt-3 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}
```

---

## Final Notes

- **Your dashboard is critical for debugging** - Users rely on it to understand what's happening
- **Performance matters** - Test with large datasets (1000+ executions)
- **Auto-refresh carefully** - Balance freshness with performance
- **Make errors clear** - Error messages should be actionable
- **Mobile responsive** - Although less common, some users may access on tablets

**Resources:**
- React Query Docs: https://tanstack.com/query/latest
- date-fns Docs: https://date-fns.org/
- Sprint Plan: `SPRINT.md`
- Tech Arch: `TECH_ARCH.md`

