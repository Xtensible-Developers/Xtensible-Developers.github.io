import { DIRSTORE_API } from './dirstoreapi';
import { pageAttributes } from './page-attributes';

export const token = { value: null as null | string};

export function getLoginURL(redirect_url: string) {
	return `${DIRSTORE_API}/authorize?${new URLSerachParams({redirect_url})}`;
}

export async function loadToken(): Promise<string | null> {
	if (token.value) { return token.value; }
	if (!pageAttributes.session) { return null; }
	const url = `${DIRSTORE_API}/token`;
	const resp = await fetch(url, {method: 'POST', mode: 'cors', credentials: 'include', headers: {'content-type': 'application/json'}, body: JSON.stringify(pageAttributes.session)});
	if (resp.ok) {
		const t = await resp.json();
		token.value = t;
		return t;
	}
	return null;
}