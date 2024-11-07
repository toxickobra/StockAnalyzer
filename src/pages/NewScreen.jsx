import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewScreen() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleRunQuery = () => {
    // Navigate to the QueryResult page and pass the query via state
    navigate('/query-result', { state: { query } });
  };

  return (
    <div className="h-[100vh] bg-[#ebeff6] w-[100vw] p-20">
      <div className="bg-white p-5 rounded-xl">
        <p className="text-[1.3rem]">Create a Search Query</p>
        <p className="text-[1.1rem]">Query</p>
        <div className="flex mt-10 justify-between gap-20">
          <textarea
            placeholder="Enter your search query..."
            className="w-full p-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="6"
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update query state
          />
          <div className="border border-gray-300 bg-[#f6fafd] p-6 rounded-md w-[25%]">
            <p>
              Custom query example<br /><br />
              Market capitalization {'>'} 500 AND<br />
              Price to earning {'<'} 15 AND<br />
              Return on capital employed {'>'} 22%<br /><br />
            </p>
            <p className="text-[#625afc1]">Detailed guide on creating screens</p>
          </div>
        </div>
        <button
          className="mt-10 bg-[#625afc] text-white font-semibold px-5 py-2 rounded-md text-[1rem]"
          onClick={handleRunQuery}
        >
          RUN THIS QUERY
        </button>
      </div>
    </div>
  );
}

export default NewScreen;
