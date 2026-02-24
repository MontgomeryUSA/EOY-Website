const exp = require('express');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const { initDb, dbp } = require('./cfg/db');

const app = exp();
const prt = Number(process.env.PORT) || 3000;
// Use var so accidental duplicate declarations during manual merges do not crash startup.
var uploadsDir = process.env.UPLDS_DIR || './uplds';

app.use(cors());
app.use(exp.json());
app.use('/uplds', exp.static(uploadsDir));

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const { rtr: authRtr } = require('./rts/auth');
const usrRtr = require('./rts/usr');
const teamRtr = require('./rts/team');

app.use('/api/auth', authRtr);
app.use('/api/usr', usrRtr);
app.use('/api/team', teamRtr);
app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: dbp, uploads: uploadsDir });
});

const start = async () => {
  try {
    await initDb();
    app.listen(prt, '0.0.0.0', () => {
      console.log(`\n✅ Server running on port ${prt}\n`);
      console.log(`DB: ${dbp}`);
      console.log(`Uploads: ${uploadsDir}`);
    });
  } catch (e) {
    console.error('Failed to initialize database:', e);
    process.exit(1);
  }
};

start();
