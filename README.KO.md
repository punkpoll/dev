# Punkpoll-vote-sytem

펑크폴 투표 시스템은 미나 블록체인을 기반으로 하고 있습니다.

Poc 형태의 zk-PUNK-nft를 발행하여, 사용자에게 발행된 zk-PUNK-nft를 투표 대상의 wallet으로 전송하는 방식의 투표 시스템
# System 구성도
![punkpoll_vote_ko ver 0 2](https://github.com/punkpoll/dev/assets/137742109/57d16062-0fe5-414b-9b70-86bc79d16a05)

# 용어설명
* 순차적 Rollup
  - Pool에 추가된 Tx을 5초 단위로 처리
  - 모든 Tx은 on-chain에서 처리 된다.
* Recursion Rollup
  - zk-PUNK-nft 발행과 같이 off-chain에서 처리되고, 최종 Proof 또는 root hash값을 on-chain에 업데이트
  - off-chain에서 익명정보 생성, nft 발행, nft 전송을 처리하고, 3분에 1번 on-chain에 업데이트 한다. 

# 사용자 인증 & zk-PUNK-nft 발행, PUNK Token mint
# 인증 발행 구성도
![auth_mint_zk-punk-nft_punkToken_ko ver 0 2](https://github.com/punkpoll/dev/assets/137742109/35d69315-60bc-4027-8ba7-4bb7fdd00257)

# 인증 발행 순서
PUNK Token은 사용자 인증을 통해서 mint된다.
카카오 인증을 한 사용자 zk-PUNK-nft, PUNK 발행 절차
1. Mina Account 생성 (기존에 Account Pool을 사용하던 것에서, 직접 생성으로 변경 2023.07.11)
2. 사용자 익명정보 생성
   - Punkpoll 투표 시스템에서는 사용자가 익명화되어, MerkleMap에 등록되므로, 본인만이 자신의 정보가 등록되어 있는지를 알 수 있다. 
3. 인증된 사용자 정보 json data로 ipfs 업로드
4. ipfs에 업로드 된 기본정보의 CID로 zk-PUNK-nft 발행
  - zk-PUNK-nft 발행 정보는 익명정보-CID 쌍으로 저장된다.
  - zk-PUNK-nft 발행 정보는 해시화 되어, MerkleMap 추가 되고 root hash는 on-chain에 업데이트 된다.
  - zk-PUNK-nft의 발행 과정은 Recursion Proof로 처리한다.
6. 인증 보상 PUNK Mint (PUNK Token Tx은 순차적 Rollup으로 처리하기 위해 Tx Pool에 추가한다.)
  - PUNK Token Tx Pool에 mint 정보 추가
  - PUNK Token Tx Pool에 추가된 mint Tx 실행
  - Mina on-chain에 Tx sned
7. 인증 보상으로 발행 된 PUNK Token 분배
  - PUNK Token Tx Pool에 추가
  - User : 10PUNK
  - Punkpoll Corp : 10PUNK
  - DAO & 운영비용 (OP) : 10PUNK
  - Liquid Pool : 70PUNK

# 투표.여론조사 배포
# 투표.여론조사 배포 구성도
![depoly_ko](https://github.com/punkpoll/dev/assets/137742109/b100b058-7f69-4104-9837-fce3226c1ec6)

# 투표.여론조사 배포 순서
빌더에서 만든 투표.여론조사를 mina blockchain에 배포.
1. 사용자가 투표할 대상(질문의 보기) wallet 생성
  - Punkpoll 투표 시스템은 사용자의 표에 해당하는 zk-PUNK-nft를 사용자의 wallet에서 투표 대상 wallet으로 전송하는 방식으로 이루어진다.
  - 사용자 nft를 전송할 투표 대상 wallet을 생성한다.
    투표 대상이라 함은 사용자가 투표.여론조사에서 사용자에게 제시되는 질문의 보기를 의미한다.
    예를 들어 질문이 2개이고 각 질문에 3개의 보기가 있다면 6 (질문 2개 x 보기 3개)개의 wallet이 생성된다.
2. zkApp Complie & Deploy
  - zkApp 배포 후 on-chain에 Indexer root hash값 업데이트
3. PUNK Deposit
  - 참여자에게 리워드로 제공할 PUNK Token deposit
  - 투표.여론조사 배포에서 처리되는 모든 Tx은 실시간으로 처리되고, PUNK Token Deposit까지 on-chain에서 완료되면, 투표.여론조사를 사용할 수 있다.

# 투표.여론조사 참여
# 투표.여론조사 참여 구성도
![voting_ko](https://github.com/punkpoll/dev/assets/137742109/c9e2bcd6-5145-4517-9414-454ebfe1790c)

# 투표.여론조사 참여 순서
사용자는 챗봇으로 투표.여론조사에 참여하고, 최종 참여정보를 제출한다.
이때 사용자가 제출한 참여정보를 '참여정보 Queue'에 추가하기 전에, 사용자가 이미 참여중인지를 확인하다.
'User Nullifyer MerkleMap'에 사용자 정보가 있는지를 확인해서, 없으면 '참여정보 Queue'에 참여정보 추가
1. 참여정보 처리를 위해 '참여정보 Queue'에서 참여정보를 가져온다.
2. 참여자를 익명화하여 'User Nullifyer MerkleMap'에 추가
3. 참여자의 zk-PUNK-nft 정보를 사용해서, 투표.여론조사에서 사용할 표(nft) 생성
4. 각 질문별로 사용 할 nft(json data) ipfs 업로드
5. ipfs CID 정보를 'NFT 발행정보'에 추가
  - 해시화된 값을 'NFT 발행정보 MerkleMap'에 추가
6. 발행한 nft를 사용자 wallet으로 전송
  - Indexer에 사용자 wallet 추가 & 사용자에게 발행된 nft 추가
7. 사용자가 제출한 참여정보에 맞게, 각 질문별 nft를 대상 wallet으로 전송
  - 사용자 표 nft(각 질문에 해당 하는 nft)를 대상 wallet (질문별 wallet)으로 전송
  - 사용자 표 nft는 해당 질문의 하위 wallet(질문의 보기별로 생성된 wallet)에만 전송할 수 있다.
8. PUNK Token Reward
  - PUNK Token 전송 정보를 'PUNK Reward Queue'에 추가
  - 'PUNK Reward Transfer Rollup'에서 'PUNK Reard Queue'에 처리할 Tx이 있는지 확인해서, 5초 단위로 TX을 처리한다.
  - PUNK Token transfer는 on-chain에서 처리를 해야 하므로, Recursion Rollup이 아닌 순차적 Rollup으로 처리한다.
