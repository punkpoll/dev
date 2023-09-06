import {
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  UInt64,
  PublicKey,
  Signature,
  Experimental,
  AccountUpdate,
  Int64,
} from 'snarkyjs';

const tokenSymbol = 'PUNK';

export class PunkTokenContract extends SmartContract {
  @state(UInt64) totalAmountInCirculation = State<UInt64>();

  deploy(args: DeployArgs) {
    super.deploy(args);

    //const permissionToEdit = Permissions.proof();
    const permissionToEdit = Permissions.proofOrSignature();

    this.account.permissions.set({
      ...Permissions.default(),
      editState: permissionToEdit,
      setTokenSymbol: Permissions.proof(),
      send: permissionToEdit,
      receive: permissionToEdit,
    });

    this.account.tokenSymbol.set(tokenSymbol);
    this.totalAmountInCirculation.set(UInt64.zero);
  }

  @method tokenInit() {
    super.init();
    this.account.tokenSymbol.set(tokenSymbol);
    this.totalAmountInCirculation.set(UInt64.zero);
  }

  @method mint(
    receiverAddress: PublicKey,
    amount: UInt64,
    adminSignature: Signature
  ) {

    adminSignature
      .verify(
        this.address,
        amount.toFields().concat(receiverAddress.toFields())
      )
      .assertTrue();

    this.token.mint({
      address: receiverAddress,
      amount,
    });
  }

  @method setTotalAmountInCirculation(amount: UInt64) {
    let totalAmountInCirculation = this.totalAmountInCirculation.get();
    this.totalAmountInCirculation.assertEquals(totalAmountInCirculation);

    this.totalAmountInCirculation.set(amount);
  }

  @method sendTokens(
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    amount: UInt64
  ) {
    this.token.send({
      from: senderAddress,
      to: receiverAddress,
      amount,
    });
  }

  @method burn(receiverAddress: PublicKey, amount: UInt64) {
    let totalAmountInCirculation = this.totalAmountInCirculation.get();
    this.totalAmountInCirculation.assertEquals(totalAmountInCirculation);
    let newTotalAmountInCirculation = totalAmountInCirculation.sub(amount);
    totalAmountInCirculation.value.assertGte(
      UInt64.from(0).value,
      "Can't burn less than 0"
    );
    this.token.burn({
      address: receiverAddress,
      amount,
    });
    this.totalAmountInCirculation.set(newTotalAmountInCirculation);
  }

  @method approveTransferCallback(
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    amount: UInt64,
    callback: Experimental.Callback<any>
  ) {
    let layout = AccountUpdate.Layout.NoChildren; // Allow only 1 accountUpdate with no children
    let senderAccountUpdate = this.approve(callback, layout);
    let negativeAmount = Int64.fromObject(
      senderAccountUpdate.body.balanceChange
    );
    negativeAmount.assertEquals(Int64.from(amount).neg());
    let tokenId = this.token.id;
    senderAccountUpdate.body.tokenId.assertEquals(tokenId);
    senderAccountUpdate.body.publicKey.assertEquals(senderAddress);
    let receiverAccountUpdate = Experimental.createChildAccountUpdate(
      this.self,
      receiverAddress,
      tokenId
    );
    receiverAccountUpdate.balance.addInPlace(amount);
  }

  @method setValidTokenSymbol() {
    this.account.tokenSymbol.set(tokenSymbol);
  }
}
