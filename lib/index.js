var express = require("express");
var ExpressPlugin = function () { };

ExpressPlugin.prototype.init = function (server) {
    server.__createListener = server._createListener;
    server.express = express();
    var middleware = server.__createListener();
    server._createListener = function () {
        return server.express;
    };
    server.on("start", function () {
        server.express.use(middleware);
    });
};

module.exports = ExpressPlugin;