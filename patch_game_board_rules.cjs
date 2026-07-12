const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const settingsUiRegex = /<div className="flex justify-between items-center pt-2 border-t border-white\/10">\s*<label className="text-sm font-bold">Enable Jump-In<\/label>[\s\S]*?<\/div>/;

const newSettingsUi = `<div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold">Enable Jump-In</label>
                    <input type="checkbox" checked={gameState.jumpInEnabled || false} onChange={(e) => socket.emit('update_settings', {roomId: gameState.id, limit: gameState.eliminationLimit, jumpIn: e.target.checked, mode: gameState.mode, rule70Enabled: gameState.rule70Enabled, forcePlayEnabled: gameState.forcePlayEnabled})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold">7-0 Rule</label>
                    <input type="checkbox" checked={gameState.rule70Enabled || false} onChange={(e) => socket.emit('update_settings', {roomId: gameState.id, limit: gameState.eliminationLimit, jumpIn: gameState.jumpInEnabled, mode: gameState.mode, rule70Enabled: e.target.checked, forcePlayEnabled: gameState.forcePlayEnabled})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold">Force Play</label>
                    <input type="checkbox" checked={gameState.forcePlayEnabled || false} onChange={(e) => socket.emit('update_settings', {roomId: gameState.id, limit: gameState.eliminationLimit, jumpIn: gameState.jumpInEnabled, mode: gameState.mode, rule70Enabled: gameState.rule70Enabled, forcePlayEnabled: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>`;

code = code.replace(settingsUiRegex, newSettingsUi);

// Also need to update the other socket.emit calls in the mode / limit buttons to include the new fields
code = code.replace(/update_settings', {roomId: gameState\.id, limit: gameState\.eliminationLimit, jumpIn: gameState\.jumpInEnabled, mode: 'normal'}/g, "update_settings', {roomId: gameState.id, limit: gameState.eliminationLimit, jumpIn: gameState.jumpInEnabled, mode: 'normal', rule70Enabled: gameState.rule70Enabled, forcePlayEnabled: gameState.forcePlayEnabled}");
code = code.replace(/update_settings', {roomId: gameState\.id, limit: gameState\.eliminationLimit, jumpIn: gameState\.jumpInEnabled, mode: 'no-mercy'}/g, "update_settings', {roomId: gameState.id, limit: gameState.eliminationLimit, jumpIn: gameState.jumpInEnabled, mode: 'no-mercy', rule70Enabled: gameState.rule70Enabled, forcePlayEnabled: gameState.forcePlayEnabled}");
code = code.replace(/update_settings', {roomId: gameState\.id, limit: parseInt\(e\.target\.value\) \|\| 0, jumpIn: gameState\.jumpInEnabled, mode: gameState\.mode}/g, "update_settings', {roomId: gameState.id, limit: parseInt(e.target.value) || 0, jumpIn: gameState.jumpInEnabled, mode: gameState.mode, rule70Enabled: gameState.rule70Enabled, forcePlayEnabled: gameState.forcePlayEnabled}");

fs.writeFileSync('src/components/GameBoard.tsx', code);
