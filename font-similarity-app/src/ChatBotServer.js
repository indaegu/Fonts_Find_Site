const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const openai = new OpenAI({
    apiKey: process.env.GPTapiKey,
});

let latestUserMessage = "";

app.post('/sendMessage', async function (req, res) {
    latestUserMessage = req.body.userMessage;
    res.status(200).end();
});

app.get('/gptserver', function (req, res) {
    // SSE 설정
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 500,
        stream: true,
        n: 1,
        temperature: 0.9,
        top_p: 0.9,
        messages: [
            { role: 'system', content: '너는 글꼴 추천도우미야. 너는 웹사이트 "홍익정음"의 글꼴 추천 도우미야. 너는 사용자가 문서 작성 상황을 물어보면 어울리는 글꼴을 추천해주는 역할을 할거야. 너는 한국인을 대상으로 하기 때문에 한글로 답변해야해' },
            { role: 'user', content: `너는 글꼴 추천도우미야. 너는 웹사이트 "홍익정음"의 글꼴 추천 도우미야. 너는 사용자가 문서 작성 상황을 물어보면 어울리는 글꼴을 추천해주는 역할을 할거야. 너는 한국인을 대상으로 하기 때문에 한글로 답변해야해` },
            { role: 'assistant', content: '저는 웹사이트 "홍익정음"의 글꼴 추천 도우미입니다. 어떠한 상황에든 사용자가 원하는 글꼴을 답해줄수있습니다.' },
            { role: 'user', content: latestUserMessage },
        ],
    }).then(completion => {
        const stream = completion.response.body;
        stream.on('data', chunk => {
            const chunkStr = chunk.toString();
            // "[DONE]"이나 "data: "로 시작하는 문자열을 필터링
            if (!chunkStr.startsWith("[DONE]") && chunkStr.startsWith("data: ")) {
                res.write(chunkStr + '\n\n');
            }
        });


        stream.on('end', () => {
            res.end();
        });
    }).catch(error => {
        console.error('API 호출 중 오류 발생:', error);
        res.status(500).send('서버 오류');
    });
});

// 폰트 정보 읽기 함수
function getFonts() {
    const fontDirectory = path.join(__dirname, '..', 'public', 'Fonts2');
    const categories = fs.readdirSync(fontDirectory);

    let fonts = [];
    let fontMap = {}; // 폰트 이름을 기반으로 폰트 정보를 관리하는 맵

    categories.forEach(category => {
        const categoryFolderPath = path.join(fontDirectory, category);
        const fontFolders = fs.readdirSync(categoryFolderPath);

        fontFolders.forEach(folder => {
            const fontFolderPath = path.join(categoryFolderPath, folder);
            const fontFiles = fs.readdirSync(fontFolderPath);

            const fontImage = fontFiles.find(file => file.endsWith('.png') || file.endsWith('.PNG'));
            const fontDownload = fontFiles.find(file => file.endsWith('.zip') || file.endsWith('.ttf') || file.endsWith('.otf'));

            if (!fontMap[folder]) {
                // 폰트가 fontMap에 존재하지 않으면 새로운 폰트 정보를 생성합니다.
                fontMap[folder] = {
                    fontName: folder,
                    fontImage: `/Fonts2/${category}/${folder}/${fontImage}`,
                    fontDownloadLink: `/Fonts2/${category}/${folder}/${fontDownload}`,
                    category: [category] // 카테고리를 배열로 관리합니다.
                };
            } else {
                // 폰트가 이미 fontMap에 존재하면, 카테고리 정보만 업데이트합니다.
                fontMap[folder].category.push(category);
            }
        });
    });

    for (let key in fontMap) {
        fonts.push(fontMap[key]);
    }

    // 카테고리 배열을 문자열로 변환합니다.
    fonts.forEach(font => {
        font.category = font.category.join(', ');
    });

    return fonts;
}


// API 엔드포인트 생성
app.get('/api/fonts', (req, res) => {
    const fonts = getFonts();
    res.json(fonts);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("서버가 " + port + "번 포트에서 실행중입니다.");
});

