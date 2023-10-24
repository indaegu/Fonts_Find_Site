import React from 'react';
import '../FontCard.css';

function FontCard({ fontName, fontImage, fontDownloadLink, category, isPaid }) {
    return (
        <div className="font-card">
            <h3>{fontName}</h3>
            <p>카테고리: {category}</p>
            <p>{isPaid ? '유료' : '무료'}</p>
            <img src={fontImage} alt={fontName} className="font-image" />
            {isPaid ? (
                <a href={fontDownloadLink} target="_blank" rel="noopener noreferrer" className="download-link">구매 사이트로 이동</a>
            ) : (
                <a href={fontDownloadLink} download className="download-link">다운로드</a>
            )}
        </div>
    );
}

export default FontCard;
