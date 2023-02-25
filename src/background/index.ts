import { EVENT, CASHOUT_MULTIPLIER, START_BET_AMOUT } from '../constants';
import { Bet, BetEndEvent } from '../types';
import { onEvent, sendMessageToContentScript } from '../utils'

const previusBets: Bet[] = []
let isBetting = false;
let canBet = false;

function bet(betInfo: Bet) {
  sendMessageToContentScript(EVENT.BET, betInfo);
}

function onDOMinitiated() {
  console.log('DOM is ready');
  canBet = true;
}

function onBetEnd(message: BetEndEvent) {
  if (message.type !== EVENT.BET_END) return;

  const { crashedAt, bet: currentBet } = message.payload;
  const newBet = currentBet;
  // const shouldKeepBetting = isBetting && previusBets.length < 10;
  const shouldKeepBetting = isBetting;

  if (crashedAt > currentBet.cashoutMultiplier) {
    console.log('Bet won', currentBet);
    newBet.amount = START_BET_AMOUT;
  } else {
    console.log('Bet lost', currentBet);
    newBet.amount = currentBet.amount * CASHOUT_MULTIPLIER;
  }

  previusBets.push(currentBet);
  if (shouldKeepBetting) bet(newBet);
}

onEvent<BetEndEvent>(EVENT.DOM_INITIATED, onDOMinitiated);
onEvent<BetEndEvent>(EVENT.BET_END, onBetEnd);

chrome.action.onClicked.addListener(() => {
  if (!canBet) return;

  if (isBetting) {
    console.log('Stopping betting')
    isBetting = false;
    return;
  }

  console.log('Starting betting')
  isBetting = true;

  bet({
    amount: START_BET_AMOUT,
    cashoutMultiplier: CASHOUT_MULTIPLIER
  })
})
