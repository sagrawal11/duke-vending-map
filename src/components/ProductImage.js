import React, { useState, useEffect } from 'react';
import { getProductImage, getFallbackImage } from '../utils/productImages';
import './ProductImage.css';

const ProductImage = ({ productName, size = 'medium', className = '', showFallback = true }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);
      
      // Get the primary image path
      const primaryImage = getProductImage(productName);
      
      // Try to load the primary image
      const img = new Image();
      img.onload = () => {
        setImageSrc(primaryImage);
        setIsLoading(false);
      };
      img.onerror = () => {
        if (showFallback) {
          // Try fallback image
          const fallbackImage = getFallbackImage(productName);
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            setImageSrc(fallbackImage);
            setIsLoading(false);
          };
          fallbackImg.onerror = () => {
            setHasError(true);
            setIsLoading(false);
          };
          fallbackImg.src = fallbackImage;
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      };
      img.src = primaryImage;
    };

    if (productName) {
      loadImage();
    }
  }, [productName, showFallback]);

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'product-image-small';
      case 'large': return 'product-image-large';
      case 'medium':
      default: return 'product-image-medium';
    }
  };

  if (isLoading) {
    return (
      <div className={`product-image-loading ${getSizeClass()} ${className}`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`product-image-error ${getSizeClass()} ${className}`}>
        <div className="error-icon">📦</div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={productName}
      className={`product-image ${getSizeClass()} ${className}`}
      loading="lazy"
    />
  );
};

export default ProductImage; 