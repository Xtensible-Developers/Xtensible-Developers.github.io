
import React from 'react'
import { withPrefix, Link } from 'gatsby'

const User = ({user}) => (
	<div className="text-center pt-5">
		<Link to={user.homepage}>
			<img className="rounded-full" src={withPrefix(user.avatar)} width={85} alt={user.username} />
		</Link>
		<h2 className="text-white mt-5">{user.username}</h2>
		<p className="text-gray-300">{user.bio}</h2>
	</div>
)

export default User