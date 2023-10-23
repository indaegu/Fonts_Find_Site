const fs = require('fs');
const path = require('path');

// 시작 디렉터리 지정
const rootDirectoryPath = 'C:\\Code\\mon\\font-similarity-app\\public\\train';

function deletePNGFiles(directoryPath) {
    const directoryName = path.basename(directoryPath);

    // 디렉터리의 파일 및 하위 디렉터리 목록을 읽음
    fs.readdir(directoryPath, (err, items) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        items.forEach(item => {
            const itemPath = path.join(directoryPath, item);
            fs.stat(itemPath, (err, stats) => {
                if (err) {
                    console.error('Error reading file/directory stats:', err);
                    return;
                }

                // 디렉터리인 경우 재귀적으로 탐색
                if (stats.isDirectory()) {
                    deletePNGFiles(itemPath);
                } else if (stats.isFile() && /\.(png|PNG)$/.test(itemPath)) {
                    const fileNameWithoutExtension = path.basename(item, path.extname(item));
                    // 파일의 이름이 폴더의 이름과 일치하지 않거나, 숫자로만 이루어져 있으면 삭제
                    if (fileNameWithoutExtension !== directoryName || /^\d+$/.test(fileNameWithoutExtension)) {
                        fs.unlink(itemPath, err => {
                            if (err) {
                                console.error('Error deleting file:', err);
                            } else {
                                console.log(`Deleted: ${itemPath}`);
                            }
                        });
                    }
                }
            });
        });
    });
}

// 함수 실행
deletePNGFiles(rootDirectoryPath);
