import React, { useEffect, useState } from "react";
import { fetchLatestProducts } from "../services/productService"; // Adjust the path as needed
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchLatestProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-extrabold text-white text-center mb-8">
        Latest Products
      </h2>
      {products.length > 0 ? (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product._id} className="p-4">
              <div className="border border-gray-200 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105">
                <img
                  src={`http://localhost:5000/${product.pictures[0]}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {product.description.substring(0, 50)}...
                  </p>
                  <p className="font-bold text-indigo-600 text-lg mt-3">
                    ${product.price}
                  </p>
                </div>
              <div className="add-to-cart">
                <button
                  className="w-full py-3 text-lg font-semibold text-white bg-blue-500  rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                >
                  Add to Cart
                </button>
              </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-white font-medium">
          No products available
        </p>
      )}
    </div>
  );
};

export default ProductCarousel;

