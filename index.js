const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    /*
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    */

    console.log(__dirname);
    console.log(req.url);

    let publicFolder = 'public_html'; // this will be the main web folder
    let errorPage = '404.html';
    let filePath = path.join(__dirname, publicFolder, req.url === '/' ? 'index.html' : req.url);
    let contentType = 'text/html';
    let extName = path.extname(filePath);
    
    // set content-type based on extension
    switch(extName) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.gif': contentType = 'image/gif'; break;
        case '.xml': contentType = 'text/xml'; break;
        case '.xls', '.xlsx': contentType = 'application/vnd.ms-excel'; break;
        case '.pdf': contentType = 'application/pdf'; break;
    }

    // load the requested file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // error
            if (err.code == 'ENOENT') {
                // show 404 error
                fs.readFile(path.join(__dirname, publicFolder, errorPage), (err, content) => {
                    res.writeHead(200, {'Content-Type':'text/html'});
                    res.end(content, 'utf8');
                })
            } else {
                // show other system error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // success, show request
            res.writeHead(200, {'Content-Type':contentType});
            res.end(content, 'utf8');
        }
    });
});

const port = process.env.PORT || 5000;

// use an IP address for hostname
//const hostname = '127.0.0.1';
//server.listen(port, hostname, () => {
//console.log(`Server running at http://${hostname}:${port}`);
//});

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
