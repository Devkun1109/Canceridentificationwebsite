import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Storage bucket name
const BUCKET_NAME = 'make-83197308-skin-scans';

// Initialize storage bucket
async function initStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log('Storage bucket created:', BUCKET_NAME);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize demo account
async function initDemoAccount() {
  try {
    const demoEmail = 'demo@skincare.ai';
    const demoPassword = 'demo123456';
    const demoName = 'Demo User';

    // Check if demo user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const demoExists = existingUsers?.users?.some(user => user.email === demoEmail);

    if (!demoExists) {
      // Create demo user
      const { data, error } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: demoPassword,
        user_metadata: { name: demoName },
        email_confirm: true,
      });

      if (!error && data.user) {
        // Store demo user profile
        await kv.set(`user:${data.user.id}`, {
          id: data.user.id,
          email: demoEmail,
          name: demoName,
          created_at: new Date().toISOString(),
        });
        console.log('Demo account created: demo@skincare.ai / demo123456');
      }
    } else {
      console.log('Demo account already exists');
    }
  } catch (error) {
    console.error('Error initializing demo account:', error);
  }
}

// Initialize on startup
initStorage();
initDemoAccount();

// Authenticate user middleware
async function authenticateUser(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }

  c.set('user', data.user);
  await next();
}

// Routes

// Health check
app.get('/make-server-83197308/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Sign up
app.post('/make-server-83197308/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm email since email server not configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      created_at: new Date().toISOString(),
    });

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ error: error.message || 'Signup failed' }, 500);
  }
});

// Get user profile
app.get('/make-server-83197308/user/:userId', authenticateUser, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUser = c.get('user');

    // Ensure user can only access their own profile
    if (currentUser.id !== userId) {
      return c.json({ error: 'Forbidden: Cannot access other user profiles' }, 403);
    }

    const userProfile = await kv.get(`user:${userId}`);

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json(userProfile);
  } catch (error: any) {
    console.error('Get user profile error:', error);
    return c.json({ error: error.message || 'Failed to get user profile' }, 500);
  }
});

// Update user profile
app.put('/make-server-83197308/user/:userId', authenticateUser, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUser = c.get('user');
    const body = await c.req.json();

    // Ensure user can only update their own profile
    if (currentUser.id !== userId) {
      return c.json({ error: 'Forbidden: Cannot update other user profiles' }, 403);
    }

    const existingProfile = await kv.get(`user:${userId}`);
    if (!existingProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const updatedProfile = {
      ...existingProfile,
      name: body.name || existingProfile.name,
      updated_at: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, updatedProfile);

    return c.json(updatedProfile);
  } catch (error: any) {
    console.error('Update user profile error:', error);
    return c.json({ error: error.message || 'Failed to update user profile' }, 500);
  }
});

// Upload image
app.post('/make-server-83197308/upload-image', authenticateUser, async (c) => {
  try {
    const currentUser = c.get('user');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Ensure user can only upload for themselves
    if (currentUser.id !== userId) {
      return c.json({ error: 'Forbidden: Cannot upload for other users' }, 403);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${userId}/${timestamp}.${extension}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Failed to upload image' }, 500);
    }

    // Get signed URL
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filename, 31536000); // 1 year

    return c.json({ imageUrl: signedUrlData?.signedUrl });
  } catch (error: any) {
    console.error('Upload image error:', error);
    return c.json({ error: error.message || 'Failed to upload image' }, 500);
  }
});

// Analyze image (mock ML analysis - replace with actual ML API call)
app.post('/make-server-83197308/analyze', authenticateUser, async (c) => {
  try {
    const currentUser = c.get('user');
    const body = await c.req.json();
    const { userId, imageUrl } = body;

    if (!imageUrl) {
      return c.json({ error: 'Image URL is required' }, 400);
    }

    // Ensure user can only analyze for themselves
    if (currentUser.id !== userId) {
      return c.json({ error: 'Forbidden: Cannot analyze for other users' }, 403);
    }

    // Get the Hugging Face API token
    const hfToken = Deno.env.get('HUGGINGFACE_API_TOKEN');
    if (!hfToken) {
      console.error('HUGGINGFACE_API_TOKEN not configured');
      return c.json({ error: 'ML service not configured' }, 500);
    }

    // Fetch the image from the signed URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image from storage');
    }
    const imageBlob = await imageResponse.blob();

    // Call Hugging Face Gradio API
    const hfApiUrl = 'https://avanniiii-skin-disease-classifier.hf.space/api/predict';
    
    // Create form data for the API
    const formData = new FormData();
    formData.append('data', JSON.stringify([imageBlob]));

    const mlResponse = await fetch(hfApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
      },
      body: formData,
    });

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      console.error('Hugging Face API error:', errorText);
      throw new Error('ML analysis failed');
    }

    const mlResult = await mlResponse.json();
    console.log('ML Result:', mlResult);

    // Parse the ML result
    // Expected format: { disease_code, disease_name, confidence, all_probabilities }
    const prediction = mlResult.data?.[0] || mlResult;
    
    // Disease information mapping
    const diseaseInfo: Record<string, any> = {
      'nv': {
        fullName: 'Melanocytic nevi: benign mole',
        severity: 'Low',
        description: 'A benign (non-cancerous) mole formed by melanocytes. Generally harmless but should be monitored for changes.',
        recommendations: [
          'Monitor the mole for any changes in size, shape, or color',
          'Use sunscreen to protect your skin',
          'Schedule regular skin checks with a dermatologist',
          'Take photos to track any changes over time',
        ],
      },
      'mel': {
        fullName: 'Melanoma: dangerous skin cancer',
        severity: 'High',
        description: 'A type of skin cancer that develops in melanocytes. Early detection is crucial for successful treatment.',
        recommendations: [
          'Consult a dermatologist immediately for professional evaluation',
          'Avoid sun exposure and use SPF 50+ sunscreen',
          'Monitor the area for any changes in size, shape, or color',
          'Do not attempt self-treatment',
        ],
      },
      'bkl': {
        fullName: 'Benign keratosis: non-cancerous growth',
        severity: 'Low',
        description: 'A non-cancerous skin growth that is usually harmless. Common in older adults.',
        recommendations: [
          'Consult with a dermatologist if it changes or becomes irritated',
          'Protect skin from excessive sun exposure',
          'Regular skin monitoring is recommended',
          'Treatment is usually not necessary unless for cosmetic reasons',
        ],
      },
      'bcc': {
        fullName: 'Basal cell carcinoma: type of skin cancer',
        severity: 'Moderate',
        description: 'The most common form of skin cancer, usually caused by sun exposure. Generally slow-growing and treatable.',
        recommendations: [
          'Schedule an appointment with a dermatologist',
          'Protect the area from sun exposure',
          'Use broad-spectrum sunscreen daily',
          'Avoid picking or scratching the area',
        ],
      },
      'akiec': {
        fullName: 'Actinic keratoses: precancerous lesions',
        severity: 'Moderate',
        description: 'Rough, scaly patches on skin caused by years of sun exposure. Considered precancerous and should be treated.',
        recommendations: [
          'Consult with a dermatologist for treatment options',
          'Use daily sunscreen (SPF 30+)',
          'Wear protective clothing when outdoors',
          'Regular skin checks to monitor progression',
        ],
      },
      'vasc': {
        fullName: 'Vascular lesions: abnormal blood vessels',
        severity: 'Low',
        description: 'Abnormalities in blood vessels that appear on the skin. Usually benign but may require medical evaluation.',
        recommendations: [
          'Consult a dermatologist for proper diagnosis',
          'Avoid trauma to the affected area',
          'Monitor for any changes in size or appearance',
          'Treatment options are available if desired',
        ],
      },
      'df': {
        fullName: 'Dermatofibroma: benign skin nodule',
        severity: 'Low',
        description: 'A common benign skin growth, usually firm to the touch. Generally harmless and does not require treatment.',
        recommendations: [
          'No treatment necessary unless it becomes bothersome',
          'Avoid scratching or irritating the area',
          'Consult a dermatologist if it changes or causes discomfort',
          'Removal is possible if desired for cosmetic reasons',
        ],
      },
    };

    const diseaseCode = prediction.disease_code;
    const confidence = Math.round(prediction.confidence * 100 * 100) / 100; // Convert to percentage
    const info = diseaseInfo[diseaseCode] || {
      fullName: prediction.disease_name || 'Unknown',
      severity: 'Unknown',
      description: 'Unable to determine specific condition. Please consult a dermatologist.',
      recommendations: ['Consult a dermatologist for proper diagnosis and treatment'],
    };

    // Generate scan ID
    const scanId = `scan_${userId}_${Date.now()}`;

    // Save scan to KV store
    const scanData = {
      id: scanId,
      user_id: userId,
      image_url: imageUrl,
      disease_code: diseaseCode,
      disease_name: info.fullName,
      confidence: confidence,
      severity: info.severity,
      description: info.description,
      recommendations: info.recommendations,
      all_probabilities: prediction.all_probabilities || {},
      created_at: new Date().toISOString(),
    };

    await kv.set(scanId, scanData);

    return c.json({
      scanId,
      disease_code: diseaseCode,
      disease_name: info.fullName,
      confidence: confidence,
      severity: info.severity,
      description: info.description,
      recommendations: info.recommendations,
      all_probabilities: prediction.all_probabilities || {},
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return c.json({ error: error.message || 'Analysis failed' }, 500);
  }
});

// Get user scans
app.get('/make-server-83197308/scans/:userId', authenticateUser, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUser = c.get('user');

    // Ensure user can only access their own scans
    if (currentUser.id !== userId) {
      return c.json({ error: 'Forbidden: Cannot access other user scans' }, 403);
    }

    // Get all scans for this user
    const allScans = await kv.getByPrefix('scan_');
    const userScans = allScans
      .filter((scan: any) => scan.user_id === userId)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return c.json({ scans: userScans });
  } catch (error: any) {
    console.error('Get scans error:', error);
    return c.json({ error: error.message || 'Failed to get scans' }, 500);
  }
});

// Delete scan
app.delete('/make-server-83197308/scans/:scanId', authenticateUser, async (c) => {
  try {
    const scanId = c.req.param('scanId');
    const currentUser = c.get('user');

    // Get scan to verify ownership
    const scan = await kv.get(scanId);

    if (!scan) {
      return c.json({ error: 'Scan not found' }, 404);
    }

    // Ensure user can only delete their own scans
    if (scan.user_id !== currentUser.id) {
      return c.json({ error: 'Forbidden: Cannot delete other user scans' }, 403);
    }

    // Delete scan
    await kv.del(scanId);

    return c.json({ success: true, message: 'Scan deleted successfully' });
  } catch (error: any) {
    console.error('Delete scan error:', error);
    return c.json({ error: error.message || 'Failed to delete scan' }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

Deno.serve(app.fetch);