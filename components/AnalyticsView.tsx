
import React, { useEffect, useState } from 'react';
import type { SalesRecord } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { analyzeDataWithGemini, getChartDataWithGemini } from '../services/geminiService';
import Chart from './ui/Chart';

interface AnalyticsViewProps {
  salesData: SalesRecord[];
  analysisResult: string;
  chartData: any;
  onAnalysisComplete: (analysis: string, charts: any) => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ salesData, analysisResult, chartData, onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runAnalysis = async () => {
    if (salesData.length === 0) return;
    
    setLoading(true);
    setError('');
    try {
      const jsonData = JSON.stringify(salesData);
      const [analysis, chartsResponse] = await Promise.all([
        analyzeDataWithGemini(jsonData),
        getChartDataWithGemini(jsonData)
      ]);
      const parsedCharts = JSON.parse(chartsResponse);
      onAnalysisComplete(analysis, parsedCharts);
    } catch (e) {
      console.error("Analysis failed:", e);
      setError("An error occurred while analyzing the data. The AI might be busy, please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically run analysis if data is present but results are not
    if (salesData.length > 0 && !analysisResult) {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesData]);

  if (salesData.length === 0) {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-2 text-slate-500">Please upload some data in the 'Data Hub' to generate analytics.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Business Analytics</h1>
        <Button onClick={runAnalysis} disabled={loading}>
          {loading ? 'Analyzing...' : 'Re-run Analysis'}
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader text="AI is generating insights..." />
        </div>
      )}

      {error && <p className="text-red-500 text-center p-4 bg-red-100 rounded-lg">{error}</p>}
      
      {!loading && analysisResult && (
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
                 <h2 className="text-xl font-semibold mb-4 text-slate-800">AI Insights & Predictions</h2>
                 <div 
                    className="prose prose-sm max-w-none text-slate-600 prose-headings:text-slate-700" 
                    dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
                />
            </Card>
            <div className="lg:col-span-2 space-y-6">
                {chartData?.barChart && (
                    <Card>
                        <h2 className="text-lg font-semibold mb-4">Sales Performance</h2>
                        <Chart type="bar" data={chartData.barChart} />
                    </Card>
                )}
                {chartData?.pieChart && (
                    <Card>
                        <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
                        <Chart type="pie" data={chartData.pieChart} />
                    </Card>
                )}
            </div>
         </div>
      )}
    </div>
  );
};

export default AnalyticsView;
