import analyticsService from '../src/services/analytics.service.js';

describe('AnalyticsService', () => {
  const mockProfile = {
    login: 'testuser',
    name: 'Test User',
    followers: 10,
    public_repos: 5,
  };

  const mockRepos = [
    {
      name: 'repo1',
      stargazers_count: 10,
      forks_count: 5,
      watchers_count: 10,
      language: 'JavaScript',
      updated_at: new Date().toISOString(),
      archived: false,
      fork: false,
    },
    {
      name: 'repo2',
      stargazers_count: 20,
      forks_count: 10,
      watchers_count: 20,
      language: 'Python',
      updated_at: new Date().toISOString(),
      archived: false,
      fork: true,
    },
  ];

  test('should calculate repo stats correctly', () => {
    const stats = analyticsService.calculateRepoStats(mockRepos);
    expect(stats.total_stars).toBe(30);
    expect(stats.total_forks).toBe(15);
    expect(stats.average_stars).toBe(15);
    expect(stats.most_starred_repo).toBe('repo2');
  });

  test('should calculate language stats correctly', () => {
    const stats = analyticsService.calculateLanguageStats(mockRepos);
    expect(stats.most_used_language).toBe('JavaScript');
    expect(stats.language_distribution_json['JavaScript']).toBe(50);
  });

  test('should calculate scores correctly', () => {
    const popularity = analyticsService.calculatePopularityScore(10, 30, 15);
    // (10 * 3) + (30 * 2) + (15 * 1) = 30 + 60 + 15 = 105
    expect(popularity).toBe(105);

    const developer = analyticsService.calculateDeveloperScore(5, 30, 10);
    // (5 * 2) + (30 * 3) + (10 * 2) = 10 + 90 + 20 = 120
    expect(developer).toBe(120);
  });

  test('should classify profile correctly', () => {
    const category = analyticsService.classifyProfile(105, 120, 10, 5);
    expect(category).toBe('Intermediate');
  });
});
