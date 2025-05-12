import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const ProductDetails = () => {
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0); // Always scroll to top on mount
    if (!product) {
      // Fetch product details from the JSON database
      fetch(`/static/products.json`)
        .then((response) => response.json())
        .then((data) => {
          const foundProduct = data.products.find((p) => p.id === parseInt(id));
          setProduct(foundProduct);
        })
        .catch((error) => console.error('Error fetching product details:', error));
    }
  }, [product, id]);

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <img src={product.image_url} alt={product.name} />
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Rating:</strong> {product.rating}</p>
      <p><strong>Delivery Cost:</strong> ${product.delivery_cost}</p>
      <p><strong>Payment Mode:</strong> {product.payment_mode}</p>
      <p><strong>MB Score:</strong> {product.mb_score}</p>
      <p><strong>CB Score:</strong> {product.cb_score}</p>
      <p><strong>Description:</strong> {product.description || 'No description available.'}</p>
      <h3>User Comments</h3>
      {product.reviews && product.reviews.length > 0 ? (
        <ul>
          {product.reviews.map((review, index) => (
            <li key={index}>
              <p><strong>User:</strong> {review.user}</p>
              <p><strong>Comment:</strong> {review.comment}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
};

export default ProductDetails;
