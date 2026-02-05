
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardView from './DashboardView';
import DataView from './DataView';
import AnalyticsView from './AnalyticsView';
import CrmView from './CrmView';
import type { NavItem, SalesRecord } from '../types';

interface MainAppProps {
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<NavItem>('Dashboard');
  const [uploadedData, setUploadedData] = useState<SalesRecord[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [chartData, setChartData] = useState<any>(null);

  const handleDataUploaded = (data: SalesRecord[]) => {
    setUploadedData(data);
    setActiveView('Analytics'); // Switch to analytics view after upload
  };

  const handleAnalysisComplete = (analysis: string, charts: any) => {
    setAnalysisResult(analysis);
    setChartData(charts);
  };

  const renderView = () => {
    switch (activeView) {
      case 'Dashboard':
        return <DashboardView chartData={chartData} onNavigate={setActiveView} />;
      case 'Data Hub':
        return <DataView onDataUploaded={handleDataUploaded} />;
      case 'Analytics':
        return <AnalyticsView
          salesData={uploadedData}
          analysisResult={analysisResult}
          chartData={chartData}
          onAnalysisComplete={handleAnalysisComplete}
        />;
      case 'CRM':
        return <CrmView />;
      default:
        return <DashboardView chartData={chartData} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <Sidebar activeTab={activeView} setActiveTab={setActiveView} onLogout={onLogout} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default MainApp;