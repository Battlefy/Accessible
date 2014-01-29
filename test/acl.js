var acl = require('../');

var controlList = {
  "admin": {
    "/tournaments": {
      get: true,
      delete: false,
      post: true,
      put: function(req, done) {
        done(undefined, true);
      }
    }
  },
  "organizer": {
    "/tournaments/:id": {
      get: true,
      delete: false,
      post: true
    }
  },
}

describe('acl', function(){

  it('can be instantiated with a controlList', function(){
    var middleware = acl(controlList);
    middleware.should.be.type('function');
  });

  it('can handle an admin route to GET /tournaments', function(done){
    var middleware = acl(controlList);
    var req = { url: '/tournaments', method: 'GET', route: { path: '/tournaments' }};
    var res = { end: done }
    req.user =  { role: 'admin' };
    middleware(req, res, done);
  });

  it('can handle an async admin route to PUT /tournaments', function(done){
    var middleware = acl(controlList);
    var req = { url: '/tournaments', method: 'PUT', route: { path: '/tournaments' }};
    var res = { end: done }
    req.user =  { role: 'admin' };
    middleware(req, res, done);
  });

});
