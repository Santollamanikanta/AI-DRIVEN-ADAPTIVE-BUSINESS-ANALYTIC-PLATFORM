import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { getMarketIntelligence } from '../services/groqService';
import type { SalesRecord } from '../types';
import { DocumentTextIcon, SparklesIcon } from './icons';

declare const XLSX: any; // From CDN

interface DataViewProps {
  onDataUploaded: (data: SalesRecord[]) => void;
}

const DataView: React.FC<DataViewProps> = ({ onDataUploaded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [marketAnalysis, setMarketAnalysis] = useState('');
  const [industry, setIndustry] = useState('');

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        onDataUploaded(json as SalesRecord[]);
      } catch (err) {
        setError('Failed to parse the Excel file. Please ensure it is a valid format.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleGetIntelligence = async () => {
    if (!industry.trim()) {
      setError('Please enter an industry or business type.');
      return;
    }

    setError('');
    setMarketAnalysis('');
    setLoading(true);
    try {
      const result = await getMarketIntelligence(industry);
      setMarketAnalysis(result);
    } catch (err: any) {
      setError(`Intelligence gathering failed: ${err.message || 'Unknown error'}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Data Hub</h1>
      <p className="text-slate-500">Fuel your business with AI. Upload your sales data for internal analysis, or use AI to scan the global market for your industry.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <DocumentTextIcon className="w-8 h-8 text-teal-600" />
            <h2 className="text-xl font-semibold">Upload Sales Data</h2>
          </div>
          <p className="text-slate-500 mb-4">Upload an Excel file (.xlsx, .csv) with your sales records to unlock deep internal analytics.</p>
          <input
            type="file"
            id="excel-upload"
            className="hidden"
            accept=".xlsx, .xls, .csv"
            onChange={handleExcelUpload}
          />
          <Button onClick={() => document.getElementById('excel-upload')?.click()} disabled={loading} variant="primary" className="w-full">
            {loading ? 'Processing...' : 'Choose Excel File'}
          </Button>
        </Card>

        <Card>
          <div className="flex items-center gap-4 mb-4">
            <SparklesIcon className="w-8 h-8 text-teal-600" />
            <h2 className="text-xl font-semibold">AI Market Intelligence</h2>
          </div>
          <p className="text-slate-500 mb-4">Type your industry below to get AI-generated trends, competitor analysis, and strategic advice.</p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Coffee Shop, Real Estate..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGetIntelligence()}
            />
            <Button onClick={handleGetIntelligence} disabled={loading} variant="secondary">
              Analyze
            </Button>
          </div>
        </Card>
      </div>

      {loading && <div className="flex justify-center"><Loader text="AI is gathering intelligence..." /></div>}
      {error && <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

      {marketAnalysis && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-teal-500" />
              Market Intelligence Report: {industry}
            </h3>
            <button
              onClick={() => setMarketAnalysis('')}
              className="text-slate-400 hover:text-slate-600 text-sm"
            >
              Clear
            </button>
          </div>
          <div
            className="prose prose-sm max-w-none text-slate-700 prose-headings:text-slate-900 prose-strong:text-teal-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: marketAnalysis
                .replace(/^#+\s+(.*)$/gm, '<h4 class="font-bold text-teal-800 mt-4 mb-1">$1</h4>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/^\s*[-*]\s+(.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
                .replace(/\n/g, '<br />')
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default DataView;
