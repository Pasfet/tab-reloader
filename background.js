'use strict';
import { createButton, removeButton } from './button.js'

const reloadWindow = (tabId, cmd) => {
  if (cmd) {
    chrome.storage.local.set({ showStartButton: true }, () => {
      createButton(tabId)
    })
  } else {
    chrome.storage.local.get(['showStartButton'], ({ showStartButton }) => {
      if (showStartButton) {
        createButton(tabId)
      } else {
        removeButton(tabId)
      }
    })
  }
}


const init = async () => {
  const storage = await chrome.storage.local.get(['timerStart', 'delay'])
  let timer = null
  let delay = storage.delay || 30000
  let timerStart = storage.timerStart
  let localTabId = null

  chrome.tabs.onActivated.addListener(({ tabId }) => {
    localTabId = tabId
    reloadWindow(tabId)
  })

  chrome.tabs.onUpdated.addListener((tabId) => {
    localTabId = tabId
    reloadWindow(tabId)
  })

  chrome.commands.onCommand.addListener((command) => {
    reloadWindow(localTabId, command)
  })

  const timerRun = () => {
    if (timerStart && delay && !timer) {
      timer = setInterval(() => {
        chrome.tabs.reload()
      }, delay)
    } else {
      clearInterval(timer)
      timer = null
    }  
  }


  chrome.storage.onChanged.addListener((changes) => {
    if (changes.timerStart && changes.timerStart.newValue !== timerStart) {
      timerStart = changes.timerStart.newValue
    }

    if (changes.delay && changes.delay.newValue !== delay) {
      delay = changes.delay.newValue
    }

    timerRun()
  })

  timerRun()
}

init();