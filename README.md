# Mayhem

## Setup

* Install `bower` and `grunt-cli` globally, `npm install -g bower grunt-cli`
* Clone the repo, `git clone git@github.com:SitePen/mayhem.git`
* Setup development dependencies, `npm install`
* Compile TypeScript and PEG parser with `grunt build`

## Conventions

* Follows the [dojo2-core guidelines](https://github.com/csnover/dojo2-core#code-conventions) for all JavaScript
  syntaxes
* For type hints, there MUST NOT be whitespace between the identifier and its type (to differentiate between types
  and object literal keys)
* Imports should be ordered alphabetically, case-insensitive, by identifier
* Class properties should be ordered alphabetically, case-insensitive, ignoring leading underscores, in the following
  order:
	* static properties
	* static methods
	* instance properties
	* constructor
	* instance methods
