import React, { useState } from 'react';
import axios from 'axios';

const TodoForm = ({ setItems, fetchData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/items/", {
        name,
        description,
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchData(); // Refresh the item list
      setName('');
      setDescription('');
      setQuantity('');
    } catch (error) {
      console.log('Error creating item', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex mb-6 space-x-4">
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Item Name" 
          required 
          className="w-1/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
        />
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Description" 
          required 
          className="w-1/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
        />
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          placeholder="Quantity" 
          required 
          className="w-1/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-blue-600 transition"
        >
          Add Item
        </button>
      </form>
      
    </div>
  );
};

export default TodoForm;
