import React from 'react';
import { 
  LogOut,
  Server
} from 'lucide-react';

export const SideNav: React.FC = () => {
  return (
    <div className="bg-black text-white w-64 flex-shrink-0 hidden md:flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b border-gray-700">
        <div className="bg-purple-600 text-white p-1.5 rounded">
          <Server size={20} />
        </div>
        <span className="font-semibold text-lg">MCP Central</span>
      </div>
      
      <nav className="flex-1 py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Main
        </div>
        <NavItem icon={<Server size={18} />} label="MCP Server Review List" active />
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-full">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-4 py-2 my-1 text-sm transition-colors ${
        active 
          ? 'bg-purple-600 text-white' 
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
};