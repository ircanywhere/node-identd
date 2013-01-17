/*
 * node-ident
 * 
 * An ident daemon in node with a MongoDB and JSON backend
 *
 * Copyright (c) 2013 IRCAnywhere <support@ircanywhere.com>.
 * Rights to this code are as documented in LICENSE.
 */

const util = require('util'),
	  net = require('net'),
	  respond = require('./respond');
// include our modules

/*
 * Server
 *
 * A server object containing everything
 */
var Server = {
	config: require('../config.json'),
	database: require('./database').database
};

/*
 * Server::start
 *
 * The initial function which starts the socket server and handles any other business
 */
Server.start = function()
{
	var _this = this;

	_this.ip = _this.config.server.ip || '127.0.0.1';
	_this.port = _this.config.server.port || 10113;
	// get our ip and port

	_this.server = net.createServer(function(socket)
	{
		socket.on('data', function(data)
		{
			console.log(data.toString());
			socket.end("23, 23 : USERID : LINUX : FakeUser");
		});
	});

	_this.server.listen(_this.port, _this.ip, function()
	{
		_this.database.setup();
		// setup the database

		util.log('Now listening on ' + _this.ip + ':' + _this.port);
		// ready to go
	});
	// tell the socket server to listen on our port and ip
};

Server.start();
// start the process immediately