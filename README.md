<p align="center"><img src="http://veams.org/img/svg/icons/veams-std.svg"></p>
<p align="center">Head to the <a href="http://veams.org/">site</a> for detailed instructions.
<br><br>
<a href="https://gitter.im/Sebastian-Fitzner/Veams?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge"><img src="https://badges.gitter.im/Sebastian-Fitzner/Veams.svg" alt="Gitter Chat" /></a></p>


## What is Veams? 

__Veams is one of the most flexible and efficient system to build scalable Web Apps, HTML5 web interfaces and Prototypes. It is extremely extensible and efficiently architected.__

Veams contains various (pluggable) instruments which are controlled by our custom command line interface.



## Veams as Framework

Veams exposes a framework which you can use as a simple starter kit. This starter kit can be enhanced and extended by you.

You have some optional key benefits:

1. ES Harmony syntax (you can use CommonJS if you like)
2. Ajax Module Handling (MutationObserver)
3. Helper functions which can be imported separately
4. Simple plugin support
5. Common modules like `VeamsComponent`, `BaseComponent` or `HttpService`
6. Local event system with custom template string support
7. Global publish and subscribe system (`Veams.Vent`)

__ES Harmony__

For our current development stack we use ES Harmony which gets compiled to ES5. 

The benefit of classes, arrow function and block scoping outweigh the additional code.

### Usage 

To use Veams as framework just install and import the library: 

__Installation__

``` bash
npm install veams --save
```

__Import__ 

_JavaScript_

``` js
import Veams from 'veams';
```

_SCSS_

``` scss
// Reset (veams-reset or veams-normalize)
@import "../node-modules/veams/src/scss/veams-reset";
@import "../node-modules/veams/src/scss/veams";
```

Then initialize the core:

``` js
Veams.core.initialize();
```

That's it. The framework is integrated. 

### Plugins

In general the plugin system is a really simple one. 

#### Usage of a plugin

When you want to use a plugin you first need to import the plugin and then just execute the `use` method of Veams: 

```js
import VeamsLogger from 'veams/lib/plugins/logger';

// Add plugins to the Veams system
Veams.use(VeamsLogger);
```

You can pass in options to the plugin just by adding another parameter(s): 

```js
import VeamsMediaQueryHandler from 'veams/lib/plugins/media-query-handler';

// Add plugins to the Veams system
Veams.use(VeamsMediaQueryHandler, {
    delay: 200
});
```

#### Creation of a plugin

When you want to create a plugin you only need to export an object with an `initialize` method in it. It is really easy. 

Let's say you want to add jQuery as DOM handler in Veams: 

1. First you need to import the jQuery library
2. Then you create a simple object 
    - The `pluginName` is optional
    - Into the `initialize` method there will be passed the Veams object
3. Execute `use` of Veams.

```js
import $ from 'jquery';

let DomPlugin = {
	pluginName: '$',
	initialize: function(Veams) {
        Veams.$ = $;
	}
};

Veams.use(DomPlugin);
```

That's it. You extended the general Veams object. 

#### Available plugins

There are multiple plugins available.

1. VeamsDOM
    - `import VeamsDOM from 'veams/lib/plugins/dom'`
2. VeamsLogger
    - `import VeamsLogger from 'veams/lib/plugins/logger'`
3. VeamsMediaQueryHandler
    - `import VeamsMediaQueryHandler from 'veams/lib/plugins/dom'`
4. VeamsModules
    - `import VeamsModules from 'veams/lib/plugins/modules'`
5. VeamsVent
    - `import VeamsVent from 'veams/lib/plugins/vent'`

Please keep in mind that the order of the initialisation of your used plugins sometimes important. In general it makes sense to use the following order: 

```js
// Intialize core of Veams
Veams.core.initialize();

// Add plugins to the Veams system
Veams.use(VeamsDOM);
Veams.use(VeamsVent);
Veams.use(VeamsLogger);
Veams.use(VeamsModules);
Veams.use(VeamsMediaQueryHandler);
```

__VeamsMediaQueryHandler__

If you want to use the media query support then just add the following lines to a custom scss file and modify it like you want: 

``` scss
head {
	font-family: desktop;

	@include bp(1024px) {
		font-family: tablet-l;
	}

	@include bp(768px) {
		font-family: tablet-p;
	}

	@include bp(657px) {
		font-family: mobile-l;
	}

	@include bp(480px) {
		font-family: mobile-p;
	}

	@include bp(360px) {
		font-family: mobile-s;
	}
}
```

Then you only need to import and use the plugin from the Veams package: 

```js
import VeamsMediaQueryHandler from 'veams/lib/plugins/media-query-handler';

// Add plugins to the Veams system
Veams.use(VeamsMediaQueryHandler);
```

- Documentation: http://www.veams.org/sass/docs/_output/
- Documentation: http://www.veams.org/js/index.html

------------------

## Further Veams Tools

### Veams-Cli

Veams-Cli provides a command line interface for scaffolds and build processes.
The key benefit is the rapid setup time. You can easily create complex application setups with Veams-Cli in a few minutes.

#### Repository and Options

- Github: https://github.com/Sebastian-Fitzner/veams-cli
- NPM: https://www.npmjs.com/package/veams-cli

### Veams-Generator

Veams-Cli uses Yeoman, Inserter, generator-veams and some other modules to provide a nice base.

Veams-Generator is a module based on Yeoman. We use this generator to scaffold applications or blueprints. You want to know more?

#### Repository and Options

- Github: https://github.com/Sebastian-Fitzner/generator-veams
- NPM: https://www.npmjs.com/package/generator-veams

### Veams-Methodology

Veams-Methodology is a system for your whole frontend stack. Typical questions - which Veams-Methodology is solving - are:

1. How to scope and differentiate units (Components, Blocks, Regions) in your HTML?
2. How to bind JavaScript to your DOM elements?
3. How to structure layouts?
4. How to write your classes?
5. How to extend your project?

#### Documentation

- http://www.veams.org/methodology/

### Veams-Components

Veams-Components is a building blocks library to speed up templating in projects.

All components can be found here: https://github.com/Veams

**Do you want to see the components in action? Here you go: http://examples.veams.org/**

### veams.org

The website is built with Veams, of course. Here ist the repository: https://github.com/Sebastian-Fitzner/veams.org