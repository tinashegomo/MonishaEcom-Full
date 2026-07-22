import axios from "axios";
import { getStoredToken, isTokenExpired, removeToken } from "../utils/tokenUtils";

const API = axios.create({
    baseURL: "/api/monishaEcom"
});

// Before EVERY request is sent, this function runs.
// It reads the JWT token from localStorage and attaches it to the Authorization header.
// Spring Boot's security filter reads this header and decides whether to let the request through.
// If there's no token (user not logged in), the header is simply left out
API.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    // If the token is expired, remove it from localStorage
    if (isTokenExpired(token)) {
      removeToken();
      return config; // proceeds without auth header → backend returns 401
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// This is a response interceptor — the mirror image of the request interceptor.
// It catches every response (or error) coming back from the backend.
// Response interceptor: auto-redirect to /login on 401/403
API.interceptors.response.use(
  (response) => response,   // Handler #1: runs on SUCCESS
  (error) => {              // Handler #2: runs on FAILURE
    if (error.response?.status === 401 || error.response?.status === 403) {
      removeToken();
      window.location.href = "/login";
    }

    // If we don't throw the error here, Axios will think the request worked fine,
    // even though it actually failed. That means the component that called this API
    // will not know there was a problem, and it may try to use data that doesn't exist.
    throw error; // send the error back so the calling code still knows it failed
  }
);

/* ============================================================
                       AUTH APIs
   ============================================================ */

export const registerCustomer = async (RegisterRequestDTO) => {
    const response = await API.post("/auth/register", RegisterRequestDTO);
    return response.data; // Returns AuthResponseDTO
};

export const loginCustomer = async (LoginRequestDTO) => {
    const response = await API.post("/auth/login", LoginRequestDTO);
    return response.data; // Returns AuthResponseDTO
};

/* ============================================================
                    PRODUCT CATALOG APIs
   ============================================================ */

export const getAllProducts = async () => {
    const response = await API.get("/products");
    return response.data; // Returns List<ImsProductDTO>
};

export const getProductById = async (productId) => {
    const response = await API.get(`/products/${productId}`);
    return response.data; // Returns ImsProductDTO
};

/* ============================================================
                       CART APIs
   ============================================================ */

export const getCart = async () => {
    const response = await API.get("/cart");
    return response.data; // Returns CartResponseDTO
};

export const addToCart = async (AddToCartRequestDTO) => {
    const response = await API.post("/cart/items", AddToCartRequestDTO);
    return response.data; // Returns CartResponseDTO
};

export const updateCartItem = async (itemId, quantity) => {
    const response = await API.put(`/cart/items/${itemId}`, { quantity });
    return response.data; // Returns CartResponseDTO
};

export const removeCartItem = async (itemId) => {
    const response = await API.delete(`/cart/items/${itemId}`);
    return response.data; // Returns CartResponseDTO
};

export const clearCart = async () => {
    const response = await API.delete("/cart");
    return response.data;
};

/* ============================================================
                     WISHLIST APIs
   ============================================================ */

export const getWishlist = async () => {
    const response = await API.get("/wishlist");
    return response.data; // Returns List<WishlistResponseDTO>
};

export const addToWishlist = async (AddToWishlistRequestDTO) => {
    const response = await API.post("/wishlist/items", AddToWishlistRequestDTO);
    return response.data; // Returns WishlistResponseDTO
};

export const removeFromWishlist = async (itemId) => {
    const response = await API.delete(`/wishlist/items/${itemId}`);
    return response.data;
};

/* ============================================================
                     ORDER APIs
   ============================================================ */

export const checkout = async (CheckoutRequestDTO) => {
    const response = await API.post("/orders/checkout", CheckoutRequestDTO);
    return response.data; // Returns OrderResponseDTO
};

export const getMyOrders = async () => {
    const response = await API.get("/orders/my-orders");
    return response.data; // Returns List<OrderResponseDTO>
};
