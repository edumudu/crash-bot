/**
 * Safe query selector by test id.
 * Throws an error if the element is not found
 */
export function getElementByTestId<T extends HTMLElement>(id: string) {
  const el = document.querySelector(`[data-testid="${id}"]`);

  if (!el) throw new Error(`Element with data-testid="${id}" not found`);

  return el as T;
}

/**
 * Safe query selector by text.
 * Throws an error if the element is not found
 */
export function getElementByText(text: string) {
  const xpath = `//*[contains(text(), "${text}")]`;
  const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  if (!el) throw new Error(`Element with text="${text}" not found`);

  return el as HTMLElement;
}

/**
 * Safe query selector.
 * Throws an error if the element is not found
 */
export function getElement(selectors: string) {
  const el = document.querySelector(`${selectors}`);

  if (!el) throw new Error(`Element with selector "${selectors}" not found`);

  return el as HTMLElement;
}

/**
 * Type in an input in a way that triggers the input event
 */
export function typeInInput(inputEl: HTMLInputElement, value: string) {
  const event = new Event('input', {
    bubbles: true,
    cancelable: false,
    composed: true
  });

  inputEl.value = value;
  inputEl.dispatchEvent(event);
};

/**
 * Click in a button if is enabled
 * If not, wait for the button to be enabled, then click
 */
export async function clickInBtn(btnEl: HTMLButtonElement) {
  return new Promise((resolve) => {
    const isEnabled = () => !btnEl.disabled;

    function click() {
      btnEl.click();
      resolve(null);
    }

    if (isEnabled()) click()

    const mutationObserver = new MutationObserver(([mutation]) => {
      if(!isEnabled()) return;

      mutationObserver.disconnect();
      click();
    });

    mutationObserver.observe(btnEl, { attributes: true });
  })
}
