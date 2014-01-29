# Accessible Basic Usage:

```
  var controlList = {
    "/tournaments": {
      getRole: function getUserRole (req, done){
        done(undefined, 'organizer');
      },
      get: ["admin", "organizer"],
      put: ["admin", "organizer"],
      post: ["admin", "organizer"],
      delete: ["admin", "organizer"]
    }
  }
  var middleware = acl(controlList);
  var express = express();
  express.use(middleware);
```


# Example of denying users that re not logged in:

```
    var controlList = {
      "/tournaments": {
        getRole: function getUserRole (req, callback){
          if(!req.user){
            callback(undefined, false);
          }
          callback(undefined, 'user');
        },
        get: ["admin", "organizer", "user"],
        put: ["admin", "organizer"],
        post: ["admin", "organizer"],
        delete: ["admin", "organizer"]
      }
    }
```
