import React from 'react';
import { Link } from 'react-router-dom';


const HomePage: React.FC = () => {
  return (
    <div>
      <p>Please register or login to manage your images in <Link to="/dashboard">Dashboard</Link>.</p>
    </div>
  );
};

export default HomePage;