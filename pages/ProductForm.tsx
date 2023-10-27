// pages/ProductForm.tsx

import router from 'next/router';
import React, { useState } from 'react';
import AWS from 'aws-sdk';
import axios from 'axios';

const ProductForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateToken()
      .then(async (access_token) => {
        try {
          console.log('outro token' + access_token)
          const response = await fetch('https://peqm4z0h1a.execute-api.us-east-1.amazonaws.com/prod/study-case/v1', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            console.log('Produto cadastrado com sucesso!');
            router.back();
          } else {
            console.error('Erro ao cadastrar produto:', response.statusText);
          }
        } catch (error) {
          console.error('Erro ao cadastrar produto:', error);
        }
      })

  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    AWS.config.update({
      accessKeyId: 'AKIA4K53XUDGYWKTW4GR',
      secretAccessKey: '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',
      region: 'us-east-1'
    });
    const file = e.target.files && e.target.files[0];

    if (file) {
      const s3 = new AWS.S3();

      const params = {
        Bucket: 'study-case-page',
        Key: `${file.name}`, // Escolha um caminho e nome para o arquivo
        Body: file,
        ContentType: file.type
      };

      try {
        const data = await s3.upload(params).promise();
        setFormData(prev => ({ ...prev, image: data.Location }));
        console.log('Imagem enviada com sucesso. URL:', data.Location);
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
      }
    }
  };



  return (
    <div className="container mt-5">
      <h1>Cadastrar Produto</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">URL Image</label>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Escolha uma Imagem</label>
            <input type="file" className="form-control" id="image" name="image" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Create Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
