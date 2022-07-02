'use strict'

export class Button {
  scripting = null
  tabId = null

  btnStyle = `
    top: 50vh;
    left: 95vw;
    z-index: 999;
    border: none;
    position:fixed;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  `

  constructor(tabId) {
    this.scripting = chrome.scripting
    this.tabId = tabId
  }

  create(timerStart) {
    this.scripting.executeScript({
      target: { tabId: this.tabId },
      func: (timerStart, btnStyle) => {
        const existingButton = document.getElementById('actions-button')

        if (existingButton) {
          return;
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
      args: [timerStart, this.btnStyle]
    })
  }

  remove() {
    this.scripting.executeScript({
      target: { tabId: this.tabId },
      func: () => {
        const button = document.getElementById('actions-button')

        if (button) {
          button.remove()
        }
      },
    })
  }
}