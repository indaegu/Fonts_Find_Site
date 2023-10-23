import React, { useState } from 'react';

function IconMenu({onCategorySelect} ) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const icons = [
        { name: "sns(개인, 카톡)", image: "sns.png" },
        { name: "공문서(논문,계약서)", image: "doc.png" },
        { name: "발표(ppt)", image: "ppt.png" },
        { name: "블로그, 커뮤니티", image: "blog.png" },
        { name: "코딩", image: "coding.png" },
        { name: "편지(서체)", image: "letter.png" },
        { name: "홍보(간판, 현수막)", image: "pr.png" },
    ];


    const handleIconClick = (category) => {
        setSelectedCategory(category); // 선택된 카테고리 상태 업데이트
        onCategorySelect(category);  // 아이콘이 클릭되었을 때, AllPage로 카테고리를 전달
    }

    return (
        <div className="icon-menu-container">
            <div className="icon-menu">
                {icons.map(icon => (
                    <div className="icon" onClick={() => handleIconClick(icon.name)}>
                        <img src={icon.image} alt={icon.name} />
                        <span className="tooltip">{icon.name}</span>
                    </div>
                ))}
                {/* "X" 아이콘 이미지로 변경 */}
                {selectedCategory && selectedCategory !== 'All' && (
                    <div className="icon close-icon" onClick={() => handleIconClick('All')}>
                        <img src="close.png" alt="닫기" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default IconMenu;

