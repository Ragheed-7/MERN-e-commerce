import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/product';

export const fetchProducts = async (queryParams = '') => {
    const response = await axios.get(`${BASE_URL}?${queryParams}`);
    return response.data;
};

export const fetchProductById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const createProduct = async (productData, pictures) => {
    const formData = new FormData();
    for (const key in productData) {
        formData.append(key, productData[key]);
    }
    pictures.forEach((file) => formData.append('pictures', file));
    const response = await axios.post(`${BASE_URL}/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await axios.put(`${BASE_URL}/update/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`);
    return response.data;
};

export const fetchLatestProducts = async () => {
    const response = await axios.get(`${BASE_URL}/display/latest`);
    return response.data.products;
  };