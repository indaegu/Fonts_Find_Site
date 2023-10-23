import React, { useState } from 'react';

const Header = ({onSearch}) => {

    const [searchKeyword, setSearchKeyword] = useState("");
    const handleSearch = () => {
        onSearch(searchKeyword);

    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };
    return (
        <header className="header">
            <div className="top-section">
                <div className="logo">
                    <a href="/"><img src="/logo.png" alt="Logo" />
                    </a>
                </div>

                <nav className="categories">
                    <div className="category-item">
                        <a href="/">모든폰트</a> <br />
                    </div>
                    <div className="category-item">
                        <a href="/RecommendPage">추천폰트</a> <br />
                    </div>
                    <div className="category-item">
                        <a href="/PredictPage">폰트찾기</a> <br />
                    </div>
                </nav>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="전체 폰트 검색"
                        className="search-bar"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSearch} className="search-button">
                        <img src="/searchicon.png" alt="검색" className="search-icon" />
                    </button>
                </div>
            </div>

        </header>
    )
}

export default Header;
