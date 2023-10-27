// pages/index.tsx

import React, { useEffect, useState } from 'react';
import ProductList, { Product } from './components/ProductList';
import ProductForm from './ProductForm';
import axios from 'axios';
import Link from 'next/link';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {

    const generateToken = async () => {
      try {
        const heardersToken = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };

        const form = new URLSearchParams();
        form.append('grant_type', 'client_credentials');
        form.append('client_id', '34lvfc4hmde994m9i89epokpuo');
        form.append('client_secret', '2f87n97cf1kj7nv87bn1gjfh09jtef4o0hc5r02va4t4cj7lhs6');
        form.append('scope', 'study/read');

        const response = await axios.post('https://sts-study-case.auth.us-east-1.amazoncognito.com/oauth2/token', form, heardersToken)

        return response.data.access_token; // Supondo que a resposta inclua um token
      } catch (error) {
        console.error('Erro ao gerar o token:', error);
        throw error; // Propaga o erro para o próximo nível
      }
    };
    generateToken()
      .then((access_token) => {
        // Use o token na próxima chamada
        axios.get('https://peqm4z0h1a.execute-api.us-east-1.amazonaws.com/prod/study-case/v1', {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        })
          .then((response) => setProducts(response.data))
          .catch((error) => console.error('Erro ao buscar dados:', error));
      })
      .catch((error) => {
        // Trate o erro ao gerar o token, se necessário
      });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://peqm4z0h1a.execute-api.us-east-1.amazonaws.com/prod/study-case/v1/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Atualizar o estado removendo o produto excluído
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        console.log(`Produto com ID ${id} foi excluído.`);
      } else {
        console.error(`Erro ao excluir o produto com ID ${id}.`);
      }
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Product List</h1>
      <Link href="/ProductForm">
      <button type="button" className="btn btn-primary">Cadastrar Produto</button>
      </Link>
      <ProductList products={products} handleDelete={handleDelete} />
    </div>
  );
};


export default Home;
