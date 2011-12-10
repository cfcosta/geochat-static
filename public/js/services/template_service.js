var TemplateRepository = function () {};
TemplateRepository.prototype = {
	user: function (data) {
		return Mustache.to_html(
				'<li class="user" data-id="{{id}}">'+
					'<a class="nickname" href="#">{{nickname}}</a>'+
					'<span class="distance">{{distance}}kms</span>'+
				'</li>', data);
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
