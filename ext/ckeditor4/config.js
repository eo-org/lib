/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
	    { items : [ 'Source' ]},
	    { name: 'clipboard' },
	    { name: 'basicstyles', items : [ 'RemoveFormat' ] },
	    { items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
	    '/',
	    { name: 'links' },
	    { items : [ 'Table','SpecialChar','PageBreak' ] },
	    { name: 'styles' },
	    { name: 'colors' },
	    { items : [ 'Maximize', 'ShowBlocks' ] }
	];
};
