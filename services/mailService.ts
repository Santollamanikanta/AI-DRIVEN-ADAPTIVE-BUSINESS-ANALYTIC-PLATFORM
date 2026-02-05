/**
 * Mail Service
 * Handles REAL automatic email dispatching using the EmailJS API.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a free account at https://www.emailjs.com/
 * 2. Add an "Email Service" to get a SERVICE_ID.
 * 3. Create an "Email Template" with {{subject}} and {{message}} fields to get a TEMPLATE_ID.
 * 4. Go to Account -> Public Key to get your PUBLIC_KEY.
 * 5. Add these to your .env.local file.
 */

export const sendEmailViaEmailJS = async (to: string, subject: string, body: string): Promise<{ success: boolean; message: string }> => {
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Check if keys are configured
    if (!SERVICE_ID) return { success: false, message: "Setup Required: Please add VITE_EMAILJS_SERVICE_ID to .env.local" };
    if (!TEMPLATE_ID) return { success: false, message: "Setup Required: Please add VITE_EMAILJS_TEMPLATE_ID to .env.local" };
    if (!PUBLIC_KEY) return { success: false, message: "Setup Required: Please add VITE_EMAILJS_PUBLIC_KEY to .env.local" };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service_id: SERVICE_ID,
                template_id: TEMPLATE_ID,
                user_id: PUBLIC_KEY,
                template_params: {
                    to_email: to, // Key for the recipient
                    subject: subject,
                    message: body,
                },
            }),
        });

        if (response.ok) {
            return { success: true, message: "Email successfully sent to " + to };
        } else {
            const errorText = await response.text();
            throw new Error(errorText || "EmailJS API failed");
        }
    } catch (error: any) {
        console.error("EmailJS Error:", error);
        return { success: false, message: `Delivery Error: ${error.message}` };
    }
};

export const sendEmailViaApi = sendEmailViaEmailJS;
