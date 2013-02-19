/*
 * node-ident
 * 
 * An ident daemon in node with a MongoDB and JSON backend
 * Implemented as per: http://www.ietf.org/rfc/rfc1413.txt
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
var Server = {};

/*
 * Server::start
 *
 * The initial function which starts the socket server and handles any other business
 */
Server.start = function()
{
	var _this = this;

	_this.ip = '127.0.0.1';
	_this.port = 10113;
	// get our ip and port

	_this.server = net.createServer(function(socket)
	{
		socket.on('data', function(data)
		{
			console.log(data.toString());
			//socket.end("23, 23 : USERID : LINUX : FakeUser");
		});
	});

	_this.server.listen(_this.port, _this.ip, function()
	{
		util.log('Now listening on ' + _this.ip + ':' + _this.port);
		// ready to go
	});
	// tell the socket server to listen on our port and ip
};

Server.start();
// start the process immediately