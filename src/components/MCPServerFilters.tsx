import React from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { FilterState } from '../types';

interface MCPServerFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export const MCPServerFilters: React.FC<MCPServerFiltersProps> = ({ filters, onChange }) => {
  const statusOptions = ['Auto Approved'];
  
  const providerOptions = ['Individual', 'ITEM'];
  
  const handleStatusChange = (status: string) => {
    onChange({
      ...filters,
      status: filters.status.includes(status)
        ? filters.status.filter(s => s !== status)
        : [...filters.status, status]
    });
  };
  
  const handleProviderChange = (provider: string) => {
    onChange({
      ...filters,
      provider: filters.provider.includes(provider)
        ? filters.provider.filter(p => p !== provider)
        : [...filters.provider, provider]
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      search: e.target.value
    });
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        start: e.target.value ? new Date(e.target.value) : null
      }
    });
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        end: e.target.value ? new Date(e.target.value) : null
      }
    });
  };
  
  const handleClearFilters = () => {
    onChange({
      status: [],
      provider: [],
      dateRange: { start: null, end: null },
      search: '',
      mcpServerId: '',
      developer: ''
    });
  };

  return (
    <div className="bg-black p-4 rounded-lg shadow animate-slideDown space-y-4 border border-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-white">Filter MCP Servers</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          <X size={16} />
          Clear all filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="MCP Server or developer name"
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-gray-500"
          />
        </div>
        
        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {statusOptions.map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="rounded text-purple-600 focus:ring-purple-600 mr-2 bg-gray-800/50 border-gray-600"
                />
                <span className="text-sm text-gray-300">{status}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Provider filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Provider
          </label>
          <div className="space-y-1">
            {providerOptions.map(provider => (
              <label key={provider} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.provider.includes(provider)}
                  onChange={() => handleProviderChange(provider)}
                  className="rounded text-purple-600 focus:ring-purple-600 mr-2 bg-gray-800/50 border-gray-600"
                />
                <span className="text-sm text-gray-300">{provider}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Date range filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Submission Date
          </label>
          <div className="space-y-2">
            <div className="relative">
              <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                placeholder="Start date"
                value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                onChange={handleStartDateChange}
                className="w-full pl-10 pr-3 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                placeholder="End date"
                value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                onChange={handleEndDateChange}
                className="w-full pl-10 pr-3 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 