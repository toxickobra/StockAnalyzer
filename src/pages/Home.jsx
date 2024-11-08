import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    const savedScreens = JSON.parse(localStorage.getItem('savedScreens')) || [];
    setScreens(savedScreens);
  }, []);

  const handleCreateNewScreen = () => {
    navigate('/new-screen');
  };

  const handleScreenClick = (link) => {
    navigate(link); // Directly navigates within the app for relative paths
  };

  return (
    <div className="h-[100vh] w-full bg-[#ebeff6] p-5 lg:p-20">
      <div className="flex justify-between">
        <p className="font-medium text-2xl">Stock screens</p>
        <button
          className="bg-[#625afc] text-white font-semibold px-5 py-2 rounded-md text-[1rem]"
          onClick={handleCreateNewScreen}
        >
          Create New Screen
        </button>
      </div>
      <div className="bg-white p-5 mt-10 rounded-xl shadow-sm">
        <p className="font-medium text-[1.2rem]">Your Screens</p>
        <p className="text-zinc-600 font-medium">Custom Screens created by you</p>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {screens.length > 0 ? (
            screens.map((screen, index) => (
              <div
                key={index}
                className="savedScreen border-2 rounded-md px-2 py-3 cursor-pointer"
                onClick={() => handleScreenClick(screen.link)}
              >
                <div className="title font-semibold">{screen.title}</div>
                <div className="desc text-zinc-600">{screen.name}</div>
              </div>
            ))
          ) : (
            <p>No screens available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
