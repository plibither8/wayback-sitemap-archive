#!/usr/bin/env node

const fetch = require('node-fetch');
const Sitemapper = require('sitemapper');

const SITEMAP_URL = process.argv[2];
const WAYBACK_SAVE = 'https://web.archive.org/save/';

const main = async () => {
	if (!SITEMAP_URL) {
		console.error('No URL provided.');
		process.exit(1);
	}

	console.log('Fetching sitemap for', SITEMAP_URL);

	const sitemap = new Sitemapper();
	const {sites} = await sitemap
		.fetch(SITEMAP_URL)
		.catch(err => {
			console.error('Failed to fetch sitemap.');
			console.error(err);
			process.exit(1);
		});

	if (sites.length === 0) {
		console.error('No sites found at', SITEMAP_URL);
		console.error('Try specifying a different URL.');
		process.exit(1);
	}

	for (const site of sites) {
		await fetch(WAYBACK_SAVE + site)
			.then(res => {
				if (res.ok) {
					console.log('✔️', 'Archived', site);
				}
			})
			.catch(err => {
				console.error('❌', 'Failed to archive site:', site);
				console.error(err);
			});
	}
};

(async () => await main())();
