import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadImage, type ImageUploadResponse } from '../../services/imageService';

const ImageUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMessage(null);
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please select a JPEG, PNG, GIF, or WEBP image.');
        setSelectedFile(null);
        setPreview(null);
        return;
      }
      const maxSize = 20 * 1024 * 1024; // 20MB verification before upload, the same as backend
      if (file.size > maxSize) {
        setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      setSelectedFile(file);
      //preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file to upload.');
      return;
    }
    if (!token) {
        setError('You must be logged in to upload images.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('imageFile', selectedFile); 

    try {
      const response: ImageUploadResponse = await uploadImage(formData);
      setSuccessMessage(response.message || 'Image uploaded successfully!');
      setSelectedFile(null); 
      setPreview(null);
      console.log('Upload successful:', response);

    } catch (err: any) {
      console.error('Image upload failed:', err);
      if (err.errors && Array.isArray(err.errors) && err.errors[0]?.msg) {
        setError(err.errors[0].msg);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during image upload.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Upload Your Image</h3>
      {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green', border: '1px solid green', padding: '10px' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="imageFile" style={{ display: 'block', marginBottom: '5px' }}>
            Choose Image:
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile" 
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {preview && (
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <h4>Preview:</h4>
            <img src={preview} alt="Image preview" style={{ maxWidth: '100%', maxHeight: '300px', border: '1px solid #ddd' }} />
          </div>
        )}

        <button type="submit" disabled={isLoading || !selectedFile} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {isLoading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
};

export default ImageUploadForm;