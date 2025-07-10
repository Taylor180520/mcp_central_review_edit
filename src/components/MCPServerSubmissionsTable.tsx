import React from 'react';
import { Link } from 'react-router-dom';
import { MCPServerSubmission } from '../types';
import { StatusBadge } from './StatusBadge';
import { ActionButtons } from './ActionButtons';
import { Calendar, ChevronDown } from 'lucide-react';

interface MCPServerSubmissionsTableProps {
  mcpServers: MCPServerSubmission[];
  selectedMCPServers: string[];
  onSelectMCPServer: (mcpServerId: string) => void;
  onSelectAll: (isSelected: boolean) => void;
  onDelist: (mcpServerId: string) => void;
  isReviewedTab: boolean;
}

export const MCPServerSubmissionsTable: React.FC<MCPServerSubmissionsTableProps> = ({
  mcpServers,
  selectedMCPServers,
  onSelectMCPServer,
  onSelectAll,
  onDelist,
  isReviewedTab,
}) => {
  const allSelected = mcpServers.length > 0 && selectedMCPServers.length === mcpServers.length;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getProviderBadge = (provider: string) => {
    const providerStyles: { [key: string]: string } = {
      'Individual': 'bg-blue-100 text-blue-800',
      'ITEM': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${providerStyles[provider] || 'bg-gray-100 text-gray-800'}`}>
        {provider}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-800/50 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
            <th className="px-6 py-3 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-600"
              />
            </th>
            <th className="px-6 py-3">
              <div className="flex items-center gap-1">
                MCP Server Name
                <ChevronDown size={14} />
              </div>
            </th>
            <th className="px-6 py-3">MCP Server ID</th>
            <th className="px-6 py-3">Developer</th>
            <th className="px-6 py-3">Provider</th>
            <th className="px-6 py-3">Version</th>
            <th className="px-6 py-3">
              <div className="flex items-center gap-1">
                Submission Date
                <ChevronDown size={14} />
              </div>
            </th>
            <th className="px-6 py-3">Status</th>
            {!isReviewedTab && (
              <th className="px-6 py-3 text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-gray-800/50 divide-y divide-gray-700">
          {mcpServers.map((mcpServer) => (
            <tr 
              key={mcpServer.id}
              className="hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedMCPServers.includes(mcpServer.id)}
                  onChange={() => onSelectMCPServer(mcpServer.id)}
                  className="rounded text-purple-600 focus:ring-purple-600"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link 
                  to={`/mcp-server/${mcpServer.id}`}
                  className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
                >
                  {mcpServer.mcpServerName}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300 font-mono">{mcpServer.mcpServerId}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{mcpServer.developer}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getProviderBadge(mcpServer.provider)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300 font-mono">{mcpServer.version}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-300">
                  <Calendar size={14} className="mr-1 text-gray-400" />
                  {formatDate(mcpServer.submissionDate)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge 
                  status={mcpServer.status} 
                  onDelist={mcpServer.status === 'Published' ? () => onDelist(mcpServer.id) : undefined}
                  autoReviewResults={mcpServer.status === 'Auto Approved' ? {
                    overallScore: 92.2,
                    contentQuality: 86.7,
                    safetyCheck: 100.0,
                    compliance: 90.0
                  } : undefined}
                />
              </td>
              {!isReviewedTab && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ActionButtons status={mcpServer.status} appId={mcpServer.id} />
                </td>
              )}
            </tr>
          ))}
          
          {mcpServers.length === 0 && (
            <tr>
              <td colSpan={isReviewedTab ? 8 : 9} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-gray-800/50 p-3 mb-4">
                    <Calendar size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-300 text-lg mb-1">No MCP servers found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}; 