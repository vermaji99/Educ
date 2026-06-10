class AnalyticsService {
  analyzeProfile(profile, repos) {
    const totalRepos = repos.length;
    const stats = this.calculateRepoStats(repos);
    const languages = this.calculateLanguageStats(repos);
    const activity = this.calculateActivityMetrics(repos);
    const health = this.calculateHealthMetrics(repos);

    const popularityScore = this.calculatePopularityScore(profile.followers, stats.totalStars, stats.totalForks);
    const developerScore = this.calculateDeveloperScore(profile.public_repos, stats.totalStars, profile.followers);
    const profileCategory = this.classifyProfile(popularityScore, developerScore, profile.followers, totalRepos);

    return {
      username: profile.login,
      name: profile.name,
      bio: profile.bio,
      location: profile.location,
      company: profile.company,
      blog: profile.blog,
      avatar_url: profile.avatar_url,
      followers: profile.followers,
      following: profile.following,
      public_repos: profile.public_repos,
      public_gists: profile.public_gists,
      ...stats,
      ...languages,
      ...activity,
      ...health,
      popularity_score: popularityScore,
      developer_score: developerScore,
      profile_category: profileCategory,
      analysis_date: new Date(),
    };
  }

  calculateRepoStats(repos) {
    let totalStars = 0;
    let totalForks = 0;
    let totalWatchers = 0;
    let mostStarredRepo = null;
    let mostForkedRepo = null;

    repos.forEach(repo => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      totalWatchers += repo.watchers_count;

      if (!mostStarredRepo || repo.stargazers_count > mostStarredRepo.stars) {
        mostStarredRepo = { name: repo.name, stars: repo.stargazers_count };
      }
      if (!mostForkedRepo || repo.forks_count > mostForkedRepo.forks) {
        mostForkedRepo = { name: repo.name, forks: repo.forks_count };
      }
    });

    return {
      total_stars: totalStars,
      total_forks: totalForks,
      total_watchers: totalWatchers,
      average_stars: repos.length ? parseFloat((totalStars / repos.length).toFixed(2)) : 0,
      average_forks: repos.length ? parseFloat((totalForks / repos.length).toFixed(2)) : 0,
      most_starred_repo: mostStarredRepo ? mostStarredRepo.name : null,
      most_forked_repo: mostForkedRepo ? mostForkedRepo.name : null,
    };
  }

  calculateLanguageStats(repos) {
    const languageCounts = {};
    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const sortedLanguages = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a);

    const totalWithLanguage = Object.values(languageCounts).reduce((a, b) => a + b, 0);
    const distribution = {};
    sortedLanguages.forEach(([lang, count]) => {
      distribution[lang] = parseFloat(((count / totalWithLanguage) * 100).toFixed(2));
    });

    return {
      most_used_language: sortedLanguages.length ? sortedLanguages[0][0] : 'None',
      language_distribution_json: distribution,
    };
  }

  calculateActivityMetrics(repos) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 60)); // 30+60
    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));

    let last30 = 0, last90 = 0, lastYear = 0;

    repos.forEach(repo => {
      const updatedAt = new Date(repo.updated_at);
      if (updatedAt >= thirtyDaysAgo) last30++;
      if (updatedAt >= ninetyDaysAgo) last90++;
      if (updatedAt >= oneYearAgo) lastYear++;
    });

    return {
      repositories_last_30_days: last30,
      repositories_last_90_days: last90,
      repositories_last_year: lastYear,
    };
  }

  calculateHealthMetrics(repos) {
    let archived = 0, forked = 0, original = 0;
    repos.forEach(repo => {
      if (repo.archived) archived++;
      if (repo.fork) forked++;
      else original++;
    });

    return {
      archived_repositories: archived,
      forked_repositories: forked,
      original_repositories: original,
    };
  }

  calculatePopularityScore(followers, stars, forks) {
    return (followers * 3) + (stars * 2) + (forks * 1);
  }

  calculateDeveloperScore(repos, stars, followers) {
    return (repos * 2) + (stars * 3) + (followers * 2);
  }

  classifyProfile(popularity, developer, followers, repos) {
    if (popularity > 1000 || followers > 500) return 'Popular Developer';
    if (developer > 500 || repos > 50) return 'Advanced';
    if (developer > 100 || repos > 10) return 'Intermediate';
    if (repos > 0) return 'Beginner';
    return 'Open Source Contributor'; // Default/Fallback
  }
}

export default new AnalyticsService();
