import React, { useEffect, useState } from "react";
import { fetchLatestProducts } from "../services/productService"; // Adjust the path as needed
import "slick-carousel/slick/slick.css"; // Install react-slick
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
        <div className="max-w-screen-lg mx-auto mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Products</h2>
            {products.length > 0 ? (
                <Slider {...settings}>
                    {products.map((product) => (
                        <div key={product._id} className="p-4">
                            <div className="border rounded-lg shadow-md">
                                <img
                                    src={`http://localhost:5000/${product.pictures[0]}`} // Assuming you're using the first image in the array
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-md mb-2"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {product.description.substring(0, 50)}...
                                    </p>
                                    <p className="font-bold text-indigo-600 mt-2">${product.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
};

export default ProductCarousel;
