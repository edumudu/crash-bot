import { safeMultiply } from '../utils/math';
import { EVENT, CASHOUT_MULTIPLIER, START_BET_AMOUT } from '../constants';
import { Bet, StopBettingEvent, StartBettingEvent, BetResult } from '../types';
import { onEvent, sendMessageToContentScript } from '../utils'
import { delayExecution, randomWait } from '../utils/ramdominess';
import { createDatabase } from '../utils/database';
import { BetService } from 'src/services/bet.service';
import { logger } from '~/utils/logger';

const isSimulating = true;
export let isBetting = false;
let canBet = false;

let db: IDBDatabase;
let betService: BetService;

async function bet(betInfo: Bet) {
  return sendMessageToContentScript<BetResult>(EVENT.BET, betInfo);
}

// Calls bet function with random delays to look more human
async function delayedBet(betInfo: Bet) {
  await randomWait({ min: 500, max: 1000 * 4 });

  return sendMessageToContentScript<BetResult>(EVENT.BET, betInfo);
}


function onBetEnd({ crashedAt, bet: currentBet }: BetResult) {
  const newBet = {...currentBet};
  const shouldKeepBetting = isBetting;

  if (crashedAt > currentBet.cashoutMultiplier) {
    logger.info('Bet won', currentBet);
    newBet.amount = START_BET_AMOUT;
  } else {
    logger.info('Bet lost', currentBet);
    newBet.amount = safeMultiply(currentBet.amount, CASHOUT_MULTIPLIER);
  }

  betService.createBet({
    ...currentBet,
    isSimulated: isSimulating,
    crashedAt
  });

  if (!shouldKeepBetting) return;

  delayedBet(newBet).then(onBetEnd);
}

async function onStartBetting(message: StartBettingEvent) {
  if (!canBet || isBetting) return;

  const { amount, cashoutMultiplier } = message.payload;

  isBetting = true;
  logger.info('Bet started', {
    startAmount: amount,
    cashoutMultiplier,
  })

  const betResult = await bet({
    amount: amount,
    cashoutMultiplier: cashoutMultiplier
  });

  logger.info({ betResult })

  onBetEnd(betResult);
}

function onStopBetting() {
  logger.info('Bet stopped')
  isBetting = false;
}

function onDOMinitiated() {
  logger.info('DOM is ready');
  canBet = true;
}

onEvent(EVENT.DOM_INITIATED, onDOMinitiated);
onEvent<StartBettingEvent>(EVENT.START_BETTING, onStartBetting);
onEvent<StopBettingEvent>(EVENT.STOP_BETTING, onStopBetting);

createDatabase('crash-betting').then((database) => {
  db = database;
  betService = new BetService(db);
  logger.info('Database created');
})
