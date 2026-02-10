
const api = {
  url: (() => {
    const h = window.location.hostname;
    console.log('Detected hostname:', h);
    
     if (h === 'localhost' || h === '127.0.0.1') {
      console.log('Using local API');
      return 'http://127.0.0.1:3000/api';
    }
    
    console.log('Using production API');
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
    
    const tkn = this.getTkn();
      if (!opt.noAuth && tkn) {
        hdrs.Authorization = `Bearer ${tkn}`;
      }
    
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