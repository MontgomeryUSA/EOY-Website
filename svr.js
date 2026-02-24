const exp = require('express');
const pth = require('path');
const fs = require('fs');
const cors = require('cors');
const upldsDir = process.env.UPLDS_DIR || './uplds';
const app = exp();
const prt = 3000;

// CORS is handled by Cloudflare Transform Rules
// In local dev we still need CORS to allow the frontend to hit the API.
app.use(cors());

app.use(exp.json());
if (!fs.existsSync(upldsDir)) {
  fs.mkdirSync(upldsDir, { recursive: true });
}

if (!fs.existsSync('./uplds')) {
  fs.mkdirSync('./uplds');
}

const { rtr: authRtr } = require('./rts/auth');
const usrRtr = require('./rts/usr');
const teamRtr = require('./rts/team');

app.use('/api/auth', authRtr);
app.use('/api/usr', usrRtr);
app.use('/api/team', teamRtr);
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});


start();
