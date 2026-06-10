import app from './app.js';
import sequelize from './config/database.js';
import { logger } from './utils/logger.js';
import dotenv from 'dotenv';
import cron from 'node-cron';
import GithubProfile from './models/githubProfile.model.js';
import githubService from './services/github.service.js';
import analyticsService from './services/analytics.service.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Authenticate Database
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Sync Models (Use { alter: true } in development, but be careful in production)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('Database models synchronized.');

    // Start Cron Job for daily refresh (Bonus Feature)
    cron.schedule('0 0 * * *', async () => {
      logger.info('Running daily profile refresh cron job...');
      try {
        const profiles = await GithubProfile.findAll();
        for (const profile of profiles) {
          try {
            const githubUser = await githubService.fetchUserProfile(profile.username);
            const githubRepos = await githubService.fetchUserRepositories(profile.username);
            const analysisData = analyticsService.analyzeProfile(githubUser, githubRepos);
            await profile.update(analysisData);
            logger.info(`Refreshed profile for ${profile.username}`);
          } catch (err) {
            logger.error(`Failed to refresh profile for ${profile.username}: ${err.message}`);
          }
        }
      } catch (err) {
        logger.error(`Cron job failed: ${err.message}`);
      }
    });

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
