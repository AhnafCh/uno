/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { socket } from './socket.ts';
import { GameState, GameMode } from './types.ts';
import Lobby from './components/Lobby.tsx';
import GameBoard from './components/GameBoard.tsx';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('state_update', (state: GameState) => {
      setGameState(state);
      setError(null);
    });
    socket.on('error', (msg: string) => setError(msg));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('state_update');
      socket.off('error');
    };
  }, []);

  const handleJoin = (roomId: string, name: string, mode: GameMode) => {
    socket.emit('join_room', { roomId, name, mode });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans overflow-hidden flex flex-col">
      {!isConnected && (
        <div className="bg-red-500 text-white text-center py-1 text-xs">
          Connecting to server...
        </div>
      )}
      {error && (
        <div className="bg-red-500 text-white text-center p-2 fixed top-0 w-full z-50 animate-bounce">
          {error}
          <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
        </div>
      )}
      
      {!gameState ? (
        <Lobby onJoin={handleJoin} />
      ) : (
        <GameBoard gameState={gameState} socketId={socket.id || ''} />
      )}
    </div>
  );
}
