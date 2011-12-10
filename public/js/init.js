var User = function() {};
User.prototype = {
    ready: function(socketService) {
        this.id = sessionStorage.getItem('id');
        this.name = sessionStorage.getItem('name');
        this.link = sessionStorage.getItem('link');
        this.picture = sessionStorage.getItem('picture');

        socketService.sendObject({
            method: 'ready',
            data: {
                id: this.id,
                name: this.name,
                location: this.location,
                link: this.link,
                picture: this.picture
            }
        });
    }
};

var GeoChat = function() {
    var geochat = this;
    var user = new User();

    var start = function() {
        this.services.location = new LocationService(this, function(position) {
            user.location = [position.coords.latitude, position.coords.longitude];
            _.bind(user.ready, user)(this.services.socket);
        });

        this.services.template = new TemplateService();
        this.render = _.bind(this.services.template.render, this.services.template);
    };

    var onMessage = function(msg) {
        console.log("Received Message: " + msg.data);
        var message = JSON.parse(msg.data);
        switch (message.method) {
        case('contact-list'):
            console.log(msg);
        }
    };

    this.services.socket = new SocketService(this, start, onMessage);
};
GeoChat.prototype = {
    services: {}
};

$(document).ready(function() {
    FB.init({
        appId: '215905315154536',
        status: true,
        cookie: true,
        xfbml: true
    });

    $('#fb-login-button').click(function() {
        FB.login(function(response) {
            if (response.session) {
                sessionStorage.setItem("oauth-uid", response.session.uid);
                sessionStorage.setItem("oauth-secret", response.session.secret);
                sessionStorage.setItem("oauth-access-token", response.session.access_token);

                FB.api('/me', function(response) {
                    sessionStorage.setItem("id", response.id);
                    sessionStorage.setItem("name", [response.first_name, response.last_name].join(' '));
                    sessionStorage.setItem("link", response.link);
                    sessionStorage.setItem("picture", 'http://graph.facebook.com/' + response.id + '/picture');
                })

                var geochat = new GeoChat();
            } else {
                console.log("Você não autorizou o bagulho, cara.")
            };
        });
    });
});

