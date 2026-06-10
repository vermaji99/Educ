CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

CREATE TABLE IF NOT EXISTS github_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    company VARCHAR(255),
    blog VARCHAR(255),
    avatar_url VARCHAR(255),
    
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    
    public_repos INT DEFAULT 0,
    public_gists INT DEFAULT 0,
    
    total_stars INT DEFAULT 0,
    total_forks INT DEFAULT 0,
    total_watchers INT DEFAULT 0,
    
    average_stars FLOAT DEFAULT 0,
    average_forks FLOAT DEFAULT 0,
    
    most_used_language VARCHAR(100),
    language_distribution_json JSON,
    
    most_starred_repo VARCHAR(255),
    most_forked_repo VARCHAR(255),
    
    repositories_last_30_days INT DEFAULT 0,
    repositories_last_90_days INT DEFAULT 0,
    repositories_last_year INT DEFAULT 0,
    
    archived_repositories INT DEFAULT 0,
    forked_repositories INT DEFAULT 0,
    original_repositories INT DEFAULT 0,
    
    popularity_score INT DEFAULT 0,
    developer_score INT DEFAULT 0,
    
    profile_category VARCHAR(50),
    
    analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_popularity (popularity_score),
    INDEX idx_developer (developer_score)
);
