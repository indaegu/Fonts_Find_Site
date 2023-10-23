// // server.js
// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');
//
// const app = express();
// const PORT = 5001;
// app.use(cors());
//
// // 폰트 정보 읽기 함수
// function getFonts() {
//     const fontDirectory = path.join(__dirname, '..', 'public', 'Fonts2');
//     const categories = fs.readdirSync(fontDirectory);
//
//     let fonts = [];
//     let fontMap = {}; // 폰트 이름을 기반으로 폰트 정보를 관리하는 맵
//
//     categories.forEach(category => {
//         const categoryFolderPath = path.join(fontDirectory, category);
//         const fontFolders = fs.readdirSync(categoryFolderPath);
//
//         fontFolders.forEach(folder => {
//             const fontFolderPath = path.join(categoryFolderPath, folder);
//             const fontFiles = fs.readdirSync(fontFolderPath);
//
//             const fontImage = fontFiles.find(file => file.endsWith('.png') || file.endsWith('.PNG'));
//             const fontDownload = fontFiles.find(file => file.endsWith('.zip') || file.endsWith('.ttf') || file.endsWith('.otf'));
//
//             if (!fontMap[folder]) {
//                 // 폰트가 fontMap에 존재하지 않으면 새로운 폰트 정보를 생성합니다.
//                 fontMap[folder] = {
//                     fontName: folder,
//                     fontImage: `/Fonts2/${category}/${folder}/${fontImage}`,
//                     fontDownloadLink: `/Fonts2/${category}/${folder}/${fontDownload}`,
//                     category: [category] // 카테고리를 배열로 관리합니다.
//                 };
//             } else {
//                 // 폰트가 이미 fontMap에 존재하면, 카테고리 정보만 업데이트합니다.
//                 fontMap[folder].category.push(category);
//             }
//         });
//     });
//
//     for (let key in fontMap) {
//         fonts.push(fontMap[key]);
//     }
//
//     // 카테고리 배열을 문자열로 변환합니다.
//     fonts.forEach(font => {
//         font.category = font.category.join(', ');
//     });
//
//     return fonts;
// }
//
//
// // API 엔드포인트 생성
// app.get('/api/fonts', (req, res) => {
//     const fonts = getFonts();
//     res.json(fonts);
// });
//
// app.listen(PORT, () => {
//     console.log(`Server started on http://localhost:${PORT}`);
// });
