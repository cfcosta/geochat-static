var TemplateRepository = function () {};
TemplateRepository.prototype = {
	userTemplate:
		'<li class="user" data-id="{{id}}" data-distance="{{distance}}">'+
			'<img class="picture" src="{{picture}}" />'+
			'<a class="nickname" href="#">{{nickname}}</a>'+
			'<span class="distance">{{distance}}kms</span>'+
		'</li>',

	user: function (data) {
		return Mustache.to_html(this.userTemplate, data);
	},

	chatTemplate:
		'<li class="chat" data-to="{{to}}">'+
			'<ul class="messages">'+
			'</ul>'+
			'<form action="" class="messagebox" data-to="{{to}}">'+
				'<input type="text" class="message-entry xlarge" name="message" />'+
				'<input type="submit" class="btn primary" value="Enviar" />'+
			'</form>'+
		'</li>',

	chat: function (data) {
		return Mustache.to_html(this.chatTemplate, data);
	},

	eventMessageTemplate:
		'<li class="event">'+
			'{{time}} {{name}} {{event}}.'+
		'</li>',

	eventMessage: function (data) {
		return Mustache.to_html(this.eventMessageTemplate, data);
	},

	messageTemplate:
		'<li class="{{sender}}">'+
			'<span class="sender">{{time}} {{from_name}}: </span>'+
			'<span class="message">{{message}}</span>'+
		'</li>',

	message: function (data) {
		return Mustache.to_html(this.messageTemplate, data);
	},
	
	messageCount: function (data) {
		return Mustache.to_html('<span class="label important">{{count}}</span>')
	}
};

var TemplateService = function () {
	this.repository = new TemplateRepository();
};
TemplateService.prototype = {
	render: function (template, data) {
		return $(this.repository[template](data));
	}
};
