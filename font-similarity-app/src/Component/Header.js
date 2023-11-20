import { NavLink } from 'react-router-dom';
import React from 'react';

function Header() {
    return (
        <header className="header">
            <div className="top-section">
                <div className="logo">
                    <a href="/"><img src="/logo1.png" alt="Logo" /></a>
                </div>

                <nav className="categories">
                    <div className="category-item">
                        <NavLink to="/" activeClassName="active">모든폰트</NavLink> <br />
                    </div>
                    <div className="category-item">
                        <NavLink to="/RecommendPage" activeClassName="active">폰트추천</NavLink> <br />
                    </div>
                    <div className="category-item">
                        <NavLink to="/PredictPage" activeClassName="active">한글폰트찾기</NavLink> <br />
                    </div>
                    <div className="category-item">
                        <NavLink to="/PredictPageEn" activeClassName="active">영어를한글로</NavLink> <br />
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header;
