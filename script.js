const list = document.getElementById('star-list');

async function fetchStarredRepos() {
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
  if (!Array.isArray(repos) || repos.length === 0) {
    list.innerHTML = '<li class="star-item"><p class="repo-description">No starred repositories yet.</p></li>';
    return;
  }

  const items = repos.map((repo) => {
    const languageColor = getLanguageColor(repo.language);
    const date = new Date(repo.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return `
      <li class="star-item">
        <span class="star-badge" aria-label="Starred"></span>
        <div class="repo-details">
          <h2 class="repo-name">
            <a href="https://github.com/${repo.repo}" target="_blank" rel="noreferrer">
              ${repo.name}
            </a>
          </h2>
          <p class="repo-description">${repo.description || 'No description provided.'}</p>
          <div class="repo-meta">
            <span><span class="language-dot" style="--language-color: ${languageColor};"></span>${repo.language || 'Unknown'}</span>
            <span>Starred on ${date}</span>
          </div>
        </div>
        <div class="star-count" aria-label="Star count">
          <span>★</span>
          <span>${formatCount(repo.stars)}</span>
        </div>
      </li>
    `;
  });

  list.innerHTML = items.join('');
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
    C++: '#f34b7d',
    Go: '#00ADD8',
    Rust: '#dea584',
    Java: '#b07219',
    HTML: '#e34c26',
    Shell: '#89e051'
  };

  return palette[language] || '#8c8c8c';
}

fetchStarredRepos();
