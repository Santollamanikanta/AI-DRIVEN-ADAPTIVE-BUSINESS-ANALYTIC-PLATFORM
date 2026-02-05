import React, { useState } from 'react';
import type { Customer } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { generateCrmEmailWithClaude, getCustomerInsights } from '../services/groqService';
import { sendEmailViaApi } from '../services/mailService';
import { SparklesIcon, UsersIcon, LightBulbIcon, PlusIcon, EnvelopeIcon, CheckCircleIcon } from './icons';

const CrmView: React.FC = () => {
  // State for Customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // State for Email Generation
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [greeting, setGreeting] = useState('Dear');
  const [topic, setTopic] = useState('checking in');

  // State for Automatic Sending
  const [sendingAutomatic, setSendingAutomatic] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // State for Customer Insights
  const [customerInsights, setCustomerInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [errorInsights, setErrorInsights] = useState('');

  // State for New Customer Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', lastPurchase: '' });

  const handleGenerateEmail = async () => {
    if (!selectedCustomer) {
      setErrorEmail('Please select a customer first.');
      return;
    }
    setLoadingEmail(true);
    setErrorEmail('');
    setGeneratedEmail('');
    setSendSuccess('');
    try {
      const email = await generateCrmEmailWithClaude(
        selectedCustomer.name,
        selectedCustomer.lastPurchase,
        greeting,
        topic
      );
      setGeneratedEmail(email);
    } catch (e) {
      setErrorEmail('Failed to generate email. Please try again.');
      console.error(e);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleAutoSend = async () => {
    if (!selectedCustomer || !generatedEmail) return;

    setSendingAutomatic(true);
    setSendSuccess('');
    setErrorEmail('');
    setShowSetupGuide(false); // Hide guide on new attempt

    const subjectMatch = generatedEmail.match(/Subject:\s*(.*)/i);
    const bodyMatch = generatedEmail.match(/Body:\s*([\s\S]*)/i);

    const subject = subjectMatch ? subjectMatch[1].trim() : `Update for ${selectedCustomer.name}`;
    const body = bodyMatch ? bodyMatch[1].trim() : generatedEmail;

    try {
      const response = await sendEmailViaApi(selectedCustomer.email, subject, body);
      if (response.success) {
        setSendSuccess(response.message);
        // Clear the draft after successful auto-send
        setTimeout(() => setGeneratedEmail(''), 3000);
      } else {
        setErrorEmail(response.message);
        if (response.message.includes('VITE_EMAILJS') || response.message.includes('not configured')) {
          setShowSetupGuide(true);
        }
      }
    } catch (err: any) {
      setErrorEmail("Failed to automate send.");
      if (err.message && (err.message.includes('VITE_EMAILJS') || err.message.includes('not configured'))) {
        setShowSetupGuide(true);
      }
    } finally {
      setSendingAutomatic(false);
    }
  };

  const handleGetInsights = async () => {
    if (!selectedCustomer) return;

    setLoadingInsights(true);
    setErrorInsights('');
    setCustomerInsights('');
    try {
      const result = await getCustomerInsights(selectedCustomer.name, selectedCustomer.lastPurchase);
      setCustomerInsights(result);
    } catch (err: any) {
      setErrorInsights(`Failed to get insights: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) return;

    const customer: Customer = {
      id: Date.now(),
      ...newCustomer
    };

    setCustomers([customer, ...customers]);
    setNewCustomer({ name: '', email: '', lastPurchase: '' });
    setShowAddForm(false);
    setSelectedCustomer(customer);
  };

  const onSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setGeneratedEmail('');
    setCustomerInsights('');
    setErrorEmail('');
    setErrorInsights('');
    setSendSuccess('');
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Personal CRM</h1>
          <p className="text-slate-500">Manage real leads and automate your personalized outreach.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            variant="outline"
            className="text-xs border-slate-200"
          >
            {showSetupGuide ? 'Hide Setup' : 'How to send real emails?'}
          </Button>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "outline" : "primary"}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{showAddForm ? 'Cancel' : 'New Lead'}</span>
          </Button>
        </div>
      </div>

      {showSetupGuide && (
        <Card className="bg-blue-50 border-blue-200 animate-in slide-in-from-top-2 duration-300">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Email Configuration (EmailJS)</h3>
          <p className="text-sm text-blue-800 mb-4 opacity-80">I have restored your EmailJS keys. Here is the final fix to send to customers:</p>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border-2 border-green-500 shadow-sm">
              <h4 className="font-bold text-green-700 flex items-center gap-2 mb-2">
                🏁 THE "SEND TO ANYONE" FIX
              </h4>
              <p className="text-xs text-slate-700 mb-2">Go to <strong>EmailJS Dashboard</strong> {'->'} <strong>Email Templates</strong> {'->'} <strong>Settings</strong>.</p>
              <div className="bg-green-50 p-2 rounded border border-green-200 text-xs">
                <p className="font-bold text-green-800 mb-1">Find the "To Email" field:</p>
                <p className="mb-2">Delete your email address and type exactly this:</p>
                <code className="bg-white px-2 py-1 rounded border border-green-300 text-green-700 font-bold">{"{{to_email}}"}</code>
              </div>
              <p className="mt-2 text-[10px] text-slate-500 italic">*This is the ONLY way to send automated emails to customers without owning a website domain.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 opacity-60">
              <div className="bg-white p-2 rounded-lg border border-blue-100 text-[10px]">
                <p className="font-bold text-blue-600">✅ Service ID</p>
                <p className="font-mono">service_bf5kwzo</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100 text-[10px]">
                <p className="font-bold text-blue-600">✅ Template ID</p>
                <p className="font-mono">template_qhzt74m</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100 text-[10px]">
                <p className="font-bold text-blue-600">✅ Public Key</p>
                <p className="font-mono">LPicBeELD...Z</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {showAddForm && (
        <Card className="bg-slate-50 border-teal-100 animate-in slide-in-from-top-4 duration-300 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Add New Lead</h2>
          <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                placeholder="e.g. Manikanta"
                value={newCustomer.name}
                onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                placeholder="user@example.com"
                value={newCustomer.email}
                onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Topic / Last Purchase</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                placeholder="e.g. Milk"
                value={newCustomer.lastPurchase}
                onChange={e => setNewCustomer({ ...newCustomer, lastPurchase: e.target.value })}
              />
            </div>
            <Button type="submit" variant="primary" className="h-[42px]">Add Lead</Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="md:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Your Leads</h2>
            {customers.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                <UsersIcon className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No leads added yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => onSelectCustomer(customer)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedCustomer?.id === customer.id
                      ? 'bg-teal-50 border-teal-500 shadow-md ring-1 ring-teal-500'
                      : 'bg-white border-slate-100 hover:border-teal-200 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-900">{customer.name}</p>
                      {selectedCustomer?.id === customer.id && <CheckCircleIcon className="w-5 h-5 text-teal-600" />}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{customer.email}</p>
                    {customer.lastPurchase && (
                      <div className="mt-2 text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full inline-block">
                        {customer.lastPurchase}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* AI Workspace */}
        <div className="md:col-span-2 space-y-6">
          {selectedCustomer ? (
            <>
              {/* Dynamic Outreach Tool */}
              <Card className="border-teal-100">
                <div className="flex items-center gap-2 mb-6">
                  <EnvelopeIcon className="w-6 h-6 text-teal-600" />
                  <h2 className="text-xl font-semibold">AI Automated Outreach</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Greeting Style</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                      value={greeting}
                      onChange={e => setGreeting(e.target.value)}
                    >
                      <option value="Hi">Hi {selectedCustomer.name}</option>
                      <option value="Dear">Dear {selectedCustomer.name}</option>
                      <option value="Hey">Hey {selectedCustomer.name}!</option>
                      <option value="Greetings">Greetings, {selectedCustomer.name}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message Topic</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                      placeholder="e.g. 10% discount on milk"
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button onClick={handleGenerateEmail} disabled={loadingEmail} className="w-full flex items-center justify-center gap-2 py-6 text-lg">
                    {loadingEmail ? <Loader className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5 text-teal-200" />}
                    <span>{loadingEmail ? 'AI is drafting...' : 'Draft Personalized Message'}</span>
                  </Button>

                  {errorEmail && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{errorEmail}</p>}
                  {sendSuccess && <p className="text-teal-600 text-sm font-bold text-center bg-teal-50 p-2 rounded-lg flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    {sendSuccess}
                  </p>}

                  {generatedEmail && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 shadow-inner overflow-hidden">
                        <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">AI Draft Ready</span>
                        </div>
                        <div className="p-8 prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-slate-800 font-medium">
                          {generatedEmail}
                        </div>
                        <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
                          <Button
                            variant="primary"
                            className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 px-8"
                            onClick={handleAutoSend}
                            disabled={sendingAutomatic}
                          >
                            {sendingAutomatic ? <Loader className="w-4 h-4" /> : <EnvelopeIcon className="w-4 h-4" />}
                            <span>{sendingAutomatic ? 'Sending Automatically...' : 'Auto-Send (API)'}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="bg-amber-50/30 border-amber-100">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <LightBulbIcon className="w-6 h-6 text-amber-500" />
                  AI Lead Insight
                </h2>
                <Button
                  onClick={handleGetInsights}
                  disabled={loadingInsights}
                  variant="secondary"
                  size="sm"
                  className="mb-4"
                >
                  {loadingInsights ? 'Analyzing...' : 'Analyze Persona'}
                </Button>
                {customerInsights && (
                  <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm animate-in fade-in">
                    <div
                      className="prose prose-sm max-w-none text-slate-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: customerInsights
                          .replace(/^#+\s+(.*)$/gm, '<h4 class="font-bold text-amber-800 mt-4 mb-2">$1</h4>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/^\s*[-*]\s+(.*)$/gm, '<li class="ml-4 list-disc text-amber-900">$1</li>')
                          .replace(/\n/g, '<br />')
                      }}
                    />
                  </div>
                )}
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400 border-4 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
              <UsersIcon className="w-16 h-16 opacity-10 mb-4" />
              <h3 className="text-2xl font-bold text-slate-700">Select a Lead</h3>
              <p className="text-slate-500">Pick someone from your CRM to start automated outreach.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrmView;
