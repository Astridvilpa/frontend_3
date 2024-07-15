import { createContext, useContext, useState } from "react";

export const AuthContext = createContext()

export const useAuthContext = () => {
 const [userToken, setUserToken] = useState(null)

 const logan = (userWithToken) => {
    setUserToken(userWithToken)
    localStorage.setItem("userToken", JSON.stringify(userWithToken));
 }

 const logout = () => {
    setUserToken(null)
   localStorage.removeItem("userToken")


 }
  return {
    userToken,
    logan,
    logout
  }
}

export const useAuth = () => {
return useContext(AuthContext)

}
