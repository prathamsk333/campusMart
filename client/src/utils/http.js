import axios from "axios";
import getToken from "./getToken";

const API_BASE_URL = "http://localhost:3000/api/v1";

export async function fetchEvent() {
  try {
    const response = await fetch(`${API_BASE_URL}/tours`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to fetch events");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return (await response.json()).data.data;
  } catch (error) {
    console.error("fetchEvent error:", error);
    throw error;
  }
}

export async function fetchitems() {
  try {
    const response = await fetch(`${API_BASE_URL}/getAllItems`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to fetch items");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return (await response.json()).data.data;
  } catch (error) {
    console.error("fetchitems error:", error);
    throw error;
  }
}

export async function fetchTour(tour) {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/view/${tour}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to fetch tour");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return (await response.json()).data?.tour || null;
  } catch (error) {
    console.error("fetchTour error:", error);
    throw error;
  }
}

export async function fetchBookings() {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/view/mybookings/getMyBookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to fetch bookings");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("fetchBookings error:", error);
    throw error;
  }
}

export async function loginPOST(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Login failed");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function signUpPOST(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Signup failed");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function updateMe(credentials) {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/users/updateMe`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to update profile");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return (await response.json()).data || null;
  } catch (error) {
    console.error("updateMe error:", error);
    throw error;
  }
}

export async function checkoutSessionPOST(tourID, amount) {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/bookings/checkout-session/${tourID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
      body: JSON.stringify({ amount, currency: "INR", receipt: tourID }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to create checkout session");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("checkoutSessionPOST error:", error);
    throw error;
  }
}

