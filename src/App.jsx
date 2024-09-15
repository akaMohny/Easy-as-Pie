import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const Spinner = ({ show }) => (
  <div
    className={`fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-500
          ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className='animate-spin rounded-full h-12 w-12 border-4 border-l-fuchsia-300 border-r-fuchsia-600'></div>
  </div>
);

const App = () => {
  const [category, setCategory] = useState('pizza');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = ['pizza', 'burger', 'biryani', 'butter-chicken', 'dessert', 'dosa', 'pasta', 'rice'];
  const placeholderImage = 'https://fakeimg.pl/300x300/fafafa/e9e9e9?text=YumYum&font=bebas';

  const fetchImages = useCallback(async (category) => {
    setLoading(true);
    setImages(Array(20).fill(placeholderImage));

    try {
      const batchSize = 5;
      for (let i = 0; i < 20; i += batchSize) {
        const fetchPromises = Array.from({ length: batchSize }, () =>
          fetch(`https://foodish-api.com/api/images/${category}`).then((res) => res.json())
        );
        const results = await Promise.all(fetchPromises);

        setImages((prevImages) => {
          const newImages = [...prevImages];
          results.forEach((result, index) => {
            if (result.image) {
              newImages[i + index] = result.image;
            }
          });
          return newImages;
        });
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(category);
  }, [category, fetchImages]);

  const handleCategoryChange = useCallback(
    (cat) => {
      if (cat !== category) setCategory(cat);
    },
    [category]
  );

  return (
    <div className='p-4'>
      <div className='w-full flex justify-center items-center gap-x-2 overflow-x-auto'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`flex justify-center items-center gap-x-2 px-3 py-2 rounded-xl font-medium transition-all hover:scale-110 hover:px-6 hover:mx-1
              ${category === cat ? 'bg-fuchsia-500 text-white' : 'bg-white text-fuchsia-500'}`}>
            <img className='w-6 h-6' src={`icons/${cat == 'butter-chicken' ? 'chicken' : cat}${category === cat ? '' : '-colored'}.png`} alt='pizza' />
            <span className={`text-lg ${category === cat ? '-rotate-3 font-semibold scale-110' : 'rotate-3 font-medium scale-100'}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className='w-full h-0.5 bg-white/30 rounded-full my-4'></div>

      <div className={`grid grid-cols-2 md:grid-cols-5 gap-2 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {images.map((img, index) => (
          <div key={index} className='rounded-xl overflow-hidden transform transition-all'>
            <img src={img} alt={category} className='w-full h-48 object-cover' loading='lazy' />
          </div>
        ))}
      </div>

      <Spinner show={loading} />
    </div>
  );
};

export default App;
