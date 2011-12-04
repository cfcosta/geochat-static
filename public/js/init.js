var GeoChat = function () {
    this.services.socket = new SocketService(this, function () {
        this.services.socket.sendObject({
            method: 'nickname',
            data: { nickname: 'FooBar' }
        });

        this.services.location = new LocationService(this, function (position) {
            this.services.socket.sendObject({
                method: 'location',
                data: { location: [position.coords.latitude, position.coords.longitude]}
            });
        });
    });
};
GeoChat.prototype = {
    services: {}
};

$(document).ready(function() {
    var geochat = new GeoChat();
});

