import React from 'react';
import { Link } from 'react-router-dom';

import ImageUploadForm from '../components/images/ImageUploadForm';

const UploadPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Upload a New Image</h2>
      <p>Select an image file (JPEG, PNG, GIF, WEBP) to upload and process.</p>
      <ImageUploadForm />
      <div style={{ marginTop: '20px' }}>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default UploadPage;