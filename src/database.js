/*
 * node-ident
 * 
 * An ident daemon in node with a MongoDB and JSON backend
 *
 * Copyright (c) 2013 IRCAnywhere <support@ircanywhere.com>.
 * Rights to this code are as documented in LICENSE.
 */

const util = require('util'),
	  fs = require('fs');
// include our required objects and modules

/*
 * Database
 *
 * A database object which contains all settings and handles connections and lookups
 */
var Database = {
	config: require('../config.json'),
	mongoose: require('mongoose'),
	TYPES: {
		JSON: 'json',
		MONGO: 'mongo'
	}
};

/*
 * Database::setup
 *
 * Determine what backend we're using and how to deal with it
 */
Database.setup = function()
{
	var _this = this,
		storage = this.config.database.storage || this.TYPES.JSON;
	// default to json, hassle free

	fs.watchFile(__dirname + '/../config.json', function(curr, prev)
	{
		util.log('Found changes in config.json, rehashing. This will only affect the database.');
		// log it

		var fileName = require.resolve(__dirname + '/../config.json');
		delete require.cache[fileName];
		// clear the cache

		_this.config = require('../config.json');
		_this.setup();
		// re-require it and re-setup the database :)
	});
	// setup a watcher for our config file, almost like rehashes
	// but only this file specific (so we can't change the port its running on etc)

	if (storage == _this.TYPES.JSON)
	{
		if (_this.config.records == undefined)
			throw new Error('You have selected a json backend but not defined a records array.');
		// no records, bail
	}
	// setup the "database" if we're using JSON.
	else if (storage == _this.TYPES.MONGO)
	{
		var databaseUrl = _this.config.database.url,
			collection = _this.config.database.idents || 'idents';
			// default to 'idents'

		if (databaseUrl == undefined)
			throw new Error('You have selected a mongo backend but not provided a url to connect to.');
		// no mongodb url, bail

		_this.mongoose.connect(databaseUrl, function(err)
		{
			if (err)
				throw err;

			util.log('Sucessfully connected to the mongo database.');
		});
		// connect to the database

		var IdentModel = new _this.mongoose.Schema({
			localPort: Number,
			remotePort: Number,
			user: String
		});

		_this.identModel = _this.mongoose.model(collection, IdentModel);
		// setup the schema
	}
	// setup the database if we're using MONGO
	else
	{
		throw new Error('You have selected an invalid backend, valid backends are "mongo" and "json".');
	}
	// unsupported type
};

/*
* Database::find
*
* Find our ident record based on the values we've got from the socket
* <remote port> , <local port>
*/
Database.find = function()
{

};

exports.database = Database;