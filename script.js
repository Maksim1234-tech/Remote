const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const screenshot = require('screenshot-desktop');
const robot = require('robotjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Кто-то подключился к Боссу!');

    // Цикл отправки скриншотов
    const sendScreen = setInterval(async () => {
        try {
            const img = await screenshot({ format: 'jpg' });
            socket.emit('screen', img.toString('base64'));
        } catch (err) {
            // Хаос случается
        }
    }, 100);

    // Управление мышью
    socket.on('click', (data) => {
        // Умножаем на 2, если у тебя Retina или масштаб Windows 200%
        robot.moveMouse(data.x, data.y);
        robot.mouseClick();
    });

    socket.on('disconnect', () => clearInterval(sendScreen));
});

server.listen(3000, () => {
    console.log('Сервер летит на http://localhost:3000');
});
