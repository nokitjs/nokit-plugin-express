var express = require("express");

var ExpressPlugin = function() { };

ExpressPlugin.prototype.init = function(server) {
    server.__createListener = server._createListener;
    server.app = express();
    var listener = server.__createListener();
    server._createListener = function() {
        return server.app;
    };
    nokit.Response.prototype.__proto__ = server.app.response;
    nokit.Request.prototype.__proto__ = server.app.request;
    server.use = function(expr, middleware) {
        return server.filter(expr, {
            onRequest: function(context, next) {
                return middleware(context.request, context.response, next);
            }
        });
    };
    server.on("start", function() {
        server.app.use(listener);
    });
};

module.exports = ExpressPlugin;