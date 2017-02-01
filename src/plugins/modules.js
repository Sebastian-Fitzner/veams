'use strict';
const defaultsHelper = require('../utils/helpers/defaults');
const queryHelper = require('../utils/helpers/query-selector-array');
const forEachHelper = require('../utils/helpers/for-each');
let _Veams = {};

class Modules {
	constructor(VEAMS = window.Veams, opts) {
		_Veams = VEAMS;
		let options = {
			DEBUG: false,
			attrPrefix: 'data-js'
		};

		this.options = _Veams.helpers.defaults(opts || {}, options);
		this.list = {}; // Module list
		this.modulesInContext = []; // Save modules on current page

		this.initialize();
	}

	initialize() {
		this.queryString = '[' + this.options.attrPrefix + '-module]';
		this.modulesInContext = queryHelper(this.queryString);
		this.observe(document.body);

		this.bindEvents();
	}

	bindEvents() {
	}

	/**
	 * Save the module in Veams.modules.list.
	 * @param {Object} module - module metadata object (@see VeamsComponent.metaData())
	 * @param {Object} element - module element (this.el)
	 */
	save(module, element) {
		if (!this.list[module.name]) {
			this.list[module.name] = module;
			this.list[module.name].nodes = [element];
		} else {
			this.list[module.name].nodes.push(element);
		}

		if (_Veams.Vent) {
			_Veams.Vent.trigger(_Veams.EVENTS.moduleRegistered, {
				module: module,
				el: element
			});
		}
	}

	/**
	 * Register multiple modules.
	 *
	 * @param {Array} arr - Array which contains the modules as object.
	 */
	register(arr) {
		if (!Array.isArray(arr)) {
			throw new Error('You need to pass an array to register()!');
		}

		this.modulesList = arr;
		this.registerAll();
	}

	registerAll() {
		if (!this.modulesList) return;

		this.modulesList.forEach((module) => {
			this.registerOne(module);
		});
	}

	/**
	 * Initialize a module and render it and/or provide a callback function
	 *
	 * @param {Object} obj - Definition of our module
	 * @param {string} obj.el - Required: element
	 * @param {Object} obj.module - Required: class which will be used to render your module
	 * @param {boolean} [obj.render=true] - Optional: render the class, if false the class will only be initialized
	 * @param {function} [obj.cb] - Optional: provide a function which will be executed after initialisation
	 * @param {Object} [obj.context] - Optional: context of module
	 * @param {Object} [obj.options] - Optional: You can pass options to the module via JS (Useful for DOMChanged)
	 *
	 */
	registerOne(obj) {
		if (!obj.domName) throw new Error('In order to work with register() you need to define the module name as string!');
		if (!obj.module) throw new Error('In order to work with register() you need to define a module!');

		this.initModules(obj.domName, obj.module, obj.render, obj.options, obj.cb);
	}

	/**
	 * Initialize a module and render it and/or provide a callback function
	 *
	 * @param {string} domName - Required: dom name of the element
	 * @param {Object} Module - Required: class which will be used to render your module
	 * @param {boolean} [render=true] - Optional: render the class, if false the class will only be initialized
	 * @param {Object} [options] - Optional: You can pass options to the module via JS (Useful for DOMChanged)
	 * @param {function} [cb] - Optional: provide a function which will be executed after initialisation
	 *
	 */
	initModules(domName, Module, render, options, cb) {
		forEachHelper(this.modulesInContext, (i, el) => {
			this.initModule(el, domName, Module, render, options, cb);
		});
	}

	initModule(el, domName, Module, render, options, cb) {
		let noRender = el.getAttribute(this.options.attrPrefix + '-no-render') || render === false || false;
		let dataModules = el.getAttribute(this.options.attrPrefix + '-module').split(' ');

		if (dataModules.indexOf(domName) !== -1) {
			let attrs = el.getAttribute('data-js-options');
			let mergedOptions = defaultsHelper(options || {}, JSON.parse(attrs));

			let module = new Module({
				el: el,
				options: mergedOptions,
				namespace: domName
			});

			// Render after initial module loading
			if (!noRender) module.render();
			// Provide callback function in which you can use module and options
			if (cb && typeof (cb) === 'function') cb(module, mergedOptions);
		}
	}

	/**
	 * Add mutation observer to observe new modules.
	 *
	 * @param {Object} context - Context for the mutation observer
	 */
	observe(context) {
		let observer = new MutationObserver((mutations) => {
			// look through all mutations that just occured
			for (let i = 0; i < mutations.length; ++i) {
				// look through all added nodes of this mutation
				for (let j = 0; j < mutations[i].addedNodes.length; ++j) {
					let addedNode = mutations[i].addedNodes[j];

					if (addedNode instanceof HTMLElement) {
						if (addedNode.getAttribute(this.options.attrPrefix + '-module')) {
							let domName = addedNode.getAttribute(this.options.attrPrefix + '-module');

							if (this.options.DEBUG) {
								console.info('Recording new module: ', addedNode, domName);
							}

							for (let module of this.modulesList) {
								if (module.domName === domName) {

									this.initModule(addedNode, module.domName, module.module, module.render, module.options, module.cb);

									break;
								}
							}
						}

						if (this.getModulesInContext(addedNode)) {
							this.modulesInContext = this.getModulesInContext(addedNode);

							if (this.options.DEBUG) {
								console.info('Recording new context. When available new modules will be initialised in: ', addedNode);
							}

							this.registerAll();
						}
					}
				}
			}
		});

		observer.observe(context, {
			childList: true,
			subtree: true
		});
	}

	/**
	 * Get Modules in a specific context.
	 *
	 * @param {Object} context - Context for query specific string
	 */
	getModulesInContext(context) {
		return queryHelper(this.queryString, context);
	}
}

/**
 * Plugin object
 */
const VeamsModules = {
	pluginName: 'ModulesHandler',
	initialize: function (Veams, opts) {
		Veams.modules = Veams.modules || new Modules(Veams, opts);
	}
};

export default VeamsModules;