const http = require('http');
// const app = require('./backend/app');
const app = require('./backend/app')

const PORT = 2500;

//? setting the app port..
// app.set('port', PORT);
app.set('port', PORT);

//? creating the server
const server = http.createServer(app);

// running the server at the given port..
server.listen(PORT);