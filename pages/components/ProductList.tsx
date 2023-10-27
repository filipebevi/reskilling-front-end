// components/ProductList.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export  interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Props {
  products: Product[];
  handleDelete: (id: string) => void;
}

const ProductList: React.FC<Props> = ({ products, handleDelete }) => {
  return (
    <div className="row">
      {products?.map((product) => (
        <div key={product.id} className="col-md-4 mb-4">
          <div className="card h-100" >
            <div className="d-flex justify-content-center align-items-center"  >
              <img src={product.image} className="card-img-top img-fluid" style={{ maxWidth: '300px', width: '100%' }} alt={product.name} />
            </div>
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">Price: ${product.price}</p>
              <p className="card-text">{product.description}</p>
              <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
