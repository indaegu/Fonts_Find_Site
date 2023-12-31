import React from 'react';
import '../App.css';
import Header from "../Component/Header";
import Chatbot from '../Component/ChatBot';

function RecommendPage() {
    return (
        <div className="main-container">
            <Header/>
            <div className="PredictPage">
                <h1 className="page-title">폰트 추천 도우미에게 질문하기</h1>
                <Chatbot/>
            </div>
        </div>
    );
}

export default RecommendPage;
