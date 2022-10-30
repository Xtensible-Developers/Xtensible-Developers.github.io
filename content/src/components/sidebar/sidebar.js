import React from 'react'
import { Layout, Divider } from 'antd'

import {User, Author} from './user'
import Contacts from './contacts'
import Menu from './menu'
import Categories from './categories'
import Tags from './Tags'

import { useSiteMetadata } from '../../hooks'

const { Sider } = Layout

const Sidebar = ({hideMobile}) => {
	const { author, menu} = useSiteMetadata()

	return (
		<Sider className={`text-white no-print ${hideMobile && 'hide-mobile'}`}>
			<User user={user} />
			<Divider className="sidebar-divider" />
			<Author author={author} />
			<Contacts contacts={author.contacts} />
			<Divider className="sidebar-divider" />

			<div className="hide-mobile" >
				<Categories />
				<Tags />
			</div>
		</Sider>
	)
}

export default Sidebar