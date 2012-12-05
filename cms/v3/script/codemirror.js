var codeMirrorEditor = null;
$(document).on('AdminControlLoad', function() {
	var editor = document.getElementById('codemirror-editor');
	codeMirrorEditor = CodeMirror.fromTextArea(editor, {
		lineNumbers: true,
		matchBrackets: true,
		indentUnit: 4,
		indentWithTabs: true,
		dragDrop: false,
		onBlur: function() {
			codeMirrorEditor.save();
		}
	});
});

$(document).on('AdminControlUnload', function() {
	var codeMirrorEditor = null;
});