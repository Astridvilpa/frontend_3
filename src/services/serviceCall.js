const BASE_URL = "http://localhost:4000/api/";

export const createService = async (serviceData, token) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(serviceData),
    };
  
    try {
      const response = await fetch(`${BASE_URL}/services`, options);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  };
  
  
  export const getAllServices = async (token) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await fetch(`${BASE_URL}/services`, options);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  export const updateServiceId = async (data, token) => {
    console.log(data, token, "data y token en updateServiceById");
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
  
    try {
      const response = await fetch(`${BASE_URL}/services/${data.id}`, options);
      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  };

  export const deleteServiceById = async (id, token) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await fetch(`${BASE_URL}/services/${id}`, options);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  };
  