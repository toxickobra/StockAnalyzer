import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleCreateNewScreen = () => {
    navigate('/new-screen');
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-[#ebeff6] p-20">
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
        <div className="mt-5 grid grid-cols-3 gap-4">
          <div className="border-2 rounded-md px-2 py-3">
            <div className="title font-semibold">Title 1</div>
            <div className="desc text-zinc-600">Description 1</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
