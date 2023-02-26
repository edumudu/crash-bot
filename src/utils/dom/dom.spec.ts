import { setImmediate } from 'timers/promises';

import { clickInBtn, getElement, getElementByTestId, getElementByText } from './index'

describe('clickInBtn', () => {
  let btnEl: HTMLButtonElement = document.createElement('button');
  let clickSpy = vi.spyOn(btnEl, 'click');

  beforeEach(async () => {
    btnEl = document.createElement('button');
    clickSpy = vi.spyOn(btnEl, 'click');

    document.body.innerHTML = '';
    document.body.appendChild(btnEl);
  });

  it('should click in a button if button is enabled', async () => {
    clickInBtn(btnEl)
    await setImmediate();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  describe('when button is disabled', () => {
    beforeEach(() => {
      btnEl.setAttribute('disabled', 'disabled');
    })

    it('should delay click in a button if button is disabled, and click when button is enabled', async () => {
      clickInBtn(btnEl);
      await setImmediate();
      expect(clickSpy).not.toHaveBeenCalled();

      btnEl.removeAttribute('disabled');
      await setImmediate();
      expect(clickSpy).toHaveBeenCalledTimes(1);
    })

    it('should return a promise that resolves when button is clicked', async () => {
      const promise = clickInBtn(btnEl);

      expect(promise).toBeInstanceOf(Promise);
      expect(clickSpy).not.toBeCalled();

      btnEl.removeAttribute('disabled');

      await expect(promise).resolves.toBeDefined();
      expect(clickSpy).toHaveBeenCalledTimes(1);
    })

    it('should release mutation observer when button is clicked', async () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');
      const promise = clickInBtn(btnEl);

      btnEl.removeAttribute('disabled');

      await expect(promise).resolves.toBeDefined();
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    })
  })
});

describe('getElement', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should throw if element does not exist', () => {
    expect(() => getElement('[data-test-id="test-id"]')).toThrow(Error);
  });

  it('should return an element if it exists', () => {
    const el = document.createElement('div');

    el.setAttribute('data-test-id', 'test-id');
    document.body.appendChild(el);

    const foundEl = getElement('[data-test-id="test-id"]');

    expect(foundEl).toBe(el);
  });

  it('should get element by class', () => {
    const el = document.createElement('div');

    el.classList.add('test-class');
    document.body.appendChild(el);

    const foundEl = getElement('.test-class');

    expect(foundEl).toBe(el);
  })

  it('should get element by id', () => {
    const el = document.createElement('div');

    el.setAttribute('id', 'test-id');
    document.body.appendChild(el);

    const foundEl = getElement('#test-id');

    expect(foundEl).toBe(el);
  })
})

describe('getElementByTestId', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should throw if element does not exist', () => {
    expect(() => getElementByTestId('test-id')).toThrow(Error);
  });

  it('should return an element if it exists', () => {
    const el = document.createElement('div');

    el.setAttribute('data-testid', 'test-id');
    document.body.appendChild(el);

    const foundEl = getElementByTestId('test-id');

    expect(foundEl).toBe(el);
  });
})

describe('getElementByText', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should throw if element does not exist', () => {
    expect(() => getElementByText('test-text')).toThrow(Error);
  });

  it('should return an element if it exists', () => {
    const el = document.createElement('div');

    el.textContent = 'test-text';
    document.body.appendChild(el);

    const foundEl = getElementByText('test-text');

    expect(foundEl).toBe(el);
  });
})
