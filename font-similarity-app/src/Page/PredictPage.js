import React, {useState} from 'react';
import '../App.css';
import DragDropArea from '../Component/DragDropArea';
import UploadedFile from '../Component/UploadedFile';
import FontItem from '../Component/FontItem';
import Header from "../Component/Header";

function PredictPage() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fonts, setFonts] = useState([]);

    const handleSubmit = async () => {
        if (!file) {
            alert("사진을 삽입해주세요!");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data && data.fonts) {
                if (data.paidFontDetected) {
                    const userResponse = window.confirm("유료 폰트로 판단됩니다! 가장 유사한 무료 폰트를 제시해드릴까요?");
                    if (userResponse) {
                        const freeFonts = data.fonts.filter(font => !font.isPaid);
                        if (freeFonts.length > 0) {
                            setFonts(freeFonts);
                        } else {
                            const paidResponse = window.confirm("죄송합니다. 현재 유사한 무료 폰트를 찾을 수 없습니다. 유사한 유료 폰트라도 제공해드릴까요?");
                            if (paidResponse) {
                                setFonts(data.fonts);
                            }
                        }
                    } else {
                        setFonts(data.fonts);
                    }
                } else {
                    setFonts(data.fonts);
                }
            } else {
                console.error("Unexpected server response:", data);
            }
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    };


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        e.target.value = null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.items) {
            if (e.dataTransfer.items[0].kind === 'file') {
                const droppedFile = e.dataTransfer.items[0].getAsFile();
                setFile(droppedFile);
                setFileName(droppedFile.name);
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="main-container">
            <Header/>
            <div className="PredictPage">
                <h1 className="page-title">폰트찾기</h1>
                <div className="PredictPage-container">
                    <DragDropArea
                        fileName={fileName}
                        onFileChange={handleFileChange}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    />
                    <button className="PredictPage-button" onClick={handleSubmit}>Upload and Predict</button>
                    {fileName && <UploadedFile fileName={fileName} file={file}/>}

                    {/* Font items container */}
                    <div className="font-items-container">
                        {fonts.map((font, idx) => (
                            <FontItem key={idx} font={font} isPaid={font.isPaid}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PredictPage;
