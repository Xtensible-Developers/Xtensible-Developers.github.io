
import { useState, useEffect } from 'react'
import storage from 'local-storage-fallback'
import config from '../../customize'
import { theme as globalTheme } from "../components/shared/styles-global"

function useTheme(defaultTheme = {mode: config.defaultTheme}) {
	const [theme, _setTheme] = useState(getInitialTheme)

	// get theme from local storage
	function getInitialTheme() {
		const savedTheme = storage.getItem("theme")
		return savedTheme ? JSON.parse(savedTheme) : defaultTheme
	}

	// Store theme in local storage
	useEffect(() => {
		storage.setItem("theme", JSON.stringify(theme))
	}, [theme])

	// save theme to global var
	globalTheme.curTheme = theme.mode

	return {
		...theme,
		setTheme: ({setTheme, ...theme}) => _setTheme(theme),
	}
}

export default useTheme