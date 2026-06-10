import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GithubProfile = sequelize.define('GithubProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  location: {
    type: DataTypes.STRING,
  },
  company: {
    type: DataTypes.STRING,
  },
  blog: {
    type: DataTypes.STRING,
  },
  avatar_url: {
    type: DataTypes.STRING,
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  public_repos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  public_gists: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_forks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_watchers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  average_stars: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  average_forks: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  most_used_language: {
    type: DataTypes.STRING,
  },
  language_distribution_json: {
    type: DataTypes.JSON,
  },
  most_starred_repo: {
    type: DataTypes.STRING,
  },
  most_forked_repo: {
    type: DataTypes.STRING,
  },
  repositories_last_30_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  repositories_last_90_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  repositories_last_year: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  archived_repositories: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  forked_repositories: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  original_repositories: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  popularity_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  developer_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  profile_category: {
    type: DataTypes.STRING,
  },
  analysis_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'github_profiles',
  underscored: true,
  timestamps: true,
});

export default GithubProfile;
