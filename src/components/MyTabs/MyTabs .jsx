import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

import CardList from '../CardList/CardList';
import RatedMovies from '../RatedMovies/RatedMovies';
import './MyTabs.css';
import Service from '../Api';

const { TabPane } = Tabs;

const MyTabs = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [guestSessionId, setGuestSessionId] = useState('');
  const service = new Service();

  useEffect(() => {
    if (guestSessionId.length > 0) {
      localStorage.setItem('sessionId', guestSessionId);
    }
  }, [guestSessionId]);

  useEffect(() => {
    const isSessionId = localStorage.getItem('sessionId');
    if (!isSessionId || isSessionId.length === 0) {
      const getToken = async () => {
        const token = await service.createGuestSession();
        setGuestSessionId(token);
      };

      getToken();
    } else {
      setGuestSessionId(isSessionId);
    }
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'rated' && !guestSessionId) {
      console.error('guest session ID is not set');
    }
  };

  return (
    <div className="tabs-wrapper">
      <Tabs activeKey={activeTab} onChange={handleTabChange} className="tabs--centered" centered>
        <TabPane tab="Search" key="search">
          <CardList />
        </TabPane>
        <TabPane tab="Rated" key="rated">
          {guestSessionId ? (
            <RatedMovies key={activeTab} guestSessionId={guestSessionId} />
          ) : (
            <div>Loading...</div>сщ
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MyTabs;
