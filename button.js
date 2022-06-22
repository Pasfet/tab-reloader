export const createButton = (tabId) => {
  chrome.scripting.executeScript({
    target: { tabId },
    func: async () => {
      const oldButton = document.querySelector('.fixed-button');

      if (oldButton) {
        oldButton.remove()
        return;
      }

      const { timerStart } = await chrome.storage.local.get(['timerStart'])

      const defaultCSS = `
      top: 50vh;
      left: 95vw;
      z-index: 999;
      border: none;
      position:fixed;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      `

      const bgc = `${defaultCSS}${timerStart ? 'background-color: green;box-shadow: 0px 0px 10px 4px green;' : 'background-color: red;box-shadow: 0px 0px 10px 4px red;'}`

      const newButton = document.createElement('button');
      newButton.setAttribute('class', 'fixed-button');
      newButton.setAttribute('style', bgc);
      
      let localStart = false
      newButton.addEventListener('click', (e) => {
        if (e.target.style.backgroundColor === 'green') {
          localStart = false
          newButton.setAttribute('style', `${defaultCSS}background-color: red;box-shadow: 0px 0px 10px 4px red;`)
        } else {
          localStart = true
          newButton.setAttribute('style', `${defaultCSS}background-color: green;box-shadow: 0px 0px 10px 4px green;`)
        }

        if (timerStart || !localStart) {
          chrome.storage.local.set({ timerStart: false })
        } else {
          chrome.storage.local.set({ timerStart: true })
        }
      })

      document.body.appendChild(newButton);
    },
  })
}

export const removeButton = (tabId) => {
  chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const fixedButton = document.querySelector('.fixed-button')
      if (fixedButton) {
        fixedButton.remove()
      }
    }
  })
}