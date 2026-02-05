
// import dotenv from 'dotenv';
import fs from 'fs';

// Manually read .env.local because dotenv might not pick it up automatically if not configured or if we just want to be sure
const envConfig = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envConfig.match(/VITE_GROQ_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error("Could not find VITE_GROQ_API_KEY in .env.local");
    process.exit(1);
}

console.log(`Using API Key: ${apiKey.substring(0, 10)}...`);

const callGroq = async () => {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: "Hello, are you working?"
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error ${response.status}: ${errorText}`);
        } else {
            const data = await response.json();
            console.log("Success! Response:");
            console.log(data.choices[0].message.content);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
};

callGroq();
