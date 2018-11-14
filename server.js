const http = require('http');
const app = require('./app');

const port = process.env.PORT || 12345;
const server = http.createServer(app);

server.listen(port, () => {
    console.log("Server is running at port " + port);
});

