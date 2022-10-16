/** @format */

const express = require('express');
const path = require('path');
const apiRouter = require('./routes/api');

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// db.json를 조작하기 위해 lowdb 사용
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser); // body 작성이 필요한 요청에 사용될 미들웨어
/*-------------여기에 Custom 라우터를 작성해준다-------
.
.
.
-------------------------------------------*/
// Use default router
server.use(router);

server.listen(process.env.JSON_PORT || 5500, () => {
    console.log('JSON Server is running');
});

const app = express();
app.set('port', process.env.PORT || 4000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRouter);
app.use((req, res, next) => {
    const walletData = db.get('wallet').value();
    console.log(walletData);
    if (walletData.hash) {
        console.log(walletData.hash);
        req.wallet = {
            hash: walletData.hash,
            access_time: walletData.access_time,
        };
    } else {
    }
    next();
});

app.get('/', (req, res) => {
    // res.json(`${req.method}: ${req.url}`);
    if (req.wallet) {
        res.status(200);
        res.json({
            wallet: req.wallet,
        });
    } else {
        res.status(200);
        res.json({ wallet: null });
    }
});

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
