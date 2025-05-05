import axios from "axios";
import getToken from "./getToken";

const API_BASE_URL = "http://localhost:3001/api/v1";



export async function fetchitems() {
  try {
    const response = await fetch(`${API_BASE_URL}/items/getAllItems`, {
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

    const responseData = await response.json();
    return responseData.data?.items || [];
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
    console.log("Login response:", response);
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
export async function fetchUserDetails() {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/users/user`, {
      method: "POST", // Change to POST to send the ID in the body
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",      // Send the ID in the request body
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to fetch user details");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return (await response.json()).data?.user || null;
  } catch (error) {
    console.error("fetchUserDetails error:", error);
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
export async function createBid(productId, bidAmount) {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Authentication required. Please log in to place a bid.");
    }
    
    const response = await fetch(`${API_BASE_URL}/items/bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
       itemId: productId,
        amount: bidAmount
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to place bid";
      
      // Try to parse the error message if it's in JSON format
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
       console.error("Failed to parse error message:", e);
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    const data = await response.json();
    console.log("Bid created successfully:", data);
    return data;
  } catch (error) {
    console.error("createBid error:", error);
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
export async function getItemById(itemId) {
  try {
    const token = getToken(); // Retrieve the token if authentication is required
    const response = await fetch(`${API_BASE_URL}/items/item_details/${itemId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // Include token if available
      },
      credentials: "include", // Include cookies if needed
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to fetch item by ID");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return await response.json(); } catch (error) {
    console.error("getItemById error:", error);
    throw error;
  }
}
export async function createItem(itemDetails) {
  try {
    const token = getToken();
    const formData = new FormData();
    for (const key in itemDetails) {
      if (key !== "images") {
        formData.append(key, itemDetails[key]);
      }
    }
    if (itemDetails.images && itemDetails.images.length) {
      itemDetails.images.forEach((file) => {
        formData.append("images", file); 
      });
    }
    
    console.log("Sending data to server with", itemDetails.images.length, "images");    
    const response = await fetch(`${API_BASE_URL}/items/createItem`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to create item");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("createItem error:", error);
    throw error;
  }
}