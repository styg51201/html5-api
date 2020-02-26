const WebSocket = require('ws');
const sessionParser = require('./session-parser-module');

const createChatServer = server => {
    const wsServer = new WebSocket.Server({ server });
    const map = new Map();
    wsServer.on('connection', (ws, req) => {

        console.log(req.url); //req路徑
        console.log(req.session);// undefine
        //解析session (req,{要加的sess?},解析完後的callback func)
        sessionParser(req, {}, () => {
            // 解析完後可以看到已有的session => 判斷有無登入
            // 若無可以 ws.distoery => 刪掉ws
            // 若有就繼續往下 傳送訊息
            console.log(req.url);
            console.log(req.session);
        });


        map.set(ws, { name: '' });

        ws.on('message', message => {
            const mObj = map.get(ws);//取得每個客戶對應的ws
            let msg = '';
            //首次連線的話
            if (!mObj.name) {
                mObj.name = message;
                msg = `${mObj.name} 進入，人數：${wsServer.clients.size}`;
            } else {
                msg = `${mObj.name}: ${message}`;
            }
            //參數c = 每一個ws
            wsServer.clients.forEach(c => {
                //向還在線的發送訊息
                if (c.readyState === WebSocket.OPEN) {
                    c.send(msg);
                }
            });
        });
    });
};

module.exports = createChatServer;


