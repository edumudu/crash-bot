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
export type BetEndEvent = Event<EVENT.BET_END, BetResult>;

export type AnyEvent = BetEvent | BetEndEvent;
