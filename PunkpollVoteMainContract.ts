import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  MerkleTree,
  CircuitString,
  PublicKey,
  Signature,
  Bool,
  UInt64
} from 'snarkyjs';

export class PunkpollVoteMainContract extends SmartContract {
  @state(PublicKey) votePublicKey = State<PublicKey>(); // 참여 zkapp의 public key
  @state(Field) voteCid = State<Field>(); // vote Information ipfs cid
  @state(UInt64) depositVal = State<UInt64>(); // deposit punk amount 
  @state(UInt64) rewardVal = State<UInt64>(); // reward punk amount
  @state(UInt64) rewardCount = State<UInt64>(); // Paid reward count 
  @state(UInt64) startDate = State<UInt64>(); // start Date
  @state(UInt64) endDate = State<UInt64>(); // end Date
  //@state(UInt64) resultDate = State<UInt64>(); // result Open Date
  
  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
      //: Permissions.proofOrSignature(),
    });
  }

  @method initState() {
    this.rewardCount.set(UInt64.zero);
    this.depositVal.set(UInt64.zero);
    this.rewardVal.set(UInt64.zero);
    this.startDate.set(UInt64.zero);
    this.endDate.set(UInt64.zero);
    //this.resultDate.set(UInt64.zero);
  }

  @method getVoteStorageAddress(): PublicKey {
    this.votePublicKey.assertEquals(this.votePublicKey.get());
    return this.votePublicKey.get();
  }
  @method getVoteCid(): Field {
    this.voteCid.assertEquals(this.voteCid.get());
    return this.voteCid.get();
  }
  @method getDepositAmount(): UInt64 {
    this.depositVal.assertEquals(this.depositVal.get());
    return this.depositVal.get();
  }
  @method getRewardAmount(): UInt64 {
    this.rewardVal.assertEquals(this.rewardVal.get());
    return this.rewardVal.get();
  }
  @method getRewardCount(): UInt64 {
    this.rewardCount.assertEquals(this.rewardCount.get());
    return this.rewardCount.get();
  }
  
  @method getVoteRewardCondition(): [UInt64, UInt64] {
    this.rewardVal.assertEquals(this.rewardVal.get());
    this.rewardCount.assertEquals(this.rewardCount.get());

    return [this.rewardVal.get(), this.rewardCount.get()];
  }
  
  
  @method getVoteDate(): [UInt64, UInt64] {
    this.startDate.assertEquals(this.startDate.get());
    this.endDate.assertEquals(this.endDate.get());
    //this.resultOpenDate.assertEquals(this.resultOpenDate.get());

    return [this.startDate.get(), this.endDate.get()];
  }

  @method setVoteDate(startDate: UInt64, endDate: UInt64) {
    const sDate = this.startDate.get();
    this.startDate.assertEquals(sDate);

    const eDate = this.endDate.get();
    this.endDate.assertEquals(eDate);

    //const rDate = this.resultOpenDate.get();
    //this.resultOpenDate.assertEquals(rDate);

    this.startDate.set(startDate);
    this.endDate.set(endDate);
    //this.resultOpenDate.set(resultOpenDate);
  }
  
  
  @method setVoteRewardCondition(rewardVal: UInt64, rewardCount: UInt64) {
    const rVal = this.rewardVal.get();
    this.rewardVal.assertEquals(rVal);
    const rCount = this.rewardCount.get();
    this.rewardCount.assertEquals(rCount);

    this.rewardVal.set(rewardVal);
    this.rewardCount.set(rewardCount);
  }
  
  @method setVoteStorageAddress(votePublicKey: PublicKey) {
    const pKey = this.votePublicKey.get();
    this.votePublicKey.assertEquals(pKey);

    this.votePublicKey.set(votePublicKey);
  }

  @method setVoteCid(voteCid: Field) {
    const vCid = this.voteCid.get();
    this.voteCid.assertEquals(vCid);

    this.voteCid.set(voteCid);
  }

  @method setDepositAmount(depositVal: UInt64) {
    const dVal = this.depositVal.get();
    this.depositVal.assertEquals(dVal);

    this.depositVal.set(depositVal);
  }

  @method setRewardAmount(rewardVal: UInt64) {
    const rVal = this.rewardVal.get();
    this.rewardVal.assertEquals(rVal);

    this.rewardVal.set(rewardVal);
  }

  @method setRewardCount(rewardCount: UInt64) {   
    this.rewardCount.set(rewardCount);
  }

  
}
