/* ==========================================
   ENTERPRISE SMS AUTHENTICATION SERVER
   
   This server provides SMS verification capabilities
   for the SecureAuth Pro authentication demo.
   
   Features:
   - Real SMS sending via Twilio API
   - Rate limiting for security
   - Phone number validation
   - Error handling and fallbacks
   - CORS support for frontend integration
   
   Author: Nadia Swansey
   ========================================== */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500', '*'],
    credentials: true
}));
app.use(express.json());

// Twilio configuration
// Replace these with your actual Twilio credentials
const TWILIO_CONFIG = {
    accountSid: 'ACabf62036ff84407cc2fce631024b4d95',
    authToken: '1933fb5e44e630a1f3bc935695209177',
    fromNumber: '+17737473808'
};

// Import and initialize Twilio
let twilio;
let twilioClient;

try {
    twilio = require('twilio');
    twilioClient = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);
    console.log('✅ Twilio initialized successfully');
} catch (error) {
    console.log('⚠️ Twilio not available:', error.message);
    console.log('💡 Run: npm install twilio');
}

// Rate limiting storage (in production, use Redis)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 3;

// Verification codes storage (in production, use Redis with expiration)
const verificationCodes = new Map();

/**
 * Rate limiting middleware
 * Prevents SMS spam and abuse
 */
function rateLimitSMS(req, res, next) {
    const phoneNumber = req.body.phoneNumber;
    const now = Date.now();
    
    if (!rateLimitMap.has(phoneNumber)) {
        rateLimitMap.set(phoneNumber, { count: 1, windowStart: now });
        return next();
    }
    
    const userLimit = rateLimitMap.get(phoneNumber);
    
    // Reset window if expired
    if (now - userLimit.windowStart > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(phoneNumber, { count: 1, windowStart: now });
        return next();
    }
    
    // Check if limit exceeded
    if (userLimit.count >= RATE_LIMIT_MAX_ATTEMPTS) {
        return res.status(429).json({
            success: false,
            error: 'Too many SMS requests. Please try again later.',
            retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - userLimit.windowStart)) / 1000)
        });
    }
    
    userLimit.count++;
    next();
}

/**
 * Validates phone number format (E.164 international standard)
 */
function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber) && phoneNumber.length <= 16;
}

/**
 * Formats phone number to E.164 standard
 */
function formatPhoneNumber(input) {
    const digits = input.replace(/\D/g, '');
    
    // Add US country code if missing
    if (digits.length === 10) {
        return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
        return `+${digits}`;
    }
    
    return input.startsWith('+') ? input : `+${digits}`;
}

/**
 * Generates cryptographically secure 6-digit verification code
 */
function generateSecureCode() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return String(array[0]).slice(-6).padStart(6, '0');
}

/**
 * Main SMS verification endpoint
 * POST /api/send-verification-code
 */
app.post('/api/send-verification-code', rateLimitSMS, async (req, res) => {
    try {
        let { phoneNumber, userEmail } = req.body;
        
        console.log(`📱 SMS verification request for: ${phoneNumber}`);
        
        // Validation
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required'
            });
        }
        
        // Format and validate phone number
        phoneNumber = formatPhoneNumber(phoneNumber);
        
        if (!isValidPhoneNumber(phoneNumber)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid phone number format. Please include country code.'
            });
        }
        
        // Generate verification code
        const verificationCode = generateSecureCode();
        const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        
        // Store code for validation
        verificationCodes.set(phoneNumber, {
            code: verificationCode,
            expires: expirationTime,
            attempts: 0
        });
        
        const message = `🔐 SecureAuth Pro verification code: ${verificationCode}. Expires in 5 minutes. If you didn't request this, ignore this message.`;
        
        // Attempt to send real SMS
        if (twilioClient) {
            try {
                console.log(`📤 Sending real SMS to ${phoneNumber}...`);
                
                const messageInstance = await twilioClient.messages.create({
                    body: message,
                    from: TWILIO_CONFIG.fromNumber,
                    to: phoneNumber
                });
                
                console.log(`✅ SMS sent successfully!`);
                console.log(`   SID: ${messageInstance.sid}`);
                console.log(`   Status: ${messageInstance.status}`);
                console.log(`   Code: ${verificationCode}`);
                
                return res.json({
                    success: true,
                    method: 'real_sms',
                    messageSid: messageInstance.sid,
                    phoneNumber: phoneNumber,
                    verificationCode: verificationCode, // For demo - remove in production
                    message: 'SMS sent successfully to your phone!',
                    status: messageInstance.status
                });
                
            } catch (twilioError) {
                console.error('❌ Twilio error:', twilioError);
                
                // Handle specific Twilio error codes
                if (twilioError.code === 21614) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid phone number. Please check and try again.'
                    });
                }
                
                if (twilioError.code === 21608) {
                    return res.status(400).json({
                        success: false,
                        error: 'Phone number is not reachable.'
                    });
                }
                
                // Fall through to demo mode for other errors
                console.log('📱 Falling back to demo mode...');
            }
        }
        
        // Demo mode fallback
        console.log(`📋 Demo mode - SMS would be sent to ${phoneNumber}`);
        console.log(`   Message: ${message}`);
        console.log(`   Code: ${verificationCode}`);
        
        // Simulate sending delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        res.json({
            success: true,
            method: 'demo_mode',
            phoneNumber: phoneNumber,
            verificationCode: verificationCode,
            message: 'Demo mode: Check console for verification code',
            demoMessage: message
        });
        
    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Code verification endpoint
 * POST /api/verify-code
 */
app.post('/api/verify-code', (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        
        if (!phoneNumber || !code) {
            return res.status(400).json({
                success: false,
                error: 'Phone number and code are required'
            });
        }
        
        const formattedPhone = formatPhoneNumber(phoneNumber);
        const storedData = verificationCodes.get(formattedPhone);
        
        if (!storedData) {
            return res.status(400).json({
                success: false,
                error: 'No verification code found'
            });
        }
        
        // Check expiration
        if (new Date() > storedData.expires) {
            verificationCodes.delete(formattedPhone);
            return res.status(400).json({
                success: false,
                error: 'Verification code has expired'
            });
        }
        
        // Check attempt limit
        if (storedData.attempts >= 3) {
            verificationCodes.delete(formattedPhone);
            return res.status(400).json({
                success: false,
                error: 'Too many failed attempts'
            });
        }
        
        // Verify code
        if (storedData.code === code) {
            verificationCodes.delete(formattedPhone);
            console.log(`✅ Code verified for ${formattedPhone}`);
            
            return res.json({
                success: true,
                verified: true,
                message: 'Code verified successfully'
            });
        } else {
            storedData.attempts++;
            
            return res.status(400).json({
                success: false,
                error: 'Invalid verification code',
                attemptsRemaining: 3 - storedData.attempts
            });
        }
        
    } catch (error) {
        console.error('❌ Verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'SMS Authentication API',
        twilio: twilioClient ? 'configured' : 'not_available',
        version: '1.0.0'
    });
});

/**
 * API documentation endpoint
 */
app.get('/', (req, res) => {
    res.json({
        name: 'SecureAuth Pro SMS API',
        version: '1.0.0',
        description: 'Enterprise SMS authentication service',
        endpoints: {
            'POST /api/send-verification-code': 'Send SMS verification code',
            'POST /api/verify-code': 'Verify SMS code',
            'GET /health': 'Health check',
            'GET /': 'API documentation'
        },
        author: 'Nadia Swansey',
        github: 'https://github.com/nadiaswansey'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀========================================');
    console.log(`📱 SecureAuth Pro SMS API`);
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log('🚀========================================');
    console.log(`📋 Health: http://localhost:${PORT}/health`);
    console.log(`📖 Docs: http://localhost:${PORT}/`);
    console.log('');
    
    if (twilioClient) {
        console.log('✅ Twilio Status: CONFIGURED');
        console.log(`📞 From: ${TWILIO_CONFIG.fromNumber}`);
        console.log('✨ Ready to send real SMS!');
    } else {
        console.log('⚠️  Twilio Status: DEMO MODE');
        console.log('💡 Install: npm install twilio');
    }
    
    console.log('========================================');
});

module.exports = app;
