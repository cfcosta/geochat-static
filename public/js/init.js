var User = function() {};
User.prototype = {
    ready: function(geochat, socketService) {
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

        $('.user').live('click', function () {
            var userId = $(this).data('id');
            if($('.chat[data-to='+ userId +']').length < 1) {
                _.bind(geochat.createChat, geochat)({ to: userId }, socketService);
            }
        });
    }
};

var GeoChat = function() {
    var geochat = this;
    this.user = new User();

    var start = function() {
        this.services.location = new LocationService(this, function(position) {
            this.user.location = [position.coords.latitude, position.coords.longitude];
            _.bind(this.user.ready, this.user)(this, this.services.socket);
        });

        this.services.template = new TemplateService();
        this.render = _.bind(this.services.template.render, this.services.template);
    };

    var onMessage = function(msg) {
        console.log("Received Message: " + msg.data);
        var message = JSON.parse(msg.data);
        switch (message.method) {
            case 'contact-list':
                var clients = _.each(message.data.clients, _.bind(function (client) {
                    this.render('user', client).appendTo('#contact-list');
                }, this));

                $('.user').sort(function(a,b) {
                    return parseFloat(a.data('distance')) > parseFloat(b.data('distance')) ? 1 : -1
                });

                break;
            case 'connect':
                if ($('.chat[data-to="'+message.data.id+'"]').length > 0) {
                    var data = { time: new Date().strftime("%T"), name: message.data.nickname, event: "acabou de entrar"}
                    this.render('eventMessage', data).appendTo('.chat[data-to="'+message.data.id+'"] > .messages');
                };
                this.render('user', message.data).appendTo('#contact-list');
                break;
            case 'disconnect':
                $('.user[data-id="'+ message.data.id +'"]').remove();

                if ($('.chat[data-to="'+message.data.id+'"]').length > 0) {
                    var data = { time: new Date().strftime("%T"), name: message.data.nickname, event: "acabou de sair"}
                    this.render('eventMessage', data).appendTo('.chat[data-to="'+message.data.id+'"] > .messages');
                };

                break;
            case 'private-message':
                if($('.chat[data-to='+ message.data.from +']').length < 1) {
                    this.createChat({to: message.data.from});
                }

                message.data.sender = "their";
                var messages = $('.chat[data-to='+ message.data.from +']').find('.messages');
                this.render('message', message.data).appendTo(messages);

                break;
            default:
                console.log("Received unknown message: " + msg.data);
        }
    };

    this.services.socket = new SocketService(this, start, onMessage);
};
GeoChat.prototype = {
    services: {},
    createChat: function (data, socketService) {
        var geochat = this;
        var chat = this.render('chat', data);
        var messagebox = chat.find('.messagebox');
        $('#chat-content').append(chat);

        messagebox.submit(function () {
            var text = $(this).find('.message-entry').val();
            $(this).find('.message-entry').val('');

            var now = new Date().strftime("%T")
            var message = {sender: 'mine', time: now, from_name: sessionStorage.getItem('name'), message: text};

            var messages = $('.chat[data-to='+ $(this).data('to') +']').find('.messages');
            geochat.render('message', message).appendTo(messages);

            socketService.sendObject({
                method: 'private-message',
                data: {
                    from: sessionStorage.getItem('id'),
                    to: $(this).data('to'),
                    text: text
                }
            });

            return false;
        });
    }
};

$(document).ready(function() {
    FB.init({
        appId: '215905315154536',
        status: true,
        cookie: true,
        xfbml: true
    });

    $('#fb-login-button').button();
    $('#fb-login-button').click(function() {
        $(this).button('loading');
        var button = this;

        FB.login(function(response) {
            if (response.session) {
                sessionStorage.setItem("oauth-uid", response.session.uid);
                sessionStorage.setItem("oauth-secret", response.session.secret);
                sessionStorage.setItem("oauth-access-token", response.session.access_token);

                FB.api('/me', _.bind(function(response) {
                    sessionStorage.setItem("id", response.id);
                    sessionStorage.setItem("name", [response.first_name, response.last_name].join(' '));
                    sessionStorage.setItem("link", response.link);
                    sessionStorage.setItem("picture", 'http://graph.facebook.com/' + response.id + '/picture');

                    $(this).hide();
                }, button));

                var geochat = new GeoChat();
            } else {
                console.log("Você não autorizou o bagulho, cara.")
            };
        });
    });
});

