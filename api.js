var api = {
  prodUrl: 'https://eoyapi.monty.my/api',
  url: null,

  getOverrideBase: function () {
    var fromStorage = null;
    try {
      fromStorage = window.localStorage.getItem('apiBase');
    } catch (e) {
      fromStorage = null;
    }

    var fromQuery = null;
    try {
      if (window.URLSearchParams) {
        fromQuery = new URLSearchParams(window.location.search).get('apiBase');
      }
    } catch (e2) {
      fromQuery = null;
    }

    var fromGlobal = typeof window.__API_BASE_URL === 'string' ? window.__API_BASE_URL : null;
    return fromStorage || fromQuery || fromGlobal || null;
  },

  normalizeBase: function (base) {
    if (!base || typeof base !== 'string') return null;
    return base.replace(/\/$/, '');
  },

  uniqueList: function (arr) {
    var out = [];
    for (var i = 0; i < arr.length; i += 1) {
      if (arr[i] && out.indexOf(arr[i]) === -1) out.push(arr[i]);
    }
    return out;
  },

  buildCandidates: function () {
    var host = window.location.hostname;
    var sameOrigin = window.location.origin + '/api';
    var local = 'http://127.0.0.1:3000/api';
    var override = this.normalizeBase(this.getOverrideBase());
    var prod = this.normalizeBase(this.prodUrl);
    var prodHost = '';
    var candidates = [];

    if (prod) {
      try {
        prodHost = new URL(prod).hostname;
      } catch (e) {
        prodHost = '';
      }
    }

    if (override) candidates.push(override);

    if (host === 'localhost' || host === '127.0.0.1') {
      candidates.push(local);
      candidates.push(sameOrigin);
      if (prod) candidates.push(prod);
    } else if (prod && host !== prodHost) {
      candidates.push(prod);
      candidates.push(sameOrigin);
    } else {
      candidates.push(sameOrigin);
      if (prod) candidates.push(prod);
    }

    return this.uniqueList(candidates);
  },

  getTkn: function () {
    return localStorage.getItem('tkn');
  },

  setTkn: function (t, uid) {
    localStorage.setItem('tkn', t);
    localStorage.setItem('uid', uid || '');
  },

  clr: function () {
    localStorage.clear();
  },

  req: function (ep, opt) {
    var self = this;
    opt = opt || {};
    var hdrs = { 'Content-Type': 'application/json' };
    var tkn = self.getTkn();

    if (!opt.noAuth && tkn) {
      hdrs.Authorization = 'Bearer ' + tkn;
    }

    var cfg = {
      method: opt.m || 'GET',
      headers: hdrs
    };

    if (opt.body) {
      cfg.body = JSON.stringify(opt.body);
    }

    var candidates = self.buildCandidates();
    var idx = 0;

    function tryNext(lastErr) {
      if (idx >= candidates.length) {
        return Promise.reject(lastErr || new Error('API request failed'));
      }

      var base = candidates[idx++];
      return fetch(base + ep, cfg)
        .then(function (res) {
          return res.json();
        })
        .then(function (dat) {
          self.url = base;
          return dat;
        })
        .catch(function (err) {
          return tryNext(err);
        });
    }

    return tryNext(null);
  }
};

api.url = api.buildCandidates()[0] || api.prodUrl;
