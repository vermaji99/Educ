import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { httpLogger } from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import githubRoutes from './routes/github.routes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "cdn.jsdelivr.net", "cdnjs.cloudflare.com", "cdn.tailwindcss.com"],
      "img-src": ["'self'", "data:", "avatars.githubusercontent.com", "github.com", "*.githubusercontent.com"],
      "style-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com", "cdn.jsdelivr.net"],
      "font-src": ["'self'", "cdnjs.cloudflare.com", "fonts.gstatic.com"],
      "connect-src": ["'self'", "api.github.com"],
    },
  },
}));
app.use(cors());
app.use(express.json());

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));

// Logging
app.use(httpLogger);

// Swagger Documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.warn('Swagger documentation not found at swagger.yaml');
}

// Routes
app.use('/api/github', githubRoutes);

// Favicon handler to prevent 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error Handling
app.use(errorHandler);

export default app;
