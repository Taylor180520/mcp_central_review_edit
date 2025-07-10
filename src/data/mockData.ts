import { MCPServerSubmission } from '../types';

export const mockMCPServers: MCPServerSubmission[] = [
  // Pending Review Items (Not reviewed)
  {
    id: 'mcp-123456789',
    mcpServerName: 'File System Manager',
    mcpServerId: 'filesystem-manager',
    developer: 'alex.johnson@modelcontextprotocol.com',
    provider: 'ITEM',
    version: '1.2.3',
    submissionDate: '2025-03-10T14:30:00Z',
    status: 'Auto Approved',
    aiReviewResult: 'Pass',
    isReviewed: false
  },
  {
    id: 'mcp-234567890',
    mcpServerName: 'Database Query Tool',
    mcpServerId: 'database-query',
    developer: 'sarah.miller@microsoft.com',
    provider: 'Individual',
    version: '2.1.0',
    submissionDate: '2025-03-08T09:15:00Z',
    status: 'Auto Approved',
    aiReviewResult: 'Pass',
    isReviewed: false
  },
  {
    id: 'mcp-345678901',
    mcpServerName: 'AI Assistant Connector',
    mcpServerId: 'ai-connector',
    developer: 'tom.wilson@context7.com',
    provider: 'Individual',
    version: '0.8.5',
    submissionDate: '2025-03-07T11:22:00Z',
    status: 'Auto Approved',
    aiReviewResult: 'Pass',
    isReviewed: false
  },
  {
    id: 'mcp-456789012',
    mcpServerName: 'Git Repository Manager',
    mcpServerId: 'git-repo-manager',
    developer: 'emma.davis@example.com',
    provider: 'ITEM',
    version: '3.0.1',
    submissionDate: '2025-03-06T16:45:00Z',
    status: 'Auto Rejected',
    aiReviewResult: 'Fail',
    isReviewed: false
  },
  {
    id: 'mcp-567890123',
    mcpServerName: 'Cloud Storage Connector',
    mcpServerId: 'cloud-storage',
    developer: 'mike.brown@cloudtech.com',
    provider: 'Individual',
    version: '1.5.2',
    submissionDate: '2025-03-05T08:30:00Z',
    status: 'Auto Approved',
    aiReviewResult: 'Pass',
    isReviewed: false
  },
  {
    id: 'mcp-678901234',
    mcpServerName: 'API Gateway Manager',
    mcpServerId: 'api-gateway',
    developer: 'lisa.chen@techcorp.com',
    provider: 'ITEM',
    version: '2.3.0',
    submissionDate: '2025-03-04T14:20:00Z',
    status: 'Auto Approved',
    aiReviewResult: 'Pass',
    isReviewed: false
  },

  // Reviewed Items
  {
    id: 'mcp-789012345',
    mcpServerName: 'Task Automation Engine',
    mcpServerId: 'task-automation',
    developer: 'david.kim@automate.io',
    provider: 'Individual',
    version: '1.8.7',
    submissionDate: '2025-02-28T10:15:00Z',
    status: 'Published',
    aiReviewResult: 'Pass',
    isReviewed: true
  },
  {
    id: 'mcp-890123456',
    mcpServerName: 'Data Analytics Suite',
    mcpServerId: 'data-analytics',
    developer: 'jennifer.white@analytics.com',
    provider: 'ITEM',
    version: '4.2.1',
    submissionDate: '2025-02-25T13:45:00Z',
    status: 'Published',
    aiReviewResult: 'Pass',
    isReviewed: true
  },
  {
    id: 'mcp-901234567',
    mcpServerName: 'Security Monitor',
    mcpServerId: 'security-monitor',
    developer: 'robert.garcia@security.net',
    provider: 'Individual',
    version: '2.0.5',
    submissionDate: '2025-02-20T09:30:00Z',
    status: 'Rejected',
    aiReviewResult: 'Fail',
    isReviewed: true
  },
  {
    id: 'mcp-012345678',
    mcpServerName: 'Content Management Hub',
    mcpServerId: 'content-hub',
    developer: 'maria.rodriguez@content.pro',
    provider: 'ITEM',
    version: '1.9.3',
    submissionDate: '2025-02-18T15:20:00Z',
    status: 'Delisted',
    aiReviewResult: 'Pass',
    isReviewed: true
  }
];