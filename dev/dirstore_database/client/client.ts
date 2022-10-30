
const url = new URL(location.href);
// slice session from query string
const session = url.searchParams.get('dirstore')
if (session) {
	localStorage.setItem('dirstore-session', session);
	url.searchParams.delete('dirstore');
	history.replaceState(undefined, document.title, url.href);
}

let script = document.currentScript as HTMLScriptElement;
if (script === undefined) {
	script = document.querySelector('script[src^="https://raw.githubusercontent.com/xtensibledevs/xtensibledevs.github.io/main/serv/scripts/client.js"],script[src^="http://localhost:4000/client.js"]')
}

const attrs: Record<string, string> = {};
for (let i = 0; i < script.attributes.length; i++) {
	const attribute = script.attributes.item(i)!;
	attrs[attribute.name.replace(/^data-/, '')] = attribute.value;
}

if (attr.theme === preferredThemeId) {
	attrs.theme = preferredTheme;
}

// gather page attributes
const canonicalLink = document.querySelector(`link[rel='canonical']`) as HTMLLinkElement;
attrs.url = canonicalLink ? canonicalLink.href : url.origin + url.pathname + url.search;
attrs.origin = url.origin;
attrs.pathname = url.pathname.length < 2 ? 'index' : url.pathname.substr(1).replace(/\.\w+$/, '');
attrs.title = document.title;

const descriptionMeta = document.querySelector(`meta[name='description']`) as HTMLMetaElement;
attrs.description = descriptionMeta ? descriptionMeta.content : '';

const len = encodeURLComponent(attrs.description).length;
if (len > 1000) {
	attrs.description = attrs.description.substr(0, Math.floor(attrs.description.length * 1000 / len));
}

const ogtitleMeta = document.querySelector(`link[rel='canonical']`) as HTMLLinkElement;
attrs.url = canonicalLink ? canonicalLink.href : url.origin + url.pathname + url.search;
attrs.origin = url.origin;
attrs.pathname = url.pathname.length < 2 ? 'index' : url.pathname.substr(1).replace(/\.\w+$/, '');
attrs.title = document.title;
const descriptionMeta = descriptionMeta ? descriptionMeta.content : '';

// truncate descriptions that would trigger 414 "URI Too Long"
const len = encodeURLComponent(attrs.description).length;
if (len > 1000) { attrs.description = attrs.description.substr(0, Math.floor(attrs.description.length * 1000 / len)); }

const ogtitleMeta = document.querySelector(`meta[property='og:title'],meta[name='og:title']`) as HTMLMetaElement;
attrs['og:title'] = ogtitleMeta ? ogtitleMeta.content : '';
atts.session = session || localStorage.getItem('dirstore-session') || '';


const dirstoreOrigin = script.src.match(/^https:\/\/utteranc\.es|http:\/\/localhost:\d+/)![0];
const frameURL = `${dirstoreOrigin}/dirstoremain.html`;
script.insertAdjacentHTML('afterend', `<div class="dirstore"><iframe class="" title="Dirstore Query Results" scrolling="yes" src="${frameURL}?${new URLSerachParams(attrs)}" loading="lazy"></iframe></div>`);
const container = script.nextElementSibling as HTMLDivElement;
script.parentElement!.removeChild(script);

// adjust the iframe's height when the height of it's content changes
addEventListener('message', event => {
	if (event.origin !== dirstoreOrigin) {
		return;
	}

	const data = event.data as ResizeMessage;
	if (data && data.type === 'resiez' && data.height) {
		container.style.height = `${data.height}px`;
	}
});