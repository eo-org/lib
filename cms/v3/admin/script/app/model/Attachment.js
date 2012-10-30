var checkFile = function(imgUrl, ajaxUrl, postData) {
	var img = new Image();
	var result = true;
	
	img.onload = function() {
		$('img.introicon-img').attr('src', imgUrl);
	}
	img.onerror = function() {
		var p = Prompt.getInstance();
		p.showLoadingBox();
		$.ajax({
			url: ajaxUrl,
			data: postData,
			type: "POST",
			dataType: "json",
			success: function(obj) {
				$('img.introicon-img').attr('src', imgUrl);
				p.hideLoadingBox();
				if(obj.result == 'success') {
					alert('new resize image generated!');
				} else {
					alert('something is wrong, try refresh the page!');
				}
			}
		});
	};
	img.src = imgUrl;
}

Attachment = Backbone.Model.extend({defaults:{
	filetype: 'graphic',
	filename: '',
	urlname: ''
}});

AttachmentView = Backbone.View.extend({
	tagName: 'li',
	events: {
		"click .set-introicon"		: "setIntroicon",
		"click .remove-attachment"	: "removeAttachment"
	},
	render: function() {
		if(this.model.get('filetype') == 'graphic') {
			var template = _.template($('#graphic-template').html());
		} else if(this.model.get('filetype') == 'download') {
			var template = _.template($('#download-template').html());
		}
		$(this.el).html(template(this.model.toJSON()));
		
		return this;
	},
	setIntroicon: function() {
		var imgUrl = 'http://storage.aliyun.com/public-misc/' + window.SITE_FOLDER + '/_resize/' + thumbWidth + '_' + thumbHeight + '_' + this.model.get('urlname');
		var ajaxUrl = 'http://file.enorange.cn/' + window.SITE_FOLDER + '/default/file/resize';
		$('#introicon').val('_resize/' + thumbWidth + '_' + thumbHeight + '_' + this.model.get('urlname'));
		
		checkFile(imgUrl, ajaxUrl, {
			'urlname': this.model.get('urlname'),
			'toWidth': thumbWidth,
			'toHeight': thumbHeight,
			'xTime': xTime,
			'xSig': xSig
		});
	},
	removeAttachment: function() {
		alert('clicked');
	}
});

AttachmentCollectionView = Backbone.View.extend({
	el: $('div#attachment'),
	events: {
		
	},
	initialize: function() {
		graphicListEl = $(this.el).find('#graphic-list');
		downloadListEl = $(this.el).find('#download-list');
		var TH = this;
		$(this.options.attachmentObjList).each(function(i, attaObj) {
			attaModel = new Attachment();
			attaModel.set(attaObj);
			TH.append(attaModel);
		});
	},
	render: function() {
		return this;
	},
	append: function(item) {
		var view = new AttachmentView({
			model: item
		});
		
		if(item.get('filetype') == 'graphic') {
			graphicListEl.prepend(view.render().el);
		} else if(item.get('filetype') == 'download') {
			downloadListEl.prepend(view.render().el);
		}
	}
});