
import React, { useState, useCallback } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { analyzeImageWithGemini } from '../services/geminiService';
import type { SalesRecord } from '../types';
import { DocumentTextIcon, PhotoIcon } from './icons';

declare const XLSX: any; // From CDN

interface DataViewProps {
  onDataUploaded: (data: SalesRecord[]) => void;
}

const DataView: React.FC<DataViewProps> = ({ onDataUploaded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState('');

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setImageAnalysis('');
    setLoading(true);
    try {
      const result = await analyzeImageWithGemini(file);
      setImageAnalysis(result);
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Data Hub</h1>
      <p className="text-slate-500">Upload your business data to fuel the AI analysis. You can upload structured data like Excel sheets or unstructured data like photos of handwritten bills.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <div className="flex items-center gap-4 mb-4">
                <DocumentTextIcon className="w-8 h-8 text-teal-600"/>
                <h2 className="text-xl font-semibold">Upload Sales Data</h2>
            </div>
          <p className="text-slate-500 mb-4">Upload an Excel file (.xlsx, .csv) with your sales records.</p>
          <input
            type="file"
            id="excel-upload"
            className="hidden"
            accept=".xlsx, .xls, .csv"
            onChange={handleExcelUpload}
          />
          <Button onClick={() => document.getElementById('excel-upload')?.click()} disabled={loading} variant="secondary">
            {loading ? 'Processing...' : 'Choose Excel File'}
          </Button>
        </Card>
        
        <Card>
            <div className="flex items-center gap-4 mb-4">
                <PhotoIcon className="w-8 h-8 text-teal-600"/>
                <h2 className="text-xl font-semibold">Analyze a Document</h2>
            </div>
            <p className="text-slate-500 mb-4">Upload an image of a handwritten bill or document.</p>
            <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            <Button onClick={() => document.getElementById('image-upload')?.click()} disabled={loading} variant="secondary">
                {loading ? 'Analyzing...' : 'Choose Image File'}
            </Button>
        </Card>
      </div>

      {loading && <div className="flex justify-center"><Loader text="AI is processing your data..."/></div>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {imageAnalysis && (
        <Card>
          <h3 className="text-xl font-semibold mb-2">Image Analysis Result</h3>
          <div className="prose prose-sm max-w-none prose-slate" dangerouslySetInnerHTML={{ __html: imageAnalysis.replace(/\n/g, '<br />') }} />
        </Card>
      )}
    </div>
  );
};

export default DataView;
