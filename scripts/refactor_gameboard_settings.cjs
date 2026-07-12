const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const helper = `
  const handleUpdateSettings = (updates: any) => {
    socket.emit('update_settings', {
      roomId: gameState.id,
      limit: gameState.eliminationLimit || 0,
      jumpIn: gameState.jumpInEnabled || false,
      mode: gameState.mode,
      rule70Enabled: gameState.rule70Enabled || false,
      forcePlayEnabled: gameState.forcePlayEnabled || false,
      botSpeed: gameState.botSpeed || 1500,
      turnTimeLimit: gameState.turnTimeLimit || 0,
      ...updates
    });
  };
`;

code = code.replace(/const \{ playSound \} = useAudio\(\);/, "const { playSound } = useAudio();" + helper);

// Mode buttons
code = code.replace(/socket\.emit\('update_settings', \{roomId: gameState\.id, limit: gameState\.eliminationLimit, jumpIn: gameState\.jumpInEnabled, mode: 'normal', rule70Enabled: gameState\.rule70Enabled, forcePlayEnabled: gameState\.forcePlayEnabled\}\)/g, "handleUpdateSettings({mode: 'normal'})");
code = code.replace(/socket\.emit\('update_settings', \{roomId: gameState\.id, limit: gameState\.eliminationLimit, jumpIn: gameState\.jumpInEnabled, mode: 'no-mercy', rule70Enabled: gameState\.rule70Enabled, forcePlayEnabled: gameState\.forcePlayEnabled\}\)/g, "handleUpdateSettings({mode: 'no-mercy'})");

// Elimination limit
code = code.replace(/socket\.emit\('update_settings', \{roomId: gameState\.id, limit: parseInt\(e\.target\.value\) \|\| 0, jumpIn: gameState\.jumpInEnabled, mode: gameState\.mode, rule70Enabled: gameState\.rule70Enabled, forcePlayEnabled: gameState\.forcePlayEnabled\}\)/g, "handleUpdateSettings({limit: parseInt(e.target.value) || 0})");

// Jump in
code = code.replace(/socket\.emit\('update_settings', \{roomId: gameState\.id, limit: gameState\.eliminationLimit, jumpIn: e\.target\.checked, mode: gameState\.mode, rule70Enabled: gameState\.rule70Enabled, forcePlayEnabled: gameState\.forcePlayEnabled\}\)/g, "handleUpdateSettings({jumpIn: e.target.checked})");

// Rule 7-0
code = code.replace(/socket\.emit\('update_settings', \{roomId: gameState\.id, limit: gameState\.eliminationLimit, jumpIn: gameState\.jumpInEnabled, mode: gameState\.mode, rule70Enabled: e\.target\.checked, forcePlayEnabled: gameState\.forcePlayEnabled\}\)/g, "handleUpdateSettings({rule70Enabled: e.target.checked})");

// Force play
code = code.replace(/socket\.emit\('update_settings', \{roomId: gameState\.id, limit: gameState\.eliminationLimit, jumpIn: gameState\.jumpInEnabled, mode: gameState\.mode, rule70Enabled: gameState\.rule70Enabled, forcePlayEnabled: e\.target\.checked\}\)/g, "handleUpdateSettings({forcePlayEnabled: e.target.checked})");

fs.writeFileSync('src/components/GameBoard.tsx', code);
