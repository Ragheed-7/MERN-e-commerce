import React from 'react';
import Header from './components/Header';
import ProductCarousel from './components/ProductCarousel';

const App = () => {

  return (
   <>
   <Header/>
   <h1 className="text-center text-3xl font-bold mt-4">Welcome to Our Store</h1>
      <ProductCarousel />
   </>
  );
};

export default App;
