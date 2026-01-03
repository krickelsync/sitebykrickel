import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactEmailRequest = await req.json();

    console.log("Received contact form submission:", { name, email });

    // Validate input
    if (!name || !email || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email via Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Site by Krickel <noreply@sitebykrickel.com>",
        to: ["contact@sitebykrickel.com"],
        reply_to: email,
        subject: `[New Inquiry] ${name} - dari Contact Form`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 16px; padding: 32px; border: 1px solid #222222;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #a3e635; font-size: 24px; margin: 0;">New Contact Form Submission</h1>
              </div>
              
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #a3e635; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0;">Client Details</h2>
                <p style="margin: 0 0 8px 0;"><strong style="color: #888888;">Name:</strong> <span style="color: #ffffff;">${name}</span></p>
                <p style="margin: 0;"><strong style="color: #888888;">Email:</strong> <a href="mailto:${email}" style="color: #a3e635; text-decoration: none;">${email}</a></p>
              </div>
              
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 24px;">
                <h2 style="color: #a3e635; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0;">Message</h2>
                <p style="color: #cccccc; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #222222;">
                <p style="color: #666666; font-size: 12px; margin: 0;">You can reply directly to this email to respond to ${name}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const data = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
