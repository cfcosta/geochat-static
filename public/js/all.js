var LocationService = function (geochat, callback) {
    this.setupGeolocation(_.bind(callback, geochat));
};
LocationService.prototype = {
    setupGeolocation: function (callback) {
        if (!navigator.geolocation) {
            new Error('No geolocation!');
        };

        navigator.geolocation.getCurrentPosition(callback, this.geolocationError);
    },

    geolocationError: function (error) {
    }
};

var GeoChat = function (callback) {
    this.connectionCallback = callback;
    this.startSocket();
};
GeoChat.prototype = {
    startSocket: function () {
        this.socket = new WebSocket('ws://ws.example.org:5000');

        var onOpen = _.bind(this.onOpen, this);
        var onMessage = _.bind(this.onMessage, this);

        this.socket.onopen = onOpen;
        this.socket.onmessage = onMessage;
    },

    sendLocation: function (position) {
        var locationObject = {
            method: 'location',
            data: {location: [position.coords.latitude, position.coords.longitude]}}
        this.sendObject(locationObject);
        this.connectionCallback();
    },

    changeNickname: function (nickname) {
        this.nickname = nickname;
        this.sendObject({method: 'nickname', data: {nickname: nickname}});
    },

    fetchOnlineUsers: function (callback) {
        var result = this.sendObject({method: 'client_list'});
        return callback(JSON.parse(result));
    },

    sendObject: function (object) {
        this.send(JSON.stringify(object));
    },

    send: function (message) {
        if (this.socket) {
            console.log("Sending message: " + message);
            this.socket.send(message);
        } else {
            console.log('Trying to send message, but not connected: ' + message);
        };
    },

    onOpen: function (event) {
        console.log("Connected!");
        this.changeNickname(Math.random().toString(36).substring(5));
        this.locationService = new LocationService(this, this.sendLocation);
    },

    onMessage: function (message) {
        console.log(message.data);
    }
};

$(document).ready(function () {
    geoChat = new GeoChat(function () {
        geoChat.fetchOnlineUsers(function (elements) {
            elements.each(function (index, element) {
                $('#online-users').append("<li id='user-"+index+"'>"+element.nickname+" - "+element.distance+"</li>")
            });
        });
    });
});

