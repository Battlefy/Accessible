var acl = require('../');

var controlList = {
  "/tournaments": {
    getUserRole: function getUserRole (req, done){
      done(undefined, 'organizer');
    },
    get: ["admin", "organizer"],
    put: ["admin", "organizer"],
    post: ["admin", "organizer"],
    delete: ["admin", "organizer"]
  }
}

describe('acl', function(){

  it('can be instantiated with a controlList', function(){
    var middleware = acl(controlList);
    middleware.should.be.type('function');
  });

  it('can handle a role already defined', function(done){
    var middleware = acl(controlList);
    var res = {
      send: function() {},
      end: function() {}
    }
    var req = {
      url: '/tournaments',
      method: 'GET',
      route: { path: '/tournaments' },
      user: {
        _id: 1,
        role: 'admin'
      }
    };
    var noop = function(err) {
      if(err) {throw err}
      done();
    }
    middleware(req, res, noop);
  });

  it('can call getUserRole when no role is already defined', function(done){
    var controlList = {
      "/tournaments": {
        getRole: function getUserRole (req, callback){
          done();
        },
        get: ["admin", "organizer"],
        put: ["admin", "organizer"],
        post: ["admin", "organizer"],
        delete: ["admin", "organizer"]
      }
    }
    var middleware = acl(controlList);
    var res = {
      send: function() {},
      end: function() {}
    }
    var req = {
      url: '/tournaments',
      method: 'GET',
      route: { path: '/tournaments' },
      user: {
        _id: 1
      }
    };
    var noop = function(err) {}
    middleware(req, res, noop);
  });

});
