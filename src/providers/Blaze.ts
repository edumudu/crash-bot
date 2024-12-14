import { Bet, BetResult } from '~/types';
import { clickInBtn, getElement, getElementByTestId, getElementByText, typeInInput } from '~/utils/dom';

type InitParams = {
  isSimulating?: boolean;
}

export class BlazeProvider {
  private isSimulating: boolean;

  constructor({ isSimulating = false }: InitParams) {
    this.isSimulating = isSimulating;
  }

  async bet({ amount, cashoutMultiplier }: Bet) {
    const amountEl = getElementByText('Amount').nextElementSibling as HTMLInputElement;
    const autoCashoutEl = getElementByTestId<HTMLInputElement>('auto-cashout');
    const betBtnEl = getElementByText('Enter Round') as HTMLButtonElement;

    // Bet
    typeInInput(amountEl, amount.toString());
    typeInInput(autoCashoutEl, cashoutMultiplier.toString());

    if (!this.isSimulating) clickInBtn(betBtnEl);

    await this.waitRoundEnd();
    const { crashedAt } = this.getLastRoundResult();

    const betResult: BetResult = {
      crashedAt,
      bet: {
        amount,
        cashoutMultiplier,
      }
    }

    return betResult;
  }

  async waitRoundEnd() {
    const previousEntriesEl = getElement('.crash-previous .entries');

    return new Promise((resolve) => {
      const mutationObserver = new MutationObserver(([mutation]) => {
        if (mutation.addedNodes.length === 0) return;

        mutationObserver.disconnect();
        resolve(null);
      })

      mutationObserver.observe(previousEntriesEl, { childList: true });
    })
  }


  getLastRoundResult() {
    const lastRoundEl = getElement('.crash-previous .entries > *:first-child');
    const text = lastRoundEl.innerText.replace(/[^0-9.]/g, '');
    const crashedAt = Number(text);

    return {
      crashedAt,
    }
  }
}
