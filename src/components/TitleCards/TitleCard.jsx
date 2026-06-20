import React, { useRef, useEffect, useState } from 'react';
import './TitleCards.css';
import cards_data from '../../assets/cards/Cards_data';
import { Link } from 'react-router-dom';

const TitleCards = ({ title = "Popular on Netflix", category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjU0MDNiNDQzNmZmZWEyYWY5NDczNWQxNmU5NzU0MiIsIm5iZiI6MTc4MDcyOTUzMi43Miwic3ViIjoiNmEyM2M2YmM5NWRmYTVkNjFjYWI1YTVjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.yobBFlk11VjpltbzdWq_BCmnsbmenp8hPrQqCwvgaHE'
    }
  };

  const handleWheel = (event) => {
    if (!cardsRef.current) return;
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`,
      options
    )
      .then(res => res.json())
      .then(res => setApiData(res.results))
      .catch(err => console.error(err));

    const slider = cardsRef.current;

    if (!slider) return;

    slider.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      slider.removeEventListener('wheel', handleWheel);
    };
  }, [category]);

  return (
    <div className='title-cards'>
      <h2>{title}</h2>

      <div className="card-list" ref={cardsRef}>
        {apiData.map((card) => (
          
          <Link
            to={`/player/${card.id}`}
            key={card.id}
            className="card-link"
          >

            <div className="card">
              <img
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                alt={card.original_title}
              />
              <p>{card.original_title}</p>
            </div>

          </Link>

        ))}
      </div>
    </div>
  );
};

export default TitleCards;