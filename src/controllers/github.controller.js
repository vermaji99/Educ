import githubService from '../services/github.service.js';
import analyticsService from '../services/analytics.service.js';
import GithubProfile from '../models/githubProfile.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import sequelize from '../config/database.js';

class GithubController {
  async analyzeUser(req, res, next) {
    try {
      const { username } = req.params;
      const { refresh } = req.query;

      let profile = await GithubProfile.findOne({ where: { username } });

      if (profile && refresh !== 'true') {
        return successResponse(res, 'Profile retrieved from database', profile);
      }

      // Fetch from GitHub
      const githubUser = await githubService.fetchUserProfile(username);
      const githubRepos = await githubService.fetchUserRepositories(username);

      // Analyze
      const analysisData = analyticsService.analyzeProfile(githubUser, githubRepos);

      if (profile) {
        // Update existing
        await profile.update(analysisData);
      } else {
        // Create new
        profile = await GithubProfile.create(analysisData);
      }

      return successResponse(res, profile ? 'Profile updated successfully' : 'Profile analyzed and saved successfully', profile, profile ? 200 : 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllProfiles(req, res, next) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', order = 'desc' } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await GithubProfile.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, order]],
      });

      return successResponse(res, 'Profiles retrieved successfully', {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        profiles: rows,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSingleProfile(req, res, next) {
    try {
      const { username } = req.params;
      const profile = await GithubProfile.findOne({ where: { username } });

      if (!profile) {
        return errorResponse(res, 'Profile not found', 404);
      }

      return successResponse(res, 'Profile retrieved successfully', profile);
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req, res, next) {
    try {
      const { username } = req.params;
      const deleted = await GithubProfile.destroy({ where: { username } });

      if (!deleted) {
        return errorResponse(res, 'Profile not found', 404);
      }

      return successResponse(res, 'Profile deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async refreshProfile(req, res, next) {
    req.query.refresh = 'true';
    return this.analyzeUser(req, res, next);
  }

  async getStats(req, res, next) {
    try {
      const totalProfiles = await GithubProfile.count();
      
      const stats = await GithubProfile.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('followers')), 'averageFollowers'],
          [sequelize.fn('AVG', sequelize.col('public_repos')), 'averageRepos'],
        ],
        raw: true,
      });

      const topDeveloper = await GithubProfile.findOne({
        order: [['developer_score', 'DESC']],
      });

      const topPopularityScore = await GithubProfile.findOne({
        order: [['popularity_score', 'DESC']],
      });

      return successResponse(res, 'Analytics stats retrieved successfully', {
        totalProfiles,
        averageFollowers: parseFloat(stats.averageFollowers || 0).toFixed(2),
        averageRepos: parseFloat(stats.averageRepos || 0).toFixed(2),
        topDeveloper,
        topPopularityScore,
      });
    } catch (error) {
      next(error);
    }
  }

  async recalculateAllScores(req, res, next) {
    try {
      const profiles = await GithubProfile.findAll();
      const recalculated = [];

      for (const profile of profiles) {
        const popularityScore = (profile.followers * 3) + (profile.total_stars * 2) + (profile.total_forks * 1);
        const developerScore = (profile.public_repos * 2) + (profile.total_stars * 3) + (profile.followers * 2);
        
        const profileCategory = this.classifyProfile(popularityScore, developerScore, profile.followers, profile.public_repos);

        await profile.update({
          popularity_score: popularityScore,
          developer_score: developerScore,
          profile_category: profileCategory,
        });
        
        recalculated.push({ username: profile.username, popularityScore, developerScore, profileCategory });
      }

      return successResponse(res, 'All scores recalculated successfully', { recalculated });
    } catch (error) {
      next(error);
    }
  }

  classifyProfile(popularity, developer, followers, repos) {
    if (popularity > 1000 || followers > 500) return 'Popular Developer';
    if (developer > 500 || repos > 50) return 'Advanced';
    if (developer > 100 || repos > 10) return 'Intermediate';
    if (repos > 0) return 'Beginner';
    return 'Open Source Contributor';
  }
}

export default new GithubController();
