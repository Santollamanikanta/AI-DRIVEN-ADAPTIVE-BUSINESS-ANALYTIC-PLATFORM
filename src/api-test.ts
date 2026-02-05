// Quick diagnostic script to test OpenRouter API
console.log("=== API Diagnostic ===");
console.log("API Key exists:", !!import.meta.env.VITE_CLAUDE_API_KEY);
console.log("API Key (first 20 chars):", import.meta.env.VITE_CLAUDE_API_KEY?.substring(0, 20));

// Test API call
async function testAPI() {
    try {
        console.log("Testing OpenRouter API...");
        const response = await fetch('/openrouter-api/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_CLAUDE_API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Business Analytics Platform',
            },
            body: JSON.stringify({
                model: "anthropic/claude-3.5-sonnet",
                messages: [{ role: "user", content: "Say hello" }],
            })
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok) {
            console.log("✅ API test successful!");
            console.log("Message:", data.choices?.[0]?.message?.content);
        } else {
            console.error("❌ API test failed:", data);
        }
    } catch (error) {
        console.error("❌ API test error:", error);
    }
}

// Run test after a short delay
setTimeout(testAPI, 1000);
