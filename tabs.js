export class ChromeTabs {
  tabs = null

  constructor() {
    this.tabs = chrome.tabs
  }

  onEventsTab(event, cb) {
    return this.tabs[event].addListener(cb)
  }

  reload() {
    this.tabs.reload()
  }

  async getCurrentTab() {
    const [tab] = await this.tabs.query({ currentWindow: true, active : true })
    return tab.id
  }
}