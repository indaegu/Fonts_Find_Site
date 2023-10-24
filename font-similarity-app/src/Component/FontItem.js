import React from 'react';
import '../App.css';

function FontItem({font, isPaid}) {
    console.log("Font:", font);
    console.log("IsPaid:", isPaid);
    return (
        <div className="font-item">
            <strong>{font.fontName}</strong>
            <span>유사도 : {font.similarity}</span>
            <img src={font.fontImage} alt={font.fontName} />
            <a href={font.fontDownloadLink} download>Download {font.fontName}</a>
            <div className="font-type">
                {isPaid ? "유료" : "무료"}
            </div>
        </div>
    );
}


export default FontItem;
