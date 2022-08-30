export function isSafari() {
  return /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
}
