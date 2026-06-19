const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        res.writeHead(200, {"content-type":"text/plain"});
        res.end("Home Page");
        
    }
    else if(req.url == "/about"){
        res.writeHead(200,{"content-type":"text/plain"});
        res.end("About page")
    }
    else if(req.url == "/file"){
        const readStream = fs.createReadStream("./sample.mp4");
        res.writeHead(200,{"content-type":"video/mp4"});
        //res.end("Sample video");
        readStream.pipe(res);
    }
    else{
        res.writeHead(404, {"content-type":"text/plain"});
        res.end("404 Page not found");
    }
    
});

server.listen(5000, () => {
    console.log("Server listening http://localhost:5000");
})