/// <reference path="../../dojo" />
/// <reference path="../../dstore" />

import declare = require('dojo/_base/declare');
import Memory = require('dstore/Memory');
import util = require('../../util');

interface DomStorage<T> extends Memory<T> {
	key:string;
	storage:Storage;
	filter(query:string):DomStorage<T>;
	filter(query:{}):DomStorage<T>;
	filter(query:(item:T, index:number) => boolean):DomStorage<T>;
	sort(property:string, descending?:boolean):DomStorage<T>;
	sort(property:(a:T, b:T) => number, descending?:boolean):DomStorage<T>;
	track():DomStorage<T>;
}

var DomStorage = declare<DomStorage<any>>(Memory, {
	key: 'dstore',
	target: null,

	constructor: function (kwArgs:HashMap<any>):void {
		if (!this.target && typeof localStorage === 'undefined') {
			throw new Error('No storage is available in the current environment');
		}

		this.setTarget(this.key, this.target || localStorage);
	},

	fetchSync: function <T>():dstore.FetchArray<T> {
		this._loaded || this._load();
		return this.inherited(arguments);
	},

	_loaded: false,
	_load: function ():void {
		this._loaded = true;
		Memory.prototype.setData.call(this, JSON.parse(this.target.getItem(this.key)) || []);
	},

	_persist: util.debounce(function ():void {
		this.target.setItem(this.key, JSON.stringify(this.storage.fullData));
	}, 1000),

	getSync: function <T>(id:any):T {
		this._loaded || this._load();
		return this.inherited(arguments);
	},

	putSync: function <T>(object:T):T {
		this._loaded || this._load();
		var putObject:T = this.inherited(arguments);
		this._persist();
		return putObject;
	},

	removeSync: function ():boolean {
		this._loaded || this._load();
		var isRemoved:boolean = this.inherited(arguments);
		this._persist();
		return isRemoved;
	},

	setData: function ():void {
		this.inherited(arguments);
		this._persist();
	},

	setTarget: function (key:string, target:Storage = this.target):void {
		this.target = target;
		this.key = key;

		// Reload the data immediately if the target changes after it has already been loaded once since any
		// observers need to be notified of the new data set
		this._loaded && this._load();
	}
});

export = DomStorage;