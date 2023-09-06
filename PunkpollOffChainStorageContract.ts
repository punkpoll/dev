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
  Poseidon
} from 'snarkyjs';

import {
  OffChainStorage,
  Update,
  MerkleWitness128,
} from 'experimental-zkapp-offchain-storage-punkpoll';

// The public key of our trusted data provider
const ORACLE_PUBLIC_KEY = 'B62qpaYiQn1TAiijfMCAemSx5SRBLA8HH7dnnukJGCs3hH3Wva4qVEL';

export class PunkpollVoteContract extends SmartContract {
  @state(PublicKey) voteZkAppPublicKey = State<PublicKey>(); // 투표 zkapp의 public key
  @state(PublicKey) storageServerPublicKey = State<PublicKey>(); // OffChainStorage zkapp의 public key
  @state(Field) storageNumber = State<Field>(); // MerkleTree number
  @state(Field) storageTreeRoot = State<Field>(); // MerkleTree root 

  @state(PublicKey) oraclePublicKey = State<PublicKey>();

  // EKESCW8fZT2Wm3ZcKoiABfwPNwQQmYTqFxEiR2o21d9pLwjw75Aw

  // Define contract events
  events = {
    verified: Field,
  };

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
      //editSequenceState: Permissions.proofOrSignature(),
    });
  }

  @method initState(storageServerPublicKey: PublicKey) {
    this.storageServerPublicKey.set(storageServerPublicKey);
    this.storageNumber.set(Field.zero);

    const emptyTreeRoot = new MerkleTree(128).getRoot();
    this.storageTreeRoot.set(emptyTreeRoot);

    // Initialize contract state
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    // Specify that caller should include signature with tx instead of proof
    this.requireSignature();

  }

  @method update(
    priorLeafMessage: CircuitString,
    priorLeafSigner: PublicKey,
    priorLeafIsEmpty: Bool,
    leafWitness: MerkleWitness128,
    message: CircuitString,
    publicKey: PublicKey,
    signature: Signature,
    storedNewStorageNumber: Field,
    storedNewStorageSignature: Signature
  ) {
    const storedRoot = this.storageTreeRoot.get();
    this.storageTreeRoot.assertEquals(storedRoot);

    let storedNumber = this.storageNumber.get();
    this.storageNumber.assertEquals(storedNumber);

    let storageServerPublicKey = this.storageServerPublicKey.get();
    this.storageServerPublicKey.assertEquals(storageServerPublicKey);

    const leaf = priorLeafSigner.toFields().concat(priorLeafMessage.toFields());
    const newLeaf = publicKey.toFields().concat(message.toFields());

    signature.verify(publicKey, newLeaf).assertTrue();

    const updates: Update[] = [
      {
        leaf,
        leafIsEmpty: priorLeafIsEmpty,
        newLeaf,
        newLeafIsEmpty: Bool(false),
        leafWitness,
      },
    ];

    const storedNewRoot = OffChainStorage.assertRootUpdateValid(
      storageServerPublicKey,
      storedNumber,
      storedRoot,
      updates,
      storedNewStorageNumber,
      storedNewStorageSignature
    );

    this.storageTreeRoot.set(storedNewRoot);
    this.storageNumber.set(storedNewStorageNumber);

  }

  @method verify(voterInx: Field, firstNftId: Field, txSignature: Signature) {
    // Get the oracle public key from the contract state
    const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey);

    // Get the oracle public key from the contract states
    txSignature
      .verify(
        oraclePublicKey,
        [voterInx, firstNftId]
      ).assertTrue();
  }
  @method verifyZkPunk(cirVcid: CircuitString, cirNullifierZkPunk: CircuitString, userNftIdString: CircuitString, voteIdxNum: Field, txSignature: Signature) {
    // Get the oracle public key from the contract state
    const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey);

    const zkPunkLeaf = cirNullifierZkPunk.toFields().concat(cirVcid.toFields()).concat(userNftIdString.toFields()).concat(voteIdxNum);

    // Get the oracle public key from the contract states
    txSignature
      .verify(
        oraclePublicKey,
        zkPunkLeaf
      ).assertTrue();
  }
}
