module.exports = {
	ci: {
		collect: {
			startServerCommand: 'npm run build && npm run preview',
			startServerReadyPattern: 'ready started server on',
			url: ['http://localhost:4173'],
			numberOfRuns: 5,
			settings: {
				preset: 'desktop',
				throttling: {
					rttMs: 40,
					throughputKbps: 10240,
					cpuSlowdownMultiplier: 1
				}
			}
		},
		assert: {
			preset: 'lighthouse:recommended',
			assertions: {
				'categories:performance': ['warn', { minScore: 0.9 }],
				'categories:accessibility': ['error', { minScore: 0.9 }],
				'categories:best-practices': ['warn', { minScore: 0.9 }],
				'categories:seo': ['warn', { minScore: 0.9 }]
			}
		},
		upload: {
			target: 'temporary-public-storage'
		}
	}
};
