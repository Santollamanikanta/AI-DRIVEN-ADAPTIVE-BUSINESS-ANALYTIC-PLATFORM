

import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// This function must be called right before making an API call to ensure the latest key is used.
const getGenAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const analyzeDataWithGemini = async (jsonData: string): Promise<string> => {
    const ai = getGenAIClient();
    const prompt = `
        You are a business intelligence expert for small businesses.
        Analyze the following sales data and provide:
        1. A brief, easy-to-understand summary of the key findings.
        2. Identification of the highest and lowest sales periods/products.
        3. A data-driven prediction for future business trends based on this data.
        4. Actionable recommendations for the business owner.
        
        Format your response in clear, well-structured markdown.

        Here is the sales data in JSON format:
        ${jsonData}
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });
    return response.text;
};

export const getChartDataWithGemini = async (jsonData: string): Promise<string> => {
    const ai = getGenAIClient();
    const prompt = `
        Based on the following sales data, generate a JSON object for a dashboard.
        The JSON object should have two properties: "barChart" and "pieChart".
        "barChart" should be an array of objects for a bar chart, with each object having "name" (e.g., month or product) and "value" (e.g., total sales).
        "pieChart" should be an array of objects for a pie chart, with each object having "name" (e.g., category) and "value" (e.g., sales count or amount).
        Choose the most relevant data points to visualize.

        Sales Data:
        ${jsonData}
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    barChart: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                value: { type: Type.NUMBER },
                            },
                        },
                    },
                    pieChart: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                value: { type: Type.NUMBER },
                            },
                        },
                    },
                },
            },
        },
    });

    return response.text;
};

export const analyzeImageWithGemini = async (imageFile: File): Promise<string> => {
    const ai = getGenAIClient();
    const base64Image = await fileToBase64(imageFile);
    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: base64Image,
        },
    };
    const textPart = {
        text: `Analyze this image, which is likely a handwritten bill or business document. Extract all relevant information such as items, quantities, prices, and totals. If it's not a bill, describe the content in detail from a business perspective. Present the extracted data in a clean, structured format (like a table in markdown).`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
};

export const generateCrmEmailWithGemini = async (customerName: string, lastPurchase: string): Promise<string> => {
    const ai = getGenAIClient();
    const prompt = `Generate a friendly, personalized marketing email to a customer named ${customerName}. Their last purchase was ${lastPurchase}. The goal is to re-engage them, perhaps mentioning a new product or a special offer. Keep it concise and professional.`;

    const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: prompt,
    });
    
    return response.text;
};

// Fix: Add generateImageWithGemini function to generate images using gemini-3-pro-image-preview.
export const generateImageWithGemini = async (prompt: string, imageSize: '1K' | '2K' | '4K'): Promise<string> => {
    const ai = getGenAIClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            imageConfig: {
                aspectRatio: "1:1",
                imageSize: imageSize,
            },
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64EncodeString: string = part.inlineData.data;
            return `data:image/png;base64,${base64EncodeString}`;
        }
    }
    
    throw new Error("No image generated.");
};

// Fix: Add editImageWithGemini function to edit images using gemini-2.5-flash-image.
export const editImageWithGemini = async (prompt: string, imageFile: File): Promise<string> => {
    const ai = getGenAIClient();
    const base64Image = await fileToBase64(imageFile);
    
    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: base64Image,
        },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64EncodeString: string = part.inlineData.data;
            return `data:image/png;base64,${base64EncodeString}`;
        }
    }
    
    throw new Error("No image generated from edit.");
};
