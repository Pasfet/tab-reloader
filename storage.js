export class ChromeStorage {
  storage = null
  constructor() {
    this.storage = chrome.storage;
  }

  async set(payload) {
    await this.storage.local.set(payload)
  }

  get(keys) {
    return this.storage.local.get(keys)
  }

  changed(cb) {
    this.storage.onChanged.addListener(cb)
  }
}