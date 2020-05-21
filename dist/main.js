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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setup.js */ \"./src/setup.js\");\n\n\ndocument.getElementById('choose').addEventListener('click', () => {\n    document.getElementById('file').click()\n})\n\ndocument.querySelector('input').addEventListener('input', function () {\n    //@ts-ignore\n    fileGuard(this.files)\n})\n\nwindow.addEventListener('drop', async ev => {\n    ev.preventDefault()\n    fileGuard(ev.dataTransfer.files)\n})\n\n// Prevent Chrome from replacing the document when a file's dropped over it\ndocument.addEventListener('dragover', ev => {\n    ev.preventDefault()\n})\n\n\n/**\n * @param {FileList} files\n */\nfunction fileGuard(files) {\n    const candidates = [...files]\n    const file =\n        candidates.find(file => file.type.startsWith('audio/')) ||\n        candidates.find(file => file.type.startsWith('video/'))\n    if (!file) {\n        console.log(candidates.map(f => f.type))\n        alert(\"Be sure to drop an audio file your browser supports :)\")\n        return\n    }\n\n    init(file)\n}\n\nconst select = document.querySelector('select')\nselect.addEventListener('input', () => {\n    Object(_setup_js__WEBPACK_IMPORTED_MODULE_0__[\"useProcessor\"])(select.value)\n})\n\n/**\n * @param {File} audioFile\n */\nasync function init(audioFile) {\n    const audioEl = document.querySelector('audio')\n    audioEl.src = URL.createObjectURL(audioFile)\n    Object(_setup_js__WEBPACK_IMPORTED_MODULE_0__[\"useProcessor\"])(select.value)\n\n    _setup_js__WEBPACK_IMPORTED_MODULE_0__[\"audio\"].resume().then(() => audioEl.play())\n\n    document.title = `D♭ • ${audioFile.name}`\n\n    if (navigator.mediaSession && typeof MediaMetadata !== 'undefined') {\n        navigator.mediaSession.metadata = new MediaMetadata({\n            title: audioFile.name,\n            album: \"D♭\"\n        });\n        navigator.mediaSession.setActionHandler('play', () => {\n            audioEl.play()\n        })\n        navigator.mediaSession.setActionHandler('pause', () => {\n            audioEl.pause()\n        })\n        navigator.mediaSession.setActionHandler('seekbackward', () => {\n            audioEl.currentTime -= 5\n        })\n        navigator.mediaSession.setActionHandler('seekforward', () => {\n            audioEl.currentTime += 5\n        })\n    }\n}\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/processors.worklet.js":
/*!***********************************!*\
  !*** ./src/processors.worklet.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"processors.worklet.js\";\n\n//# sourceURL=webpack:///./src/processors.worklet.js?");

/***/ }),

/***/ "./src/setup.js":
/*!**********************!*\
  !*** ./src/setup.js ***!
  \**********************/
/*! exports provided: useProcessor, audio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"useProcessor\", function() { return useProcessor; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"audio\", function() { return audio; });\n/* harmony import */ var _processors_worklet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./processors.worklet.js */ \"./src/processors.worklet.js\");\n/* harmony import */ var _processors_worklet_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_processors_worklet_js__WEBPACK_IMPORTED_MODULE_0__);\n//@ts-ignore\n\n\nconst audioEl = document.querySelector('audio')\nconst audio = new AudioContext()\nconst audioSrcNode = audio.createMediaElementSource(audioEl)\n\n// Add the modules\naudio.audioWorklet.addModule('/dist/' + _processors_worklet_js__WEBPACK_IMPORTED_MODULE_0___default.a)\n\nlet dFlat = null\n// let dFlat = null new AudioWorkletNode(audio, 'subtract-overlap', {\n//     processorOptions: {\n//         maxChannels: audio.destination.maxChannelCount\n//     }\n// })\n\n// audioSrcNode.connect(dFlat)\n// dFlat.connect(audio.destination)\n\n/**\n * Swaps out the processor\n * @param {string} name The name of the processor to use\n */\nfunction useProcessor(name) {\n    if (dFlat) {\n        dFlat.disconnect()\n        audioSrcNode.disconnect()\n    }\n\n    dFlat = new AudioWorkletNode(audio, name, {\n        processorOptions: {\n            maxChannels: audio.destination.maxChannelCount\n        }\n    })\n    audioSrcNode.connect(dFlat)\n    dFlat.connect(audio.destination)\n}\n\n\n\n\n// const audioEl = document.querySelector('audio')\n// const audio = new AudioContext()\n// await audio.audioWorklet.addModule('/dist/' + workletUrl)\n\n// const dFlat = new AudioWorkletNode(audio, 'subtract-overlap', {\n// // const dFlat = new AudioWorkletNode(audio, 'bit-crusher', {\n//     processorOptions: {\n//         maxChannels: audio.destination.maxChannelCount\n//     }\n// })\n// const audioSrcNode = audio.createMediaElementSource(audioEl)\n\n// audioSrcNode.connect(dFlat)\n// dFlat.connect(audio.destination)\n// audioEl.src = URL.createObjectURL(audioFile)\n\n\n//# sourceURL=webpack:///./src/setup.js?");

/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/main.js */\"./src/main.js\");\n\n\n//# sourceURL=webpack:///multi_./src/main.js?");

/***/ })

/******/ });