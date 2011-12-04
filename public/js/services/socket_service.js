var SocketService = function(geochat, openCallback, messageCallback) {
    this.onOpen = _.bind(openCallback, geochat);
    this.onMessage = _.bind(messageCallback, geochat);
    this.start();
};

SocketService.prototype = {
    start: function() {
        this.socket = new WebSocket('ws://ws.example.org:5000');

        var onOpen = _.bind(this.onOpen, this);
        var onMessage = _.bind(this.onMessage, this);

        this.socket.onopen = onOpen;
        this.socket.onmessage = onMessage;
    },

    sendObject: function(object) {
        this.send(JSON.stringify(object));
    },

    send: function(message) {
        if (this.socket) {
            console.log("Sending message: " + message);
            this.socket.send(message);
        } else {
            console.log('Trying to send message, but not connected: ' + message);
        };
    },
};
