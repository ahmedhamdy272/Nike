import { useState } from "react";
import { useStore, Product } from "./useStore";
import { useAddToCartAnimation } from "./useAddToCartAnimation";
import { useToast } from "../Components/Toast";

export const useProductActions = () => {
  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const isFavorite = useStore((state) => state.isFavorite);
  const { addToast } = useToast();

  const { isAnimating, triggerAnimation, handleAnimationComplete } = useAddToCartAnimation();
  const [animatingImage, setAnimatingImage] = useState<string | undefined>(undefined);

  const handleAddToCart = (shoe: Product) => {
    addToCart(shoe);
    setAnimatingImage(shoe.image);
    triggerAnimation();
    addToast(`Added ${shoe.title} to Cart! 👟`, "success");
  };

  const handleHeartClick = (shoe: Product) => {
    toggleFavorite(shoe);
    const fav = isFavorite(shoe.id);
    if (fav) {
      addToast(`Added ${shoe.title} to Favorites! ❤️`, "success");
    } else {
      addToast(`Removed ${shoe.title} from Favorites.`, "info");
    }
  };

  return {
    handleAddToCart,
    handleHeartClick,
    isAnimating,
    animatingImage,
    handleAnimationComplete,
    isFavorite,
  };
};
