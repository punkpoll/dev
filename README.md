# Punkpoll-vote-sytem

The Punkpoll voting system is based on the Mina blockchain.

A voting system which issues zk-PUNK-nft in the form of PoC, and sends the issued zk-PUNK-nft to the voting target's wallet.
# System Diagram
![punkpoll_vote_eng ver 2 0](https://github.com/punkpoll/dev/assets/137742109/4970cba3-ac6c-4ce9-88e4-9bd895424f61)

# Terminology
* Sequential Rollup
  - Processing Tx added to the Pool every 5 seconds
  - All Tx are processed on-chain
* Recursion Rollup
  - Operations such as issuing zk-PUNK-nft are processed off-chain, with the final Proof or root hash value updated on-chain
  - Anonymous information creation, nft issuance, nft transfer are processed off-chain, and updated on-chain once every 3 minutes

# User Authentication & zk-PUNK-nft Issuance, PUNK Token Minting
# Authentication Issuance Diagram
![auth_mint_zk-punk-nft_punkToken_eng ver 0 2](https://github.com/punkpoll/dev/assets/137742109/a6185b4e-41d5-4d40-90fc-775189da3cfd)

# Authentication Issuance Order
PUNK Tokens are minted through user authentication.
Procedure for issuing zk-PUNK-nft and PUNK for users who have authenticated with Kakao:
1. Generate Mina Account (Changed from using Account Pool to direct creation on July 11, 2023)
2. Create anonymous user information
   - In the Punkpoll voting system, users are anonymized and registered in the MerkleMap, so only the user themselves can know that their information is registered.
3. Upload authenticated user information as json data to ipfs
4. Issue zk-PUNK-nft with the CID of the basic information uploaded to ipfs
  - zk-PUNK-nft issuance information is stored as anonymous information-CID pairs.
  - zk-PUNK-nft issuance information is hashed, added to the MerkleMap, and the root hash is updated on-chain.
  - The process of issuing zk-PUNK-nft is handled with Recursion Proof.
6. Mint PUNK as authentication reward (Add the PUNK Token Tx to the Tx Pool for sequential Rollup processing.)
  - Add mint information to PUNK Token Tx Pool
  - Execute mint Tx added to PUNK Token Tx Pool
  - Send Tx to Mina on-chain
7. Distribute PUNK Tokens minted as authentication rewards
  - Add to the PUNK Token Tx Pool.
  - User : 10PUNK
  - Punkpoll Corp : 10PUNK
  - DAO & Operational Expenses (OP) : 10PUNK
  - Liquid Pool : 70PUNK

# Voting/Survey Distribution
# Voting/Survey Distribution Diagram
![deploy_eng](https://github.com/punkpoll/dev/assets/137742109/f355bb6b-0014-4b98-8600-396f9da4795a)

# Voting/Survey Distribution Procedure
The voting/survey created by the builder is deployed on the mina blockchain.
1. Create a wallet for users to vote (the options for the question)
  - The Punkpoll voting system is designed so that users send the corresponding zk-PUNK-nft from their wallet to the voting target wallet.
  - Create a voting target wallet to send user nft.
    The voting target refers to the options of the questions presented to users in the voting/survey.
    For example, if there are two questions and each question has three options, then six wallets (2 questions x 3 options) are created.
2. zkApp Complie & Deploy
  - After deploying zkApp, update the Indexer root hash value on-chain
3. PUNK Deposit
  - Deposit PUNK Token to be provided as a reward for participants
  - All Tx processed in the voting/survey deployment are processed in real time, and once the PUNK Token Deposit is completed on-chain, the voting/survey can be used.

# Voting/Survey Participation
# Voting/Survey Participation Diagram
![voting_eng](https://github.com/punkpoll/dev/assets/137742109/576fda38-84cc-4242-a8d7-427f4867e634)

# Voting/Survey Participation Procedure
Users participate in the voting/survey through the chatbot and submit the final participation information.
Before adding the submitted participation information to the 'Participation Information Queue', it is checked whether the user is already participating.
Check if there is user information in the 'User Nullifier MerkleMap' and if not, add participation information to the 'Participation Information Queue'
1. Retrieve participation information from the 'Participation Information Queue' for processing.
2. Anonymize the participant and add to the 'User Nullifier MerkleMap'
3. Create a ballot (nft) for use in voting/surveys using the participant's zk-PUNK-nft information
4. Upload each question-specific nft (json data) to ipfs
5. Add ipfs CID information to 'NFT Issuance Information'
  - Add the hashed value to the 'NFT Issuance Information MerkleMap'
6. Send the issued nft to the user's wallet
  - Add the user's wallet to the Indexer and add the issued nft to the user
7. Transfer each question-specific nft to the target wallet as per the submitted participation information
  - Transfer user ballot nft (nft for each question) to the target wallet (question-specific wallet)
  - User ballot nft can only be transferred to the sub-wallet of the respective question (wallet created for each option of the question)
8. PUNK Token Reward
  - Add PUNK Token transfer information to the 'PUNK Reward Queue'
  - The 'PUNK Reward Transfer Rollup' checks if there is a Tx to process in the 'PUNK Reward Queue' and processes the TX every 5 seconds.
  - PUNK Token transfer needs to be processed on-chain, so it is handled with sequential Rollup instead of Recursion Rollup.
