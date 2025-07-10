import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MCPServerMarketplaceDashboard } from './components/MCPServerMarketplaceDashboard';
import { MCPServerDetail } from './components/MCPServerDetail';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MCPServerMarketplaceDashboard />} />
          <Route path="/mcp-server/:id" element={<MCPServerDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;