class DI {
  constructor() {
    this.dependencies = {};
  }

  get(name) {
    return this.dependencies[name];
  }

  set(name, value) {
    this.dependencies[name] = value;
  }
}

export const di = new DI();