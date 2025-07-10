import React from 'react';
import { DelistModal } from './DelistModal';
import { Info } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  onDelist?: (reason: string) => void;
  autoReviewResults?: {
    overallScore?: number;
    contentQuality?: number;
    safetyCheck?: number;
    compliance?: number;
  };
  rejectReason?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  onDelist, 
  autoReviewResults,
  rejectReason = "The content lacks sufficient clarity, detail, and coherence. The title and description are identical and provide no additional context or value, which significantly impacts Content Quality and Compliance. Additionally, the prompt suggests a purpose that is not clearly aligned with the title or description, leading to inconsistency across the three fields."
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showDelistModal, setShowDelistModal] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'Auto Approved':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'Auto Rejected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'Published':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'Rejected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'Delisted':
    case 'Unlisted':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  const handleDelist = (reason: string) => {
    onDelist?.(reason);
    setShowDelistModal(false);
    setShowDropdown(false);
  };

  const shouldShowTooltip = status === 'Auto Rejected' || status === 'Rejected' || status === 'Unlisted' || status === 'Auto Approved';

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {status === 'Published' ? (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
          >
            {status}
          </button>
        ) : (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
            {status}
          </span>
        )}
        
        {shouldShowTooltip && (
          <div className="relative group">
            <span className="w-4 h-4 flex items-center justify-center bg-white rounded-full text-xs border border-gray-300 cursor-help">
              <Info size={12} className="text-gray-600" />
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-gray-900 rounded-lg shadow-lg p-4 w-64 text-white border border-gray-800">
                {status === 'Auto Approved' || status === 'Auto Rejected' ? (
                  <>
                    <h3 className="text-base font-medium mb-4">Auto Review Results</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-400">Overall Score:</span>
                          <span>{autoReviewResults?.overallScore?.toFixed(1)}%</span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${autoReviewResults?.overallScore}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-400">Content Quality:</span>
                          <span>{autoReviewResults?.contentQuality?.toFixed(1)}%</span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${autoReviewResults?.contentQuality}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-400">Safety Check:</span>
                          <span>{autoReviewResults?.safetyCheck?.toFixed(1)}%</span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${autoReviewResults?.safetyCheck}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-400">Compliance:</span>
                          <span>{autoReviewResults?.compliance?.toFixed(1)}%</span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full" 
                            style={{ width: `${autoReviewResults?.compliance}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-medium mb-2">Rejection Reason</h3>
                    <p className="text-sm text-gray-300">{rejectReason}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {showDropdown && status === 'Published' && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-50">
          <button
            onClick={() => setShowDelistModal(true)}
            className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Delist
          </button>
        </div>
      )}

      <DelistModal
        isOpen={showDelistModal}
        onClose={() => setShowDelistModal(false)}
        onConfirm={handleDelist}
      />
    </div>
  );
};