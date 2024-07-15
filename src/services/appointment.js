const BASE_URL = "http://localhost:4000/api";

export const createAppointment = async (appointmentData, token) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  };
  console.log("Token:", token);
  console.log("BASE_URL:", BASE_URL);
  try {
    const response = await fetch(`${BASE_URL}/appointments`, options);
    const responseData = await response.json();
    console.log("Appointment creation response:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, message: error.message };
  }
};

export const getUserAppointments = async (userId, token) => {
  console.log(userId, token)
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/appointments/user/${userId}`, options);
    const responseData = await response.json();
    console.log("Get user appointments response:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error getting user appointments:", error);
    return { success: false, message: error.message };
  }
};

export const updateAppointmentById = async (data, token) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${BASE_URL}/appointments/${data.id}`, options);
    const responseData = await response.json();
    console.log("Update appointment response:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false, message: error.message };
  }
};

export const deleteAppointmentById = async (id, token) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/appointments/${id}`, options);
    const responseData = await response.json();
    console.log("Delete appointment response:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, message: error.message };
  }
};

export const getAllAppointments = async (token) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/appointments`, options);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};


export const getAllServices = async (token) => {
  try {
    const response = await fetch("http://localhost:4000/api/services", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, message: "Error fetching services", error };
  }
};