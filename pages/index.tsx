// pages/index.tsx

import React, { useEffect, useState } from 'react';
import ProductList from './components/ProductList';

const Home: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001') // Substitua com o URL da sua API
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="container mt-5">
      <h1>Product List</h1>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
