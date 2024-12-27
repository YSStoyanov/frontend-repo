import React, { useState } from 'react';
import axios from 'axios';

const SignalForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    category: '',
    description: '',
    lat: '',
    lng: '',
    image: null,
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('contact', formData.contact);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('lat', formData.lat);
    data.append('lng', formData.lng);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/signals', data);
      setStatusMessage('Signal submitted successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting signal:', error);
      setStatusMessage('Error submitting signal. Please try again.');
    }
  };

  return (
    <div>
      <h2>Submit a Signal</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="contact">Contact:</label>
          <input type="email" id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="lat">Latitude:</label>
          <input type="number" id="lat" name="lat" value={formData.lat} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="lng">Longitude:</label>
          <input type="number" id="lng" name="lng" value={formData.lng} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" name="image" onChange={handleFileChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default SignalForm;