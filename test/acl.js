var acl = require('../');

var controlList = {
  "/tournaments": {
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

  it('can call getRole when no role is already defined', function(done){
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

  it('can call next middleware when role is in METHOD array', function(done){
    var controlList = {
      "/tournaments": {
        getRole: function getUserRole (req, callback){
          callback(undefined, 'organizer');
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
    var noop = function(err) {
      if(err) { throw err }
      done();
    }
    middleware(req, res, noop);
  });


  it('can send not authorized when getRole returns false', function(done){
    var controlList = {
      "/tournaments": {
        getRole: function getUserRole (req, callback){
          if(!req.user){
            callback(undefined, false);
          }
          callback(undefined, 'organizer');
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
      route: { path: '/tournaments' }
    };
    var noop = function(err) {
      if(err) { throw err }
      done();
    }
    middleware(req, res, noop);
  });

  it('can error when getRole doesnt return a string for a role', function(done){
    var controlList = {
      "/tournaments": {
        getRole: function getUserRole (req, callback){
          callback(undefined, {});
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
    var noop = function(err) {
      if(err) {
        done();
      }
    }
    middleware(req, res, noop);
  });

  it('can handle error cases when role returned is not in METHOD array', function(done){
    var controlList = {
      "/tournaments": {
        getRole: function getUserRole (req, callback){
          callback(undefined, 'organizer');
        },
        get: ["admin"]
      }
    }
    var middleware = acl(controlList);
    var res = {
      send: function(statusCode, body) {
        statusCode.should.equal(401);
        body.error.should.equal('Not Authorized');
        done();
      },
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
    var next = function(err) {};

    middleware(req, res, next);
  });


  it('handles the case where * is provided instead of a list of allowed roles', function(done) {

    var controlList = {
      "/thing": {
        getRole: function(req, cb) { cb(undefined, 'doesnt matter'); },
        get: '*'
      }
    };

    var middleware = acl(controlList);

    var res = {};

    var req = {
      url: '/thing',
      method: 'GET',
      route: { path: '/thing' },
      user: {
        _id: 11231231
      }
    };

    var next = function(err) {
      (err === undefined).should.be.OK;
      done();
    };

    middleware(req, res, next);
  });
});
