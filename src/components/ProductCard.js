if (!product || !Array.isArray(product.reviews)) {
    return <div>No product data available</div>; // Added a fallback to handle undefined or non-array product reviews
  }

  const reviewCount = product.reviews.length; // Safely access length