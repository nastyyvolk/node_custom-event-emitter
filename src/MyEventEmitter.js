'use strict';

module.exports = class MyEventEmitter {
  constructor() {
    this.events = {};
  }

  onceWrapper(evName, callback) {
    const wrapped = (...args) => {
      callback(args);
      this.off(evName, wrapped);
    };

    return wrapped;
  }

  on(evName, callback) {
    if (!this.events[evName]) {
      this.events[evName] = [];
    }
    this.events[evName].push(callback);
  }

  once(evName, callback) {
    this.on(evName, this.onceWrapper(evName, callback));
  }

  off(evName, callback) {
    this.events[evName] = this.events[evName]
      .filter((func) => func !== callback);
  }

  emit(evName, ...args) {
    this.events[evName].forEach((callback) => {
      callback(args);
    });
  }

  prependListener(evName, callback) {
    if (!this.events[evName]) {
      this.events[evName] = [];
    }

    this.events[evName].unshift(callback);
  }

  prependOnceListener(evName, callback) {
    this.prependListener(evName, this.onceWrapper(evName, callback));
  }

  removeAllListeners(evName) {
    this.events[evName] = [];
  }

  listenerCount(evName) {
    return this.events[evName] && this.events[evName].length;
  }
};
