import React from 'react';
import '../App.css';

function FontItem({ font }) {
    return (
        <div className="font-item">
            <strong>{font.fontName}</strong>
            <span>유사도 : {font.similarity}</span>
            <img src={font.fontImage} alt={font.fontName} />
            <a href={font.fontDownloadLink} download>Download {font.fontName}</a>
        </div>
    );
}


export default FontItem;
