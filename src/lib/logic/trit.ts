export type TritValue = -1 | 0 | 1;

export class Trit {
  #val: TritValue;

  get val(): TritValue { return this.#val; }

  set val(v: TritValue) { this.#val = v; }

  constructor(val: TritValue = 0) { this.#val = val; }
}

export type TritMatrix = [[Trit, Trit, Trit], [Trit, Trit, Trit], [Trit, Trit, Trit]];

export function tritValue(t: Trit | TritValue): TritValue {
  if (t instanceof Trit) {
    return t.val
  }
  return t;
}

export class TruthTable {
  #table: TritMatrix;

  constructor(table: TritMatrix) {
    this.#table = table;
  }

  at(a: Trit | TritValue, b: Trit | TritValue): Trit {
    return this.#table[tritValue(a) + 1][tritValue(b) + 1];
  }

  emplace(a: Trit | TritValue, b: Trit | TritValue, val: Trit | TritValue): void {
    this.#table[tritValue(a) + 1][tritValue(b) + 1] = new Trit(tritValue(val));
  }
}

export type TritVector = Array<Trit>;

export class Gate {
  public table: TruthTable | null;
  public in_a: Gate | null;
  public in_b: Gate | null;
  protected _state: Trit = new Trit(0);

  get state() { return this._state; }

  constructor(table: TruthTable | null = null, a: Gate | null = null, b: Gate | null = null) {
    this.table = table;
    this.in_a = a;
    this.in_b = b;
  }

  resolve(): Trit {
    this._state = this.table!.at(this.in_a!.resolve(), this.in_b!.resolve());
    return this._state;
  }
}

export class StartGate extends Gate {
  #value: Trit;

  get value() { return this.#value };
  set value(value: Trit | TritValue) {
    this.#value = new Trit(tritValue(value));
  }

  constructor(value: Trit = new Trit(0)) {
    super();
    this.#value = value;
  }

  resolve(): Trit { return this.#value; }
}

export class PlusGate extends StartGate { constructor() { super(new Trit(1)); } }
export class NullGate extends StartGate { constructor() { super(new Trit(0)); } }
export class MinusGate extends StartGate { constructor() { super(new Trit(-1)); } }

export class EndGate extends Gate {
  constructor(input: Gate | null) {
    super(null, input, null);
  }

  resolve(): Trit {
    this._state = this.in_a!.resolve();
    return this._state;
  }
}
