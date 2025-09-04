import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './App.css';
import PersonCard from './PersonCard';


// This interface should match the PersonData interface on the backend
interface PersonData {
  id: number;
  name: string;
  imageUrl: string | null;
  bio: string | null;
  wikipediaUrl: string;
  createdAt: string; // Dates are serialized as strings
}

function App() {
  const [people, setPeople] = useState<PersonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeaths = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/deaths');
        setPeople(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeaths();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Died Today</h1>
        <p>Notable people who recently passed away.</p>
      </header>
      <main>
        {loading && <p className="status-message">Loading...</p>}
        {error && <p className="status-message error">{error}</p>}
        {!loading && !error && people.length === 0 && (
          <div className="status-message">
            <h2>No new deaths reported recently.</h2>
            <p>Check back later for updates.</p>
          </div>
        )}
        {!loading && !error && people.length > 0 && (
          <Swiper
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
          >
            {people.map(person => (
              <SwiperSlide key={person.id}>
                <PersonCard person={person} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </main>
    </div>
  );
}

export default App;
