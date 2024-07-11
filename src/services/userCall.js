const BASE_URL = "http://localhost:4000/api/";

export const getProfile = async (token) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}users/profile`, options);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error, "Error al recuperar mi perfil");
  }
};




export const updateProfile = async (data, token) => {
  console.log(data, token, "somos data y token en updateProfile");
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${BASE_URL}/users/profile`, options);
    const data = response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};



