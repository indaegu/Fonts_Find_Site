import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from "../Component/Header";
import FontCard from "../Component/FontCardComponent";
import PageNation from "../Component/PageNation";
import IconMenu from "../Component/IconMenu";

function AllPage() {
    const [fonts, setFonts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const fontsPerPage = 6;
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [fontFilter, setFontFilter] = useState('all'); // 'all', 'paid', 'free'

    const filteredFonts = fonts.filter(font => font.fontName.toLowerCase().includes(searchKeyword.toLowerCase()));

    const categoryFilteredFonts = selectedCategory === 'All' ?
        filteredFonts :
        filteredFonts.filter(font => font.category.includes(selectedCategory));

    let displayFonts = categoryFilteredFonts;

    switch(fontFilter) {
        case 'paid':
            displayFonts = displayFonts.filter(font => font.isPaid);
            break;
        case 'free':
            displayFonts = displayFonts.filter(font => !font.isPaid);
            break;
        default:
            break;
    }

    const indexOfLastFont = currentPage * fontsPerPage;
    const indexOfFirstFont = indexOfLastFont - fontsPerPage;
    const fontsToShow = displayFonts.slice(indexOfFirstFont, indexOfLastFont);

    const handleFontFilterChange = (filter) => {
        setFontFilter(filter);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    function deduplicateFonts(fontList) {
        const fontMap = {};

        fontList.forEach(font => {
            if (!fontMap[font.fontName]) {
                fontMap[font.fontName] = font;
            } else {
                fontMap[font.fontName].category += `, ${font.category}`;
            }
        });

        return Object.values(fontMap);
    }

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        setCurrentPage(1);
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
                <IconMenu onCategorySelect={setSelectedCategory} />
                <div className="font-filter">
                    <label>
                        <input type="radio" name="font-filter" value="all" checked={fontFilter === 'all'} onChange={() => handleFontFilterChange('all')} />
                        모두 보기
                    </label>
                    <label>
                        <input type="radio" name="font-filter" value="paid" checked={fontFilter === 'paid'} onChange={() => handleFontFilterChange('paid')} />
                        유료만 보기
                    </label>
                    <label>
                        <input type="radio" name="font-filter" value="free" checked={fontFilter === 'free'} onChange={() => handleFontFilterChange('free')} />
                        무료만 보기
                    </label>
                </div>
                <div className="font-container">
                    {fontsToShow.length > 0 ? (
                        fontsToShow.map(font => (
                            <FontCard
                                key={font.fontName}
                                fontName={font.fontName}
                                fontImage={font.fontImage}
                                fontDownloadLink={font.fontDownloadLink}
                                category={font.category}
                                isPaid={font.isPaid}
                            />
                        ))
                    ) : (
                        <p className="no-results">검색 결과가 없습니다.</p>
                    )}
                </div>
                {fontsToShow.length > 0 && <PageNation totalFonts={displayFonts.length} fontsPerPage={fontsPerPage} paginate={paginate} />}
            </div>
        </div>
    );
}

export default AllPage;
