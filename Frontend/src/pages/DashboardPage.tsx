import React, { useEffect, useState } from 'react';
import { getUserImages, type ImageMetadata } from '../services/imageService';
import { useAuth } from '../contexts/AuthContext';
import ImageCard from '../components/images/ImageCard';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const Vite_API_URL_FOR_IMAGE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';


  useEffect(() => {
    if (isAuthenticated) {
      const fetchImages = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const userImages = await getUserImages();
          setImages(userImages);
        } catch (err: any) {
          console.error('Failed to fetch images:', err);
          setError(err.errors?.[0]?.msg || err.message || 'Could not load your images.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchImages();
    } else {
      setIsLoading(false);
      setError("User not authenticated. Cannot load images.");
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <p>Loading your images...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Your Image Dashboard</h2>
      {images.length === 0 ? (
        <p>
          You haven't uploaded any images yet.
          <Link to="/upload" style={{ marginLeft: '10px' }}>Upload your first image!</Link>
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {images.map((imageMeta) => (
            <ImageCard
              key={imageMeta._id}
              imageMetadata={imageMeta}
              apiBaseUrl={Vite_API_URL_FOR_IMAGE}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;