import { EVENT, ROUND_STATUS, ROUND_BREAK_TIME } from '../constants'
import { BetEvent } from '../types'
import { sendEventToBackground, onEvent } from '../utils'
import { BlazeProvider } from '~/providers/Blaze';

const isSimulating = true;
let isScriptSetuped = false;
let roundStatus: ROUND_STATUS = ROUND_STATUS.RUNNING;

const betProvider = new BlazeProvider({ isSimulating });

console.log('dom-bet.js Loaded')

async function handleBet(message: BetEvent) {
  console.log('Starting Bet', message.payload);

  const { amount, cashoutMultiplier } = message.payload;

  // Wait current round to end if is already running
  if (roundStatus === ROUND_STATUS.RUNNING) await betProvider.waitRoundEnd();

  return await betProvider.bet({ amount, cashoutMultiplier });
}

function monitorRoundStatus({ onRoundEnd }: { onRoundEnd?: () => void }) {
  betProvider.waitRoundEnd().then(() => {
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

  isScriptSetuped = true;

  sendEventToBackground(EVENT.DOM_INITIATED);
  onEvent<BetEvent>(EVENT.BET, handleBet);

  console.log('Dom script is fully initialized')
}

window.addEventListener('load', () => monitorRoundStatus({ onRoundEnd: onFirstRoundEnd }));
