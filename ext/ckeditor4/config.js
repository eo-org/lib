/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
	    { items : [ 'Source' ]},
	    { name: 'clipboard' },
	    { name: 'basicstyles', items : [ 'RemoveFormat' ] },
	    '/',
	    { items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
	    { name: 'links' },
	    { items : [ 'Table','SpecialChar','PageBreak' ] },
	    '/',
	    { items : [ 'Format','FontSize' ] },
	    { name: 'colors' },
	    { items : [ 'Maximize', 'ShowBlocks' ] }
	];
};
