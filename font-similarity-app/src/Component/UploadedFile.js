import React from 'react';

function UploadedFile({ fileName, file }) {
    return (
        <div className="uploaded-file">
            <h3>Uploaded Image: {fileName}</h3>
            <img src={URL.createObjectURL(file)} alt="Uploaded" />
        </div>
    );
}

export default UploadedFile;
