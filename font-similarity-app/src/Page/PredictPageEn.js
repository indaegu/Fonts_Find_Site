import React, {useState} from 'react';
import '../App.css';
import DragDropArea from '../Component/DragDropArea';
import UploadedFile from '../Component/UploadedFile';
import FontItem from '../Component/FontItem';
import Header from "../Component/Header";

function PredictPageEn() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fonts, setFonts] = useState([]);
    const [fontMode, setFontMode] = useState(null); // 폰트 모드 상태 추가
    const [selectedFontMode, setSelectedFontMode] = useState(null);



    const handleSubmit = async () => {
        if (!file) {
            alert("사진을 삽입해주세요!");
            return;
        }
        // if (!fontMode) {
        //     alert("폰트 모드를 선택해주세요!"); // 폰트 모드 선택 확인
        //     return;
        // }


        const formData = new FormData();
        formData.append('file', file);
        // formData.append('fontMode', fontMode); // 폰트 모드 데이터 추가

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

    const toggleFontMode = (mode) => {
        if (selectedFontMode === mode) {
            setSelectedFontMode(null); // 같은 버튼을 다시 클릭하면 선택 취소
            setFontMode(null);
        } else {
            setSelectedFontMode(mode);
            setFontMode(mode); // 서버로 보낼 폰트 모드 설정
        }
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
                <h1 className="page-title">영어폰트와 유사한 한글폰트</h1>
                <div className="PredictPage-container">
                    <DragDropArea
                        fileName={fileName}
                        onFileChange={handleFileChange}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    />
                    {/* 폰트 모드 선택 버튼 */}
                    {/*<div className="font-mode-buttons">*/}
                    {/*    <button className={selectedFontMode === 'korean' ? 'selected' : ''} onClick={() => toggleFontMode('korean')}>한글 폰트</button>*/}
                    {/*    <button className={selectedFontMode === 'english' ? 'selected' : ''} onClick={() => toggleFontMode('english')}>영어 폰트</button>*/}
                    {/*    <button className={selectedFontMode === 'any' ? 'selected' : ''} onClick={() => toggleFontMode('any')}>상관없음</button>*/}
                    {/*</div>*/}
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

export default PredictPageEn;
