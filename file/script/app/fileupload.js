$(document).ready(function() {
	var DH = $(document).height();
	var WH = $(document).width();
	var BB_LT = (WH - 600) / 2
	
	var BUTTON_UPLOAD = $("<input id='uploadfile' type='file' name='uploadfile' multiple='multiple' />");
	var BUTTON_START = $("<input id='button-start' type='button' name='start-upload' value='Start' />");
	var UL_FILE = $("<ul class='file-list'></ul>");
	var FILELIST_UPLOAD = null;
	
	function fileUpload(file, i, afterUpload)
	{
		var formData = new FormData();
		formData.append("uploadedfile", file);
		var groupId = $('.file-container').attr('groupId');
		var xhr = new XMLHttpRequest();
		xhr.open('POST', "/rest/file?groupId=" + groupId, true);
		xhr.onreadystatechange = function() {
	        if (xhr.readyState == 4) {
	            if (xhr.status == 200 || xhr.status == 304) {
	            	afterUpload(i);
	            }
	        }
	    }
		xhr.send(formData);
	};
	
	
	var afterUpload = function(i) {
		var lis = UL_FILE.find('li');
		$(lis[i]).css('color', 'red');
		$(lis[i]).attr('active', 0);
		var allFinished = true;
		_.each(lis, function(li) {
			if($(li).attr('active') == 1) {
				allFinished = false;
			}
		})
		if(allFinished) {
			WB.css('display', 'none');
			BB.css('display', 'none');
		}
	};
	
	BUTTON_START.click(function() {
		if(FILELIST_UPLOAD.length > 0) {
			_.each(FILELIST_UPLOAD, function(file, i) {
				fileUpload(file, i, afterUpload);
			});
		}
	});
	
	BUTTON_UPLOAD.change(function() {
		FILELIST_UPLOAD = document.getElementById('uploadfile').files;
		
		_.each(FILELIST_UPLOAD, function(file, i) {
			var liEl = "<li file-index='" + i + "' active='1'>" + file.name + ' <div class=\'size\'>' + (file.size/(1024 * 1024)).toFixed(2) + 'MB' + "</div></li>"
			UL_FILE.append(liEl);
		});
		
	});
	
	var WB = $('#whitebox');
	WB.css({
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: DH,
		background: 'white',
		opacity: 0.8,
		display: 'none'
	});
	var BB = $('#blackbox');
	BB.css({
		position: 'absolute',
		top: '50px',
		left: BB_LT,
		width: '600px',
		height: '500px',
		background: '#777',
		display: 'none'
	});
	WB.click(function() {
		WB.css('display', 'none');
		BB.css('display', 'none');
	});
	$('#upload-button').click(function() {
		WB.css('display', 'block');
		BB.css('display', 'block');
		BB.append(BUTTON_UPLOAD);
		BB.append(UL_FILE);
		BB.append(BUTTON_START);
	});
	
	
	
});




(function($){
	jQuery.event.props.push("dataTransfer");
	FileUploader = function(options) {
		var FU = this;
		var currentFileName = "";
		
		this.ops = {};
		this.default_opts = {
			url: '',
			refresh: 5,
			paramname: 'uploadedfile',
			maxfiles: 25,
			maxfilesize: 8, // MBs
			data: {},
			drop: empty,
			beforeEach: empty,
			afterOneSent: empty,
			afterAll: empty,
			error: function(err, file, i){alert(err);},
			uploadStarted: empty,
			uploadFinished: empty,
			progressUpdated: empty,
			speedUpdated: empty
		},
		this.errors = ["BrowserNotSupported", "TooManyFiles", "FileTooLarge"],
		this.files_count = 0,
		this.files = null;
		
		this.opts = $.extend( {}, this.default_opts, options );
		
		this.process = function(files) {
			if (files === null || files === undefined) {
				this.opts.error(errors[0]);
				return false;
			}
			this.files = files;
			var groupId = $('#uploadfile').attr('groupId');
			this.opts.data = {'groupId': groupId};
			this.upload();
			return false;
		}
		
		
		this.upload = function() {
			stop_loop = false;
			var filesDone = 0,
				filesRejected = 0,
				filesCount = this.files.length;
			
			if (filesCount > this.opts.maxfiles) {
			    this.opts.error(errors[1]);
			    return false;
			}
	
			for (var i = 0; i < filesCount; i++) {
				if (stop_loop)
					return false;
	//			try {
					if (this.opts.beforeEach(this.files[i]) != false) {
						if (i === filesCount) return;
						var reader = new FileReader(),
							max_file_size = 1048576 * this.opts.maxfilesize;
							
						reader.index = i;
						if (this.files[i].size > max_file_size) {
							this.opts.error(this.errors[2], this.files[i], i);
							filesRejected++;
							continue;
						}
						currentFileName = unescape(encodeURIComponent(this.files[i].name));;
						reader.readAsBinaryString(this.files[i]);
						reader.onloadend = this.send;
					} else {
						filesRejected++;
					}
	//			} catch(err) {
	//				this.opts.error(this.errors[0]);
	//				return false;
	//			}
			}
		}
		
		this.send = function(e) {
			var xhr = new XMLHttpRequest(),
				upload = xhr.upload,
				file = e.target,
				start_time = new Date().getTime(),
				boundary = '------multipartformboundary' + (new Date).getTime();
			var	builder = getBuilder(e.target.result, boundary);
			console.log(file);
			upload.file = file;
			upload.downloadStartTime = start_time;
			upload.currentStart = start_time;
			upload.currentProgress = 0;
			upload.startData = 0;
			upload.addEventListener("progress", progress, false);
			
			xhr.open("POST", FU.opts.url, true);
			xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' 
			    + boundary);
			    
			xhr.sendAsBinary(builder);  
			
			xhr.onload = function() {
				if (xhr.status == 200) {
					jsonObj = eval('(' + xhr.response + ')');
					FU.opts.afterOneSent(jsonObj);
				} else {
					//error  
				}  
			};
			
			function getBuilder(filedata, boundary) {
				var dashdash = '--',
					crlf = '\r\n',
					builder = '';
	
				$.each(FU.opts.data, function(i, val) {
			    	if (typeof val === 'function') val = val();
					builder += dashdash;
					builder += boundary;
					builder += crlf;
					builder += 'Content-Disposition: form-data; name="'+i+'"';
					builder += crlf;
					builder += crlf;
					builder += val;
					builder += crlf;
				});
				
				builder += dashdash;
				builder += boundary;
				builder += crlf;
				builder += 'Content-Disposition: form-data; charset: utf-8; accept-charset: utf-8; name="' + FU.opts.paramname + '"';
				builder += '; filename="' + currentFileName + '"';
				builder += crlf;
				
				builder += 'Content-Type: application/octet-stream';
				builder += crlf;
				builder += crlf; 
				
				builder += filedata;
				builder += crlf;
			    
				builder += dashdash;
				builder += boundary;
				builder += dashdash;
				builder += crlf;
				return builder;
			}
		}
	};
     
	function progress(e) {
		if (e.lengthComputable) {
			
			console.log(e.loaded + ' ' + e.total);
			
			var percentage = Math.round((e.loaded * 100) / e.total);
			if (this.currentProgress != percentage) {
				
				this.currentProgress = percentage;
//				opts.progressUpdated(this.index, this.file, this.currentProgress);
				
				var elapsed = new Date().getTime();
				var diffTime = elapsed - this.currentStart;
				if (diffTime >= 1000) {
					var diffData = e.loaded - this.startData;
					var speed = diffData / diffTime; // KB per second
////					opts.speedUpdated(this.index, this.file, speed);
					this.startData = e.loaded;
					this.currentStart = elapsed;
					console.log(speed + percentage);
				}
			}
		}
	}
    
	function getIndexBySize(size) {
		for (var i=0; i < files_count; i++) {
			if (files[i].size == size) {
				return i;
			}
		}
		
		return undefined;
	}
	 
	function empty(){}
	
	try {
		if (XMLHttpRequest.prototype.sendAsBinary) return;
		XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
		    function byteValue(x) {
		        return x.charCodeAt(0) & 0xff;
		    }
		    var ords = Array.prototype.map.call(datastr, byteValue);
		    var ui8a = new Uint8Array(ords);
		    this.send(ui8a.buffer);
		}
	} catch(e) {}
     
})(jQuery);