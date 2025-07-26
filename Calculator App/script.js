class SimpleCalculator {
  constructor() {
    this.display = document.getElementById("display")
    this.historyDisplay = document.getElementById("history")
    this.expressionDisplay = document.getElementById("expression")

    this.currentValue = "0"
    this.previousValue = null
    this.operator = null
    this.waitingForOperand = false
    this.history = ["Ready"]
    this.soundEnabled = true
    this.theme = "dark"

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.updateDisplay()
    this.loadSettings()
  }

  setupEventListeners() {
    // Button clicks
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleButtonClick(e.target)
      })
    })

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      this.handleKeyPress(e)
    })

    // Control buttons
    document.getElementById("theme-toggle").addEventListener("click", () => {
      this.toggleTheme()
    })

    document.getElementById("sound-toggle").addEventListener("click", () => {
      this.toggleSound()
    })
  }

  handleButtonClick(button) {
    const action = button.dataset.action
    const number = button.dataset.number

    this.playSound("click")
    this.addButtonFeedback(button)

    if (number !== undefined) {
      this.inputNumber(number)
    } else if (action) {
      this.handleAction(action)
    }
  }

  handleAction(action) {
    switch (action) {
      case "clear":
        this.clear()
        break
      case "sign":
        this.toggleSign()
        break
      case "percent":
        this.percent()
        break
      case "decimal":
        this.inputDecimal()
        break
      case "add":
      case "subtract":
      case "multiply":
      case "divide":
        this.inputOperator(action)
        break
      case "equals":
        this.calculate()
        break
    }
  }

  inputNumber(num) {
    if (this.waitingForOperand) {
      this.currentValue = num
      this.waitingForOperand = false
    } else {
      this.currentValue = this.currentValue === "0" ? num : this.currentValue + num
    }
    this.updateDisplay()
    this.updateExpression()
  }

  inputDecimal() {
    if (this.waitingForOperand) {
      this.currentValue = "0."
      this.waitingForOperand = false
    } else if (this.currentValue.indexOf(".") === -1) {
      this.currentValue += "."
    }
    this.updateDisplay()
  }

  inputOperator(nextOperator) {
    const inputValue = Number.parseFloat(this.currentValue)

    if (this.previousValue === null) {
      this.previousValue = inputValue
    } else if (this.operator) {
      const currentValue = this.previousValue || 0
      const newValue = this.performCalculation()

      this.currentValue = String(newValue)
      this.previousValue = newValue
      this.addToHistory(`${currentValue} ${this.getOperatorSymbol(this.operator)} ${inputValue} = ${newValue}`)
    }

    this.waitingForOperand = true
    this.operator = nextOperator
    this.updateExpression()
  }

  calculate() {
    const inputValue = Number.parseFloat(this.currentValue)

    if (this.previousValue !== null && this.operator) {
      const newValue = this.performCalculation()
      const expression = `${this.previousValue} ${this.getOperatorSymbol(this.operator)} ${inputValue} = ${newValue}`

      this.currentValue = String(newValue)
      this.previousValue = null
      this.operator = null
      this.waitingForOperand = true

      this.addToHistory(expression)
      this.updateDisplay()
      this.updateExpression()
      this.playSound("equals")
      this.addCalculationEffect()
    }
  }

  performCalculation() {
    const prev = this.previousValue
    const current = Number.parseFloat(this.currentValue)

    switch (this.operator) {
      case "add":
        return prev + current
      case "subtract":
        return prev - current
      case "multiply":
        return prev * current
      case "divide":
        return current !== 0 ? prev / current : 0
      default:
        return current
    }
  }

  clear() {
    this.currentValue = "0"
    this.previousValue = null
    this.operator = null
    this.waitingForOperand = false
    this.updateDisplay()
    this.updateExpression()
    this.playSound("clear")
    this.addClearEffect()
  }

  toggleSign() {
    this.currentValue = String(Number.parseFloat(this.currentValue) * -1)
    this.updateDisplay()
    this.playSound("function")
  }

  percent() {
    this.currentValue = String(Number.parseFloat(this.currentValue) / 100)
    this.updateDisplay()
    this.playSound("function")
  }

  updateDisplay() {
    const value = Number.parseFloat(this.currentValue)
    const formattedValue = this.formatNumber(value)
    this.display.value = formattedValue

    // Subtle display animation
    this.display.style.transform = "scale(1.01)"
    setTimeout(() => {
      this.display.style.transform = "scale(1)"
    }, 100)
  }

  updateExpression() {
    if (this.operator && this.previousValue !== null) {
      this.expressionDisplay.textContent = `${this.previousValue} ${this.getOperatorSymbol(this.operator)}`
    } else {
      this.expressionDisplay.textContent = ""
    }
  }

  formatNumber(num) {
    if (isNaN(num)) return "0"

    const str = num.toString()
    if (str.length > 12) {
      return num.toExponential(6)
    }

    return str
  }

  getOperatorSymbol(operator) {
    const symbols = {
      add: "+",
      subtract: "−",
      multiply: "×",
      divide: "÷",
    }
    return symbols[operator] || operator
  }

  addToHistory(entry) {
    this.history.unshift(entry)
    if (this.history.length > 10) {
      this.history.pop()
    }
    this.updateHistoryDisplay()
  }

  updateHistoryDisplay() {
    const latestEntry = this.history[0] || ""
    this.historyDisplay.innerHTML = `<div class="history-item">${latestEntry}</div>`
  }

  // UI Functions
  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", this.theme)

    const themeIcon = document.querySelector(".theme-icon")
    themeIcon.textContent = this.theme === "dark" ? "☀️" : "🌙"

    this.saveSettings()
    this.playSound("click")
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled
    const soundIcon = document.querySelector(".sound-icon")
    soundIcon.textContent = this.soundEnabled ? "🔊" : "🔇"

    this.saveSettings()
    if (this.soundEnabled) this.playSound("click")
  }

  // Visual Effects
  addButtonFeedback(button) {
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      button.style.transform = ""
    }, 100)
  }

  addCalculationEffect() {
    const calculator = document.querySelector(".calculator")
    calculator.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.1)"

    setTimeout(() => {
      calculator.style.boxShadow = ""
    }, 800)
  }

  addClearEffect() {
    const display = document.querySelector(".display-section")
    display.style.background = "var(--bg-secondary)"
    display.style.transform = "scale(0.98)"

    setTimeout(() => {
      display.style.transform = "scale(1)"
    }, 200)
  }

  // Sound System
  playSound(type) {
    if (!this.soundEnabled) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    const frequencies = {
      click: 800,
      equals: 600,
      clear: 400,
      function: 700,
    }

    oscillator.frequency.setValueAtTime(frequencies[type] || 600, audioContext.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  // Keyboard Support
  handleKeyPress(e) {
    const key = e.key

    if (key >= "0" && key <= "9") {
      this.inputNumber(key)
      this.playSound("click")
    } else if (key === ".") {
      this.inputDecimal()
      this.playSound("click")
    } else if (key === "+") {
      this.inputOperator("add")
      this.playSound("click")
    } else if (key === "-") {
      this.inputOperator("subtract")
      this.playSound("click")
    } else if (key === "*") {
      this.inputOperator("multiply")
      this.playSound("click")
    } else if (key === "/") {
      e.preventDefault()
      this.inputOperator("divide")
      this.playSound("click")
    } else if (key === "Enter" || key === "=") {
      e.preventDefault()
      this.calculate()
    } else if (key === "Escape" || key === "c" || key === "C") {
      this.clear()
    } else if (key === "Backspace") {
      this.backspace()
    }
  }

  backspace() {
    if (this.currentValue.length > 1) {
      this.currentValue = this.currentValue.slice(0, -1)
    } else {
      this.currentValue = "0"
    }
    this.updateDisplay()
    this.playSound("click")
  }

  // Settings
  saveSettings() {
    const settings = {
      theme: this.theme,
      soundEnabled: this.soundEnabled,
    }
    localStorage.setItem("simple-calculator-settings", JSON.stringify(settings))
  }

  loadSettings() {
    const saved = localStorage.getItem("simple-calculator-settings")
    if (saved) {
      const settings = JSON.parse(saved)
      this.theme = settings.theme || "dark"
      this.soundEnabled = settings.soundEnabled !== false

      document.documentElement.setAttribute("data-theme", this.theme)
      document.querySelector(".theme-icon").textContent = this.theme === "dark" ? "☀️" : "🌙"
      document.querySelector(".sound-icon").textContent = this.soundEnabled ? "🔊" : "🔇"
    }
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SimpleCalculator()
})
