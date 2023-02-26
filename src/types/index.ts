import { EVENT } from '../constants'

export type Event<T extends EVENT = EVENT, K = unknown> = {
  type: T
  payload: K
}

export type Bet = {
  amount: number
  cashoutMultiplier: number
}

export type BetResult = {
  crashedAt: number,
  bet: Bet,
}

export type BetEvent = Event<EVENT.BET, Bet>;
export type StartBettingEvent = Event<EVENT.START_BETTING, Bet>;
export type StopBettingEvent = Event<EVENT.START_BETTING>;

export type AnyEvent = BetEvent | StartBettingEvent | StopBettingEvent;
