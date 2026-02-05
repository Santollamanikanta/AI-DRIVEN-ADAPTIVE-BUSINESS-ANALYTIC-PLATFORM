export const analyzeDataWithClaude = async (jsonData: string): Promise<string> => {
    const truncatedJson = truncateData(jsonData);
    const prompt = `
        You are a business intelligence expert for small businesses.
        Analyze the following sales data (showing a sample of ${JSON.parse(truncatedJson).length} records) and provide:
        1. A brief, easy-to-understand summary of the key findings.
        2. Identification of the highest and lowest sales periods/products.
        3. A data-driven prediction for future business trends based on this data.
        4. Actionable recommendations for the business owner.
        
        Format your response in beautiful, clear markdown with headings, bullets, and bold text. NO RAW JSON.

        Here is the sales data in JSON format:
        ${truncatedJson}
    `;

    return await callGroq(prompt, "llama-3.3-70b-versatile", false);
};

export const getChartDataWithClaude = async (jsonData: string): Promise<string> => {
    const truncatedJson = truncateData(jsonData);
    const prompt = `
        Based on the following sales data (sample of ${JSON.parse(truncatedJson).length} records), generate a JSON object for a dashboard.
        The JSON object should have two properties: "barChart" and "pieChart".
        "barChart" should be an array of objects for a bar chart, with each object having "name" (e.g., month or product) and "value" (e.g., total sales).
        "pieChart" should be an array of objects for a pie chart, with each object having "name" (e.g., category) and "value" (e.g., sales count or amount).
        Choose the most relevant data points to visualize.
        
        IMPORTANT: Return ONLY the raw JSON string. Do not include markdown formatting like \`\`\`json.

        Sales Data:
        ${truncatedJson}
    `;

    const response = await callGroq(prompt, "llama-3.3-70b-versatile", true);
    const cleanResponse = response.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    return cleanResponse;
};

export const getMarketIntelligence = async (industry: string): Promise<string> => {
    const prompt = `You are a high-end business consultant. Provide a detailed Market Intelligence report for the "${industry}" industry. 
    Include:
    1. CURRENT TRENDS: What's happening right now?
    2. COMPETITIVE LANDSCAPE: Who are the major players and what are they doing?
    3. OPPORTUNITIES: Where can a small business win?
    4. STRATEGIC ADVICE: 3 clear steps for the next 6 months.
    
    Format in beautiful Markdown with emojis and bold highlights.`;

    return await callGroq(prompt, "llama-3.3-70b-versatile", false);
};

export const getCustomerInsights = async (customerName: string, purchaseHistory: string): Promise<string> => {
    const prompt = `Analyze this customer: "${customerName}" who previously bought "${purchaseHistory}". 
    Define their CUSTOMER PERSONA (e.g. Budget Conscious, Tech Enthusiast, Busy Professional).
    Predict their NEXT LIKELY PURCHASE.
    Suggest a TAILORED UPSELL STRATEGY.
    
    Format in clean Markdown.`;

    return await callGroq(prompt, "llama-3.3-70b-versatile", false);
};

export const generateCrmEmailWithClaude = async (customerName: string, lastPurchase: string, greeting: string = "Hi", topic: string = "checking in"): Promise<string> => {
    const prompt = `
        You are a customer relationship manager. Write a short, professional, and friendly email to a customer.
        Customer Name: ${customerName}
        Last Item Purchased: ${lastPurchase}
        Greeting Style: ${greeting}
        Specific Topic/Goal: ${topic}
        
        Requirements:
        1. Use the name and last purchase naturally.
        2. Keep it under 100 words.
        3. Clear and helpful subject line.
        4. No [Placeholders].
        5. Output in plain text (no markdown formatting symbols like # or *).

        Email structure:
        Subject: ...
        
        Body: ...
    `;
    return await callGroq(prompt, "llama-3.3-70b-versatile");
};

// --- Groq Helper Functions ---

const callGroq = async (prompt: string, model: string, isJson: boolean = false): Promise<string> => {
    const messages = [{ role: "user", content: prompt }];
    return await callGroqMessages(messages, model, isJson);
};


const callGroqMessages = async (messages: any[], model: string, isJson: boolean = false): Promise<string> => {
    try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("Missing Groq API Key! If you are on Vercel/Production, add VITE_GROQ_API_KEY to your Environment Variables in the dashboard.");
        }

        console.log("🚀 Groq API Call Starting...");
        console.log("Model:", model);
        console.log("API Key present:", !!apiKey);
        console.log("API Key prefix:", apiKey.substring(0, 10));

        // Using Llama 3.2 90B Vision Preview for better accuracy
        const modelToUse = model === "llama-3.2-11b-vision-preview" ? "llama-3.2-90b-vision-preview" : model;

        const response = await fetch('/groq-api/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`, // Key sent from client to proxy
            },
            body: JSON.stringify({
                model: modelToUse,
                messages: messages,
                max_tokens: 2048,
                temperature: 0.2,
                ...(isJson ? { response_format: { type: "json_object" } } : {})
            })
        });

        console.log("🚀 Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Groq API Error:", response.status, errorText);

            // Try to parse error as JSON for better error messages
            try {
                const errorJson = JSON.parse(errorText);
                console.error("❌ Parsed Error:", errorJson);
                throw new Error(`Groq API Error (${response.status}): ${errorJson.error?.message || errorText}`);
            } catch (parseError) {
                throw new Error(`Groq API Error (${response.status}): ${errorText}`);
            }
        }

        const data = await response.json();
        console.log("✅ Groq API Success");
        console.log("Response data:", data);

        return data.choices?.[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error("❌ AI Service Error:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
};

const truncateData = (jsonData: string, limit: number = 50): string => {
    try {
        const data = JSON.parse(jsonData);
        if (Array.isArray(data) && data.length > limit) {
            console.warn(`Data truncated from ${data.length} to ${limit} items for API processing.`);
            return JSON.stringify(data.slice(0, limit));
        }
        return jsonData;
    } catch (e) {
        console.error("Failed to parse/truncate JSON data:", e);
        return jsonData;
    }
};

