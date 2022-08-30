type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T; 
}

export default HTMLElementEvent;