import React from "react";
import ProductCarousel from "./ProductCarousel";
import Header from "./Header";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{
        backgroundImage:
          "url('https://thumbs.dreamstime.com/b/black-friday-scene-crowded-malls-long-queues-online-shopping-deals-wooden-background-black-friday-scene-crowded-318363939.jpg')",
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center py-12 px-6 bg-black bg-opacity-50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md mb-8">
          Welcome to Our Store!
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
          Discover a wide variety of products tailored to your needs and enjoy exclusive deals every day!
        </p>
        <ProductCarousel />
      </main>
    </div>
  );
};

export default Home;

