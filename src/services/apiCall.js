const BASE_URL = "http://localhost:4000/api/";

export const login = async (credentials) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
  
      body: JSON.stringify(credentials),
    };

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, options);
      
      if (!response.ok) {
        throw new Error('Error en la solicitud de login');
      }

      const data = await response.json();
      
      return data.token;
    } catch (error) {
      console.log(error, "algo ha salido mal login");
      throw error; // Lanza el error para que sea capturado en loginHandler
    }
  };