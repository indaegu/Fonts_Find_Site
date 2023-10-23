import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictPage from "./Page/PredictPage";
import AllPage from "./Page/AllPage";
import RecommendPage from "./Page/RecommendPage";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/PredictPage" element={<PredictPage />} />
                    <Route path="/" element={<AllPage />} />
                    <Route path="/RecommendPage" element={<RecommendPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
