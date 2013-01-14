$(document).ready(function() {
	var template = _.template($('#disqus-post-template').html());
	var postHolder = $('#disqus-post-holder');
	var disqusContent = $('#disqus-content');
	
	var resourceId = postHolder.attr('data-resource-id');
	var topic = postHolder.attr('data-topic');
	
	$.ajax({
		url: "/rest/rest-disqus-post.json",
		data: {"resourceId":  resourceId},
		dataType: "json",
		success: function(jsonObj) {
			var data = jsonObj.data;
			$.each(data, function(idx, dataItem) {
				postHolder.append(template({item:dataItem}));
			})
		}
	});
	
	$('#disqus-submit').click(function() {
		var requestData = {
			'topic': topic,
			'resourceId': resourceId,
			'content': disqusContent.val()
		};
		
		$.ajax({
			type: "POST",
			data: requestData,
			dataType: "json",
			url: "/rest/rest-disqus-post.json",
			success: function(jsonObj){
				var postHolder = $('#disqus-post-holder');
				postHolder.prepend(template({item:jsonObj}));
				disqusContent.val('');
			}
		});
	});
});