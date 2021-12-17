const OPERATIONS = {
  ADD_DECIMAL: 'add_decimal',
  SUBSTRACT: 'substract',
  SUM: 'sum',
  MULTIPLIY: 'multiply',
  DIVIDE: 'divide',
  DELETE: 'delete',
  RESET: 'reset',
  GET_RESULT: 'get_result',
}

const possibleThemeClasses = {
  1: 'theme-dark',
  2: 'theme-light',
  3: 'theme-purple',
}

const UI = (() => {
  let screenValue = '0'
  const elements = {
    themeSwitch: document.querySelector('#slider'),
    screen: document.querySelector('#screen'),
    buttonsContainer: document.querySelector('#buttons_container'),
  }

  return {
    elements,
    printResult: (value) => {
      if (screenValue === '0' && value === 0) {
        elements.screen.textContent = screenValue
        return
      }

      screenValue = (+(+screenValue + value)).toString()
      elements.screen.textContent = screenValue
    },
    printDecimal: (value) => {
      screenValue = value
      elements.screen.textContent = value
    },
    clearScreen: () => {
      screenValue = '0'
    },
    getScreenValue: () => {
      return screenValue
    },
    changeTheme: (value) => {
      document.querySelector('html').classList.value =
        possibleThemeClasses[value]
      localStorage.setItem('theme', value)
    },
    getSavedTheme: () => {
      const themeSaved = localStorage.getItem('theme')
      if (!themeSaved || isNaN(themeSaved)) {
        return 1
      }
      return themeSaved
    },
    setSavedTheme: (theme) => {
      elements.themeSwitch.value = theme
    },
  }
})()

const CONTROLLER = (() => {
  const operationsAndAmounts = []
  const operations = {
    multiply: (a, b) => a * b,
    sum: (a, b) => a + b,
    divide: (a, b) => a / b,
    substract: (a, b) => a - b,
  }
  return {
    addOperation: (operation) => {
      if (
        operationsAndAmounts[operationsAndAmounts.length - 1] === operation ||
        !(operation in operations)
      ) {
        return
      }
      operationsAndAmounts.push(operation)
    },
    addAmount: (amount) => operationsAndAmounts.push(amount),
    getLastValue: () => operationsAndAmounts[operationsAndAmounts.length - 1],
    getResult: () => {
      let res = 0
      if (isNaN(operationsAndAmounts[operationsAndAmounts.length - 1])) {
        operationsAndAmounts.pop()
      }
      const resu = operationsAndAmounts.reduce((prev, curr, idx) => {
        if (idx === 1) {
          res = prev
        }

        if (isNaN(curr)) {
          res = operations[curr](res, operationsAndAmounts[idx + 1])
        }
        return res
      })
      return resu
    },
    resetOperationsAndAmounts: () => (operationsAndAmounts.length = 0),
  }
})()

const app = ((ui, ctrl) => {
  const setEventListeners = () => {
    ui.elements.buttonsContainer.addEventListener('click', (e) => {
      e.preventDefault()
      const { target } = e
      const { operation, value } = target.dataset
      if (operation === OPERATIONS.ADD_DECIMAL) {
        const screenVal = ui.getScreenValue()
        if (screenVal.includes('.')) {
          return
        }
        ui.printDecimal(`${screenVal}.`)
        return
      }

      if (operation === 'delete') {
        ui.clearScreen()
        ui.printResult(0)
      }

      if (operation) {
        if (!+ui.getScreenValue()) {
          return
        }
        ctrl.addAmount(+ui.getScreenValue())
        ctrl.addOperation(operation)
        ui.clearScreen()
      }

      if (operation === OPERATIONS.GET_RESULT) {
        const result = ctrl.getResult()
        ui.clearScreen()
        ui.printResult(result)
        ctrl.resetOperationsAndAmounts()
        return
      }

      if (operation === OPERATIONS.RESET) {
        ctrl.resetOperationsAndAmounts()
        ui.clearScreen()
        ui.printResult(0)
        return
      }

      if (target.dataset.value) {
        const screenVal = ui.getScreenValue()
        if (screenVal.includes('.')) {
          ui.printDecimal(`${screenVal}${target.dataset.value}`)
          return
        }
        ui.printResult(target.dataset.value)
      }
    })
    ui.elements.themeSwitch.addEventListener('change', (e) =>
      ui.changeTheme(+e.target.value)
    )
  }

  return {
    init: () => {
      const savedTheme = ui.getSavedTheme()
      ui.setSavedTheme(savedTheme)
      ui.changeTheme(savedTheme)
      setEventListeners()
    },
  }
})(UI, CONTROLLER)

window.addEventListener('DOMContentLoaded', app.init)
