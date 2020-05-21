/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/processors.worklet.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/processors.worklet.js":
/*!***********************************!*\
  !*** ./src/processors.worklet.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/// <reference path=\"./types.d.ts\" />\n\nconst carry = Symbol()\n\nclass NoopProcessor extends AudioWorkletProcessor {\n    /**\n     * @param {Float32Array[][]} inputs\n     * @param {Float32Array[][]} outputs\n     */\n    process(inputs, outputs) {\n        const input = inputs[0]\n        const output = outputs[0]\n\n        for (let channel = 0; channel < input.length; channel++) {\n            output[channel].set(input[channel])\n        }\n        return true\n    }\n}\nregisterProcessor('noop', NoopProcessor)\n\nclass Mono extends AudioWorkletProcessor {\n    /**\n     * @param {Float32Array[][]} inputs\n     * @param {Float32Array[][]} outputs\n     */\n    process(inputs, outputs) {\n        // This processor has only one input and one output.\n        const input = inputs[0]\n        const output = outputs[0]\n\n        for (let channel = 0; channel < input.length; channel++) {\n            for (let sample = 0; sample < input[0].length; sample++) {\n                // Mono: (L + R) / 2\n                // More generally: 1/n * (\\sum_{i = 0}^n C_i)\n                output[0][sample] += input[channel][sample] * (1 / input.length)\n            }\n            if (channel !== 0) {\n                output[channel].set(output[0])\n            }\n        }\n\n        return true\n    }\n}\nregisterProcessor('mono', Mono)\n\nclass DerivativeProcessor extends AudioWorkletProcessor {\n    constructor(options) {\n        super()\n        this[carry] = new Float32Array(options.processorOptions.maxChannels)\n    }\n    \n    /**\n     * @param {Float32Array[][]} inputs\n     * @param {Float32Array[][]} outputs\n     */\n    process(inputs, outputs) {\n        const input = inputs[0]\n        const output = outputs[0]\n\n        for (let channel = 0; channel < input.length; channel++) {\n            output[channel][0] = this[carry][channel]\n            for (let sample = 1; sample < input[channel].length; sample++) {\n                // dy/dx: (s2 - s1) / time\n                output[channel][sample] = input[channel][sample] - input[channel][sample - 1]\n            }\n            this[carry][channel] = input[channel][input.length - 1]\n        }\n\n        return true\n    }\n}\nregisterProcessor('derivative', DerivativeProcessor)\n\nclass IntegralProcessor extends AudioWorkletProcessor {\n\n    constructor(options) {\n        super()\n        this[carry] = new Float32Array(options.processorOptions.maxChannels)\n    }\n  \n    /**\n     * @param {Float32Array[][]} inputs\n     * @param {Float32Array[][]} outputs\n     */\n    process(inputs, outputs) {\n        const input = inputs[0]\n        const output = outputs[0]\n\n        for (let channel = 0; channel < input.length; channel++) {\n            output[channel][0] = (this[carry][channel] + input[channel][0]) / 2\n            for (let sample = 1; sample < input[channel].length; sample++) {\n                // Integral of two samples: (time * (s1 + s2)) / 2\n                output[channel][sample] = (input[channel][sample - 1] + input[channel][sample]) / 2\n            }\n            this[carry][channel] = input[channel][input.length - 1]\n        }\n\n        return true\n    }\n}\nregisterProcessor('integral', IntegralProcessor)\n\n\nclass BitCrusher extends AudioWorkletProcessor {\n    /**\n     * @param {Float32Array[][]} inputs\n     * @param {Float32Array[][]} outputs\n     */\n    process(inputs, outputs) {\n        const input = inputs[0]\n        const output = outputs[0]\n\n        let phase = 1\n        const step = 2 * Math.pow(.5, 8)\n\n        for (let channel = 0; channel < input.length; channel++) {\n            for (let sample = 0; sample < input[channel].length; sample++) {\n                output[channel][sample] = input[channel][sample]\n            }\n        }\n\n        return true\n    }\n}\nregisterProcessor('bit-crusher', BitCrusher)\n\n\n/**\n * Inverts the amplitude of every even-numbered channel and merges them to mono.\n * Quick-and-dirty way of removing vocals\n */\nclass SubtractOverlap extends AudioWorkletProcessor {\n    /**\n     * @param {Float32Array[][]} inputs\n     * @param {Float32Array[][]} outputs\n     */\n    process(inputs, outputs) {\n        // This processor has only one input and one output.\n        const input = inputs[0]\n        const output = outputs[0]\n\n        for (let channel = 0; channel < input.length; channel++) {\n            for (let sample = 0; sample < input[channel].length; sample++) {\n                output[0][sample] += (channel % 2 === 0 ? 1 : -1) * input[channel][sample]\n            }\n            if (channel !== 0) {\n                output[channel].set(output[0])\n            }\n        }\n\n        return true\n    }\n}\nregisterProcessor('subtract-overlap', SubtractOverlap)\n\n/**\n * Like `subtract-overlap`, but isolates the overlap instead of removing it.\n * Quick-and-dirty way to isolate vocals\n */\nclass IsolateOverlap extends AudioWorkletProcessor {\n    /**\n     * @param {Float32Array[][]} inputs\n     * @param {Float32Array[][]} outputs\n     */\n    process(inputs, outputs) {\n        // This processor has only one input and one output.\n        const input = inputs[0]\n        const output = outputs[0]\n\n        // FIXME: I can't get this filter to work :/\n\n        for (let channel = 0; channel < input.length; channel++) {\n            for (let sample = 0; sample < input[channel].length; sample++) {\n                output[0][sample] += (channel % 2 === 0 ? 1 : -1) * input[channel][sample]\n            }\n        }\n\n        for (let channel = input.length - 1; 0 <= channel; channel--) {\n            for (let sample = 0; sample < input[channel].length; sample++) {\n                output[channel][sample] = input[channel][sample] - output[0][sample]\n            }\n        }\n\n\n        return true\n    }\n}\nregisterProcessor('isolate-overlap', IsolateOverlap)\n\n\n//# sourceURL=webpack:///./src/processors.worklet.js?");

/***/ })

/******/ });