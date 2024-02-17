export function delayedInput(node: HTMLInputElement, callback: () => void) {
  let timer: NodeJS.Timeout;

  function handleInput() {
    // Clear the previous timer
    clearTimeout(timer);

    // Start a new timer
    timer = setTimeout(callback, 300);
  }

  // Attach the event listener to the input element
  node.addEventListener("input", handleInput);

  // Cleanup when the component is destroyed
  return {
    destroy() {
      node.removeEventListener("input", handleInput);
    },
  };
}
