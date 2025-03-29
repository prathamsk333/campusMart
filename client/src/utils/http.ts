import axios from 'axios';
import getToken from './getToken';

const API_BASE_URL = 'http://65.2.70.36:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export async function fetchEvent() {
  try {
    const response = await api.get('/tours');
    return response.data.data;
  } catch (error) {
    console.error('fetchEvent error:', error);
    throw error;
  }
}

export async function fetchitems() {
  try {
    const response = await api.get('/getAllItems');
    return response.data.data;
  } catch (error) {
    console.error('fetchEvent error:', error);
    throw error;
  }
}
export async function fetchTour(tour: any) {
  try {
    const token = getToken();
    const response = await api.get(`/view/${tour}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data.data?.tour || null;
  } catch (error) {
    console.error('fetchTour error:', error);
    throw error;
  }
}

export async function fetchBookings() {
  try {
    const token = getToken();
    const response = await api.get('/view/mybookings/getMyBookings', {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data;
  } catch (error) {
    console.error('fetchBookings error:', error);
    throw error;
  }
}

interface logincreds{
  email:string;
  password:string ,
  
}
export async function loginPOST(credentials:logincreds) {
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

interface signupcreds{
  username:string ,
  password:string ,
  email:string
}
export  async  function signUpPOST(credentials:signupcreds) {
  try {
    const response = await api.post('/users/signup', credentials);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export  async function updateMe(credentials: any) {
  try {
    const token = getToken();
    const response = await api.patch('/users/updateMe', credentials, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data.data || null;
  } catch (error) {
    console.error('updateMe error:', error);
    throw error;
  }
}




export async function checkoutSessionPOST(tourID: any, amount: any) {
  try {
    const token = getToken();
    const response = await api.post(
      `/bookings/checkout-session/${tourID}`,
      { amount, currency: 'INR', receipt: tourID },
      { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    );
    return response.data;
  } catch (error) {
    console.error('checkoutSessionPOST error:', error);
    throw error;
  }
}
