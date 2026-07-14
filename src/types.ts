export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export type CardValue = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'skip' | 'reverse' | 'draw2' | 'draw4' | 'discard_all' | 'skip_everyone' | 'wild' | 'wild_reverse_draw4' | 'wild_draw6' | 'wild_draw10' | 'wild_color_roulette';

export interface Card {
  id: string;
  color: CardColor;
  value: CardValue;
}

export interface Player {
  id: string; // Socket ID
  name: string;
  avatar: string;
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

export function getDrawValue(value: CardValue): number {
    switch (value) {
        case 'draw2': return 2;
        case 'draw4': return 4;
        case 'wild_reverse_draw4': return 4;
        case 'wild_draw6': return 6;
        case 'wild_draw10': return 10;
        default: return 0;
    }
}
