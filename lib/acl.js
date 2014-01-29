
/**
 * Create ACL middleware ment to be passed to connect
 * @param  {Object} controlList The access control list.
 * @return {Function}           The middleware function.
 */
function acl(controlList) {

  function middlware(req, res, next) {
    var role = req.user.role;
    var controlList = roles[role];
    var AclController = controlList[req.routeUrl];
    var method = req.method.toLowerCase();
    var checkPermissions = controlList[method];

    if(checkPermissions === undefined) { return next(); }

    var done = function(err, allow) {
      if(err) { return next(err); }
      if(typeof allow != 'boolean') { return next(); }
      if(allow) { next(); }
      else { res.send(402, { error: 'Not authorized' }) }
    };

    if(typeof checkPermissions == 'function') {
      checkPermissions(req, done);
    } else {
      done(checkPermissions);
    }
  }

  return middlware;
};