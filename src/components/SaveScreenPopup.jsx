import React, { useState } from 'react';

function SaveScreenPopup({ onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Get the relative path (pathname + search)
  const currentPath = window.location.pathname + window.location.search;

  // Handle Save button click
  const handleSave = () => {
    if (title && name) {
      // Check if the screen name already exists in saved screens
      const savedScreens = JSON.parse(localStorage.getItem('savedScreens')) || [];
      const isDuplicate = savedScreens.some(screen => screen.name === name);

      if (isDuplicate) {
        setError('A screen with this name already exists.');
        return;
      }

      // Create the object to save
      const newScreen = {
        title,
        name,
        link: currentPath, // Store only the relative path
      };

      // Save to local storage
      savedScreens.push(newScreen);
      localStorage.setItem('savedScreens', JSON.stringify(savedScreens));
      console.log(savedScreens);

      // Clear the inputs
      setTitle('');
      setName('');

      // Call the onSave callback and close the popup
      onSave(newScreen);
    } else {
      setError('Please fill in both title and name');
    }
  };

  // Handle Cancel button click
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="popup-container fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="popup bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Save Screen</h2>

        {/* Title input */}
        <div className="mb-4">
          <label htmlFor="screen-title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="screen-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter screen title"
          />
        </div>

        {/* Name input */}
        <div className="mb-4">
          <label htmlFor="screen-name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="screen-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter screen name"
          />
        </div>

        {/* Error message */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveScreenPopup;
