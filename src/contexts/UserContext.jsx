import { createContext, useContext, useEffect, useState } from 'react';
import { getFromLocalStorage } from '../utils/helpers';

const UserContext = createContext();

export function UserDetailsProvider({ children }) {
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        let userInfo = getFromLocalStorage("user");
        setUserDetails(() => userInfo);
    }, [])

    return (
        <UserContext.Provider value={{ userDetails, setUserDetails }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => {
    return useContext(UserContext);
};
