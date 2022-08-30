import Vue from 'vue'

const GUTTER_Y = 20
const GUTTER_X = 20
const SCROLL_BAR_SIZE = 16

const clearElem = () => {
  const text = document.querySelector('#tooltip')
  if (text) text.classList.remove('active')
}

const showElement = (event, htmlElem, textValue) => {
  const myMouseX = event.clientX
  const myMouseY = event.clientY
  const text = document.querySelector('#tooltip')
  if (text) {
    if (typeof textValue === 'string') {
      text.innerHTML = textValue
    } else {
      text.innerHTML = `<span>${textValue.text}</span> <span>${textValue.highlite}</span>`
    }
    text.classList.add('active')
    const rectText = text.getBoundingClientRect()
    const posittionY = myMouseY + GUTTER_Y
    let posittionX = myMouseX + GUTTER_X
    const coordinateXSize = posittionX + rectText.width
    if (coordinateXSize > window.innerWidth - SCROLL_BAR_SIZE) posittionX = myMouseX - rectText.width
    text.style.top = `${posittionY}px`
    text.style.left = `${posittionX}px`
  }
}

const creatTooltip = () => {
  let body = document.getElementsByTagName('body')[0]
  const text = document.createElement('p')
  text.id = 'tooltip'
  text.classList.add('v-tooltip')
  body.appendChild(text)
}

creatTooltip()

Vue.directive('tooltip', {
  bind: (el, binding) => {
    if (!binding.value) return
    el.__vHoverOver__ = (e) => {
      showElement(e, el, binding.value)
    }
    el.__vHoverLeave__ = () => {
      clearElem(el)
    }

    // Add Event Listeners
    el.addEventListener('mousemove', el.__vHoverOver__)
    el.addEventListener('mouseleave', el.__vHoverLeave__)
  },
  unbind(el, binding) {
    if (!binding.value) return
    el.removeEventListener('mousemove', el.__vHoverOver__)
    el.removeEventListener('mouseleave', el.__vHoverLeave__)
    delete el.__vHoverOver__
    delete el.__vHoverLeave__
  },
})
