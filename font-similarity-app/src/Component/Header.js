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
                        <a href="/">모든폰트</a> <br />
                    </div>
                    <div className="category-item">
                        <a href="/RecommendPage">폰트추천</a> <br />
                    </div>
                    <div className="category-item">
                        <a href="/PredictPage">폰트찾기</a> <br />
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header;
