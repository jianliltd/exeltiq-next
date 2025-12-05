import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GymInviteRequest {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientPassword?: string;
  gymName: string;
  gymLogoUrl?: string;
  bookingUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientPassword,
      gymName,
      gymLogoUrl,
      bookingUrl,
    }: GymInviteRequest = await req.json();

    console.log("Sending gym invite to:", clientEmail);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ${gymName}</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px 20px;
              text-align: center;
            }
            .logo {
              max-width: 200px;
              height: auto;
              margin-bottom: 20px;
            }
            .header-text {
              color: #ffffff;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .content {
              padding: 20px 25px;
            }
            .greeting {
              font-size: 20px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 12px;
            }
            .message {
              font-size: 14px;
              line-height: 1.5;
              color: #4a5568;
              margin-bottom: 15px;
            }
            .credentials-box {
              background-color: #f7fafc;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
            }
            .credentials-title {
              font-size: 16px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 12px;
              text-align: center;
            }
            .credential-item {
              background-color: #ffffff;
              border-radius: 6px;
              padding: 10px;
              margin-bottom: 8px;
              border-left: 3px solid #667eea;
            }
            .credential-item:last-child {
              margin-bottom: 0;
            }
            .credential-label {
              font-size: 11px;
              font-weight: 600;
              color: #718096;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 3px;
            }
            .credential-value {
              font-size: 14px;
              font-weight: 600;
              color: #2d3748;
              word-break: break-all;
            }
            .divider {
              text-align: center;
              margin: 10px 0;
              color: #a0aec0;
              font-size: 12px;
              font-weight: 500;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 6px;
              font-weight: 600;
              font-size: 14px;
              text-align: center;
              margin: 12px 0;
            }
            .button-container {
              text-align: center;
            }
            .footer {
              background-color: #f7fafc;
              padding: 15px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer-text {
              font-size: 12px;
              color: #718096;
              margin: 3px 0;
            }
            .url-text {
              font-size: 11px;
              color: #a0aec0;
              word-break: break-all;
              margin-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="header-text">Welcome to ${gymName}</h1>
            </div>
            
            <div class="content">
              <h2 class="greeting">Hello ${clientName}! 👋</h2>
              
              <p class="message">
                We're excited to have you join us at <strong>${gymName}</strong>! Your account has been created and you can now book your gym sessions online.
              </p>
              
              <div class="credentials-box">
                <div class="credentials-title">🔐 Your Login Credentials</div>
                
                <div class="credential-item">
                  <div class="credential-label">Option 1: Phone Number</div>
                  <div class="credential-value">${clientPhone}</div>
                </div>
                
                ${clientPassword ? `
                  <div class="divider">OR</div>
                  
                  <div class="credential-item">
                    <div class="credential-label">Option 2: Email & Password</div>
                    <div class="credential-value" style="margin-bottom: 8px;">${clientEmail}</div>
                    <div class="credential-value">${clientPassword}</div>
                  </div>
                ` : ''}
              </div>
              
              <p class="message">
                Click the button below to access your booking portal and schedule your sessions:
              </p>
              
              <div class="button-container">
                <a href="${bookingUrl}" class="button">Book Your Session Now</a>
              </div>
              
              <p class="url-text">
                Or copy this link: ${bookingUrl}
              </p>
            </div>
            
            <div class="footer">
              <p class="footer-text"><strong>${gymName}</strong></p>
              <p class="footer-text">Need help? Contact us at any time.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: `${gymName} <noreply@exeltive.com>`,
      to: [clientEmail],
      subject: `Welcome to ${gymName} - Your Booking Portal`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-gym-invite function:", error);
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
