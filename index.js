const fetch = require('node-fetch');
const Sitemapper = require('sitemapper');

const SITEMAP_URL = process.argv[2] || 'https://mihir.ch/sitemap.xml';
const WAYBACK_SAVE = 'https://web.archive.org/save/';

const main = async () => {
	const sitemap = new Sitemapper();
	const {sites} = await sitemap.fetch(SITEMAP_URL);

	for (const site of sites) {
		await fetch(WAYBACK_SAVE + site)
			.then(res => {
				if (res.ok) {
					console.log('✔️', site);
				}
			});
	}
};

(async () => await main())();
