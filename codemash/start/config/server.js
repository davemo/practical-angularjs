/* Define custom server-side HTTP routes for lineman's development server
 *   These might be as simple as stubbing a little JSON to
 *   facilitate development of code that interacts with an HTTP service
 *   (presumably, mirroring one that will be reachable in a live environment).
 *
 * It's important to remember that any custom endpoints defined here
 *   will only be available in development, as lineman only builds
 *   static assets, it can't run server-side code.
 *
 * This file can be very useful for rapid prototyping or even organically
 *   defining a spec based on the needs of the client code that emerge.
 *
 */

var cards = require('../data/cards.js');
express = require('express');
secret  = 'ASECRET';

var csrfValue = function(req) {
  var token = (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token'])
    || (req.headers['x-xsrf-token']);
  return token;
};

module.exports = {
  drawRoutes: function(app) {

    app.use(express.cookieParser(secret));
    app.use(express.cookieSession());
    app.use(express.csrf({value: csrfValue}));
    app.use(function(req, res, next) {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      next();
    });

    app.post('/auth/login', function(req, res) {
      if(req.body.username !== 'codemash') {
        res.json({ error: { message: 'Invalid Username or Password' }}, 401);
      } else {
        res.send(200);
      }
    });

    app.get('/expire-my-session', function(req, res) {
      res.json({error: { message: 'Session Expired' }}, 403);
    });

    app.get('/api/cards', function(req, res) {
      res.json(cards);
    });

  }
};
