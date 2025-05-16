import React, { useState, useEffect } from 'react';
import { type ImageMetadata } from '../../services/imageService';
import { useAuth } from '../../contexts/AuthContext';

interface ImageCardProps {
  imageMetadata: ImageMetadata;
  apiBaseUrl: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageMetadata, apiBaseUrl }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchImage = async () => {
      if (!imageMetadata._id || !token) {
        setError("Missing image ID or authentication token.");
        setIsLoading(false);
        setImageUrl(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setImageUrl(null);

      try {
        const urlToFetch = `${apiBaseUrl}/images/${imageMetadata._id}`;
        console.log("ImageCard: Fetching image from URL:", urlToFetch); // DEBUG LOG

        const response = await fetch(urlToFetch, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("ImageCard: Response status:", response.status); // DEBUG LOG

        if (!response.ok) {
          let errorMsg = `Failed to load image: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            console.log("ImageCard: Error data from backend:", errorData); // DEBUG LOG
            if (errorData.errors && errorData.errors[0]?.msg) {
              errorMsg = errorData.errors[0].msg;
            } else if (errorData.error?.message) {
              errorMsg = errorData.error.message;
            }
          } catch (e) { 
            console.log("ImageCard: Could not parse error response as JSON.", e); // DEBUG LOG
          }
          throw new Error(errorMsg);
        }

        const blob = await response.blob();
        console.log("ImageCard: Blob received, size:", blob.size, "type:", blob.type); // DEBUG LOG

        if (blob.size === 0) {
            throw new Error("Received empty image blob from server.");
        }
        if (!blob.type.startsWith('image/')) {
             throw new Error(`Received non-image blob type: ${blob.type}`);
        }


        const objectUrl = URL.createObjectURL(blob);
        console.log("ImageCard: Object URL created:", objectUrl); // DEBUG LOG
        setImageUrl(objectUrl);

      } catch (err: any) {
        console.error("ImageCard: Error fetching image blob:", err); // DEBUG LOG
        setError(err.message || 'Could not load image.');
        setImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();

    // Cleanup function
    return () => {
      if (imageUrl) {
        console.log("ImageCard: Revoking object URL:", imageUrl); // DEBUG LOG
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageMetadata._id, token, apiBaseUrl]);

  return (
    <div style={cardStyle}>
      <h4>{imageMetadata.originalFileName}</h4>
      {isLoading && <p>Loading image...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {imageUrl && !isLoading && !error && (
        <img src={imageUrl} alt={imageMetadata.originalFileName} style={imageStyle} />
      )}
      {!isLoading && !imageUrl && !error && 
        <div style={{...imageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 
            <p>No preview available</p>
        </div>
      }
    </div>
  );
};

  const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    margin: '10px',
    width: '300px',
    boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '10px',
    backgroundColor: '#f0f0f0',
  };

export default ImageCard;