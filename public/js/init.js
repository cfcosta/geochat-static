var GeoChat = function () {
    var start = function () {
        this.services.socket.sendObject({
            method: 'nickname',
            data: { nickname: Math.random().toString(36).substring(5) }
        });

        this.services.location = new LocationService(this, function (position) {
            this.services.socket.sendObject({
                method: 'location',
                data: { location: [position.coords.latitude, position.coords.longitude]}
            });
        });

        var userListFunc = function () {
            this.services.socket.sendObject({method: 'client_list'})
        };
        setTimeout(_.bind(userListFunc, this), 2000)
    };

    var Templates = {
        user: '<li class="user" data-nickname="{{nickname}}">{{nickname}} - {{distance}}kms</li>',
        userPendingLocation: '<li class="user" data-nickname="{{nickname}}">{{nickname}} - (pending)</li>'
    }
    var addUser = function (element) {
        if ($('.user[data-nickname="'+element.nickname+'"]').length == 0) {
            var template = (element.distance !== undefined ? Templates.user : Templates.userPendingLocation);
            $('#online-users').append($(Mustache.to_html(template, element)));
        }
    }

    var removeUser = function (nickname) {
        $('.user[data-nickname="'+nickname+'"]').remove();
    }

    var onMessage = function (message) {
        var msg = JSON.parse(message.data);
        switch(msg.method) {
            case 'connect':
                addUser(msg.data);
            case 'disconnect':
                removeUser(msg.data.nickname);
            case 'nickname_change':
                removeUser(msg.data.before);
                addUser(msg.data);
            case 'location_change':
                removeUser(msg.data.nickname);
                addUser(msg.data);
            case 'client_list':
                _.each(msg.data.users, function (element) { addUser(element) });
        }
        console.log("Received Message: " + message.data);
    };

    this.services.socket = new SocketService(this, start, onMessage);
};
GeoChat.prototype = {
    services: {}
};

$(document).ready(function() {
    var geochat = new GeoChat();
});

