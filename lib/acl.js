/**
 * Create ACL middleware ment to be passed to connect
 * @param  {Object} controlList The access control list.
 * @return {Function}           The middleware function.
 */
function acl(controlList) {

  // validate args
  if(typeof controlList != 'object') {
    throw new Error('controlList must be an object');
  }

  function middlware(req, res, next) {

    // grab the method and route path
    var method = req.method.toLowerCase();
    var routePath = req.route.path;

    // call next if a ruleset is not defined for
    // this route.
    if(!controlList[routePath]) { return next(); }

    // grab the roles for the route.
    var roles = controlList[routePath][method];

    // define a function for handling the result
    // of a getRole call.
    var done = function(err, role) {
      if(err) { return next(err); }
      if(['boolean', 'string'].indexOf(typeof role) == -1) { return next(new Error('role must be a string or boolean')); }
      if(role === true || roles.indexOf(role) > -1) { next(); }
      else { res.send(401, { error: 'Not Authorized' }); }
    };

    // get the role. Use req.user.role if its set,
    // otherwise use the getRole function.
    var role;
    if(req.user && req.user.role) {
      role = req.user.role;
      done(undefined, role);
    } else {
      var getRole = controlList[routePath].getRole;
      if(typeof getRole != 'function') { return next(new Error('getRole must be a function')); }
      getRole(req, done);
    }
  }

  return middlware;
};

module.exports = acl;
