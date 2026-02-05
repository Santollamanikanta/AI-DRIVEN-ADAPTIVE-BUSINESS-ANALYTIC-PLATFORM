
import React, { useState } from 'react';
import type { Customer } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { generateCrmEmailWithGemini } from '../services/geminiService';
import { SparklesIcon } from './icons';

const mockCustomers: Customer[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', lastPurchase: 'Coffee Beans' },
  { id: 2, name: 'Bob Williams', email: 'bob@example.com', lastPurchase: 'Pastry Box' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', lastPurchase: 'Gift Card' },
  { id: 4, name: 'Diana Miller', email: 'diana@example.com', lastPurchase: 'Subscription' },
];

const CrmView: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateEmail = async () => {
    if (!selectedCustomer) {
      setError('Please select a customer first.');
      return;
    }
    setLoading(true);
    setError('');
    setGeneratedEmail('');
    try {
      const email = await generateCrmEmailWithGemini(selectedCustomer.name, selectedCustomer.lastPurchase);
      setGeneratedEmail(email);
    } catch (e) {
      setError('Failed to generate email. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Customer Engagement Hub</h1>
      <p className="text-slate-500">Connect with your customers. Use AI to craft personalized messages for marketing and feedback.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="md:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Customer List</h2>
            <div className="space-y-2">
              {mockCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCustomer?.id === customer.id ? 'bg-teal-50' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-semibold text-slate-800">{customer.name}</p>
                  <p className="text-sm text-slate-500">{customer.email}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Email Generator */}
        <div className="md:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4">AI Email Composer</h2>
            {selectedCustomer ? (
              <div className="space-y-4">
                <p><span className="font-semibold text-slate-600">To:</span> {selectedCustomer.name}</p>
                <p><span className="font-semibold text-slate-600">Last Purchase:</span> {selectedCustomer.lastPurchase}</p>
                
                <Button onClick={handleGenerateEmail} disabled={loading}>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                  {loading ? 'Generating...' : 'Generate Re-engagement Email'}
                </Button>

                {loading && <Loader />}
                {error && <p className="text-red-500">{error}</p>}
                
                {generatedEmail && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold mb-2">Generated Email:</h3>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap prose-slate">{generatedEmail}</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500">Select a customer to start composing an email.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrmView;
