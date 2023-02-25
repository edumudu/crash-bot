import { EVENT, ROUND_STATUS, ROUND_BREAK_TIME } from '../constants'
import { BetEvent, BetResult } from '../types'
import { clickInBtn, getElement, getElementByTestId, getElementByText, typeInInput } from './dom';
import { sendEventToBackground, onEvent } from '../utils'

let isScriptSetuped = false;
let roundStatus: ROUND_STATUS = ROUND_STATUS.RUNNING;

console.log('dom-bet.js Loaded')

function waitRoundEnd() {
  const previusEntriesEl = getElement('.crash-previous .entries');

  return new Promise((resolve) => {
    const mutationObserver = new MutationObserver(([mutation]) => {
      if(mutation.addedNodes.length === 0) return;

      mutationObserver.disconnect();
      resolve(null);
    })

    mutationObserver.observe(previusEntriesEl, { childList: true });
  })
}

function getLastRoundResult() {
  const lastRoundEl = getElement('.crash-previous .entries > *:first-child');
  const text = lastRoundEl.innerText.replace(/[^0-9.]/g, '');
  const crashedAt = Number(text);

  return {
    crashedAt,
  }
}

async function handleBet(message: BetEvent) {
  console.log('Starting Bet', message.payload);

  const { amount, cashoutMultiplier } = message.payload;

  const amountEl = getElementByText('Amount').nextElementSibling as HTMLInputElement;
  const autoCashoutEl = getElementByTestId<HTMLInputElement>('auto-cashout');
  const betBtnEl = getElementByText('Enter Round') as HTMLButtonElement;

  // Wait current round to end if is already running
  if (roundStatus === ROUND_STATUS.RUNNING) await waitRoundEnd();

  // Bet
  typeInInput(amountEl, amount.toString());
  typeInInput(autoCashoutEl, cashoutMultiplier.toString());
  clickInBtn(betBtnEl);

  await waitRoundEnd();
  const { crashedAt } = getLastRoundResult();

  const betResult: BetResult = {
    crashedAt,
    bet: {
      amount,
      cashoutMultiplier,
    }
  }

  sendEventToBackground(EVENT.BET_END, betResult);
  localStorage.removeItem('crash_recent_bets');
}

function monitorRoundStatus({ onRoundEnd }: { onRoundEnd?: () => void }) {
  waitRoundEnd().then(() => {
    console.log('Round ended');

    roundStatus = ROUND_STATUS.ENDED;
    onRoundEnd?.();

    setTimeout(() => {
      roundStatus = ROUND_STATUS.RUNNING;

      monitorRoundStatus({ onRoundEnd });
    }, ROUND_BREAK_TIME)
  });
}

function onFirstRoundEnd() {
  if (isScriptSetuped) return;

  sendEventToBackground(EVENT.DOM_INITIATED);
  onEvent<BetEvent>(EVENT.BET, handleBet);

  isScriptSetuped = true;
  console.log('Dom script is fully initialized')
}

window.addEventListener('load', () => monitorRoundStatus({ onRoundEnd: onFirstRoundEnd }));
