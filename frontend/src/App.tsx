// App.tsx
import React, { useEffect } from 'react';

import { Route, Routes } from 'react-router-dom';
import Header from './UI/Header/Header';
import Home from './UI/Home/Home';
import './UI/Styles/app.scss';
import { ThemeProvider } from './context/Theme.tsx';
import AccountSettings from './UI/AccountSettings/AccountSettings.tsx';
function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
