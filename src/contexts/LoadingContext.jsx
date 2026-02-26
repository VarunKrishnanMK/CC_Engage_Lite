import { createContext, useContext, useState } from 'react';
import Loader from '../components/Loader';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    const value = {
        isLoading,
        showLoading: () => setIsLoading(true),
        hideLoading: () => setIsLoading(false),
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
            {isLoading && <Loader />}
        </LoadingContext.Provider>
    );
}

export const useLoader = () => {
    return useContext(LoadingContext);
};
