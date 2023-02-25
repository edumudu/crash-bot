export enum EVENT {
  BET = 'bet',
  DOM_INITIATED = 'dom-initiated',
  BET_END = 'bet-end'
}

export enum ROUND_STATUS {
  RUNNING = 'running',
  ENDED = 'ended'
}

export const ROUND_BREAK_TIME = 10 * 1000;
export const START_BET_AMOUT = 0.1;
export const CASHOUT_MULTIPLIER = 2;
