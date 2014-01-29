
/**
 * Create ACL middleware ment to be passed to connect
 * @param  {Object} controlList The access control list.
 * @return {Function}           The middleware function.
 */
function acl(controlList) {

  function middlware(req, res, next) {

    var method = req.method.toLowerCase();
    var routePath = req.route.path;

    if(!controlList[routePath]) { return next(); }

    var roles = controlList[routePath][method];
    var role;

    var done = function(err, role) {
      if(err) { return next(err); }
      if(typeof role != 'string') { return next(new Error('role must be a string')); }
      if(roles.indexOf(role) > -1) { next(); }
      else { res.send(402, { error: 'Not Authorized' }); }
    };

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
