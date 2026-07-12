export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export type CardValue = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'draw4';

export interface Card {
  id: string;
  color: CardColor;
  value: CardValue;
}

export interface Player {
  id: string; // Socket ID
  name: string;
  hand: Card[];
  isHost: boolean;
  connected: boolean;
  isBot?: boolean;
  botPersonality?: 'normal' | 'aggressive' | 'hoarder';
  unoCalled?: boolean;
  eliminated?: boolean;
  finishedPlace?: number;
}

export type GameMode = 'normal' | 'no-mercy';

export interface GameState {
  id: string;
  mode: GameMode;
  status: 'lobby' | 'playing' | 'finished';
  players: Player[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  deck: Card[];
  discardPile: Card[];
  currentColor: CardColor;
  currentPenalty: number;
  winner: string | null;
  winners: { name: string; place: number }[];
  chat: ChatMessage[];
  lastActionMessage: string;
  eliminationLimit?: number;
  winLimit?: number;
  jumpInEnabled?: boolean;
  stackingEnabled?: boolean; // For No Mercy Stacking Logic / Normal stacking
  rule70Enabled?: boolean;
  forcePlayEnabled?: boolean;
  botSpeed?: number;
  turnTimeLimit?: number;
  turnStartTime?: number;
  jumpInExpiry?: number;
  drawnCardThisTurn?: Card | null; // For Play After Draw
}

export interface ChatMessage {
  id: string;
  senderName: string;
  message: string;
  timestamp: number;
}
