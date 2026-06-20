// src/components/Player/Player.jsx
import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';

const Player = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get movie ID from URL

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjU0MDNiNDQzNmZmZWEyYWY5NDczNWQxNmU5NzU0MiIsIm5iZiI6MTc4MDcyOTUzMi43Miwic3ViIjoiNmEyM2M2YmM5NWRmYTVkNjFjYWI1YTVjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.yobBFlk11VjpltbzdWq_BCmnsbmenp8hPrQqCwvgaHE'
    }
  };

  useEffect(() => {
    if (!id) {
      setError('No movie ID provided');
      setLoading(false);
      return;
    }

    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch movie details
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          options
        );
        
        if (!movieResponse.ok) {
          throw new Error('Failed to fetch movie details');
        }
        
        const movieData = await movieResponse.json();
        setMovieDetails(movieData);

        // Fetch movie videos/trailers
        const videoResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
          options
        );
        
        if (!videoResponse.ok) {
          throw new Error('Failed to fetch video data');
        }
        
        const videoData = await videoResponse.json();
        
        // Find trailer (prefer official trailer)
        const trailer = videoData.results?.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        ) || videoData.results?.find(
          video => video.site === 'YouTube'
        );
        
        if (trailer) {
          setApiData({
            name: trailer.name || 'Trailer',
            key: trailer.key,
            published_at: trailer.published_at || new Date().toISOString(),
            type: trailer.type || 'Trailer'
          });
        } else {
          setError('No trailer available for this movie');
        }
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(err.message || 'Failed to load movie data');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  // Handle loading state
  if (loading) {
    return (
      <div className="player loading">
        <div className="loading-spinner"></div>
        <p>Loading trailer...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="player error">
        <img
          src={back_arrow_icon}
          alt="Back"
          className="back-btn"
          onClick={() => navigate(-1)}
        />
        <div className="error-container">
          <span className="error-icon">🎬</span>
          <h2>Trailer Not Available</h2>
          <p>{error}</p>
          <button className="back-home-btn" onClick={() => navigate('/')}>
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Check if we have a valid video key
  if (!apiData.key) {
    return (
      <div className="player error">
        <img
          src={back_arrow_icon}
          alt="Back"
          className="back-btn"
          onClick={() => navigate(-1)}
        />
        <div className="error-container">
          <span className="error-icon">🎬</span>
          <h2>Trailer Not Found</h2>
          <p>No trailer available for this movie.</p>
          <button className="back-home-btn" onClick={() => navigate('/')}>
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='player'>
      <img
        src={back_arrow_icon}
        alt="Back"
        className="back-btn"
        onClick={() => navigate(-1)}
      />

      <div className="video-container">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${apiData.key}?autoplay=1&rel=0&modestbranding=1`}
          title={`${movieDetails?.title || 'Movie'} Trailer`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="player_info">
        <div className="movie-title">
          <h2>{movieDetails?.title || 'Movie'}</h2>
          {movieDetails?.release_date && (
            <span className="release-year">
              ({movieDetails.release_date.split('-')[0]})
            </span>
          )}
        </div>
        <div className="video-details">
          <p className="video-name">📹 {apiData.name}</p>
          <p className="video-type">🎯 {apiData.type}</p>
          <p className="video-date">
            📅 {apiData.published_at ? new Date(apiData.published_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Player;