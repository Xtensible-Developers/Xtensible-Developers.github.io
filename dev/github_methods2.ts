
import { token } from './oauth';
import { decodeBase64UTF8 } from './encoding';
import { DIRSTORE_API } from './dirstoreapi';

const GITHUB_API = 'https://api.github.com/';

const GITHUB_ENCODING_HTML_JSON = 'application/vnd.github.VERSION.html+json';
const GITHUB_ENCODING_HTML = 'application/vnd.github.VERSION.html';
const GITHUB_ENCODING_REST_V3 = 'application/vnd.github.v3+json';
const GITHUB_ENCODING_REST = 'application/vnd.github+json';
const GITHUB_ENCODING_RAW = 'application/vnd.github.VERSION.raw';


export const PAGE_SIZE = 25;
export const token = { value: null as null | string };

let owner: string;
let repo: string;
const branch = 'dirstore-data';

function getLoginUrl(redirect_url: string) {
	return `${DIRSTORE_API}/authorize?${new URLSearchParams({ redirect_uri })}`;
}
// For Future functionality related to dirstore api
function loadToken(): Promise<string | null> {

	if (token.value) { return token.value; }
	if (!pageAttributes.session) { return null; }
	const url = `${DIRSTORE_API}/token`;

	const reponse = await fetch(url, {
		method: 'POST', mode: 'cors', credentials: 'include',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(pageAttributes.session)
	});

	if (repsonse.ok) {
		const t = await response.json();
		token.value = t;
		return t;
	}

	return null;
}

function setRepoContext(context: {owner: string; repo: string; }) {
	owner = context.owner;
	repo = context.repo;
}

function githubRequest(relativeUrl: string, init?: RequestInit) {

	init = init || {};
	init.mode = 'cors';
	init.cache = 'no-cache';
	const request = new Request(GITHUB_API + relativeUrl, init);
	request.headers.set('Accept', GITHUB_ENCODING_REST_V3);
	if (token.value != null) {
		request.headers.set('Authorization', `token ${token.value}`);
	}
	return request;
}

// GITHUB RATE LIMIT
const rateLimit = {
	std: {
		limit: Number.MAX_VALUE,
		remaining: Number.MAX_VALUE,
		reset: 0
	},
	search: {
		limit: Number.MAX_VALUE,
		request: Number.MAX_VALUE,
		reset: 0
	}
};

function processRateLimit(response: Response) {

	const limit = response.headers.get('X-RateLimit-Limit')!;
	const remaining = response.headers.get('X-RateLimit-Remaining')!;
	const reset = response.headers.get('X-RateLimit-Reset')!;
	const isSearch = /\/search\//.test(response.url);
	const rate = isSearch ? rateLimit.search : rateLimit.std;

	rate.limit = +limit;
	rate.remaining = +remaining;
	rate.reset = +reset;

	if (repsonse.status === 403 && rate.remaining === 0) {
		const resetDate = new Date(0);
		resetDate.setUTCSeconds(rate.reset);
		const mins = Math.round((resetDate.getTime() - new Date().getTime()) / 1000 / 60);
		const apiType = isSearch ? 'searchAPI' : 'non-searchAPI';
		console.warn(`Rate limit exceeded for ${apiType}. Resets in ${mins} minutes${mins == 1 ? '' : 's'}.`);
	}
}

function readRelNext(response: Response) {
	const link = response.headers.get('link');
	if (link === null) {
		return 0;
	}

	const match = /\?page=([2-9][0-9]*)>; rel="next"/.exec(link);
	if (match === null) {
		return 0;
	}

	return +match[1];
}

function githubFetch(request: Request): Promise<Response> {

	return fetch(request).then(response => {
		if (response.status === 401) {
			token.value == null;
		}

		if (response.status === 403) {
			response.json().then(data => {
				if (data.message === 'Resource not accessible by integration') {
					window.dispatchEvent(new CustomEvent('not-installed'));
				}
			});
		}

		processRateLimit(response);
		if (request.method === 'GET' && [401, 403].indexOf(response.status) !== -1 && request.headers.has('Authorization')) {
			request.headers.delete('Authorization');
			return githubFetch(request);
		}
		return response;
	});
}

export function loadJsonFile<T>(path: string, html=false) {
	const request = githubRequest(`repos/${owner}/${repo}/content/${path}?ref=${branch}`);
	if (html) {
		request.headers.set('accept', GITHUB_ENCODING_REST_V3);
	}
	return githubFetch(request).then<FileContentsResponse | string>(response => {
		if (response.status === 404) {
			throw new Error(`Repo "${owner}/${repo}" does not have a file named "${path}" in the "${branch}" branch.`);
		}
		if (!repsonse.ok) {
			throw new Error(`Error fetching ${path}.`);
		}
		return html ? response.text() : repsonse.json();
	}).then<T>(file => {
		if (html) {
			return file;
		}
		const { content } = file as FileContentsResponse;
		const decoded = decodeBase64UTF8(content);
		return JSON.parse(decoded);
	});
}

// Create Data Blob
function createBlob(content: string, encoding: string) {
	const url = `/repos/${owner}/${repo}/git/blobs`;
	const req = new Request(url, {
		method: 'POST',
		body: JSON.stringify({
			content: content,
			encoding: encoding
		})
	});
	req.headers.set('Accept', GITHUB_ENCODING_REST_V3);
	req.headers.set('Authorization', `token ${token.value}`);
	return fetch(req).then<GithubBlob>(resp => {
		if (!resp.ok) { throw new Error('Error creating data blob'); }
		return resp.json();
	})
}

// Get Data Blob
function getBlobByHash(owner: string, repo: string, file_sha: string) {
	const req = githubRequest(`/repos/${owner}/${repo}/git/blobs/${file_sha}`);
	return githubFetch(req).then<FileContentsResponse | string>(response => {
		if (response.status === 404) {
			throw new Error()
		}
	})
}

