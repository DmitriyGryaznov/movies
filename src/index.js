import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Alert } from 'antd';
import { Online, Offline } from 'react-detect-offline';

import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Online>
      <App className="app" />
    </Online>
    <Offline>
      <div className="offline">
        <Alert type="error" message={'У Вас нет Интернета. You are offline:('} />
      </div>
    </Offline>
  </>
);