// components/ProductList.tsx

import React from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Props {
  products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => {
  return (
    <div className="row">
      {products.map((product) => (
        <div key={product.id} className="col-md-4 mb-4">
          <div className="card h-100" >
            <div className="d-flex justify-content-center align-items-center h-50"  >
              <img src={product.image} className="card-img-top img-fluid" style={{ maxWidth: '300px' }} alt={product.name} />
            </div>
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">Price: ${product.price}</p>
              <p className="card-text">{product.description}</p>
              <a href="#" className="btn btn-primary">Edit</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
