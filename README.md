# GitHub Profile Analyzer Backend

A production-ready Node.js backend service that analyzes GitHub user profiles, calculates performance metrics, and stores insights in MySQL.

## Features

- **Profile Analysis**: Fetches user profile and repository data from GitHub Public API.
- **Deep Insights**: Calculates popularity scores, developer scores, language distribution, and activity metrics.
- **RESTful APIs**: Full CRUD operations for analyzed profiles.
- **Analytics Dashboard**: Aggregate statistics across all analyzed users.
- **Security**: Implements Helmet, CORS, and express-validator for robust security.
- **Automation**: Daily background jobs to refresh profile data using `node-cron`.
- **Documentation**: Interactive API docs with Swagger/OpenAPI.
- **Containerization**: Docker and Docker Compose support for easy deployment.
- **Testing**: Comprehensive unit tests with Jest and Supertest.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **API Client**: Axios
- **Documentation**: Swagger UI
- **Testing**: Jest, Supertest
- **Tools**: Docker, GitHub Actions, Morgan, Dotenv

## Architecture

The project follows a Clean Architecture pattern:
- `src/controllers`: Request handling and response formatting.
- `src/services`: Core business logic (GitHub API interaction, Analytics calculations).
- `src/models`: Database schema definitions.
- `src/routes`: API endpoint definitions.
- `src/middleware`: Error handling and input validation.
- `src/utils`: Reusable helper functions.

## Database Schema

Table: `github_profiles`
- `id`, `username`, `name`, `bio`, `location`, `company`, `blog`, `avatar_url`
- `followers`, `following`, `public_repos`, `public_gists`
- `total_stars`, `total_forks`, `total_watchers`
- `average_stars`, `average_forks`
- `most_used_language`, `language_distribution_json`
- `popularity_score`, `developer_score`, `profile_category`
- `analysis_date`, `created_at`, `updated_at`

## Local Setup

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file based on the provided requirements:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=github_analyzer
   DB_USER=root
   DB_PASSWORD=password
   GITHUB_TOKEN=your_optional_token
   ```
4. **Run Database Schema**
   Import `src/database/schema.sql` into your MySQL server.
5. **Start the server**
   ```bash
   npm run dev
   ```

## Docker Setup

Run the entire stack (App + MySQL) with a single command:
```bash
docker-compose up --build
```

## API Documentation

Once the server is running, visit:
`http://localhost:5000/api-docs`

## Testing

Run tests with:
```bash
npm test
```

## Deployment

This application is ready to be deployed on Render, Railway, or AWS. Ensure you configure the environment variables in your deployment platform.
