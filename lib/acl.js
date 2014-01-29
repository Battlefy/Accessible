/**
 * Create ACL middleware ment to be passed to connect
 * @param  {Object} controlList The access control list.
 * @return {Function}           The middleware function.
 */
function acl(controlList) {

  function middlware(req, res, next) {
    var role = req.user.role;
    var method = req.method.toLowerCase();
    var route = req.route.path;
    var checkPermissions = controlList[role][method];

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
      console.log('in here');
      done(undefined, checkPermissions);
    }
  }

  return middlware;
};

module.exports = acl;
