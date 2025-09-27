import React, {createContext, useState, useEffect} from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
	const [user, setUserState] = useState(null);

	// Load user from localStorage on app start
	useEffect(() => {
		const savedUser = localStorage.getItem("user");
		if (savedUser) {
			const parsedUser = JSON.parse(savedUser);

			if (parsedUser.expiry && parsedUser.expiry > Date.now()) {
				// Restore user
				setUserState(parsedUser);

				// Sliding expiry: extend 15 more days from now
				const newExpiry = Date.now() + 15 * 24 * 60 * 60 * 1000;
				const updatedUser = {...parsedUser, expiry: newExpiry};
				setUserState(updatedUser);
				localStorage.setItem("user", JSON.stringify(updatedUser));
			} else {
				// expired → log out
				localStorage.removeItem("user");
				setUserState(null);
			}
		}
	}, []);

	// Custom setter to update both state and localStorage
	const setUser = (userData) => {
		if (userData) {
			const expiry = Date.now() + 15 * 24 * 60 * 60 * 1000; // 15 days in ms
			const dataToStore = {...userData, expiry};
			setUserState(dataToStore);
			localStorage.setItem("user", JSON.stringify(dataToStore));
		} else {
			setUserState(null);
			localStorage.removeItem("user");
		}
	};

	return (
		<UserContext.Provider value={{user, setUser}}>
			{children}
		</UserContext.Provider>
	);
};
