'use strict';

import { createButton, removeButton } from '../button.js'

const getCurrentTabId = async () => {
	const [tab] = await chrome.tabs.query({currentWindow: true, active : true })

  return tab.id
}

//////////////////////////////////////////////////////////////////////
// Button handlers.

const presentButtonClickHandler = async (e) => {
  const currentDelay = document.getElementById('currentDelay')
  const delay = parseInt(e.target.dataset.seconds, 10)

  currentDelay.innerText = `Выбрано: ${delay ?? '0'}ms`

  await chrome.storage.local.set({ delay })
}


const initButton = (tabId) => {
  createButton(tabId)

  chrome.tabs.onActivated.addListener(({ tabId }) => {
    createButton(tabId)
  });
}

const activeToggle = async (e) => {
  const tabId = await getCurrentTabId()
  const active = e.target.checked

  if (active) {
    chrome.storage.local.set({ showStartButton: true })
    initButton(tabId)
  } else {
    chrome.storage.local.set({ timerStart: false, showStartButton: false })
    removeButton(tabId)
  }
}


//////////////////////////////////////////////////////////////////////
// Initialization.

const init = async () => {
  const preset_buttons = document.querySelectorAll('input.preset_button')
  const stopBtn = document.getElementById('stopButton')
  const toggle = document.getElementById('toggle')
  const currentDelay = document.getElementById('currentDelay')

  for (let i = 0; i < preset_buttons.length; i++) {
    const button = preset_buttons[i]
    
    button.addEventListener('click', presentButtonClickHandler)
  }

  const { showStartButton, delay } = await chrome.storage.local.get(['showStartButton', 'delay'])

  toggle.checked = showStartButton ?? false
  currentDelay.innerText = `Выбрано: ${delay ?? '30000'}ms`

  toggle.addEventListener('click', activeToggle)

  stopBtn.addEventListener('click', async () => {
    await chrome.storage.local.set({ timerStart: false })
  })
}

init()