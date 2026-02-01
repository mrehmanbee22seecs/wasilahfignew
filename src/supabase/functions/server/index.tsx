import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Security Headers Middleware
app.use('*', async (c, next) => {
  await next();
  
  // Content Security Policy
  c.header(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "object-src 'none'; " +
    "frame-ancestors 'self'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );
  
  // Prevent clickjacking
  c.header('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME-sniffing
  c.header('X-Content-Type-Options', 'nosniff');
  
  // HSTS (only in production with HTTPS)
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Referrer Policy
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  c.header(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()'
  );
  
  // Legacy XSS Protection
  c.header('X-XSS-Protection', '1; mode=block');
});

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6eaebc62/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);