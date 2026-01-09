# 🛠️ Backend Implementation Guide - Wasilah Proposal System

**Quick Start Guide for Backend Developers**

---

## 🚀 Quick Implementation (30 Minutes)

### **Step 1: Create Database Schema**

```sql
-- PostgreSQL Schema
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(100) NOT NULL,
  contact_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL CHECK (role IN ('Corporate', 'NGO', 'Volunteer', 'Other')),
  budget_range VARCHAR(50) NOT NULL,
  services JSONB DEFAULT '[]',
  preferred_sdgs JSONB DEFAULT '[]',
  message TEXT,
  attachments JSONB DEFAULT '[]',
  consent BOOLEAN NOT NULL DEFAULT false,
  referrer_url TEXT,
  utm_source VARCHAR(50),
  utm_medium VARCHAR(50),
  utm_campaign VARCHAR(50),
  utm_content VARCHAR(50),
  utm_term VARCHAR(50),
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_proposals_email ON proposals(email);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created_at ON proposals(created_at);
CREATE INDEX idx_proposals_role ON proposals(role);

-- Rate limiting table
CREATE TABLE proposal_rate_limits (
  ip_address INET NOT NULL,
  submission_count INTEGER DEFAULT 1,
  window_start TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (ip_address, window_start)
);
```

---

## 📝 Implementation Examples

### **Node.js + Express Example**

```javascript
// routes/proposals.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const proposalService = require('../services/proposalService');
const rateLimiter = require('../middleware/rateLimiter');

// Validation middleware
const validateProposal = [
  body('companyName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Please enter your company name.'),
  
  body('contactName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Please enter your name.'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address.'),
  
  body('phone')
    .optional()
    .matches(/^[\d+\s()-]+$/)
    .withMessage('Please enter a valid phone number.'),
  
  body('role')
    .isIn(['Corporate', 'NGO', 'Volunteer', 'Other'])
    .withMessage('Please select your role.'),
  
  body('budgetRange')
    .notEmpty()
    .withMessage('Please select an approximate budget range.'),
  
  body('services')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Please select a maximum of 5 services.'),
  
  body('message')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Too long — keep it under 1000 characters.'),
  
  body('consent')
    .equals('true')
    .withMessage('Please consent for us to contact you.'),
  
  // Honeypot check
  body('website')
    .isEmpty()
    .withMessage('Invalid submission detected.')
];

// POST /api/proposals
router.post('/proposals', 
  rateLimiter({ max: 5, windowMs: 3600000 }), // 5 per hour
  validateProposal,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'validation_error',
          message: 'Validation failed',
          errors: errors.mapped()
        });
      }

      // Extract data
      const proposalData = {
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      };

      // Create proposal
      const proposal = await proposalService.create(proposalData);

      // Send notifications
      await Promise.all([
        proposalService.sendAdminEmail(proposal),
        proposalService.sendUserConfirmation(proposal)
      ]);

      // Log analytics
      await proposalService.logAnalytics('proposal_submitted', proposal);

      // Return success
      res.status(200).json({
        success: true,
        id: proposal.id,
        status: 'received',
        message: 'Proposal received successfully',
        estimatedResponseTime: '48 hours'
      });

    } catch (error) {
      console.error('Proposal submission error:', error);
      
      res.status(500).json({
        success: false,
        error: 'server_error',
        message: 'We\'re experiencing technical difficulties. Please try again later.'
      });
    }
  }
);

module.exports = router;
```

### **Rate Limiter Middleware**

```javascript
// middleware/rateLimiter.js
const redis = require('redis');
const client = redis.createClient();

function rateLimiter(options = {}) {
  const { max = 5, windowMs = 3600000 } = options;
  
  return async (req, res, next) => {
    const ip = req.ip;
    const key = `rate_limit:proposals:${ip}`;
    
    try {
      const current = await client.get(key);
      const count = parseInt(current) || 0;
      
      if (count >= max) {
        return res.status(429).json({
          success: false,
          error: 'rate_limit',
          message: 'Too many submissions. Please try again in 1 hour.',
          retryAfter: windowMs / 1000
        });
      }
      
      // Increment counter
      await client.incr(key);
      await client.expire(key, windowMs / 1000);
      
      next();
    } catch (error) {
      // If Redis fails, allow request (fail open)
      console.error('Rate limiter error:', error);
      next();
    }
  };
}

module.exports = rateLimiter;
```

### **Proposal Service**

```javascript
// services/proposalService.js
const db = require('../db');
const emailService = require('./emailService');

class ProposalService {
  async create(data) {
    const query = `
      INSERT INTO proposals (
        company_name, contact_name, email, phone, role,
        budget_range, services, preferred_sdgs, message,
        attachments, consent, referrer_url,
        utm_source, utm_medium, utm_campaign,
        ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    
    const values = [
      data.companyName,
      data.contactName,
      data.email,
      data.phone || null,
      data.role,
      data.budgetRange,
      JSON.stringify(data.services || []),
      JSON.stringify(data.preferredSDGs || []),
      data.message || null,
      JSON.stringify(data.attachments || []),
      data.consent,
      data.referrerUrl || null,
      data.utm?.source || null,
      data.utm?.medium || null,
      data.utm?.campaign || null,
      data.ipAddress,
      data.userAgent
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async sendAdminEmail(proposal) {
    const subject = `New Proposal Request from ${proposal.company_name}`;
    const html = this.generateAdminEmailHTML(proposal);
    
    await emailService.send({
      to: 'proposals@wasilah.org',
      subject,
      html
    });
  }

  async sendUserConfirmation(proposal) {
    const subject = 'We received your proposal request';
    const html = this.generateUserEmailHTML(proposal);
    
    await emailService.send({
      to: proposal.email,
      subject,
      html
    });
  }

  generateAdminEmailHTML(proposal) {
    const services = JSON.parse(proposal.services).join(', ');
    const sdgs = JSON.parse(proposal.preferred_sdgs).join(', ');
    
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0d9488;">New Proposal Request</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; font-weight: bold;">Company:</td>
            <td style="padding: 8px;">${proposal.company_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; font-weight: bold;">Contact:</td>
            <td style="padding: 8px;">${proposal.contact_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${proposal.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; font-weight: bold;">Phone:</td>
            <td style="padding: 8px;">${proposal.phone || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; font-weight: bold;">Role:</td>
            <td style="padding: 8px;">${proposal.role}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; font-weight: bold;">Budget:</td>
            <td style="padding: 8px;">${proposal.budget_range}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; font-weight: bold;">Services:</td>
            <td style="padding: 8px;">${services || 'None selected'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; font-weight: bold;">SDGs:</td>
            <td style="padding: 8px;">${sdgs || 'None selected'}</td>
          </tr>
        </table>
        
        <h3 style="color: #0d9488; margin-top: 24px;">Message:</h3>
        <p style="background: #f8fafc; padding: 16px; border-radius: 8px;">
          ${proposal.message || 'No message provided'}
        </p>
        
        <p style="margin-top: 24px;">
          <a href="https://admin.wasilah.org/proposals/${proposal.id}" 
             style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View in Admin Panel
          </a>
        </p>
      </body>
      </html>
    `;
  }

  generateUserEmailHTML(proposal) {
    const services = JSON.parse(proposal.services).join(', ');
    
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0d9488;">Thanks, we received your request!</h2>
        
        <p>Hi ${proposal.contact_name},</p>
        
        <p>Our CSR specialist will review your proposal and respond within 48 hours.</p>
        
        <h3 style="color: #0d9488;">What You Submitted:</h3>
        <ul style="background: #f8fafc; padding: 24px; border-radius: 8px;">
          <li>Company: <strong>${proposal.company_name}</strong></li>
          <li>Budget: <strong>${proposal.budget_range}</strong></li>
          <li>Services: <strong>${services || 'Not specified'}</strong></li>
        </ul>
        
        <h3 style="color: #0d9488; margin-top: 24px;">Next Steps:</h3>
        <p>
          <a href="https://wasilah.org/schedule" 
             style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-right: 8px;">
            Schedule a 15-min Call
          </a>
          
          <a href="https://wasilah.org/impact-report-sample.pdf" 
             style="background: white; color: #0d9488; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; border: 2px solid #0d9488;">
            Download Sample Report
          </a>
        </p>
        
        <p style="margin-top: 24px; color: #64748b;">
          Questions? Reply to this email or call +92-XXX-XXXXXXX
        </p>
        
        <p style="color: #64748b;">— The Wasilah Team</p>
      </body>
      </html>
    `;
  }

  async logAnalytics(event, data) {
    // Implement your analytics logging here
    // Examples: Google Analytics, Mixpanel, Custom logging
    console.log('[Analytics]', event, {
      proposalId: data.id,
      role: data.role,
      budgetRange: data.budget_range
    });
  }
}

module.exports = new ProposalService();
```

---

## 🔐 File Upload Implementation (S3 Example)

```javascript
// routes/upload.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

router.post('/proposals/upload-url', async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    
    // Validate file size
    if (fileSize > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'file_too_large',
        message: 'File size exceeds 5MB limit'
      });
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'video/mp4'
    ];
    
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({
        success: false,
        error: 'invalid_file_type',
        message: 'File type not supported'
      });
    }
    
    // Generate unique file ID
    const fileId = uuidv4();
    const fileExt = fileName.split('.').pop();
    const s3Key = `proposals/${fileId}.${fileExt}`;
    
    // Generate signed URL
    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      ContentType: fileType,
      Expires: 3600 // 1 hour
    });
    
    // Return signed URL
    res.json({
      success: true,
      uploadUrl,
      fileId,
      expiresIn: 3600
    });
    
  } catch (error) {
    console.error('Upload URL generation error:', error);
    res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to generate upload URL'
    });
  }
});
```

---

## 🎯 Testing with cURL

```bash
# Test proposal submission
curl -X POST https://wasilah.org/api/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Corp",
    "contactName": "John Doe",
    "email": "john@testcorp.com",
    "phone": "+923001234567",
    "role": "Corporate",
    "budgetRange": "PKR 50k–200k",
    "services": ["CSR Strategy"],
    "preferredSDGs": [4, 6],
    "message": "Test message",
    "attachments": [],
    "consent": true,
    "website": ""
  }'

# Expected response:
# {
#   "success": true,
#   "id": "proposal_abc123",
#   "status": "received",
#   "message": "Proposal received successfully",
#   "estimatedResponseTime": "48 hours"
# }
```

---

## 📊 Monitoring & Alerts

### **Key Metrics to Monitor:**

1. **Submission Rate**
   - Track proposals per hour/day
   - Alert if drops below 10% of average

2. **Error Rate**
   - Track 4xx and 5xx responses
   - Alert if > 5% of requests

3. **Email Delivery**
   - Track bounces and delivery failures
   - Alert if > 2% failure rate

4. **Response Time**
   - P95 should be < 500ms
   - Alert if > 1000ms

5. **Spam Detection**
   - Track honeypot triggers
   - Alert if > 10% of submissions

---

## 🔧 Environment Variables

```bash
# .env file
DATABASE_URL=postgresql://user:pass@localhost:5432/wasilah
REDIS_URL=redis://localhost:6379

# Email
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=hello@wasilah.org
ADMIN_EMAIL=proposals@wasilah.org

# File Upload
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
AWS_REGION=ap-south-1
S3_BUCKET=wasilah-proposals

# Analytics
GA_TRACKING_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=xxxxxxxxxxxxx

# Security
JWT_SECRET=xxxxxxxxxxxxx
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_MS=3600000
```

---

## ✅ Deployment Checklist

- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] Email templates tested
- [ ] File upload tested with real S3
- [ ] Rate limiting tested
- [ ] Error handling tested
- [ ] Analytics tracking verified
- [ ] Load testing completed (100 concurrent users)
- [ ] Monitoring/alerts configured
- [ ] Backup strategy in place
- [ ] SSL certificate valid
- [ ] CORS configured correctly
- [ ] Security headers configured

---

## 🆘 Common Issues & Solutions

**Issue: Emails not sending**
```bash
# Test email configuration
node scripts/test-email.js
```

**Issue: Rate limiting too aggressive**
```bash
# Clear rate limit for specific IP
redis-cli DEL "rate_limit:proposals:192.168.1.1"
```

**Issue: Database connection pool exhausted**
```javascript
// Increase pool size in database config
const pool = new Pool({
  max: 20, // Increase from default 10
  idleTimeoutMillis: 30000
});
```

---

This guide should get your backend implementation up and running quickly! 🚀
