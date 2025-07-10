import React, { useState, useEffect } from 'react';
import { Filter, X, Calendar, ChevronDown, User, Server, Tag, CheckCircle } from 'lucide-react';
import { MCPServerFilters } from './MCPServerFilters';
import { MCPServerSubmissionsTable } from './MCPServerSubmissionsTable';
import { mockMCPServers } from '../data/mockData';
import { MCPServerSubmission, FilterState } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { RejectModal } from './RejectModal';

export const MCPServerMarketplaceDashboard: React.FC = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [showMCPServerIdFilter, setShowMCPServerIdFilter] = useState(false);
  const [showDeveloperFilter, setShowDeveloperFilter] = useState(false);
  const [showProviderFilter, setShowProviderFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    provider: [],
    dateRange: { start: null, end: null },
    search: '',
    mcpServerId: '',
    developer: '',
  });
  
  const [tempDeveloperFilter, setTempDeveloperFilter] = useState('');
  const [selectedMCPServers, setSelectedMCPServers] = useState<string[]>([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  const [jumpToPage, setJumpToPage] = useState('');
  
  // Predefined filter options
  const mcpServerIdOptions = [
    'filesystem-manager',
    'database-query',
    'ai-connector',
    'git-repo-manager',
    'cloud-storage',
    'api-gateway',
    'task-automation',
    'data-analytics',
    'security-monitor',
    'content-hub'
  ];
  
  const developerOptions = [
    'alex.johnson@modelcontextprotocol.com',
    'sarah.miller@microsoft.com',
    'tom.wilson@context7.com',
    'emma.davis@example.com',
    'mike.brown@cloudtech.com',
    'lisa.chen@techcorp.com',
    'david.kim@automate.io',
    'jennifer.white@analytics.com',
    'robert.garcia@security.net',
    'maria.rodriguez@content.pro'
  ];
  
  const allFilteredMCPServers = mockMCPServers.filter(mcpServer => {
    if (activeTab === 'reviewed' && !mcpServer.isReviewed) {
      return false;
    }
    if (activeTab === 'pending' && mcpServer.isReviewed) {
      return false;
    }
    
    if (filters.status.length > 0 && !filters.status.includes(mcpServer.status)) {
      return false;
    }
    
    if (filters.provider.length > 0 && !filters.provider.includes(mcpServer.provider)) {
      return false;
    }
    
    if (filters.dateRange.start && new Date(mcpServer.submissionDate) < filters.dateRange.start) {
      return false;
    }
    
    if (filters.dateRange.end && new Date(mcpServer.submissionDate) > filters.dateRange.end) {
      return false;
    }

    // Handle search for MCP Server names
    if (filters.search) {
      if (!mcpServer.mcpServerName.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
    }

    // Handle multiple MCP Server IDs
    if (filters.mcpServerId) {
      const selectedIds = filters.mcpServerId.split(',').map(id => id.trim());
      if (selectedIds.length > 0 && !selectedIds.some(id => mcpServer.mcpServerId.includes(id))) {
        return false;
      }
    }
    
    // Handle multiple Developers
    if (filters.developer) {
      const selectedDevelopers = filters.developer.split(',').map(dev => dev.trim());
      if (selectedDevelopers.length > 0 && !selectedDevelopers.some(dev => mcpServer.developer.includes(dev))) {
        return false;
      }
    }
    
    return true;
  });
  
  // Calculate pagination
  const totalItems = allFilteredMCPServers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredMCPServers = allFilteredMCPServers.slice(startIndex, endIndex);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedMCPServers([]);
  }, [filters, activeTab]);
  
  // Reset selected items when pagination changes
  useEffect(() => {
    setSelectedMCPServers([]);
  }, [currentPage]);
  
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  const handleSelectMCPServer = (mcpServerId: string) => {
    setSelectedMCPServers(prev => {
      if (prev.includes(mcpServerId)) {
        return prev.filter(id => id !== mcpServerId);
      } else {
        return [...prev, mcpServerId];
      }
    });
  };
  
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedMCPServers(filteredMCPServers.map(mcpServer => mcpServer.id));
    } else {
      setSelectedMCPServers([]);
    }
  };
  
  const handleBatchAction = (action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setShowApproveModal(true);
    } else {
      setShowRejectModal(true);
    }
  };

  const handleConfirmBatchAction = (action: 'approve' | 'reject', reason?: string) => {
    console.log(`${action} for MCP servers:`, selectedMCPServers, reason ? `Reason: ${reason}` : '');
    setSelectedMCPServers([]);
    setShowApproveModal(false);
    setShowRejectModal(false);
  };

  const handleDelist = (mcpServerId: string, reason: string) => {
    console.log('Delist MCP server:', mcpServerId, 'Reason:', reason);
  };

  const handleStatusChange = (status: string) => {
    handleFilterChange({
      ...filters,
      status: filters.status.includes(status)
        ? filters.status.filter(s => s !== status)
        : [...filters.status, status]
    });
  };

  const handleProviderChange = (provider: string) => {
    handleFilterChange({
      ...filters,
      provider: filters.provider.includes(provider)
        ? filters.provider.filter(p => p !== provider)
        : [...filters.provider, provider]
    });
  };

  const handleDateRangeReset = () => {
    handleFilterChange({
      ...filters,
      dateRange: { start: null, end: null }
    });
  };

  const handleDateRangeApply = () => {
    setShowDateRange(false);
  };

  const handleDeveloperFilterApply = () => {
    handleFilterChange({
      ...filters,
      developer: tempDeveloperFilter
    });
    setShowDeveloperFilter(false);
  };

  const handleMCPServerIdChange = (mcpServerId: string) => {
    const currentIds = filters.mcpServerId ? filters.mcpServerId.split(',').map(id => id.trim()) : [];
    const newIds = currentIds.includes(mcpServerId)
      ? currentIds.filter(id => id !== mcpServerId)
      : [...currentIds, mcpServerId];
    
    handleFilterChange({
      ...filters,
      mcpServerId: newIds.join(', ')
    });
  };

  const handleDeveloperChange = (developer: string) => {
    const currentDevs = filters.developer ? filters.developer.split(',').map(dev => dev.trim()) : [];
    const newDevs = currentDevs.includes(developer)
      ? currentDevs.filter(dev => dev !== developer)
      : [...currentDevs, developer];
    
    handleFilterChange({
      ...filters,
      developer: newDevs.join(', ')
    });
  };

  const closeAllModals = () => {
    setShowMCPServerIdFilter(false);
    setShowDeveloperFilter(false);
    setShowProviderFilter(false);
    setShowStatusFilter(false);
    setShowDateRange(false);
    setShowItemsPerPageDropdown(false);
  };

  const statusOptions = activeTab === 'reviewed' 
    ? ['Published', 'Rejected', 'Delisted']
    : ['Auto Approved', 'Auto Rejected'];

  const providerOptions = ['Individual', 'ITEM'];

  // Pagination handlers
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setShowItemsPerPageDropdown(false);
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setJumpToPage('');
    }
  };
  
  const handleKeyPressJumpToPage = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  return (
    <div className="space-y-6 bg-black min-h-screen p-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">MCP Server Review List</h1>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${
                activeTab === 'pending' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              Pending Review
            </button>
            <button 
              onClick={() => setActiveTab('reviewed')}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${
                activeTab === 'reviewed' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              Reviewed
            </button>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search MCP Server names..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-gray-500"
        />
      </div>
      
      {/* Individual Filter Buttons */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={() => {
            closeAllModals();
            setShowMCPServerIdFilter(!showMCPServerIdFilter);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-md hover:bg-gray-700/50 transition-colors"
        >
          <Server size={16} />
          MCP Server ID
        </button>
        
        <button
          onClick={() => {
            closeAllModals();
            setShowDeveloperFilter(!showDeveloperFilter);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-md hover:bg-gray-700/50 transition-colors"
        >
          <User size={16} />
          Developer
        </button>
        
        <button
          onClick={() => {
            closeAllModals();
            setShowProviderFilter(!showProviderFilter);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-md hover:bg-gray-700/50 transition-colors"
        >
          <Tag size={16} />
          Provider
        </button>
        
        {activeTab === 'reviewed' && (
          <button
            onClick={() => {
              closeAllModals();
              setShowStatusFilter(!showStatusFilter);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-md hover:bg-gray-700/50 transition-colors"
          >
            <CheckCircle size={16} />
            Status
          </button>
        )}
        
        <button
          onClick={() => {
            closeAllModals();
            setShowDateRange(!showDateRange);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-md hover:bg-gray-700/50 transition-colors"
        >
          <Calendar size={16} />
          Date Range
        </button>

        {/* Active Filter Tags */}
        {filters.search && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
            <span>Search: "{filters.search}"</span>
            <button
              onClick={() => handleFilterChange({ ...filters, search: '' })}
              className="text-purple-300 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.developer && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
            <span>Developer: {filters.developer}</span>
            <button
              onClick={() => handleFilterChange({ ...filters, developer: '' })}
              className="text-purple-300 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.mcpServerId && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
            <span>MCP Server ID: {filters.mcpServerId}</span>
            <button
              onClick={() => handleFilterChange({ ...filters, mcpServerId: '' })}
              className="text-purple-300 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.status.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
            <span>Status: {filters.status.join(', ')}</span>
            <button
              onClick={() => handleFilterChange({ ...filters, status: [] })}
              className="text-purple-300 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.provider.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
            <span>Provider: {filters.provider.join(', ')}</span>
            <button
              onClick={() => handleFilterChange({ ...filters, provider: [] })}
              className="text-purple-300 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {(filters.dateRange.start || filters.dateRange.end) && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
            <span>Date Range</span>
            <button
              onClick={() => handleFilterChange({ ...filters, dateRange: { start: null, end: null } })}
              className="text-purple-300 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* MCP Server ID Filter Modal */}
      {showMCPServerIdFilter && (
        <div className="absolute top-32 left-6 z-50 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-6 w-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">FILTER OPTIONS</h3>
            <button
              onClick={() => setShowMCPServerIdFilter(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search options..."
                className="w-full px-4 py-2 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {mcpServerIdOptions.map(mcpServerId => (
                <label key={mcpServerId} className="flex items-center text-white cursor-pointer hover:bg-gray-700/30 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.mcpServerId.includes(mcpServerId)}
                    onChange={() => handleMCPServerIdChange(mcpServerId)}
                    className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 focus:ring-2"
                  />
                  <span className="text-sm">{mcpServerId}</span>
                </label>
              ))}
            </div>
            
            <button
              onClick={() => setShowMCPServerIdFilter(false)}
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
            
            <p className="text-xs text-gray-400 text-center">Click outside to close</p>
          </div>
        </div>
      )}

      {/* Developer Filter Modal */}
      {showDeveloperFilter && (
        <div className="absolute top-32 left-32 z-50 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-6 w-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">FILTER OPTIONS</h3>
            <button
              onClick={() => setShowDeveloperFilter(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search options..."
                className="w-full px-4 py-2 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {developerOptions.map(developer => (
                <label key={developer} className="flex items-center text-white cursor-pointer hover:bg-gray-700/30 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.developer.includes(developer)}
                    onChange={() => handleDeveloperChange(developer)}
                    className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 focus:ring-2"
                  />
                  <span className="text-sm">{developer}</span>
                </label>
              ))}
            </div>
            
            <button
              onClick={() => setShowDeveloperFilter(false)}
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
            
            <p className="text-xs text-gray-400 text-center">Click outside to close</p>
          </div>
        </div>
      )}

      {/* Provider Filter Modal */}
      {showProviderFilter && (
        <div className="absolute top-32 left-56 z-50 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-6 w-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">FILTER OPTIONS</h3>
            <button
              onClick={() => setShowProviderFilter(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search options..."
                className="w-full px-4 py-2 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {providerOptions.map(provider => (
                <label key={provider} className="flex items-center text-white cursor-pointer hover:bg-gray-700/30 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.provider.includes(provider)}
                    onChange={() => handleProviderChange(provider)}
                    className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 focus:ring-2"
                  />
                  <span className="text-sm">{provider}</span>
                </label>
              ))}
            </div>
            
            <button
              onClick={() => setShowProviderFilter(false)}
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
            
            <p className="text-xs text-gray-400 text-center">Click outside to close</p>
          </div>
        </div>
      )}

      {/* Status Filter Modal */}
      {showStatusFilter && (
        <div className="absolute top-32 left-80 z-50 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-6 w-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">FILTER OPTIONS</h3>
            <button
              onClick={() => setShowStatusFilter(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search options..."
                className="w-full px-4 py-2 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {statusOptions.map(status => (
                <label key={status} className="flex items-center text-white cursor-pointer hover:bg-gray-700/30 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => handleStatusChange(status)}
                    className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 focus:ring-2"
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
            
            <button
              onClick={() => setShowStatusFilter(false)}
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
            
            <p className="text-xs text-gray-400 text-center">Click outside to close</p>
          </div>
        </div>
      )}

      {/* Date Range Modal */}
      {showDateRange && (
        <div className="absolute top-32 right-6 z-50 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-6 w-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-white" />
              <h3 className="text-lg font-semibold text-white">Select Date Range</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDateRangeReset}
                className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded text-sm hover:bg-gray-600/50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowDateRange(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange({
                  ...filters,
                  dateRange: {
                    ...filters.dateRange,
                    start: e.target.value ? new Date(e.target.value) : null
                  }
                })}
                className="w-full px-3 py-2 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange({
                  ...filters,
                  dateRange: {
                    ...filters.dateRange,
                    end: e.target.value ? new Date(e.target.value) : null
                  }
                })}
                className="w-full px-3 py-2 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleDateRangeApply}
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
            
            <p className="text-xs text-gray-400 text-center">Click outside to apply filters</p>
          </div>
        </div>
      )}

      {/* Overlay to close modals */}
      {(showMCPServerIdFilter || showDeveloperFilter || showProviderFilter || showStatusFilter || showDateRange || showItemsPerPageDropdown) && (
        <div 
          className="fixed inset-0 z-40 bg-black/20"
          onClick={closeAllModals}
        />
      )}
      
      <div className="bg-gray-800/50 rounded-lg shadow border border-gray-700">
        <MCPServerSubmissionsTable 
          mcpServers={filteredMCPServers}
          selectedMCPServers={selectedMCPServers}
          onSelectMCPServer={handleSelectMCPServer}
          onSelectAll={handleSelectAll}
          onDelist={(mcpServerId) => handleDelist(mcpServerId, '')}
          isReviewedTab={activeTab === 'reviewed'}
        />
      </div>

      {selectedMCPServers.length > 0 && activeTab === 'pending' && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => handleBatchAction('approve')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Approve ({selectedMCPServers.length})
          </button>
          <button
            onClick={() => handleBatchAction('reject')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reject ({selectedMCPServers.length})
          </button>
        </div>
      )}
      
      {/* Enhanced Pagination Section */}
      <div className="flex justify-end items-center text-sm text-gray-400 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-4">
          <span>Total {totalItems}</span>
          
          {/* Items per page dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md hover:bg-gray-600/50 transition-colors text-white"
            >
              <span>{itemsPerPage}/page</span>
              <ChevronDown size={16} />
            </button>
            
            {showItemsPerPageDropdown && (
              <div className="absolute bottom-full mb-2 left-0 bg-gray-800/95 border border-gray-600 rounded-md shadow-xl z-50 min-w-[120px]">
                {[10, 20, 30, 50].map(count => (
                  <button
                    key={count}
                    onClick={() => handleItemsPerPageChange(count)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700/50 transition-colors ${
                      itemsPerPage === count ? 'text-purple-400' : 'text-gray-300'
                    }`}
                  >
                    {count}/page
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} className="rotate-90" />
            </button>
            
            <div className="flex items-center gap-1">
              <span className="px-3 py-1 bg-purple-600 text-white rounded-md font-medium">
                {currentPage}
              </span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} className="-rotate-90" />
            </button>
          </div>
          
          {/* Go to page */}
          <div className="flex items-center gap-2">
            <span>Go to</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyPress={handleKeyPressJumpToPage}
              className="w-16 px-2 py-1 bg-gray-700/50 border border-gray-600 rounded-md text-center text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="1"
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showApproveModal}
        title="Confirm"
        message={`Are you sure to approve these ${selectedMCPServers.length} MCP servers?`}
        confirmText="OK"
        onClose={() => setShowApproveModal(false)}
        onConfirm={() => handleConfirmBatchAction('approve')}
      />

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={(reason) => handleConfirmBatchAction('reject', reason)}
      />
    </div>
  );
}; 