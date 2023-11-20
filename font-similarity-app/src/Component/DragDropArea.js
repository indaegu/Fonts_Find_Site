import React from 'react';

function DragDropArea({ fileName, onFileChange, onDrop, onDragOver }) {
    return (
        <div className="drag-drop-area" onDrop={onDrop} onDragOver={onDragOver}>
            <h3>{fileName || '이미지 선택'}</h3>
            <p>Drag & Drop 으로 파일선택 혹은 <label htmlFor="fileInput">파일찾기</label></p>
            <input id="fileInput" type="file" onChange={onFileChange} hidden />
        </div>
    );
}

export default DragDropArea;
