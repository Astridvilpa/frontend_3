
const BASE_URL = "http://localhost:4000/api/";


export const createAppointment = async (appointmentData, token) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentData), // Corregido: usar appointmentData en lugar de serviceData
    };
  
    try {
      const response = await fetch(`${BASE_URL}/appointments`, options);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error creating appointment:", error);
      return { success: false, message: error.message };
    }
  };
  