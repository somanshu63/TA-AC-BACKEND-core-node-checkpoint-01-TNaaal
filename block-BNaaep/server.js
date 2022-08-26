var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
const useDir = __dirname + '/contacts/';
let object = [];


const getAllDirFiles = function(dirPath) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = [];
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(file)
      }
    })
  
    return arrayOfFiles
  }

var server = http.createServer(handleRequest);

function handleRequest(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var username = parsedUrl.query.username;
    var store = '';

    req.on('data', (chunk) => {
        store += chunk;
    });

    req.on('end', () => {
        if(req.method == 'POST' && parsedUrl.pathname == '/form'){
            store = querystring.parse(store);
            var susername = store.username;
            var stringifyData = JSON.stringify(store);
            fs.open(useDir + susername + '.json', "wx", (err, fd) => {
                if(err) console.log(err);
                fs.writeFile(fd, stringifyData, (err) => {
                    if(err) console.log(err);
                    fs.close(fd, (err) => {
                        if(err) console.log(err);
                        res.end(`${susername} contact saved`);
                    });
                });
            });
        }
        if (req.url.split(".").pop() === "css") {
            res.setHeader("Content-Type", "text/css");
            fs.readFile("./assets/style.css", (err, content) => {
              if (err) return console.log(err);
              res.end(content);
            });
          }
          if (req.url.split(".").pop() === "png") {
            res.setHeader("Content-Type", "image/png");
            fs.readFile("./assets/person.png", (err, content) => {
              if (err) return console.log(err);
              res.end(content);
            });
          }
        if(req.method == 'GET' && parsedUrl.pathname == '/'){
            fs.readFile('./index.html', (err, content) => {
                if(err) console.log(err);
                res.setHeader('content-type', 'text/html');
                res.end(content);
            });
        }
        if(req.method == 'GET' && parsedUrl.pathname == '/about'){
            fs.readFile('./about.html', (err, content) => {
                if(err) console.log(err);
                res.setHeader('content-type', 'text/html');
                res.end(content);
            });
        }
        if(req.method == 'GET' && parsedUrl.pathname == '/contact'){
            fs.readFile('./contact.html', (err, content) => {
                if(err) console.log(err);
                res.setHeader('content-type', 'text/html');
                res.end(content);
            });
        }
        if(req.method == 'GET' && req.url == `/users?username=${username}`){
            res.setHeader('content-type', 'text/html');
            fs.readFile(useDir + username + '.json', (err, user) => {
                if(err) console.log(err);
                user = JSON.parse(user);
                res.write(`<h2>${user.name}</h2>`);
                res.write(`<h3>${user.email}</h3>`);
                res.write(`<h4>${user.username}</h4>`);
                res.write(`<h4>${user.age}</h4>`);
                res.write(`<h4>${user.bio}</h4>`);
                res.end();
            });
        }
        if(req.method == 'GET' && parsedUrl.pathname == '/users'){
            getAllDirFiles(useDir);
            res.setHeader('content-type', 'text/html');
            res.write('<h1>List Of All Users</h1>');
            for (let i = 0; i < arrayOfFiles.length; i++) {
                fs.readFile(useDir + arrayOfFiles[i], (err, data) => {
                    data = JSON.parse(data.toString());
                    object[i] = `<h2>Name: ${data.name}</h2><h3>Username: ${data.username}</h3><h4>Email: ${data.email}</h4><h4>Age: ${data.age}</h4><h4>Bio: ${data.bio}</h4>`;
                    res.write(object[i]);

                });
            }
            setTimeout(() => {
                res.end();  
            }, 2000)       
        }
    });
}

server.listen(5000, () => {
    console.log('server started at 5000')
});
