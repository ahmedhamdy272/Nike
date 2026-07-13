import { create } from "zustand";
import { Product, shoesCatalog } from "../src/constant/products";
export type { Product };

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  memberSince: string;
}

interface StoreState {
  catalog: Product[];
  cart: CartItem[];
  favorites: Product[];
  profile: UserProfile;
  currentUserUid: string | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  clearCart: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  syncUserSession: (uid: string | null, email?: string, username?: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  addCatalogProduct: (product: Product) => void;
  deleteCatalogProduct: (productId: number) => void;
  updateCatalogProduct: (product: Product) => void;
}

// Helper to parse price string to number: "$134.98" -> 134.98
export const parsePrice = (priceStr: string): number => {
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
};

export const useStore = create<StoreState>((set, get) => {
  // Load initial catalog, favorites, and cart from local storage if available
  const initialCatalog = (() => {
    try {
      const saved = localStorage.getItem("nike_catalog");
      const list = saved ? JSON.parse(saved) : shoesCatalog;
      return list.map((prod: Product) => {
        const normalizePath = (p: string) => {
          if (p.startsWith("/") && !p.startsWith(import.meta.env.BASE_URL)) {
            return `${import.meta.env.BASE_URL}${p.substring(1)}`;
          }
          return p;
        };
        return {
          ...prod,
          image: normalizePath(prod.image),
          images: prod.images ? prod.images.map(normalizePath) : [normalizePath(prod.image)]
        };
      });
    } catch {
      return shoesCatalog;
    }
  })();

  const initialFavorites = (() => {
    try {
      const saved = localStorage.getItem("nike_favorites_guest");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const initialCart = (() => {
    try {
      const saved = localStorage.getItem("nike_cart_guest");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const initialProfile = (() => {
    try {
      const saved = localStorage.getItem("nike_profile_guest");
      return saved
        ? JSON.parse(saved)
        : {
            username: "",
            email: "",
            fullName: "",
            phone: "",
            address: "",
            memberSince: new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
          };
    } catch {
      return {
        username: "",
        email: "",
        fullName: "",
        phone: "",
        address: "",
        memberSince: "June 2026",
      };
    }
  })();

  return {
    catalog: initialCatalog,
    cart: initialCart,
    favorites: initialFavorites,
    profile: initialProfile,
    currentUserUid: null,
    quickViewProduct: null,
    setQuickViewProduct: (product) => set({ quickViewProduct: product }),

    addCatalogProduct: (product) => {
      set((state) => {
        const newCatalog = [...state.catalog, product];
        localStorage.setItem("nike_catalog", JSON.stringify(newCatalog));
        return { catalog: newCatalog };
      });
    },

    deleteCatalogProduct: (productId) => {
      set((state) => {
        const newCatalog = state.catalog.filter((item) => item.id !== productId);
        localStorage.setItem("nike_catalog", JSON.stringify(newCatalog));
        return { catalog: newCatalog };
      });
    },

    updateCatalogProduct: (product) => {
      set((state) => {
        const newCatalog = state.catalog.map((item) => item.id === product.id ? product : item);
        localStorage.setItem("nike_catalog", JSON.stringify(newCatalog));
        return { catalog: newCatalog };
      });
    },

    addToCart: (product) => {
      set((state) => {
        const existingIndex = state.cart.findIndex((item) => item.id === product.id);
        let newCart;
        if (existingIndex > -1) {
          newCart = state.cart.map((item, index) =>
            index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newCart = [...state.cart, { ...product, quantity: 1 }];
        }
        const keySuffix = state.currentUserUid ? `_${state.currentUserUid}` : "_guest";
        localStorage.setItem(`nike_cart${keySuffix}`, JSON.stringify(newCart));
        return { cart: newCart };
      });
    },

    removeFromCart: (productId) => {
      set((state) => {
        const newCart = state.cart.filter((item) => item.id !== productId);
        const keySuffix = state.currentUserUid ? `_${state.currentUserUid}` : "_guest";
        localStorage.setItem(`nike_cart${keySuffix}`, JSON.stringify(newCart));
        return { cart: newCart };
      });
    },

    updateQuantity: (productId, quantity) => {
      set((state) => {
        let newCart;
        if (quantity < 1) {
          newCart = state.cart.filter((item) => item.id !== productId);
        } else {
          newCart = state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );
        }
        const keySuffix = state.currentUserUid ? `_${state.currentUserUid}` : "_guest";
        localStorage.setItem(`nike_cart${keySuffix}`, JSON.stringify(newCart));
        return { cart: newCart };
      });
    },

    toggleFavorite: (product) => {
      set((state) => {
        const exists = state.favorites.some((item) => item.id === product.id);
        let newFavorites;
        if (exists) {
          newFavorites = state.favorites.filter((item) => item.id !== product.id);
        } else {
          newFavorites = [...state.favorites, product];
        }
        const keySuffix = state.currentUserUid ? `_${state.currentUserUid}` : "_guest";
        localStorage.setItem(`nike_favorites${keySuffix}`, JSON.stringify(newFavorites));
        return { favorites: newFavorites };
      });
    },

    isFavorite: (productId) => {
      return get().favorites.some((item) => item.id === productId);
    },

    clearCart: () => {
      set((state) => {
        const keySuffix = state.currentUserUid ? `_${state.currentUserUid}` : "_guest";
        localStorage.removeItem(`nike_cart${keySuffix}`);
        return { cart: [] };
      });
    },

    updateProfile: (updatedFields) => {
      set((state) => {
        const newProfile = { ...state.profile, ...updatedFields };
        const keySuffix = state.currentUserUid ? `_${state.currentUserUid}` : "_guest";
        localStorage.setItem(`nike_profile${keySuffix}`, JSON.stringify(newProfile));
        return { profile: newProfile };
      });
    },

    syncUserSession: (uid, email, username) => {
      if (!uid) {
        // Logged out
        set({
          currentUserUid: null,
          cart: [],
          favorites: [],
          profile: {
            username: "",
            email: "",
            fullName: "",
            phone: "",
            address: "",
            memberSince: "June 2026",
          },
        });
        return;
      }

      // Logged in
      const cartKey = `nike_cart_${uid}`;
      const favKey = `nike_favorites_${uid}`;
      const profileKey = `nike_profile_${uid}`;

      // Load guest cart & favorites
      const guestCart = (() => {
        try {
          const saved = localStorage.getItem("nike_cart_guest");
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      })();

      const guestFavs = (() => {
        try {
          const saved = localStorage.getItem("nike_favorites_guest");
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      })();

      const savedCart = (() => {
        try {
          const saved = localStorage.getItem(cartKey);
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      })();

      const savedFavs = (() => {
        try {
          const saved = localStorage.getItem(favKey);
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      })();

      // Merge guest cart into user's saved cart
      let mergedCart = [...savedCart];
      if (guestCart.length > 0) {
        guestCart.forEach((guestItem: CartItem) => {
          const existingIndex = mergedCart.findIndex((item) => item.id === guestItem.id);
          if (existingIndex > -1) {
            mergedCart[existingIndex].quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        });
        localStorage.setItem(cartKey, JSON.stringify(mergedCart));
        localStorage.removeItem("nike_cart_guest");
      }

      // Merge guest favorites into user's saved favorites
      let mergedFavs = [...savedFavs];
      if (guestFavs.length > 0) {
        guestFavs.forEach((guestItem: Product) => {
          if (!mergedFavs.some((item) => item.id === guestItem.id)) {
            mergedFavs.push(guestItem);
          }
        });
        localStorage.setItem(favKey, JSON.stringify(mergedFavs));
        localStorage.removeItem("nike_favorites_guest");
      }

      const savedProfile = (() => {
        try {
          const saved = localStorage.getItem(profileKey);
          return saved
            ? JSON.parse(saved)
            : {
                username: username || email?.split("@")[0] || "NikeUser",
                email: email || "",
                fullName: username || email?.split("@")[0] || "Nike User",
                phone: "",
                address: "",
                memberSince: new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                }),
              };
        } catch {
          return {
            username: username || email?.split("@")[0] || "NikeUser",
            email: email || "",
            fullName: username || email?.split("@")[0] || "Nike User",
            phone: "",
            address: "",
            memberSince: "June 2026",
          };
        }
      })();

      if (email && savedProfile.email !== email) {
        savedProfile.email = email;
      }
      if (username && !savedProfile.username) {
        savedProfile.username = username;
      }

      set({
        currentUserUid: uid,
        cart: mergedCart,
        favorites: mergedFavs,
        profile: savedProfile,
      });

      localStorage.setItem(profileKey, JSON.stringify(savedProfile));
    },
  };
});
