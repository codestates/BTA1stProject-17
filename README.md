## Hedera Hashtag

### 1. What is This ?
```shell
Hedera Hashtag는 차세대 블록체인을 이끌어갈 헤더라 해시그래프의 테스트넷용 지갑입니다.  
```

### 2. Getting Start
```shell
크롬 익스텐션으로 진행됩니다.
```
1. `yarn install`
2. `.env` 파일을 생성 (하기의 `Create .env` 내용을 참고하세요.)
3. `yarn build`
4. `chrome://extensions`에 접속
5. `압축해제된 확장 프로그램을 로드합니다.` 버튼을 눌러 빌드된 `dist` 파일 전체를 업로드합니다.
6. `Hedera Hastag`로 HBAR를 마음껏 다루어보세요!

### 3. Create .env

- `.env`에 필요한 내용들은 다음과 같습니다.
```shell
MY_ACCOUNT_ID={Hedera Portal 테스트넷 계정 ACCOUNT_ID}
MY_PRIVATE_KEY={Hedera Portal 테스트넷 계정 PRIVATE_KEY}
API_URL=https://testnet.mirrornode.hedera.com/api/v1
SECRET_KEY={해시에 사용할 값}
```
