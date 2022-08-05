import { createContext, useContext, useState } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showSpinner = () => {
    setIsLoading(true);
  };

  const hideSpinner = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        showSpinner,
        hideSpinner,
        isLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
