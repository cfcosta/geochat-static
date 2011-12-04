var GeoChat = function () {
    this.services.location = new LocationService(this, function () {
    });
    this.services.socket = new SocketService(function () {
        this.sendObject({
            method: 'nickname',
            data: { nickname: 'FooBar' }
        });
    });
};
GeoChat.prototype = {
    services: {}
};

$(document).ready(function() {
    var geochat = new GeoChat();
});

