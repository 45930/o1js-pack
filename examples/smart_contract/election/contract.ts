import { SmartContract, state, State, method, UInt32 } from 'o1js';
import { PackedUInt32Factory } from '../../../src/index.js';

export class Ballot extends PackedUInt32Factory() {}

export class Election extends SmartContract {
  @state(Ballot) ballot1 = State<Ballot>();
  @state(Ballot) ballot2 = State<Ballot>();
  @state(Ballot) ballot3 = State<Ballot>();
  @state(Ballot) ballot4 = State<Ballot>();

  init() {
    super.init();
    this.ballot1.set(Ballot.fromBigInts([0n, 0n, 0n, 0n, 0n, 0n, 0n]));
    this.ballot2.set(Ballot.fromBigInts([0n, 0n, 0n, 0n, 0n, 0n, 0n]));
    this.ballot3.set(Ballot.fromBigInts([0n, 0n, 0n, 0n, 0n, 0n, 0n]));
    this.ballot4.set(Ballot.fromBigInts([0n, 0n, 0n, 0n, 0n, 0n, 0n]));
  }

  @method
  castBallot1(vote: Ballot) {
    const unpackedVote = Ballot.unpack(vote.packed);
    const ballot1 = this.ballot1.getAndAssertEquals();
    const unpackedBallot1 = Ballot.unpack(ballot1.packed);

    let voteSum = UInt32.from(0);
    for (let i = 0; i < Ballot.l; i++) {
      voteSum = voteSum.add(unpackedVote[i]);
      unpackedBallot1[i] = unpackedBallot1[i].add(unpackedVote[i]);
    }
    voteSum.value.assertEquals(1); // vote must be exactly one vote for one choice
    this.ballot1.set(Ballot.fromUInt32s(unpackedBallot1));
  }

  @method
  castBallot2(vote: Ballot) {
    const unpackedVote = Ballot.unpack(vote.packed);
    const ballot2 = this.ballot2.getAndAssertEquals();
    const unpackedBallot2 = Ballot.unpack(ballot2.packed);

    let voteSum = UInt32.from(0);
    for (let i = 0; i < Ballot.l; i++) {
      voteSum = voteSum.add(unpackedVote[i]);
      unpackedBallot2[i] = unpackedBallot2[i].add(unpackedVote[i]);
    }
    voteSum.value.assertEquals(1); // vote must be exactly one vote for one choice
    this.ballot2.set(Ballot.fromUInt32s(unpackedBallot2));
  }

  @method
  castBallot3(vote: Ballot) {
    const unpackedVote = Ballot.unpack(vote.packed);
    const ballot3 = this.ballot3.getAndAssertEquals();
    const unpackedBallot3 = Ballot.unpack(ballot3.packed);

    let voteSum = UInt32.from(0);
    for (let i = 0; i < Ballot.l; i++) {
      voteSum = voteSum.add(unpackedVote[i]);
      unpackedBallot3[i] = unpackedBallot3[i].add(unpackedVote[i]);
    }
    voteSum.value.assertEquals(1); // vote must be exactly one vote for one choice
    this.ballot3.set(Ballot.fromUInt32s(unpackedBallot3));
  }

  @method
  castBallot4(vote: Ballot) {
    const unpackedVote = Ballot.unpack(vote.packed);
    const ballot4 = this.ballot4.getAndAssertEquals();
    const unpackedBallot4 = Ballot.unpack(ballot4.packed);

    let voteSum = UInt32.from(0);
    for (let i = 0; i < Ballot.l; i++) {
      voteSum = voteSum.add(unpackedVote[i]);
      unpackedBallot4[i] = unpackedBallot4[i].add(unpackedVote[i]);
    }
    voteSum.value.assertEquals(1); // vote must be exactly one vote for one choice
    this.ballot4.set(Ballot.fromUInt32s(unpackedBallot4));
  }
}
