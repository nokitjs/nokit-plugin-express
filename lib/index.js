var express = require("express");
var ExpressPlugin = function () { };

ExpressPlugin.prototype.init = function (server) {
    server.__createListener = server._createListener;
    server.express = express();
    var listener = server.__createListener();
    server._createListener = function () {
        return server.express;
    };
    server.use = function (expr, middleware) {
        return server.filter(expr, {
            onRequest: function (context, next) {
                return middleware(context.request, context.response, next);
            }
        });
    };
    server.on("start", function () {
        server.express.use(listener);
    });
};

module.exports = ExpressPlugin;