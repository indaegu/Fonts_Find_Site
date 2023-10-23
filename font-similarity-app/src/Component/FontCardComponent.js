import React from 'react';
import '../FontCard.css';

function FontCard({ fontName, fontImage, fontDownloadLink, category }) {
    return (
        <div className="font-card">
            <h3>{fontName}</h3>
            <p>카테고리: {category}</p>
            <img src={fontImage} alt={fontName} className="font-image" />
            <a href={fontDownloadLink} download className="download-link">Download</a>
        </div>
    );
}

export default FontCard;
