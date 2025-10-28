import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SheetData {
  name: string;
  email: string;
  phone: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone } = await req.json() as SheetData;

    console.log('Syncing user to Google Sheets:', { name, email, phone });

    const serviceAccount = Deno.env.get('GOOGLE_SHEETS_SERVICE_ACCOUNT');
    if (!serviceAccount) {
      throw new Error('Google Sheets service account not configured');
    }

    const credentials = JSON.parse(serviceAccount);
    
    // Get access token
    const jwt = await createJWT(credentials);
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const { access_token } = await tokenResponse.json();

    // Append to sheet
    const spreadsheetId = '1300EblBLOmYNUox7GgqZ_PxywxNo_FT0YxkTIqGrrhA';
    const range = 'Healbot!A:C';
    
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[name, phone, '']],
        }),
      }
    );

    if (!appendResponse.ok) {
      const error = await appendResponse.text();
      console.error('Google Sheets API error:', error);
      throw new Error('Failed to sync to Google Sheets');
    }

    console.log('Successfully synced to Google Sheets');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in sync-to-sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function createJWT(credentials: any): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaim = base64UrlEncode(JSON.stringify(claim));
  const signatureInput = `${encodedHeader}.${encodedClaim}`;

  const privateKey = await importPrivateKey(credentials.private_key);
  const signature = await sign(signatureInput, privateKey);
  
  return `${signatureInput}.${signature}`;
}

function base64UrlEncode(str: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  let base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  return await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );
}

async function sign(data: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    encoder.encode(data)
  );
  
  const signatureArray = new Uint8Array(signature);
  let base64 = btoa(String.fromCharCode(...signatureArray));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
