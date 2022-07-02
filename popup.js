'use strict';

const  btnStyle = `
top: 50vh;
left: 95vw;
z-index: 999;
border: none;
position:fixed;
width: 40px;
height: 40px;
border-radius: 50%;
`;

const getCurrentTab = async () => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active : true })
  return tab.id
}

const create = async (timerStart) => {
  const tabId = await getCurrentTab()

  chrome.scripting.executeScript({
    target: { tabId },
    func: (timerStart, btnStyle) => {
      const existingButton = document.getElementById('actions-button')

      if (existingButton) {
        existingButton.remove()
      } else {
        const bgColor = timerStart ? 'green' : 'red'
        const style = `${btnStyle}background-color: ${bgColor};box-shadow: 0px 0px 10px 4px ${bgColor};`
        const createdButton = document.createElement('button')

        createdButton.setAttribute('id', 'actions-button')
        createdButton.setAttribute('style', style)
        createdButton.setAttribute('data-start', timerStart)

        createdButton.addEventListener('click', async () => {
          if (createdButton.dataset.start === 'true') {
            createdButton.style.backgroundColor = 'red'
            createdButton.style.boxShadow = '0px 0px 10px 4px red'
            createdButton.dataset.start = 'false'
            await chrome.storage.local.set({ timerStart: false })
          } else {
            createdButton.style.backgroundColor = 'green'
            createdButton.style.boxShadow = '0px 0px 10px 4px green'
            createdButton.dataset.start = 'true'
            await chrome.storage.local.set({ timerStart: true })
          }
        })

        document.body.appendChild(createdButton)
      }
    },
    args: [timerStart, btnStyle]
  })
}

const remove = async () => {
  const tabId = await getCurrentTab()

  chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const button = document.getElementById('actions-button')

      if (button) {
        button.remove()
      }
    },
  })
}

const presentButtonClickHandler = async (e) => {
  const currentDelay = document.getElementById('currentDelay')
  const delay = parseInt(e.target.dataset.seconds, 10)

  currentDelay.innerText = `Выбрано: ${delay ?? '-'}ms`

  await chrome.storage.local.set({ delay })
}

const activeToggle = async (e) => {
  const active = e.target.checked

  if (active) {
    await chrome.storage.local.set({ showStartButton: true })
    create(false)
  } else {
    await chrome.storage.local.set({ showStartButton: false, timerStart: false })
    remove()
  }
}

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
    await chrome.storage.local.set({ timerStart: false, showStartButton: false })
    toggle.checked = false
    remove()
  })
}
init()