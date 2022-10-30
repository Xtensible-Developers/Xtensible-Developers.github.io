
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Sidebar from '../components/sidebar'
import Post from '../components/post'

import { useSiteMetadata } from '../hooks'

const PostTemplate = ({data, pageContext, authContext}) => {
	const { title: siteTitle, subtitle: siteSubtitle, keywords } = useSiteMetadata()
	const { title: postTitle, description: postDescription } = data.markdownRemark.frontmatter
	const metaDescription = postDescription !== null ? postDescription : siteSubtitle

	return (
		<Layout title={`${postTitle} - ${siteTitle}`} description={metaDescription} keywords={keywords} article={{ title: postTitle, description: metaDescription }}>

			<Sidebar hideMobile={true} />

			<Post post={data.markdownRemark} allCategories={pageContext.allCategories} />

		</Layout>
	)
}

export const query = graphql`
	query PostBySlug($slug: String!) {
		markdownRemark(fields: {slug: {eq: $slug}}) {
			id
			html
			fields {
				slug
				tagSlugs
				categorySlug
			}

			frontmatter {
				date
				description
				category
				tags
				title
			}
		}
	}
`

export default PostTemplate