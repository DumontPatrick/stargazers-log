const list = document.getElementById('star-list');

async function fetchStarredRepos() {
  if (!list) {
    console.error('The star-list element was not found in the document.');
    return;
  }

  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repos = await response.json();
    renderRepos(repos);
  } catch (error) {
    console.error('Unable to load starred repositories:', error);
    list.innerHTML = '<li class="star-item"><p class="repo-description">Unable to load repositories right now.</p></li>';
  }
}

function renderRepos(repos) {
  if (!list) {
    return;
  }

  const safeRepos = Array.isArray(repos) ? repos.filter((repo) => repo && typeof repo === 'object' && repo.repo && repo.name) : [];

  if (safeRepos.length === 0) {
    list.innerHTML = '<li class="star-item"><p class="repo-description">No starred repositories yet.</p></li>';
    return;
  }

  const items = safeRepos.map((repo) => {
    const languageColor = getLanguageColor(repo.language);
    const formattedDate = formatDate(repo.created_at);
    const repoName = escapeHtml(repo.name);
    const repoDescription = escapeHtml(repo.description || 'No description provided.');
    const repoLanguage = escapeHtml(repo.language || 'Unknown');
    const starCount = Number.isFinite(Number(repo.stars)) ? formatCount(Number(repo.stars)) : '0';
    const repoUrl = `https://github.com/${escapeHtml(repo.repo)}`;

    return `
      <li class="star-item">
        <span class="star-badge" aria-hidden="true"></span>
        <div class="repo-details">
          <h2 class="repo-name">
            <a href="${repoUrl}" target="_blank" rel="noopener noreferrer">
              ${repoName}
            </a>
          </h2>
          <p class="repo-description">${repoDescription}</p>
          <div class="repo-meta">
            <span><span class="language-dot" style="--language-color: ${languageColor};"></span>${repoLanguage}</span>
            <span>Starred on ${formattedDate}</span>
          </div>
        </div>
        <div class="star-count" aria-label="Star count">
          <span aria-hidden="true">★</span>
          <span>${starCount}</span>
        </div>
      </li>
    `;
  });

  list.innerHTML = items.join('');
}

function formatDate(value) {
  if (!value) {
    return 'Unknown date';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function formatCount(value) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function getLanguageColor(language) {
  const palette = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    CSS: '#563d7c',
    Python: '#3572A5',
    'C++': '#f34b7d',
    Go: '#00ADD8',
    Rust: '#dea584',
    Java: '#b07219',
    HTML: '#e34c26',
    Shell: '#89e051'
  };

  return palette[language] || '#8c8c8c';
}

fetchStarredRepos();
