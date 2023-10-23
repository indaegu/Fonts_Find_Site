import React, { useState } from 'react';
import '../App.css';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);



    const handleSend = async () => {
        setIsLoading(true);
        setInputMessage('');
        setMessages([...messages, { type: 'user', text: inputMessage }]);

        await fetch('http://localhost:3000/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userMessage: inputMessage
            })
        });

        const sse = new EventSource('http://localhost:3000/gptserver');

        sse.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.choices[0].delta && data.choices[0].delta.content) {
                    const content = data.choices[0].delta.content;

                    setMessages(prevMessages => {
                        // 이전 메시지의 상태를 기반으로 작업을 수행
                        if (prevMessages.length && prevMessages[prevMessages.length - 1].type === 'bot') {
                            // 마지막 메시지가 bot의 메시지인 경우, 텍스트 내용을 업데이트
                            const newMessages = [...prevMessages];
                            newMessages[newMessages.length - 1].text += content;
                            return newMessages;
                        } else {
                            // 그렇지 않은 경우 새로운 메시지를 추가
                            return [...prevMessages, { type: 'bot', text: content }];
                        }
                    });

                    // finish_reason이 있으면 로딩 상태를 종료
                    if (data.choices[0].finish_reason) {
                        console.log("Finishing loading..."); // 이 로그가 제대로 출력되는지 확인
                        setIsLoading(false);
                    }
                }
            } catch (error) {
                console.error('Invalid JSON received:', event.data);
            }
        };



        sse.onerror = (error) => {
            console.error('SSE failed:', error);
            sse.close();
        };
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chatbot-page">
            <div className="chat-window">
                {messages.map((message, idx) => (
                    <div key={idx} className={`message ${message.type}`}>
                        {message.text}
                    </div>
                ))}
                <div className="input-container">
                    <input value={inputMessage}
                           onChange={e => setInputMessage(e.target.value)}
                           onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
