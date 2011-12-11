var TemplateRepository = function () {};
TemplateRepository.prototype = {
	user: function (data) {
		return Mustache.to_html(
				'<li class="user" data-id="{{id}}" data-distance="{{distance}}">'+
					'<img class="picture" src="{{picture}}" />'+
					'<a class="nickname" href="#">{{nickname}}</a>'+
					'<span class="distance">{{distance}}kms</span>'+
				'</li>', data);
	},

	chat: function (data) {
		return Mustache.to_html(
				'<li class="chat" data-to="{{to}}">'+
					'<ul class="messages">'+
					'</ul>'+
					'<form action="" class="messagebox" data-to="{{to}}">'+
						'<input type="text" class="message-entry xlarge" name="message" />'+
						'<input type="submit" class="btn primary" value="Enviar" />'+
					'</form>'+
				'</li>', data);
	},

	message: function (data) {
		return Mustache.to_html(
				'<li class="{{sender}}">'+
					'<span class="sender">{{time}} {{from_name}}:</span>'+
					'<span class="message">{{message}}</span>'+
				'</li>', data);
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
