/*eslint-env node,jasmine */

const cLikeParser = require('../dist/split/multilang.js');


describe('C-like parser', () => {
	describe('when there are no comments', () => {

		it('returns an empty array', () => {

			expect(cLikeParser('')).toEqual([]);
			expect(cLikeParser('foobar')).toEqual([]);
			expect(cLikeParser('1234')).toEqual([]);

			const text = `
var path$1 = require('path');
var Handlebars = require('handlebars');
var templateDir = 'basic';
`;

			expect(cLikeParser(text)).toEqual([]);
		});

	});

	describe('when there are single-line comments', () => {

		it('returns one item of one line', () => {
			expect(cLikeParser('//foobar')).toEqual(['foobar']);
			expect(cLikeParser('// foobar')).toEqual(['foobar']);
			expect(cLikeParser('//  foobar')).toEqual(['foobar']);
			expect(cLikeParser('//\tfoobar')).toEqual(['foobar']);
			expect(cLikeParser('//\t\tfoobar')).toEqual(['foobar']);
			expect(cLikeParser(' // foobar')).toEqual(['foobar']);
			expect(cLikeParser('      // foobar')).toEqual(['foobar']);
			expect(cLikeParser('      //  foobar')).toEqual(['foobar']);

			expect(cLikeParser(`
something 
// foobar
something else
`)).toEqual(['foobar']);
		});

		it('returns one item of two lines', () => {
			expect(cLikeParser('//foo\n//bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('//foo\n// bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('// foo\n//bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('// foo\n// bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('   //foo\n   //bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('   // foo\n   // bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('\t\t//foo\n\t\t//bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('\t\t// \tfoo\n\t\t// \tbar')).toEqual(['foo\n\tbar']);

			expect(cLikeParser(`
something 
// foo
// bar
something else
`)).toEqual(['foo\nbar']);
		});

		it('returns several items', () => {
			expect(cLikeParser(`
something 
// foo
// bar
something else
// quux
lorem ipsum
`)).toEqual(['foo\nbar', 'quux']);
		});

	});

	describe('when there are block comments', () => {
		it('returns one item of one line', () => {
			expect(cLikeParser('/*foobar*/')).toEqual(['foobar']);
			//expect(cLikeParser('var /*foobar*/ foo')).toEqual(['foobar']);
			expect(cLikeParser('asdf\n/*foobar*/\nqwer')).toEqual(['foobar']);
			expect(cLikeParser('asdf\n\t/*foobar*/\n\tqwer')).toEqual(['foobar']);

			expect(cLikeParser('/*foobar   */')).toEqual(['foobar']);
			expect(cLikeParser('/*foobar  \n  */')).toEqual(['foobar']);

			expect(cLikeParser('/**foobar*/')).toEqual(['foobar']);
			expect(cLikeParser('/**foobar**/')).toEqual(['foobar*']);
			expect(cLikeParser('/*foobar**/')).toEqual(['foobar*']);
			expect(cLikeParser('/*******foobar******/')).toEqual(['****foobar*****']);
		});

		it('parses asterisk-only blocks', () => {
			expect(cLikeParser('/*************/')).toEqual(['*********']);
		});

		it('returns one item of two lines', () => {
			expect(cLikeParser('/*foo\nbar*/')).toEqual(['foo\nbar']);
			expect(cLikeParser(`
something 
/* foo
bar */
something else
`)).toEqual(['foo\nbar']);

			expect(cLikeParser(`
something 
/* 
foo
bar 
*/
something else
`)).toEqual(['foo\nbar']);

			expect(cLikeParser(`
something
/****
foo
bar
****/
something else
`)).toEqual(['*\nfoo\nbar\n**']);

			expect(cLikeParser(`
something 
/**
 * foo
 * bar 
 */
something else
`)).toEqual(['foo\nbar']);

			expect(cLikeParser(`
something 
/**
 *foo
 *bar 
 */
something else
`)).toEqual(['foo\nbar']);

			expect(cLikeParser(`
something 
/**
 * foo
 * bar 
 **/
something else
`)).toEqual(['foo\nbar']);

		});

		it('returns several items', () => {
			expect(cLikeParser(`
something 
/**
 * foo
 * bar
 */
something else
/* quux */
lorem ipsum
/*foo2
bar2*/
`)).toEqual(['foo\nbar', 'quux', 'foo2\nbar2']);

			expect(cLikeParser(`
	/* foo
	 * bar
	 * baz
	 */        
        `)).toEqual(['foo\nbar\nbaz']);


			expect(cLikeParser(`
	/* foo
	 *
	 * bar
	 */        
        `)).toEqual(['foo\n\nbar']);

			expect(cLikeParser(`
	/* foo

	 * bar
	 */        
        `)).toEqual(['foo\n\nbar']);


		});
	});

	it('Parses correctly Leaflet\'s eachLayer comment block', () => {


		expect(cLikeParser(`
	/* @method eachLayer(fn: Function, context?: Object): this
	 * Iterates over the layers of the map, optionally specifying context of the iterator function.
	 * \`\`\`
	 * map.eachLayer(function(layer){
	 *     layer.bindPopup('Hello');
	 * });
	 * \`\`\`
	 */        
        `)).toEqual([`@method eachLayer(fn: Function, context?: Object): this
Iterates over the layers of the map, optionally specifying context of the iterator function.
\`\`\`
map.eachLayer(function(layer){
    layer.bindPopup('Hello');
});
\`\`\``]);
	});

	it('Parses correctly Leaflet\'s Map leading comment block', () => {

		expect(cLikeParser(`
/*
 * @class Map
 * @aka L.Map
 * @inherits Evented
 *
 * The central class of the API — it is used to create a map on a page and manipulate it.
 *
 * @example
 *
 * \`\`\`js
 * // initialize the map on the "map" div with a given center and zoom
 * var map = L.map('map', {
 * 	center: [51.505, -0.09],
 * 	zoom: 13
 * });
 * \`\`\`
 *
 */
`)).toEqual([`@class Map
@aka L.Map
@inherits Evented

The central class of the API — it is used to create a map on a page and manipulate it.

@example

\`\`\`js
// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
	center: [51.505, -0.09],
	zoom: 13
});
\`\`\``]);

	});

	it('Parses correctly Leaflet\'s VML leading comment block', () => {

		expect(cLikeParser(`
/*
 * @class SVG
 *
 * Although SVG is not available on IE7 and IE8, these browsers support [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language), and the SVG renderer will fall back to VML in this case.
 *
 * VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
 * with old versions of Internet Explorer.
 */
`)).toEqual([`@class SVG

Although SVG is not available on IE7 and IE8, these browsers support [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language), and the SVG renderer will fall back to VML in this case.

VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
with old versions of Internet Explorer.`]);


	});

});

