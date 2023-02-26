import { EVENT, CASHOUT_MULTIPLIER, START_BET_AMOUT } from '../constants';
import { Bet, StopBettingEvent, StartBettingEvent, BetResult } from '../types';
import { onEvent, sendMessageToContentScript } from '../utils'

const isSimulating = true;
export let isBetting = false;
let canBet = false;

async function bet(betInfo: Bet) {
  return sendMessageToContentScript<BetResult>(EVENT.BET, betInfo);
}

function onBetEnd({ crashedAt, bet: currentBet }: BetResult) {
  const newBet = currentBet;
  const shouldKeepBetting = isBetting;

  if (crashedAt > currentBet.cashoutMultiplier) {
    console.log('Bet won', currentBet);
    newBet.amount = START_BET_AMOUT;
  } else {
    console.log('Bet lost', currentBet);
    newBet.amount = currentBet.amount * CASHOUT_MULTIPLIER;
  }

  if (!shouldKeepBetting) return;

  bet(newBet).then(onBetEnd);
}

async function onStartBetting(message: StartBettingEvent) {
  if (!canBet || isBetting) return;

  const { amount, cashoutMultiplier } = message.payload;

  isBetting = true;
  console.log('Bet started', {
    startAmount: amount,
    cashoutMultiplier,
  })

  const betResult = await bet({
    amount: amount,
    cashoutMultiplier: cashoutMultiplier
  });

  console.log({betResult})

  onBetEnd(betResult);
}

function onStopBetting() {
  console.log('Bet stopped')
  isBetting = false;
}

function onDOMinitiated() {
  console.log('DOM is ready');
  canBet = true;
}

onEvent(EVENT.DOM_INITIATED, onDOMinitiated);
onEvent<StartBettingEvent>(EVENT.START_BETTING, onStartBetting);
onEvent<StopBettingEvent>(EVENT.STOP_BETTING, onStopBetting);
