import axios from 'axios';
import React, { useState } from 'react';

const Table = ({ items, setItems, isLoading, fetchData }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [updatedDetails, setUpdatedDetails] = useState({
    name: '',
    description: '',
    quantity: '',
  }); // State for updated item details

  if (isLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/items/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchData(); // Refresh the item list
    } catch (error) {
      console.log('Error deleting item', error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setUpdatedDetails({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/items/${selectedItem.id}/`, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchData(); // Refresh the item list after updating
      setIsEditing(false); // Close the edit modal
      setSelectedItem(null); // Reset selected item
    } catch (error) {
      console.log('Error updating item', error);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-gray-50 border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Quantity</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {items.map(item => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
              <td 
                onClick={() => handleEdit(item)} 
                className="py-3 px-6 bg-white text-blue-800 font-semibold cursor-pointer hover:underline"
              >
                {item.name}
              </td>
              <td className="py-3 px-6 bg-gray-50 text-gray-800 italic">{item.description}</td>
              <td className="py-3 px-6 bg-white text-green-600 font-bold">{item.quantity}</td>
              <td className="py-3 px-6 flex space-x-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing Item */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <form onSubmit={handleUpdate}>
              <input 
                type="text" 
                value={updatedDetails.name} 
                onChange={(e) => setUpdatedDetails({ ...updatedDetails, name: e.target.value })} 
                placeholder="Item Name" 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <textarea 
                value={updatedDetails.description} 
                onChange={(e) => setUpdatedDetails({ ...updatedDetails, description: e.target.value })} 
                placeholder="Description" 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <input 
                type="number" 
                value={updatedDetails.quantity} 
                onChange={(e) => setUpdatedDetails({ ...updatedDetails, quantity: e.target.value })} 
                placeholder="Quantity" 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                  Update
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="ml-2 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
