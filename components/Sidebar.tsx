import React from 'react';
import type { NavItem } from '../types';
import { BIcon, ChartPieIcon, ArrowUpOnSquareIcon, LightBulbIcon, UsersIcon, ArrowLeftOnRectangleIcon } from './icons';

interface SidebarProps {
  activeTab: NavItem;
  setActiveTab: (tab: NavItem) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen }) => {
  const navItems: { name: NavItem; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { name: 'Dashboard', icon: ChartPieIcon },
    { name: 'Data Hub', icon: ArrowUpOnSquareIcon },
    { name: 'Analytics', icon: LightBulbIcon },
    { name: 'CRM', icon: UsersIcon },
  ];

  return (
    <div className="w-16 md:w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="flex items-center justify-center md:justify-start gap-3 h-20 border-b border-slate-200 px-4">
        <BIcon className="w-8 h-8 text-teal-600 flex-shrink-0" />
        <h1 className="text-2xl font-bold text-slate-900 hidden md:block">Business</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.name)
            }}
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeTab === item.name
              ? 'bg-teal-600 text-white font-semibold'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            <span className="ml-4 hidden md:block">{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="px-2 py-4 border-t border-slate-200">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          className="flex items-center p-3 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
          <span className="ml-4 hidden md:block">Logout</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;