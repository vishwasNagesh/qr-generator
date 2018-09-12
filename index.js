require('babel-polyfill');

var Promise = require('bluebird'),
	brandedQRCode = require('branded-qr-code'),
	path = require('path'),
	fs = Promise.promisifyAll(require("fs"));

function generateQr(options) {
	return new Promise(function(resolve, reject) {
		brandedQRCode.generate(options).then(function(result) {
			resolve(result);
		}).catch(function(err) {
			console.log(err);
		});
	});
}

var methods = {
	/**
	 * Creates a buffer
	 * @param options
	 * @returns {Promise}
	 */
	getBuffer: function(options) {
		return new Promise(function(resolve, reject) {
			generateQr(options).then(function(buffer) {
				resolve(buffer);
			}).catch(function(err) {
				reject(err);
			});
		});
	},
	/**
	 * Creates a image file in respective directory and folder name
	 * @param options
	 * @param directory
	 * @param folderName
	 * @param fileName
	 * @returns {Promise}
	 */
	getFile: function(options, directory, folderName, fileName) {
		return new Promise(function(resolve, reject) {
			var outfile = path.join(directory, folderName, fileName);
			generateQr(options).then(function(buffer) {
				fs.writeFileAsync(outfile, buffer).then(function(result) {
					resolve('created')
				}).catch(function(err) {
					reject(err);
				});
			}).catch(function(err) {
				reject(err);
			});
		});
	}
};

module.exports = methods;

// methods.getFile({
// 	text: 'https://www.google.com',
// 	path: '/home/cognitivecloud/Downloads/google.jpg',
// 	ratio: 6,
// 	opt: {
// 		errorCorrectionLevel: 'Q',
// 		margin: 1,
// 		version: 20
// 	},
// }, __dirname, 'output', 'sample.png').then(function(result) {
// 	console.log(result);
// }).catch(function(err) {
// 	console.log(err);
// });