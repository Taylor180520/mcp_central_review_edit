export interface MCPServerSubmission {
  id: string;
  mcpServerName: string;
  mcpServerId: string;
  developer: string; // developer email address
  provider: 'Individual' | 'ITEM';
  version: string;
  submissionDate: string;
  status: 'Auto Approved' | 'Auto Rejected' | 'Published' | 'Rejected' | 'Delisted' | 'Unlisted';
  aiReviewResult?: 'Pass' | 'Fail' | 'Needs Review';
  isReviewed?: boolean;
}

export interface FilterState {
  status: string[];
  provider: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  search: string;
  mcpServerId: string;
  developer: string;
}