import React, { useState } from 'react';

const PageNation = ({ totalFonts, fontsPerPage, paginate }) => {
    const [startPage, setStartPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1); // 추가: 현재 페이지 상태
    const totalPages = Math.ceil(totalFonts / fontsPerPage);
    const visiblePages = 5;

    const endPage = Math.min(startPage + visiblePages - 1, totalPages);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

    const handlePrevious = () => {
        if (startPage > 1) {
            setStartPage(prevStart => prevStart - 1);
            paginate(startPage - 1);
        }
    };

    const handleNext = () => {
        if (endPage < totalPages) {
            setStartPage(prevStart => prevStart + 1);
            const nextPage = currentPage + 1; // 추가: 다음 페이지 번호 계산
            paginate(nextPage);
            setCurrentPage(nextPage); // 추가: 현재 페이지 상태 업데이트
        }
    };
    const handlePaginate = (number) => {
        paginate(number);
        setCurrentPage(number); // 추가: 현재 페이지 업데이트
    };

    return (
        <nav className="pagination-nav">
            <ul className="pagination">
                <li className="page-item">
                    <a onClick={handlePrevious} className="page-link">
                        &lt;
                    </a>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}> {/* 수정: 현재 페이지에 'active' 클래스 추가 */}
                        <a onClick={() => handlePaginate(number)} className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
                <li className="page-item">
                    <a onClick={handleNext} className="page-link">
                        &gt;
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default PageNation;
