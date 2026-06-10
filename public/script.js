let languageChart = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchStats();
    fetchProfiles();

    // Event Listeners
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    const closeMobileMenu = () => {
        mobileMenu.classList.add('hidden');
    };

    document.getElementById('nav-dashboard').addEventListener('click', (e) => {
        e.preventDefault();
        showDashboard();
    });

    document.getElementById('mobile-nav-dashboard').addEventListener('click', (e) => {
        e.preventDefault();
        showDashboard();
        closeMobileMenu();
    });

    document.getElementById('nav-recent').addEventListener('click', (e) => {
        e.preventDefault();
        showRecent();
    });

    document.getElementById('mobile-nav-recent').addEventListener('click', (e) => {
        e.preventDefault();
        showRecent();
        closeMobileMenu();
    });

    document.getElementById('analyze-btn').addEventListener('click', analyzeUser);

    document.getElementById('refresh-list-btn').addEventListener('click', fetchProfiles);

    document.getElementById('username-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeUser();
        }
    });

    // Event delegation for "View Details" buttons in the table
    document.getElementById('profiles-table-body').addEventListener('click', (e) => {
        if (e.target.classList.contains('view-profile-btn')) {
            const username = e.target.getAttribute('data-username');
            viewProfile(username);
        }
    });
});

async function fetchStats() {
    try {
        const response = await fetch('/api/github/stats');
        const result = await response.json();
        if (result.success) {
            const { totalProfiles, averageFollowers, averageRepos } = result.data;
            document.getElementById('dash-total').textContent = totalProfiles;
            document.getElementById('dash-avg-followers').textContent = averageFollowers;
            document.getElementById('dash-avg-repos').textContent = averageRepos;
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

async function fetchProfiles() {
    try {
        const response = await fetch('/api/github/profiles?limit=10');
        const result = await response.json();
        if (result.success) {
            renderProfilesTable(result.data.profiles);
        }
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }
}

function renderProfilesTable(profiles) {
    const tbody = document.getElementById('profiles-table-body');
    tbody.innerHTML = profiles.map(profile => `
        <tr class="hover:bg-slate-50 transition">
            <td class="px-8 py-4">
                <div class="flex items-center space-x-3">
                    <img src="${profile.avatar_url}" class="w-10 h-10 rounded-xl shadow-sm" alt="${profile.username}">
                    <div>
                        <div class="font-bold text-slate-900">${profile.name || profile.username}</div>
                        <div class="text-xs text-slate-500">@${profile.username}</div>
                    </div>
                </div>
            </td>
            <td class="px-8 py-4">
                <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                    ${profile.profile_category}
                </span>
            </td>
            <td class="px-8 py-4 font-bold text-slate-700">${profile.popularity_score}</td>
            <td class="px-8 py-4 font-bold text-indigo-600">${profile.developer_score}</td>
            <td class="px-8 py-4">
                <button data-username="${profile.username}" class="view-profile-btn text-blue-600 hover:text-blue-800 font-bold text-sm">View Details</button>
            </td>
        </tr>
    `).join('');
}

async function analyzeUser() {
    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value.trim();
    if (!username) return;

    const loader = document.getElementById('loader');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');

    loader.classList.remove('hidden');
    analyzeBtn.disabled = true;
    resultsSection.classList.add('hidden');

    try {
        const response = await fetch(`/api/github/analyze/${username}`, { method: 'POST' });
        const result = await response.json();

        if (result.success) {
            displayResults(result.data);
            fetchStats();
            fetchProfiles();
        } else {
            alert(result.message || 'Error analyzing profile');
        }
    } catch (error) {
        console.error('Analysis error:', error);
        alert('Failed to connect to the server');
    } finally {
        loader.classList.add('hidden');
        analyzeBtn.disabled = false;
    }
}

async function viewProfile(username) {
    try {
        const response = await fetch(`/api/github/profiles/${username}`);
        const result = await response.json();
        if (result.success) {
            displayResults(result.data);
            window.scrollTo({ top: document.getElementById('results-section').offsetTop - 100, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error viewing profile:', error);
    }
}

function displayResults(data) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('hidden');

    // Update Basic Info
    document.getElementById('avatar').src = data.avatar_url;
    document.getElementById('name').textContent = data.name || data.username;
    document.getElementById('username').textContent = `@${data.username}`;
    document.getElementById('bio').textContent = data.bio || 'No bio available';
    document.getElementById('followers').textContent = data.followers;
    document.getElementById('public-repos').textContent = data.public_repos;
    document.getElementById('following').textContent = data.following;

    // Optional Fields
    const toggleField = (id, boxId, value) => {
        const el = document.getElementById(id);
        const box = document.getElementById(boxId);
        if (value) {
            el.textContent = value;
            if (id === 'blog') el.href = value.startsWith('http') ? value : `https://${value}`;
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    };

    toggleField('location', 'location-box', data.location);
    toggleField('company', 'company-box', data.company);
    toggleField('blog', 'blog-box', data.blog);

    // Update Scores
    document.getElementById('popularity-score').textContent = data.popularity_score;
    document.getElementById('developer-score').textContent = data.developer_score;
    document.getElementById('profile-category').textContent = data.profile_category;

    // Animate Progress Bars (cap at 100% for visual only)
    const popPercent = Math.min((data.popularity_score / 1000) * 100, 100);
    const devPercent = Math.min((data.developer_score / 1000) * 100, 100);
    document.getElementById('popularity-bar').style.width = `${popPercent}%`;
    document.getElementById('developer-bar').style.width = `${devPercent}%`;

    // Update Detail Cards
    document.getElementById('total-stars').textContent = data.total_stars;
    document.getElementById('total-forks').textContent = data.total_forks;
    document.getElementById('last-30').textContent = data.repositories_last_30_days;
    document.getElementById('original-repos').textContent = data.original_repositories;

    // Update Repos
    document.getElementById('most-starred-repo').textContent = data.most_starred_repo || 'N/A';
    document.getElementById('most-forked-repo').textContent = data.most_forked_repo || 'N/A';

    // Update Chart
    renderLanguageChart(data.language_distribution_json);
}

function renderLanguageChart(distribution) {
    const ctx = document.getElementById('languageChart').getContext('2d');
    
    if (languageChart) {
        languageChart.destroy();
    }

    if (!distribution || Object.keys(distribution).length === 0) {
        return;
    }

    const labels = Object.keys(distribution);
    const values = Object.values(distribution);
    const colors = [
        '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', 
        '#6366f1', '#f43f5e', '#14b8a6', '#f97316', '#06b6d4'
    ];

    languageChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function showDashboard() {
    const dashboardSection = document.getElementById('dashboard-section');
    if (dashboardSection) {
        dashboardSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showRecent() {
    const recentSection = document.getElementById('recent-section');
    if (recentSection) {
        recentSection.scrollIntoView({ behavior: 'smooth' });
    }
}
