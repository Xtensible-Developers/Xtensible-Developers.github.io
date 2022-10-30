

// Get a Database file, This API is size limited to 100 MB
function getDBFile<T>(path: string) {

	const request = githubRequest(`repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
	return githubFetch(request).then<FileContentsResponse | string>(resp => {
		if (resp.status === 404) {
			throw new Error(`Repo "${owner}/${repo}" does not have a file named "${path}" in the "${branch}" branch.`);
		}
		if (!resp.ok) {
			throw new Error(`Error fetching ${path}.`);
		}
		return resp.json();

	}).then<T>(file => {

		const { content } = file as FileContentsResponse;
		const decoded = decodeBase64UTF8(content);
		return DocumentFormat.parse(decoded);

	})
}

// Create a database file
function createUpdateDBFile(filePath: string, oldHash: string, commit: Commit, dbUser: GithubDBUser, content: string) {

	const url = `/repos/${dbUser.getOwner()}/${dbUser.getRepo()}/contents/${filePath}`;
	const request = new Request(url, {
		method: 'PUT',
		body: JSON.stringify({
			message: commit.getMessage(),
			committer: commit.getCommitter();
			content: content,
			author: commit.getAuthor(),
			branch: dbUser.getBranch(),
			sha: oldHash
		})
	});

	return fetch(request).then<GithubDBFile>(resp => {
		if (!resp.ok) {
			throw new Error('Error creating GithubDBFile');
		}
		return resp.json();
	});
}

// Enable GitLFS
function enableLFS(dbUser: GithubDBUser, dbRepo: GithubDBRepo) {
	const url = `/repos/${dbUser.getOwner()}/${dbRepo.getName()}/lfs`;
	const request = new Request(url, { method: 'PUT' });
	request.headers.set('Accept', GITHUB_ENCODING_REST_V3);
	request.headers.set('Authorization', `token ${token.value}`);
	return fetch(request).then(resp => {
		if (!resp.ok) { throw new Error(`Error Enabling GitLFS for the Repo : ${dbRepo.getName()}.`); }
		return resp.json();
	})
}

// Disable GitLFS
function disableLFS(dbUser: GithubDBUser, dbRepo: GithubDBRepo) {
	const url = `/repos/${dbUser.getOwner()}/${dbRepo.getName()}/lfs`;
	const request = new Request(url, { method: 'DELETE'});
	request.headers.set('Accept', GITHUB_ENCODING_REST_V3);
	request.headers.set('Authorization', `token ${token.value}`);
	return fetch(request).then(resp => {
		if (!resp.ok) { throw new Error(`Error Disabling GitLFS for Repo : ${dbRepo.getName()}.`); }
		return resp.json();
	})
}

function deleteDBFile(githubDBFile: GithubDBFile, dbUser: GithubDBUser, commit: Commit) {

	const url = `/repos/${dbUser.getOwner()}/${dbUser.getRepo()}/contents/${githubDBFile.getPath()}`;
	const request = new Request(url, {
		method: 'DELETE',
		body: JSON.stringify({
			message: commit.getMessage(),
			sha: githubDBFile.getHash(),
			branch: dbUser.getBranch(),
			committer: commit.getCommitter(),
			author: commit.getAuthor(),
		})
	});
	request.headers.set('Accept', GITHUB_ENCODING_REST_V3);
	request.headers.set('Authorization', `token ${token.value}`);
	return fetch(request).then<GithubDBFile>(resp => {
		if (!resp.ok) {
			throw new Error('Error deleting GithubDBFile');
		}
		return resp.json();
	});
}

const templateOwner = 'xtensibledevs'
const templateRepo = 'xtensibleoctocatdb-temp-v1';

// Create a Database Repo
function createDBRepo(dbUser: GithubDBUser, dbRepo: GithubDBRepo) {

	const url = `/repos/${template_owner}/${template_repo}/generate`;
	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify({
			owner: dbUser.getOwner(),
			name: dbRepo.getRepoName(),
			include_all_branches: true,
			description: dbRepo.getRepoDesc(),
			private: dbRepo.isPrivate(),
		})
	});
	request.headers.set('Accept', GITHUB_ENCODING_REST_V3);
	request.headers.set('Authorization', `token ${token.value}`);
	return fetch(request).then<RepoCreateResp>(resp => {
		if (!resp.ok) {
			throw new Error('Error creating DBRepo');
		}
		return resp.json();
	})
}