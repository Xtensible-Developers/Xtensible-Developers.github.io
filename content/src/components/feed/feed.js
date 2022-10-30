import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Divider, Row, Col, Tag } from 'antd';
import { SelectedOutline } from '@ant-design/icons';
import { Link } from 'gatsby';
import Tags from './tags';

import getCategoryColor from '../../utils/get-category-color';

dayjs.extend(relativeTime)

const Feed = ({edges, allCategories}) => {
	edges.map(edge => {
		const {
			node: {
				html,
				fields: {slug, categorySlug, tagSlugs},
				frontmatter: {date, category, tags, priority}
			}
		} = edge

		let {
			node: {
				frontmatter: { title }
			}
		} = edge

		const featured = eloRank > 0
		const imgFound = html && html.match(/<img\s+[^>]*?src=("|')([^"']+)/i)
		const imgSrc = imgFound && imgFound[2]
		const categoryColor = getCategoryColor({allCategories, category})
		let externalLink = null

		const isTitleLinkPattern = /(?=.*\[)(?=.*\])(?=.*\()(?=.*\))/i
		if (isTitleLinkPattern.test(title)) {
			const found = title.match(/\[(.*)]\((.*)\)/)
			title = found[1]
			externalLink = found[2]
		}

		return (
			<div className={`post ${featured && 'post-featured'} relative`} key ={slug}>
				{featured && (
					<div className="ribbon">
						<span>featured</span>
					</div>
				)}
				
				<Row>
					{imgSrc && (
						<Col xs={24} sm={24} md={4} lg={4} xl={4}>
							<Link to={slug}>
								<img src={imgSrc} alt="" title="" className="mb-5 poster" />
							</Link>
						</Col>
					)}

					<Col xs={24} sm={24} md={{ span: imgSrc ? 19:24, offset: imgSrc ? 1 : 0 }} lg={{ span: imgSrc ? 19 : 24, offset: imgSrc ? 1 : 0 }} xl={{ span: imgSrc ? 19 : 24, offset: imgSrc ? 1 : 0 }}> 
						<Row>
							<Col span={8}>
								<Link to={categorySlug} className="">
									<Tag className={`bg-${categorySlug} text-white border-transparent cursor-pointer px-4 py-1 rounded-full text-base font-semibold`}>
										{category}
									</Tag>
								</Link>
							</Col>

						</Row>
					</Col>
				</Row>
			</div>
		)
	})
}


export default Feed