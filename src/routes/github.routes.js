import { Router } from 'express';
import githubController from '../controllers/github.controller.js';
import { validateUsername, validatePagination } from '../middleware/validation.js';

const router = Router();

// POST /api/github/analyze/:username
router.post('/analyze/:username', validateUsername, githubController.analyzeUser.bind(githubController));

// GET /api/github/profiles
router.get('/profiles', validatePagination, githubController.getAllProfiles.bind(githubController));

// GET /api/github/profiles/:username
router.get('/profiles/:username', validateUsername, githubController.getSingleProfile.bind(githubController));

// DELETE /api/github/profiles/:username
router.delete('/profiles/:username', validateUsername, githubController.deleteProfile.bind(githubController));

// POST /api/github/refresh/:username
router.post('/refresh/:username', validateUsername, githubController.refreshProfile.bind(githubController));

// GET /api/github/stats
router.get('/stats', githubController.getStats.bind(githubController));

export default router;
