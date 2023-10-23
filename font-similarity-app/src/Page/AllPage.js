import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from "../Component/Header";
import FontCard from "../Component/FontCardComponent";
import PageNation from "../Component/PageNation";
import IconMenu from "../Component/IconMenu"; // IconMenu 컴포넌트를 추가로 임포트

function AllPage() {
    const [fonts, setFonts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const fontsPerPage = 6;
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState('All'); // 추가: 선택된 카테고리 상태 저장
    const filteredFonts = fonts.filter(font => font.fontName.toLowerCase().includes(searchKeyword.toLowerCase()));
    const indexOfLastFont = currentPage * fontsPerPage;
    const indexOfFirstFont = indexOfLastFont - fontsPerPage;

    const categoryFilteredFonts = selectedCategory === 'All' ?
        filteredFonts :
        filteredFonts.filter(font => font.category.includes(selectedCategory));

    const currentFonts = categoryFilteredFonts.slice(indexOfFirstFont, indexOfLastFont);  // 수정된 부분
    // 카테고리를 기반으로 폰트 필터링

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    function deduplicateFonts(fontList) {
        const fontMap = {};

        fontList.forEach(font => {
            if (!fontMap[font.fontName]) {
                fontMap[font.fontName] = font;
            } else {
                // 이미 해당 폰트가 fontMap에 있으면 카테고리를 병합합니다.
                fontMap[font.fontName].category += `, ${font.category}`;
            }
        });

        return Object.values(fontMap);
    }

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        setCurrentPage(1);  // 검색을 실행할 때마다 첫 페이지로 돌아갑니다.

    };
    useEffect(() => {
        fetch('http://localhost:3000/api/fonts')
            .then(res => res.json())
            .then(data => {
                const uniqueFonts = deduplicateFonts(data);
                setFonts(uniqueFonts);
            })
            .catch(err => console.error('Error fetching fonts:', err));
    }, []);

    return (
        <div className="main-container">
            <Header onSearch={handleSearch} />
            <div className="AllPage">
                {/* IconMenu 컴포넌트를 추가하고, 카테고리가 선택되었을 때 처리할 로직을 전달 */}
                <IconMenu onCategorySelect={setSelectedCategory} />
                <div className="font-container">
                    {currentFonts.length > 0 ? (
                        currentFonts.map(font => (
                            <FontCard
                                key={font.fontName}
                                fontName={font.fontName}
                                fontImage={font.fontImage}
                                fontDownloadLink={font.fontDownloadLink}
                                category={font.category}
                            />
                        ))
                    ) : (
                        <p className="no-results">검색 결과가 없습니다.</p>
                    )}
                </div>
                {currentFonts.length > 0 && <PageNation totalFonts={categoryFilteredFonts.length} fontsPerPage={fontsPerPage} paginate={paginate} />}
            </div>
        </div>
    );
}

export default AllPage;
