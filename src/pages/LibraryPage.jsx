import { useState } from 'react';
import Tab1Component from './UserSongs'; 
import Tab2Component from './playlist/UserPlaylists'; 

const LibraryPage = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState(1);

  // Function to handle tab click
  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className='my-20 p-4'>
      <div role="tablist" className="tabs tabs-boxed mb-8">
        <a
          role="tab"
          className={`tab ${activeTab === 1 ? 'tab-active' : ''}`}
          onClick={() => handleTabClick(1)}
        >
            Your Songs
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === 2 ? 'tab-active' : ''}`}
          onClick={() => handleTabClick(2)}
        >
            Your Playlists
        </a>
      </div>

      {/* Render the appropriate component based on the active tab */}
      {activeTab === 1 && <Tab1Component />}
      {activeTab === 2 && <Tab2Component />}
    </div>
  );
};

export default LibraryPage;