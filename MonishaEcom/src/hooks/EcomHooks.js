import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ecomAPI from "@/api/EcomAPI";
import { getStoredToken, isTokenExpired } from "@/utils/tokenUtils";

const isAuthenticated = () => {
  const token = getStoredToken();
  return !!token && !isTokenExpired(token);
};

/* ============================================================
                       AUTH HOOKS
   ============================================================ */

export const useRegisterCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (RegisterRequestDTO) => ecomAPI.registerCustomer(RegisterRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useLoginCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (LoginRequestDTO) => ecomAPI.loginCustomer(LoginRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/* ============================================================
                  PRODUCT CATALOG HOOKS
   ============================================================ */

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => ecomAPI.getAllProducts(),
  });
};

export const useGetProductById = (productId) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => ecomAPI.getProductById(productId),
    enabled: !!productId, // only run when productId is available
  });
};

/* ============================================================
                       CART HOOKS
   ============================================================ */

export const useGetCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => ecomAPI.getCart(),
    retry: false,
    enabled: isAuthenticated(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (AddToCartRequestDTO) => ecomAPI.addToCart(AddToCartRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }) => ecomAPI.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => ecomAPI.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ecomAPI.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/* ============================================================
                     WISHLIST HOOKS
   ============================================================ */

export const useGetWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => ecomAPI.getWishlist(),
    retry: false,
    enabled: isAuthenticated(),
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (AddToWishlistRequestDTO) => ecomAPI.addToWishlist(AddToWishlistRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => ecomAPI.removeFromWishlist(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/* ============================================================
                      ORDER HOOKS
   ============================================================ */

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (CheckoutRequestDTO) => ecomAPI.checkout(CheckoutRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetMyOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => ecomAPI.getMyOrders(),
    retry: false,
    enabled: isAuthenticated(),
  });
};
