import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Globe, ChevronLeft, ChevronRight, Download, FileText, Shield, AlertTriangle, CheckCircle, Upload, Camera, Edit3, Save } from 'lucide-react';
import { mockMCPServers } from '../data/mockData';
import { ConfirmModal } from './ConfirmModal';

export const MCPServerDetail: React.FC = () => {
  const { id } = useParams();
  const mcpServer = mockMCPServers.find(a => a.id === id);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [showIconModal, setShowIconModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'basic' | 'document' | 'video' | 'history'>('basic');
  const [showApproveModal, setShowApproveModal] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [descriptionText, setDescriptionText] = React.useState("A comprehensive MCP server for advanced file system management capabilities.");
  const [uploadedMarkdown, setUploadedMarkdown] = React.useState<{file: File, content: string, uploadTime: Date} | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const markdownInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedVideo, setUploadedVideo] = React.useState<{file: File, url: string, uploadTime: Date} | null>(null);
  const [isVideoDragOver, setIsVideoDragOver] = React.useState(false);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState({
    serviceName: mcpServer?.mcpServerName || '',
    serviceProvider: mcpServer?.provider || '',
    category: 'data-file-systems',
    useCases: 'This is a test case for file system management, data processing, and automated workflows in development environments.',
    description: 'A comprehensive MCP server for advanced file system management capabilities.',
    serviceType: 'sse',
    serviceURL: 'https://api.example.com/mcp-server'
  });

  const mockScreenshots = [
    'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg',
    'https://images.pexels.com/photos/5483064/pexels-photo-5483064.jpeg',
    'https://images.pexels.com/photos/5483071/pexels-photo-5483071.jpeg'
  ];

  const [reviewHistory, setReviewHistory] = React.useState([
    {
      date: '05/12/2025 17:36:11',
      status: 'Published',
      type: 'Manual Review',
      operator: 'John Smith',
      scores: {
        contentQuality: 92.00,
        compliance: 91.00,
        safetyCheck: 95.00,
        overall: 92.70
      }
    },
    {
      date: '05/12/2025 13:48:02',
      status: 'Auto Approved',
      type: 'Auto Review',
      scores: {
        contentQuality: 88.50,
        compliance: 89.00,
        safetyCheck: 93.00,
        overall: 90.20
      }
    },
    {
      date: '05/12/2025 10:30:00',
      status: 'Submitted',
      type: 'Submission',
      scores: null
    }
  ]);

  const mockInstallationPackages = [
    {
      fileName: 'mcp-server-v1.2.3.tar.gz',
      fileType: 'TAR.GZ',
      fileSize: '12.5 MB',
      uploadedTime: '2025-03-15',
      platformType: 'Cross-platform',
      fileHash: '8f4e8d9c1a2b3f4e8d9c1a2b3f4e8d9c1a2b3f4e8d9c1a2b3f4e8d9c1a2b3f4e',
      virusScanStatus: 'Safe',
      minPlatformVersion: 'Node.js 18.0+',
      targetPlatformVersion: 'Node.js 20.0+',
      downloadUrl: '#'
    },
    {
      fileName: 'mcp-server-docker-v1.2.3.tar',
      fileType: 'DOCKER',
      fileSize: '85.2 MB',
      uploadedTime: '2025-03-15',
      platformType: 'Docker',
      fileHash: '7d3f8a2b1c4e9d6f5g2h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d',
      virusScanStatus: 'Safe',
      minPlatformVersion: 'Docker 20.0+',
      downloadUrl: '#'
    }
  ];

  const mockFiles = [
    {
      name: 'mcp-server-config.json',
      size: '8.1 KB',
      type: 'JSON Configuration',
      icon: FileText,
      downloadUrl: '#'
    },
    {
      name: 'mcp-server-readme.md',
      size: '15 KB',
      type: 'Markdown Document',
      icon: FileText,
      downloadUrl: '#'
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');
  };

  const handleApprove = () => {
    const newReview = {
      date: formatDate(new Date()),
      status: 'Published',
      type: 'Manual Review',
      operator: 'John Smith',
      scores: {
        contentQuality: 92.00,
        compliance: 91.00,
        safetyCheck: 95.00,
        overall: 92.70
      }
    };
    
    setReviewHistory(prev => [newReview, ...prev]);
    setShowApproveModal(false);
    console.log('Approving MCP server:', id);
  };

  const handleReject = () => {
    const newReview = {
      date: formatDate(new Date()),
      status: 'Rejected',
      type: 'Manual Review',
      operator: 'John Smith',
      scores: {
        contentQuality: 85.00,
        compliance: 82.00,
        safetyCheck: 88.00,
        overall: 85.00
      }
    };
    
    setReviewHistory(prev => [newReview, ...prev]);
    setShowRejectModal(false);
    console.log('Rejecting MCP server:', id);
  };

  const getVirusScanStatusColor = (status: string) => {
    switch (status) {
      case 'Safe':
        return 'text-green-500';
      case 'Risky':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getVirusScanStatusIcon = (status: string) => {
    switch (status) {
      case 'Safe':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'Risky':
        return <AlertTriangle className="text-red-500" size={16} />;
      default:
        return <Shield className="text-gray-500" size={16} />;
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Save changes when exiting edit mode
      handleSaveChanges();
    } else {
      // Enter edit mode
      setIsEditMode(true);
    }
  };

  const handleSaveChanges = () => {
    // Here you would typically save to backend
    console.log('Saving changes:', editFormData);
    setDescriptionText(editFormData.description);
    setIsEditMode(false);
    
    // Show success message (you can implement a toast notification)
    // alert('Changes saved successfully!');
  };

  const handleCancelEdit = () => {
    // Reset form data to original values
    setEditFormData({
      serviceName: mcpServer?.mcpServerName || '',
      serviceProvider: mcpServer?.provider || '',
      category: 'data-file-systems',
      useCases: 'This is a test case for file system management, data processing, and automated workflows in development environments.',
      description: 'A comprehensive MCP server for advanced file system management capabilities.',
      serviceType: 'sse',
      serviceURL: 'https://api.example.com/mcp-server'
    });
    setDescriptionText('A comprehensive MCP server for advanced file system management capabilities.');
    setIsEditMode(false);
  };

  const handleFormDataChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'description') {
      setDescriptionText(value);
    }
  };

  const getDescriptionCharCount = () => descriptionText.length;
  const getDescriptionStatus = () => {
    const count = getDescriptionCharCount();
    if (count < 50) return { type: 'short', message: `${50 - count} more characters needed` };
    if (count <= 100) return { type: 'good', message: `${100 - count} characters remaining` };
    return { type: 'long', message: `${count - 100} characters over limit` };
  };

  const descriptionStatus = getDescriptionStatus();

  const handleMarkdownUpload = (file: File) => {
    if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setUploadedMarkdown({
          file,
          content,
          uploadTime: new Date()
        });
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a markdown (.md) file only.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleMarkdownUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMarkdownUpload(files[0]);
    }
  };

  const removeMarkdownFile = () => {
    setUploadedMarkdown(null);
    if (markdownInputRef.current) {
      markdownInputRef.current.value = '';
    }
  };

  const renderMarkdownPreview = (content: string) => {
    // Simple markdown rendering - replace with proper markdown parser in production
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic text-gray-300">$1</em>')
      .replace(/\n/gim, '<br>');
  };

  const handleVideoUpload = (file: File) => {
    if (file.type === 'video/mp4' || file.name.endsWith('.mp4')) {
      const url = URL.createObjectURL(file);
      setUploadedVideo({
        file,
        url,
        uploadTime: new Date()
      });
    } else {
      alert('Please upload an MP4 video file only.');
    }
  };

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsVideoDragOver(true);
  };

  const handleVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsVideoDragOver(false);
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsVideoDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleVideoUpload(files[0]);
    }
  };

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleVideoUpload(files[0]);
    }
  };

  const removeVideoFile = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo.url);
    }
    setUploadedVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  // Cleanup video URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (uploadedVideo) {
        URL.revokeObjectURL(uploadedVideo.url);
      }
    };
  }, [uploadedVideo]);

  const renderReviewHistory = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Review History</h2>
      <div className="relative">
        {reviewHistory.map((review, index) => (
          <div key={index} className="mb-8 relative">
            {/* Timeline dot and line */}
            <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${
              review.status === 'Published' ? 'bg-blue-600' :
              review.status === 'Auto Approved' ? 'bg-green-600' :
              review.status === 'Rejected' ? 'bg-red-600' :
              'bg-gray-600'
            }`}></div>
            {index < reviewHistory.length - 1 && (
              <div className="absolute left-2 top-4 w-0.5 h-24 bg-gray-700"></div>
            )}
            
            {/* Review content */}
            <div className="ml-8">
              <div className="flex items-center gap-3 mb-2">
                <div className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  review.status === 'Published' 
                    ? 'bg-blue-100 text-blue-800' 
                    : review.status === 'Auto Approved'
                    ? 'bg-green-100 text-green-800'
                    : review.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {review.status}
                </div>
                <span className="text-sm text-gray-400">{review.type}</span>
                {review.operator && <span className="text-sm text-gray-400">by {review.operator}</span>}
              </div>
              
              <div className="text-sm text-gray-500 mb-3">{review.date}</div>
              
              {review.scores && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Content Quality</span>
                        <span className="text-white">{review.scores.contentQuality}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${review.scores.contentQuality}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Compliance</span>
                        <span className="text-white">{review.scores.compliance}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${review.scores.compliance}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Safety Check</span>
                        <span className="text-white">{review.scores.safetyCheck}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${review.scores.safetyCheck}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Overall</span>
                        <span className="text-white font-semibold">{review.scores.overall}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${review.scores.overall}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!mcpServer) {
    return <div>MCP Server not found</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mb-6">
        <Link to="/" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
          <ArrowLeft size={20} />
          <span>Back to MCP Server List</span>
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">MCP Server Detail</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-1 text-sm rounded-md ${
                activeTab === 'basic' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              Basic Info
            </button>
            <button 
              onClick={() => setActiveTab('document')}
              className={`px-4 py-1 text-sm rounded-md ${
                activeTab === 'document' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              Documentation
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`px-4 py-1 text-sm rounded-md ${
                activeTab === 'video' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              Video
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1 text-sm rounded-md ${
                activeTab === 'history' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              Review History
            </button>
          </div>
        </div>

        {!mcpServer.isReviewed && (
          <div className="flex gap-2">
            <button 
              onClick={() => setShowApproveModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
            >
              <Check size={18} />
              Approve
            </button>
            <button 
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <X size={18} />
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-800/50 rounded-lg border border-gray-700">
        {activeTab === 'basic' ? (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                {isEditMode && (
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-md">
                    Edit Mode
                  </span>
                )}
              </div>
              <div className="flex gap-2 ml-auto">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Service Information */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Service Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Service Name
                      </label>
                      <input
                        type="text"
                        value={isEditMode ? editFormData.serviceName : mcpServer.mcpServerName}
                        onChange={(e) => handleFormDataChange('serviceName', e.target.value)}
                        readOnly={!isEditMode}
                        className={`w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                          !isEditMode ? 'cursor-default' : ''
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Service Provider
                      </label>
                      <input
                        type="text"
                        value={isEditMode ? editFormData.serviceProvider : mcpServer.provider}
                        onChange={(e) => handleFormDataChange('serviceProvider', e.target.value)}
                        readOnly={!isEditMode}
                        className={`w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                          !isEditMode ? 'cursor-default' : ''
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Category
                      </label>
                      <select 
                        value={editFormData.category}
                        onChange={(e) => handleFormDataChange('category', e.target.value)}
                        disabled={!isEditMode}
                        className={`w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                          !isEditMode ? 'cursor-default opacity-70' : ''
                        }`}
                      >
                        <option value="data-file-systems">Data & File Systems</option>
                        <option value="api-integration">API Integration</option>
                        <option value="automation">Automation</option>
                        <option value="security">Security</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Use Cases
                      </label>
                      <textarea
                        className={`w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none ${
                          !isEditMode ? 'cursor-default' : ''
                        }`}
                        rows={4}
                        value={editFormData.useCases}
                        onChange={(e) => handleFormDataChange('useCases', e.target.value)}
                        readOnly={!isEditMode}
                        placeholder="Help other users understand when and how to use your MCP server with real-world examples"
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Help other users understand when and how to use your MCP server with real-world examples
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Description
                      </label>
                      <div className="relative">
                        <textarea
                          className={`w-full px-4 py-3 bg-gray-800/50 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none ${
                            !isEditMode ? 'cursor-default' : ''
                          } ${
                            isEditMode && descriptionStatus.type === 'short' 
                              ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' 
                              : isEditMode && descriptionStatus.type === 'long' 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-700'
                          }`}
                          rows={5}
                          value={descriptionText}
                          onChange={(e) => {
                            setDescriptionText(e.target.value);
                            handleFormDataChange('description', e.target.value);
                          }}
                          readOnly={!isEditMode}
                          placeholder="Enter a brief description of your MCP server..."
                        />
                        {isEditMode && (
                          <div className="absolute bottom-3 right-3 text-xs font-medium">
                            <span className={`${
                              descriptionStatus.type === 'short' 
                                ? 'text-orange-400' 
                                : descriptionStatus.type === 'long' 
                                ? 'text-red-400' 
                                : 'text-green-400'
                            }`}>
                              {getDescriptionCharCount()}/100
                            </span>
                          </div>
                        )}
                      </div>
                      {isEditMode && (
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-gray-400 text-sm">
                            Provide a clear and concise description (50-100 characters)
                          </p>
                          <p className={`text-sm font-medium ${
                            descriptionStatus.type === 'short' 
                              ? 'text-orange-400' 
                              : descriptionStatus.type === 'long' 
                              ? 'text-red-400' 
                              : 'text-green-400'
                          }`}>
                            {descriptionStatus.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Link Information Section */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Link Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Service Type
                      </label>
                      <select 
                        value={editFormData.serviceType}
                        onChange={(e) => handleFormDataChange('serviceType', e.target.value)}
                        disabled={!isEditMode}
                        className={`w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                          !isEditMode ? 'cursor-default opacity-70' : ''
                        }`}
                      >
                        <option value="sse">sse (URL Connection)</option>
                        <option value="websocket">WebSocket</option>
                        <option value="http">HTTP API</option>
                        <option value="tcp">TCP Socket</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Service URL
                      </label>
                      <input
                        type="url"
                        value={editFormData.serviceURL}
                        onChange={(e) => handleFormDataChange('serviceURL', e.target.value)}
                        readOnly={!isEditMode}
                        placeholder="https://your-service.com"
                        className={`w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-gray-500 ${
                          !isEditMode ? 'cursor-default' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Logo and Auto Review Results */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Logo Preview</h3>
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-600 w-32 h-32 flex items-center justify-center mx-auto">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${isEditMode ? editFormData.serviceName : mcpServer.mcpServerName}`} 
                      alt="Service Logo" 
                      className="w-16 h-16 rounded-lg"
                    />
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <button 
                      className="w-36 mx-auto flex items-center justify-center gap-2 px-3 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap text-sm"
                      disabled={!isEditMode}
                    >
                      <Upload size={16} />
                      Upload Image
                    </button>
                    <p className="text-red-400 text-sm text-center">
                      <span className="text-red-400">*</span> Maximum file size: 2MB
                    </p>
                  </div>
                </div>

                {/* Auto Review Results */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Auto Review Results</h3>
                  <div className="bg-black rounded-lg p-6 border border-gray-700">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Overall Score</span>
                          <span className="text-white font-medium">92.2%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: '92.2%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Content Quality</span>
                          <span className="text-white font-medium">86.7%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '86.7%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Safety Check</span>
                          <span className="text-white font-medium">100.0%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Compliance</span>
                          <span className="text-white font-medium">90.0%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            mcpServer.status === 'Auto Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {mcpServer.status}
                          </div>
                          <span className="text-sm text-gray-400">
                            {mcpServer.status === 'Auto Approved' ? 'Passed automatic review' : 'Failed automatic review'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'document' ? (
          // Documentation tab content
          <div className="p-8">
            <div className="space-y-8">
              {/* File Upload Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Upload Documentation</h3>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-purple-400 bg-purple-600/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {uploadedMarkdown ? (
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <FileText className="text-blue-400" size={24} />
                            <div className="text-left">
                              <p className="text-white font-medium">{uploadedMarkdown.file.name}</p>
                              <p className="text-gray-400 text-sm">
                                {(uploadedMarkdown.file.size / 1024).toFixed(1)} KB • Markdown
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={removeMarkdownFile}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Last updated: {uploadedMarkdown.uploadTime.toLocaleString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => markdownInputRef.current?.click()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Replace File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileText className="mx-auto text-gray-400" size={48} />
                      <div>
                        <p className="text-white mb-2">Drop your markdown file here</p>
                        <p className="text-gray-400 text-sm mb-4">or click to browse</p>
                        <button
                          onClick={() => markdownInputRef.current?.click()}
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Choose File
                        </button>
                      </div>
                      <p className="text-gray-500 text-xs">
                        Supports: .md, .markdown files only
                      </p>
                    </div>
                  )}
                  
                  <input
                    ref={markdownInputRef}
                    type="file"
                    accept=".md,.markdown"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* File Preview Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                
                <div className="bg-black rounded-lg p-6 border border-gray-700 min-h-[400px]">
                  {uploadedMarkdown ? (
                    <div 
                      className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownPreview(uploadedMarkdown.content) 
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[300px]">
                      <div className="text-center">
                        <FileText className="mx-auto text-gray-600 mb-4" size={64} />
                        <p className="text-gray-500">Upload a markdown file to see the preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'video' ? (
          // Video tab content
          <div className="p-8">
            <div className="space-y-8">
              {/* Video Upload Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Upload Video</h3>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isVideoDragOver 
                      ? 'border-purple-400 bg-purple-600/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragOver={handleVideoDragOver}
                  onDragLeave={handleVideoDragLeave}
                  onDrop={handleVideoDrop}
                >
                  {uploadedVideo ? (
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-red-600 p-2 rounded">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="text-white font-medium">{uploadedVideo.file.name}</p>
                              <p className="text-gray-400 text-sm">
                                {(uploadedVideo.file.size / 1024 / 1024).toFixed(1)} MB • MP4 Video
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={removeVideoFile}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Last updated: {uploadedVideo.uploadTime.toLocaleString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Replace Video
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-red-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white mb-2">Drop your video file here</p>
                        <p className="text-gray-400 text-sm mb-4">or click to browse</p>
                        <button
                          onClick={() => videoInputRef.current?.click()}
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Choose Video
                        </button>
                      </div>
                      <p className="text-gray-500 text-xs">
                        Supports: MP4 files only
                      </p>
                    </div>
                  )}
                  
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept=".mp4,video/mp4"
                    onChange={handleVideoInputChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Video Player Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Video Player</h3>
                
                <div className="bg-black rounded-lg p-6 border border-gray-700">
                  {uploadedVideo ? (
                    <video 
                      controls 
                      className="w-full max-w-4xl mx-auto rounded-lg"
                      style={{ maxHeight: '500px' }}
                    >
                      <source src={uploadedVideo.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="flex items-center justify-center min-h-[300px]">
                      <div className="text-center">
                        <div className="bg-gray-700 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-gray-500">Upload a video to start playing</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Review History tab content
          <div className="p-8">
            {renderReviewHistory()}
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showApproveModal}
        title="Confirm Approval"
        message={`Are you sure you want to approve this MCP server: ${mcpServer.mcpServerName}?`}
        confirmText="Approve"
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
      />

      <ConfirmModal
        isOpen={showRejectModal}
        title="Confirm Rejection"
        message={`Are you sure you want to reject this MCP server: ${mcpServer.mcpServerName}?`}
        confirmText="Reject"
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
      />
    </div>
  );
};