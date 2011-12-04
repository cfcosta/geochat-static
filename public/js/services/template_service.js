var TemplateRepository = function () {};
TemplateRepository.prototype = {
	user: function (data) {
		if (data.distance !== undefined) {
			return Mustache.to_html('<li class="user" data-nickname="{{nickname}}">{{nickname}} - {{distance}}kms</li>', data);
		} else {
			return Mustache.to_html('<li class="user" data-nickname="{{nickname}}">{{nickname}} - (pending)</li>', data);
		};
	},
};

var TemplateService = function () {
	this.repository = new TemplateRepository();
};
TemplateService.prototype = {
	render: function (template, data) {
		return $(this.repository[template](data));
	}
};
