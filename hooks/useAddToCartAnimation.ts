import { useState } from 'react';

export const useAddToCartAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  return {
    isAnimating,
    triggerAnimation,
    handleAnimationComplete,
  };
}; 