

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Loader } from './ui/Loader';
import { generateImageWithGemini, editImageWithGemini } from '../services/geminiService';
import { PhotoIcon, SparklesIcon } from './icons';

type Mode = 'generate' | 'edit';

const ImageStudioView: React.FC = () => {
    const [mode, setMode] = useState<Mode>('generate');
    const [prompt, setPrompt] = useState('');
    const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setResultUrl(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Fix: Implement correct API key selection flow for image generation.
    const handleSubmit = async () => {
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        if (mode === 'edit' && !imageFile) {
            setError('Please upload an image to edit.');
            return;
        }

        setLoading(true);
        setError('');
        setResultUrl(null);

        try {
            let imageUrl: string;
            if (mode === 'generate') {
                if (!(await window.aistudio.hasSelectedApiKey())) {
                    await window.aistudio.openSelectKey();
                    // Assume key is now selected and proceed
                }
                imageUrl = await generateImageWithGemini(prompt, imageSize);
            } else {
                // Edit mode uses gemini-2.5-flash-image, which does not require a paid key.
                imageUrl = await editImageWithGemini(prompt, imageFile!);
            }
            setResultUrl(imageUrl);
        } catch (err: any) {
            if (err.message?.includes("Requested entity was not found.")) {
                 setError("API key not valid. Please select a valid key to continue.");
                 await window.aistudio.openSelectKey();
            } else {
                setError('An error occurred during image generation. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Image Studio</h1>
            <p className="text-slate-500">Create stunning visuals for your business or edit existing images with the power of AI.</p>

            <div className="flex gap-2 p-1 rounded-lg bg-slate-100 border border-slate-200 self-start w-fit">
                <Button onClick={() => setMode('generate')} variant={mode === 'generate' ? 'solid' : 'ghost'} className={mode === 'generate' ? 'bg-white shadow-sm !text-teal-700' : ''}>Generate Image</Button>
                <Button onClick={() => setMode('edit')} variant={mode === 'edit' ? 'solid' : 'ghost'} className={mode === 'edit' ? 'bg-white shadow-sm !text-teal-700' : ''}>Edit Image</Button>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Input Column */}
                    <div className="space-y-4">
                        <Input
                            label={mode === 'generate' ? "Describe the image you want to create" : "Describe the edit you want to make"}
                            placeholder="e.g., A modern logo for a coffee shop, vector style"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />

                        {mode === 'generate' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Image Size</label>
                                <div className="flex gap-2">
                                    {(['1K', '2K', '4K'] as const).map(size => (
                                        <Button key={size} variant={imageSize === size ? 'secondary' : 'outline'} onClick={() => setImageSize(size)}>
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {mode === 'edit' && (
                            <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-md" />
                                ) : (
                                    <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
                                )}
                                <input id="edit-image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                <Button onClick={() => document.getElementById('edit-image-upload')?.click()} className="mt-4" variant="outline">
                                    Upload Image
                                </Button>
                            </div>
                        )}

                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            {loading ? 'Working on it...' : (mode === 'generate' ? 'Generate' : 'Apply Edit')}
                        </Button>
                         {error && <p className="text-sm text-red-500">{error} {error.includes("API key") && <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">Billing Info</a>}</p>}
                    </div>
                    {/* Output Column */}
                    <div className="flex items-center justify-center bg-slate-100 rounded-lg min-h-[300px] aspect-square" style={{ backgroundImage: 'repeating-conic-gradient(#e2e8f0 0% 25%, transparent 0% 50%)', backgroundSize: '16px 16px' }}>
                        {loading ? <Loader text="AI is creating magic..." /> : 
                         resultUrl ? <img src={resultUrl} alt="Generated result" className="rounded-lg object-contain max-h-full max-w-full" /> : 
                         <div className="text-center text-slate-500">
                            <PhotoIcon className="mx-auto h-16 w-16" />
                            <p>Your image will appear here</p>
                         </div>
                        }
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ImageStudioView;
