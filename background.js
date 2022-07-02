'use strict';

import { Button } from './button';
import { ChromeStorage } from './storage'
import { ChromeTabs } from './tabs';
import { TimerReload } from "./timer";

const init = () => {
  const storage = new ChromeStorage()
  const timer = new TimerReload(storage)
  const tabs = new ChromeTabs()

  const timerRun = () => {
    timer.timerRun(() => {
      tabs.reload()
    })
  }

  const initButton = async (tabId) => {
    const button = new Button(tabId)
    const { showStartButton, timerStart } = await storage.get(['showStartButton', 'timerStart'])

    if (showStartButton) {
      button.create(timerStart)
    } else {
      button.remove()
    }

    if (timerStart && timer.timer === null) {
      timerRun()
    }
  }

  tabs.onEventsTab('onUpdated', (tabId) => {
    initButton(tabId)
  })

  tabs.onEventsTab('onActivated', ({ tabId }) => {
    initButton(tabId)
  })

  storage.changed(async changes => {
    if (changes.timerStart) {
      if (changes.timerStart.newValue) {
        await storage.set({ timerStart: true })
        timerRun()
      } else {
        await storage.set({ timerStart: false })
        await timer.timerStop()
      }
    }

    if (changes.delay) {
      await timer.timerStop()

      if (changes.delay.newValue) {
        await timer.setDelay()
        await storage.set({ delay: changes.delay.newValue })
      }
    }
  })
}

init()