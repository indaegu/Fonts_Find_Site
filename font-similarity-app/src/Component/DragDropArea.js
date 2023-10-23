import React from 'react';

function DragDropArea({ fileName, onFileChange, onDrop, onDragOver }) {
    return (
        <div className="drag-drop-area" onDrop={onDrop} onDragOver={onDragOver}>
            <h3>{fileName || 'Choose an image'}</h3>
            <p>Drag & Drop files here or <label htmlFor="fileInput">Browse</label></p>
            <input id="fileInput" type="file" onChange={onFileChange} hidden />
        </div>
    );
}

export default DragDropArea;
