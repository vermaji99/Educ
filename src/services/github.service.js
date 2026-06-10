import axios from 'axios';
import { GITHUB_CONFIG } from '../config/github.js';

class GithubService {
  constructor() {
    this.client = axios.create({
      baseURL: GITHUB_CONFIG.BASE_URL,
      headers: GITHUB_CONFIG.HEADERS,
      timeout: GITHUB_CONFIG.TIMEOUT,
    });
  }

  async fetchUserProfile(username) {
    try {
      const response = await this.client.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      this.handleError(error, username);
    }
  }

  async fetchUserRepositories(username) {
    let repositories = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        const response = await this.client.get(`/users/${username}/repos`, {
          params: {
            page,
            per_page: perPage,
            sort: 'updated',
          },
        });

        const data = response.data;
        if (!data || data.length === 0) break;

        repositories = [...repositories, ...data];
        if (data.length < perPage) break;
        page++;
      }
      return repositories;
    } catch (error) {
      this.handleError(error, username);
    }
  }

  handleError(error, username) {
    if (error.response) {
      const { status } = error.response;
      if (status === 404) {
        throw new Error(`GitHub user '${username}' not found`);
      }
      if (status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
    }
    throw new Error(`Failed to fetch data from GitHub: ${error.message}`);
  }
}

export default new GithubService();
