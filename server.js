const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const STATIC_FOLDER = 'build';
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    let file = '';
    let mimeType = null;

    if (pathname == '/') {
        file = 'index.html';
        mimeType = 'text/html';
    } else if (pathname.includes('.')) {
        file = path.parse(pathname);

        switch (file.ext) {
            case '.html':
                mimeType = 'text/html';
                break;
            case '.css':
                mimeType = 'text/css';
                break;
            case '.js':
                mimeType = 'text/javascript';
                break;
            case '.jpg':
                mimeType = 'image/jpg';
                break;
            case '.png':
                mimeType = 'image/png';
                break;
            case '.json':
                mimeType = 'application/json';
                break;
            default:
                break;
        }
    }

    if (file && mimeType) {
        let filepath;
        
        if (typeof file == 'string') {
            filepath = `${STATIC_FOLDER}/${file}`;
        } else if (file.dir == file.root) {
            filepath = `${STATIC_FOLDER}/${file.base}`;
        } else {
            filepath = `${file.dir.slice(1)}/${file.base}`;
        }

        fs.readFile(filepath, (err, content) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    res.statusCode = 404;
                    res.end(`File not found: ${filepath}`);
                } else {
                    res.end(err);
                }
            } else {
                res.writeHead(200, {'Content-Type': `${mimeType}; charset=UTF-8`});
                res.end(content, 'utf-8');
            }
        });
    } else {
        res.statusCode = 404;
        res.end('Page not available yet.');
    }
});

server.listen(8080, () => console.log('Server listening on port 8080'));
