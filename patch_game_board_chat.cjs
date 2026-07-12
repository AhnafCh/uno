const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// We need state for chat open/close, and chat message
const chatState = `  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  
  const sendChat = (msg: string) => {
      if (!msg.trim()) return;
      socket.emit('chat_message', { roomId: gameState.id, message: msg });
      setChatMsg("");
  };

  useEffect(() => {
     if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
     }
  }, [gameState.chat?.length]);
`;

if (!code.includes('const [chatOpen')) {
   code = code.replace(/const \[showPlayerPicker, setShowPlayerPicker\] = useState/, chatState + '\n  const [showPlayerPicker, setShowPlayerPicker] = useState');
}

const chatHtml = `
      {/* Chat UI */}
      <div className={\`fixed top-0 left-0 h-full w-80 bg-black/90 border-r border-white/10 z-50 transform transition-transform duration-300 flex flex-col \${chatOpen ? 'translate-x-0' : '-translate-x-full'}\`}>
         <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="font-bold">Room Chat</h3>
            <button onClick={() => setChatOpen(false)} className="text-white/50 hover:text-white">✕</button>
         </div>
         <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm custom-scrollbar">
            {gameState.chat?.map(msg => (
                <div key={msg.id} className="bg-white/5 rounded-lg p-2">
                   <div className="text-[10px] text-white/50 mb-1">{msg.senderName}</div>
                   <div>{msg.message}</div>
                </div>
            ))}
            {(!gameState.chat || gameState.chat.length === 0) && <div className="text-white/30 text-center pt-10">No messages yet.</div>}
         </div>
         <div className="p-4 border-t border-white/10 bg-black/50 space-y-2">
            <div className="flex flex-wrap gap-1">
               {["Hello!", "Good Game!", "Oops!", "Take that! 😈", "UNO! 💥"].map(emote => (
                   <button key={emote} onClick={() => sendChat(emote)} className="bg-white/10 hover:bg-white/20 text-xs px-2 py-1 rounded transition-colors">{emote}</button>
               ))}
            </div>
            <div className="flex gap-2">
               <input type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat(chatMsg)} placeholder="Message..." className="flex-1 bg-white/10 border-none rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
               <button onClick={() => sendChat(chatMsg)} className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-bold transition-colors">Send</button>
            </div>
         </div>
      </div>
      {!chatOpen && gameState.status !== 'lobby' && (
          <button onClick={() => setChatOpen(true)} className="fixed top-4 left-4 z-40 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-bold shadow-lg backdrop-blur text-sm border border-white/10 transition-all flex items-center gap-2">
             💬 Chat
          </button>
      )}
`;

code = code.replace(/(<div className="min-h-screen bg-\[#08080a\] text-white flex flex-col font-sans relative overflow-hidden">)/, "$1" + chatHtml);

fs.writeFileSync('src/components/GameBoard.tsx', code);
