// Vercel Speed Insights integration
// This script loads and initializes Vercel Speed Insights for tracking web vitals
import { injectSpeedInsights } from '../node_modules/@vercel/speed-insights/dist/index.mjs';

// Initialize Speed Insights
injectSpeedInsights();
