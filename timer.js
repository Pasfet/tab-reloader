export class TimerReload {
  timer = null
  delay = 30000
  storage = null

  constructor(storage) {
    this.storage = storage
    this.setDelay()
  }

  get timer() {
    return this.timer
  }

  async setDelay(val) {
    if (val) {
      this.delay = val
    } else {
      const { delay } = await this.storage.get(['delay'])
      console.log(delay, 'delay')
      this.delay = delay ?? 30000
    }
  }

  timerRun(cb) {
    if (!this.timer) {
      this.timer = setInterval(cb, this.delay)
    }
  }

  async timerStop() {
    clearInterval(this.timer)
    this.timer = null
    await this.storage.set({ timerStart: false })
  }
}