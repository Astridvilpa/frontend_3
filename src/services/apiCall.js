const BASE_URL = "htt://localhost:/4000/api/";

export const login = async (credentials) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
  
      body: JSON.stringify(credentials),
    }
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, options)
      const data = await response.json()
      
      return data.token
    } catch (error) {
      console.log(error, "algo ha salido mal login")
      
    }
  };
  