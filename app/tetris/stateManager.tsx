// stateManager.tsx
import EventEmitter from 'events';

class StateManager extends EventEmitter {
  constructor() {
    super();
    this.state = {
      grid: null,
      shapes: [],
      piece: null,
      img: null,
    };
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.emit('stateUpdated', this.state);
  }

  getState() {
    return this.state;
  }
}

export const stateManager = new StateManager();
