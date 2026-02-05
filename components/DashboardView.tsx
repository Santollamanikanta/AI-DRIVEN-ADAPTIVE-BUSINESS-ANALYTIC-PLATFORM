
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { NavItem } from '../types';
import Chart from './ui/Chart';

interface DashboardViewProps {
  chartData: any;
  onNavigate: (view: NavItem) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ chartData, onNavigate }) => {
  const username = localStorage.getItem('loggedInUser') || 'Business Owner';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {username}!</h1>
        <p className="mt-2 text-slate-500">Here's your business snapshot. Let's make today productive.</p>
      </div>

      {chartData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Sales Performance</h2>
            <Chart type="bar" data={chartData.barChart} />
          </Card>
          <Card>
            <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
            <Chart type="pie" data={chartData.pieChart} />
          </Card>
        </div>
      ) : (
        <Card className="text-center">
            <h2 className="text-xl font-semibold text-slate-900">No Data to Display</h2>
            <p className="mt-2 text-slate-500">
                Start by uploading your sales data to generate insights and visualize your performance.
            </p>
            <Button onClick={() => onNavigate('Data Hub')} className="mt-6">
                Upload Data
            </Button>
        </Card>
      )}
    </div>
  );
};

export default DashboardView;
