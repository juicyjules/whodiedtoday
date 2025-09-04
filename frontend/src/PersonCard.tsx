import React from 'react';
import './PersonCard.css';

interface PersonData {
  id: number;
  name: string;
  imageUrl: string | null;
  bio: string | null;
  wikipediaUrl: string;
  createdAt: string;
}

interface PersonCardProps {
  person: PersonData;
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <div className="person-card">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${person.imageUrl || 'https://via.placeholder.com/400x400'})` }}
      >
        <div className="card-image-overlay">
          <h2>{person.name}</h2>
        </div>
      </div>
      <div className="card-content">
        <p>{person.bio || 'No biography available.'}</p>
        <a href={person.wikipediaUrl} target="_blank" rel="noopener noreferrer">
          Read more on Wikipedia
        </a>
      </div>
    </div>
  );
};

export default PersonCard;
