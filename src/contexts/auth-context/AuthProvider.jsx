import { AuthContext, useAuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const auth = useAuthContext();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
