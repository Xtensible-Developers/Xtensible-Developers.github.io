import React from 'react'
import Layour from '../components/layout'
import SEO from '../components/seo'

const PageNotFound = () => {
	const { title, subtitle, keyworkds } = useSiteMetadata()

	return (
		<Layout title={`Not Found - ${title}`} description={subtitle} keywords={keywords}>
			<SEO title="404: Not found" />
			<Page title="404 : NOT FOUND">
				<p>You just hit a dead end, try getting back...</p>
			</Page>
		</Layout>
	)
}
