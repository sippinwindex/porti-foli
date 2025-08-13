'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './IconSystem';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
}

export const GitHubIntegration: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const GITHUB_USERNAME = 'sippinwindex'; // Juan's GitHub username

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposResponse.json();
        setRepos(reposData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      HTML: '#e34c26',
      CSS: '#1572B6',
      React: '#61dafb',
      Vue: '#4fc08d',
    };
    return colors[language] || '#858585';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="loading" size={32} className="animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Icon name="error" size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">Failed to load GitHub data</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-dark-50 dark:bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-dark-900 dark:text-white mb-6">
            Open Source
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              {' '}Contributions
            </span>
          </h2>
          <p className="text-xl text-dark-600 dark:text-dark-300 max-w-3xl mx-auto">
            Check out my latest projects and contributions on GitHub
          </p>
        </motion.div>

        {/* GitHub Profile Stats */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 shadow-lg border border-dark-200 dark:border-dark-700 max-w-md w-full">
              <div className="text-center">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary-200 dark:border-primary-700"
                />
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                  {user.name || user.login}
                </h3>
                {user.bio && (
                  <p className="text-dark-600 dark:text-dark-300 mb-4">{user.bio}</p>
                )}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {user.public_repos}
                    </div>
                    <div className="text-sm text-dark-500 dark:text-dark-400">Repos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {user.followers}
                    </div>
                    <div className="text-sm text-dark-500 dark:text-dark-400">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {user.following}
                    </div>
                    <div className="text-sm text-dark-500 dark:text-dark-400">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-dark-900 rounded-2xl p-6 shadow-lg border border-dark-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white truncate">
                  {repo.name}
                </h3>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-primary-600 transition-colors"
                >
                  <Icon name="external-link" size={16} />
                </a>
              </div>

              <p className="text-dark-600 dark:text-dark-300 text-sm mb-4 line-clamp-2">
                {repo.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-dark-500 dark:text-dark-400">
                  {repo.language && (
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Icon name="star" size={14} className="mr-1" />
                    {repo.stargazers_count}
                  </div>
                  <div className="flex items-center">
                    <Icon name="git-fork" size={14} className="mr-1" />
                    {repo.forks_count}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
                <p className="text-xs text-dark-400 dark:text-dark-500">
                  Updated {formatDate(repo.updated_at)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="github" size={20} className="mr-2" />
            <span>View All Repositories</span>
            <Icon name="external-link" size={16} className="ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubIntegration;