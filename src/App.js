import React from 'react';
import './App.less';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/home';

/**
 * @module function with queryClient to render Home  */

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient} contextSharing>
      <div className="App">
        <Home />
      </div>
    </QueryClientProvider>
  );
}

export default App;
