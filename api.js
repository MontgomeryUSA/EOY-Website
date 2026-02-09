// API Configuration - Cloudflare Tunnel (prod) / local dev
const api = {
  url: (() => {
    try {
      const h = window.location.hostname;
      if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '::' || h === '') {
        return 'http://127.0.0.1:3000/api';
      }
    } catch (_) {}
    return 'https://eoyapi.monty.my/api';
  })(),
  
  getTkn() {
    return localStorage.getItem('tkn');
  },
  
  setTkn(t) {
    localStorage.setItem('tkn', t);
    localStorage.setItem('uid', arguments[1] || '');
  },
  
  clr() {
    localStorage.clear();
  },
  
  async req(ep, opt = {}) {
    const hdrs = { 'Content-Type': 'application/json' };
    
    // NO AUTHORIZATION HEADER - removed to fix Cloudflare tunnel issue
    
    const cfg = {
      method: opt.m || 'GET',
      headers: hdrs
    };
    
    if (opt.body) {
      cfg.body = JSON.stringify(opt.body);
    }
    
    console.log('API:', cfg.method, this.url + ep);
    
    try {
      const res = await fetch(this.url + ep, cfg);
      const dat = await res.json();
      console.log('Response:', dat);
      return dat;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }
};