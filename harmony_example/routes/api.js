const express = require('express');
const router = express.Router();
const config = require('../config/config');
const converter = require('bech32-converting');
const request = require('request');

// import or require Harmony class
const { Harmony } = require('@harmony-js/core');
const { Account, Wallet } = require('@harmony-js/account');

// import or require settings
const {
  ChainID,
  ChainType,
  hexToNumber,
  numberToHex,
  fromWei,
  fromOne,
  Units,
  Unit,
  toAscii
} = require('@harmony-js/utils');

const {
  encode,
  decode,
  randomBytes,
  toBech32,
  fromBech32,
  HarmonyAddress,
  generatePrivateKey,
  getPubkeyFromPrivateKey,
  getAddressFromPublicKey,
  getAddressFromPrivateKey,
  encryptPhrase,
  decryptPhrase
} = require('@harmony-js/crypto');

let shardURL = 'https://api.s0.b.hmny.io/'; //앤드포인트 URL
let hmy = new Harmony(
  shardURL,
  {
      chainType: ChainType.Harmony,
      chainId: ChainID.HmyTestnet,
  },
);


/*
 *  /api
 */
router.get('/mnemonic/:PWD', async (req, res, next) => {
  try {
    if(req.params.PWD) {
      console.log(`PWD: ${req.params.PWD}`);
    } else {
      console.log('암호를 입력받지 않음');
    }
    
    //니모닉 생성
    const myMnemonic = new Wallet().newMnemonic();
    console.log(`니모닉 코드 생성: ${myMnemonic}`);
    
    //암호화
    let encData = await encryptPhrase(myMnemonic, req.params.PWD);
    console.log(encData);

    //복호화
    // decryptPhrase(JSON.parse(value), req.params.PWD).then(value => {
    //   console.log(`복호화 값: ${value}`);
    // });


    res.json({ message: "ok", data: {
      mnemonic: myMnemonic,
      encData: encData
    }});
  } catch (err) {
    console.error(err);
  }
});

/*
 *  /api/newaccount/:HDPATH
 */
router.get('/newaccount', async (req, res, next) => {
  console.log('======== 계정 생성 =========')
  try {
    let hdpath, pwd, mnemonic;
    if(req.query) {
      hdpath = req.query.hdpath;
      pwd = req.query.pwd;
      mnemonic = req.query.mnemonic;
    }

    //니모닉 코드 복호화
    let myPhrase = await decryptPhrase(JSON.parse(mnemonic), pwd);
    console.log(myPhrase);
    
    const wallet = new Wallet(
      shardURL,
      ChainType.Harmony,
      ChainID.HmyTestnet,
    );
    const account = wallet.addByMnemonic(myPhrase,req.query.hdpath);
    console.log(account);

    let result = {};
    result.addressForETH = account.address;
    result.addressForONE = converter('one').toBech32(account.address);
    //converter('eth').toHex('eth1pcl5tjla58y7kqywhjv88u7m58v6sm5afc6dwn')
    // 0x0E3f45Cbfda1C9Eb008Ebc9873F3DBA1d9A86E9D

    //개인키 암호화
    let encPrivateKey = await encryptPhrase(account.privateKey, pwd);
    result.privateKey = encPrivateKey;
    console.log('사용자 패스워드로 암호화된 개인키');
    console.log(encPrivateKey);
    
    res.json({ message: "ok", data: result });
  } catch (err) {
    console.error(err);
  }
});


/*
 *  /api/balance
 */
router.get('/balance', async (req, res, next) => {
  console.log('======== 밸런스 조회 =========')
  try {
    let myAddress, myShard, myNetwork;
    if(req.query.address) {
      myAddress = req.query.address;
      myShard = req.query.shard;
      myNetwork = req.query.network;
    }
    console.log(`샤드번호 :  ${myShard}`);
    console.log(`네트워크 :  ${myNetwork}`);

    let networkType, myChainId;
    if(myNetwork == 'mainnet') {
      networkType = 't';
      myChainId = ChainID.HmyMainnet;
    } else {
      networkType = 'b';
      myChainId = ChainID.HmyTestnet;
    }
    
    //만약 샤드 정보가 변경되었다면 hmy 객체 변경
    let myEndpoint = `https://api.s${myShard}.${networkType}.hmny.io/`;
    console.log(`엔드포인트 : ${myEndpoint}`)
    console.log(`체인ID : ${myChainId}`)
    if(shardURL != myEndpoint) {
      shardURL = myEndpoint;
      hmy = new Harmony(
        shardURL,
        {
            chainType: ChainType.Harmony,
            chainId: myChainId
        },
      );
    }

    //계정 밸런스
    let balance = await hmy.blockchain.getBalance({address: myAddress});
    let result = {};
    result.balance = fromWei(hexToNumber(balance.result), Units.one);
    console.log('밸런스 in ONEs: ' + result);
    
    //https://api.coingecko.com/api/v3/simple/price?ids=harmony&vs_currencies=krw
    let options = {
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=harmony&vs_currencies=krw',
        method: "get",
        headers: {"content-type": "application/json"},
        // body: JSON.stringify({
        //   "jsonrpc": "2.0",
        //   "id": "1",
        //   "method": "hmyv2_gasPrice",
        //   "params": []
        // })
    };
    request(options, (error, response, body) => {
        if (error) {
            console.error('An error has occurred: ', error);
        } else {
            console.log('Post successful: response: ', body);
            result.krw = JSON.parse(body).harmony.krw;
            result.krw = Math.round(Number(result.balance) * Number(result.krw));
        }
        res.json({ message: "ok", data: result });
    });

    //가스 확인
    // let options = {
    //     url: shardURL,
    //     method: "post",
    //     headers: {"content-type": "application/json"},
    //     body: JSON.stringify({
    //       "jsonrpc": "2.0",
    //       "id": "1",
    //       "method": "hmyv2_gasPrice",
    //       "params": []
    //     })
    // };
    
    // request(options, (error, response, body) => {
    //     if (error) {
    //         console.error('An error has occurred: ', error);
    //         result.gasPrice = 1;
    //     } else {
    //         console.log('Post successful: response: ', body);
    //         result.gasPrice = body.result;
    //     }
    //     console.log(`가스비 확인...`)
    //     res.json({ message: "ok", data: result });
    // });
    // Post successful: response:  {"jsonrpc":"2.0","id":"1","result":30000000000}


    //res.json({ message: "ok", data: result });
  } catch (err) {
    console.error(err);
  }
});


/*
 *  /api/privateKey?encdata=${encPrivateKey}&pwd=${pwd}
 */
router.get('/privateKey', async (req, res, next) => {
  console.log('======== 개인키 조회 =========')
  try {
    let myEncData, myPwd;
    if(req.query) {
      myEncData = req.query.encdata;
      myPwd = req.query.pwd;
    }

    //개인키 복호화
    let decPrivateKey = await decryptPhrase(JSON.parse(myEncData), myPwd);
    console.log(decPrivateKey);
    
    res.json({ message: "ok", data: decPrivateKey });
  } catch (err) {
    console.error(err);
  }
});         


/*
 *  /api/transfer?data=${data}
 */
router.get('/transfer', async (req, res, next) => {
  console.log('======== 코인 전송 =========')
  try {
    let myData;
    if(req.query) {
      myData = JSON.parse(req.query.data);
    }

    console.log(myData);

    //개인키 복호화
    let decPrivateKey = await decryptPhrase(JSON.parse(myData.encPrivateKey), myData.pwd);
    console.log(`개인키: ${decPrivateKey}`);

    /*
    * 전송 프로세스
    */
    // 1. 네트워크 세팅
    let networkType, myChainId;
    if(myData.network == 'mainnet') {
      networkType = 't';
      myChainId = ChainID.HmyMainnet;
    } else {
      networkType = 'b';
      myChainId = ChainID.HmyTestnet;
    }
    
    //만약 샤드 정보가 변경되었다면 hmy 객체 변경
    let myEndpoint = `https://api.s${myData.shard}.${networkType}.hmny.io/`;
    console.log(`엔드포인트 : ${myEndpoint}`)
    console.log(`체인ID : ${myChainId}`)
    if(shardURL != myEndpoint) {
      shardURL = myEndpoint;
      hmy = new Harmony(
        shardURL,
        {
            chainType: ChainType.Harmony,
            chainId: myChainId
        },
      );
    }

    // 2. 지갑 세팅
    const sender = hmy.wallet.addByPrivateKey(decPrivateKey);
    console.log(sender);
    //계정 밸런스
    let balance = await hmy.blockchain.getBalance({address: myData.address});
    let result = fromWei(hexToNumber(balance.result), Units.one);
    console.log('밸런스 in ONEs: ' + result);


    // 3. 샤드 정보 세팅
    // 크로스-샤드 트랜잭션 전송을 위해 sharding 세팅이 필요
    const shardStruct = await hmy.blockchain.getShardingStructure();
    hmy.shardingStructures(shardStruct.result);
 

    //4. 전송 준비
    // one1agthrfh3y7feg5gvrnz44a47tcvyj6gryjge2j
    let valueInONE = hmy.utils.toWei(myData.amount, hmy.utils.Units.one);
    const txn = hmy.transactions.newTx({
      to: myData.addressTo,             //  token send to
      value: String(valueInONE),
      //value: '10000',
      gasLimit: String(myData.gasLimit),
      //gasLimit: '210000',
      shardID: Number(myData.shard),            // send token from shardID
      toShardID: Number(myData.toShard),
      gasPrice: new hmy.utils.Unit(String(myData.gasPrice)).asGwei().toWei(),
      //gasPrice: new hmy.utils.Unit('100').asGwei().toWei(),
    });
    console.log('====== 트랜잭션 준비 ======')
    console.log(txn);
    
    // 5. 트랜잭션 서명
    const signedTxn = await hmy.wallet.signTransaction(txn);

    // 6. 트랜잭션 발송(send)
    const [sentTxn, txnHash] = await signedTxn.sendTransaction();
    console.log('====== 트랜잭션 hash ======')
    console.log(txnHash);   //transaction failed:transaction underpriced 발생할 수 있다
    //Transaction Fee   0.01938438 ONE
    //Gas Used          646146
    //Gas Price         0.00000003 ONE

    const confiremdTxn = await sentTxn.confirm(txnHash);

    // if the transactino is cross-shard transaction
    if (!confiremdTxn.isCrossShard()) {
      if (confiremdTxn.isConfirmed()) {
        console.log('--- Result ---');
        console.log('');
        console.log('Normal transaction');
        console.log(`${txnHash} is confirmed`);
        console.log(sentTxn);
      }
    }
    if (confiremdTxn.isConfirmed() && confiremdTxn.isCxConfirmed()) {
      console.log('--- Result ---');
      console.log('');
      console.log('Cross-Shard transaction');
      console.log(`${txnHash} is confirmed`);
      console.log(sentTxn);
    }



    res.json({ message: "ok", data: `전송 완료 : ${txnHash}`});
  } catch (err) {
    console.error(err);
    res.json({ message: "ok", data: err.message});
  }
});  


/*
 *  /api/activity
 */
router.get('/activity', async (req, res, next) => {
  console.log('======== 활동 조회 =========')
  try {
    let myAddress, myShard, myNetwork;
    if(req.query.address) {
      myAddress = req.query.address;
      myShard = req.query.shard;
      myNetwork = req.query.network;
    }
    console.log(`샤드번호 :  ${myShard}`);
    console.log(`네트워크 :  ${myNetwork}`);

    let networkType, myChainId;
    if(myNetwork == 'mainnet') {
      networkType = 't';
      myChainId = ChainID.HmyMainnet;
    } else {
      networkType = 'b';
      myChainId = ChainID.HmyTestnet;
    }
    
    //만약 샤드 정보가 변경되었다면 hmy 객체 변경
    let myEndpoint = `https://api.s${myShard}.${networkType}.hmny.io/`;
    console.log(`엔드포인트 : ${myEndpoint}`)
    console.log(`체인ID : ${myChainId}`)
    if(shardURL != myEndpoint) {
      shardURL = myEndpoint;
      hmy = new Harmony(
        shardURL,
        {
            chainType: ChainType.Harmony,
            chainId: myChainId
        },
      );
    }

    //계정 밸런스
    // let balance = await hmy.blockchain.getBalance({address: myAddress});
    // let result = {};
    // result.balance = fromWei(hexToNumber(balance.result), Units.one);
    // console.log('밸런스 in ONEs: ' + result);
    
    let result;
    console.log(`myAddress : ${myAddress}`);
    //활동 내역
    let options = {
        url: shardURL,
        method: "post",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": "1",
          "method": "hmyv2_getTransactionsHistory",
          "params": [
            {
              "address": myAddress,
              //"pageIndex": 0,
              //"pageSize": 1,
              "fullTx": true,
              "txType": "ALL",
              "order": "DESC"
            }
          ]
        })
    };
    
    request(options, (error, response, body) => {
        if (error) {
          console.error('An error has occurred: ', error);
        } else {
          result = JSON.parse(body).result.transactions;
          for(let i=0;i<result.length;i++) {
            result[i].value = fromWei(String(result[i].value), Units.one);
          }
        }
        res.json({ message: "ok", data: result });
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;