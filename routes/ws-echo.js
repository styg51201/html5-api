const WebSocket = require('ws');

const createEchoServer = server => {
    const wsServer = new WebSocket.Server({ server });

    wsServer.on('connection', (ws, req) => {
        //連線數
        console.log('connection num:', wsServer.clients.size);
        //連線過來的ip
        console.log('ip:', req.connection.remoteAddress);
        //連線過來的port
        console.log('port:', req.connection.remotePort);
        //綁定事件
        ws.on('message', message => {
            console.log(message)
            ws.send(message);
        });
        ws.send('connected!');
    });
};

// 出去的是一個func
module.exports = createEchoServer;


