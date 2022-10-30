
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Sidebar from '../components/sidebar'
import Page from '../components/page'

import { useSiteMetadata } from '../hooks'

const PageTemplate = ({data}) => {
	const { title: siteTitle, subtitle: siteSubtitle, keywords } = useSiteMetadata()
	const { html: pageBody } = data.markdownRemark
	const { title: pageTitle, description: pageDescription } = data.markdownRemark.frontmatter
	const metaDescription = pageDescription !== null ? pageDescription : siteSubtitle

	return (
		<Layout title={`${pageTitle} - ${siteTitle}`} description={metaDescription} keywords={keywords}>
			<Sidebar />
			<Page title={pageTitle}>
				<div dangerouslySetInnerHTML={{ __html: pageBody }} />
			</Page>
		</Layout>
	)
}

export const query = graphql`
	query PageBySlug($slug: String!) {
		markdownRemark(fields: {slug: {eq: $slug}}) {
			id
			html
			frontmatter {
				title
				data
				description
			}
		}
	}
`

export default PageTemplate