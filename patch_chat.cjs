const fs = require('fs');
let code = fs.readFileSync('src/components/Chat.tsx', 'utf8');

const regex = /return \([\s\S]*?\);\n\}/;

const newReturn = `return (
    <div className="absolute bottom-[200px] left-6 w-72 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg flex flex-col z-40 overflow-hidden shadow-2xl transition-all">
      <div 
         onClick={() => setIsOpen(!isOpen)}
         className="p-2 border-b border-white/5 text-[9px] font-bold tracking-widest text-white/30 uppercase flex justify-between items-center cursor-pointer hover:bg-white/5 transition"
      >
        <span>System Logs</span>
        <div className="flex items-center gap-2">
           {unread > 0 && !isOpen && <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unread}</span>}
           <MessageSquare size={12} className="opacity-50" />
        </div>
      </div>
      
      <AnimatePresence initial={false}>
         {isOpen && (
            <motion.div
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 160, opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="flex flex-col flex-1"
            >
              <div className="flex-1 p-2 space-y-1.5 overflow-y-auto text-[11px] custom-scrollbar">
                {gameState.chat.length === 0 ? (
                  <div className="text-white/30 italic text-center mt-2">No messages yet.</div>
                ) : (
                  gameState.chat.map(msg => {
                     const isMe = msg.senderName === gameState.players.find(p => p.id === socketId)?.name;
                     return (
                      <div key={msg.id} className={\`\${isMe ? 'text-blue-400' : 'text-white/80'}\`}>
                        <span className="font-bold opacity-70">[{msg.senderName}]:</span> {msg.message}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="p-2 border-t border-white/5">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Press Enter to chat..."
                  className="w-full bg-white/5 px-2 py-1.5 rounded border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </form>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}`;

code = code.replace(regex, newReturn);
// Let's also change the initial state to true
code = code.replace(/const \[isOpen, setIsOpen\] = useState\(false\);/, "const [isOpen, setIsOpen] = useState(true);");

fs.writeFileSync('src/components/Chat.tsx', code);
