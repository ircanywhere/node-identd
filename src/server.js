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
	  ipem = require('ipevents'),
	  respond = require('./respond');
// include our modules

/*
 * Server
 *
 * A server object containing everything
 */
var Server = {
	records: []
};

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

	_this.createIpem();
	// create the inter process emitter

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

/*
 * Server::createIpem
 *
 * A function which creates the inter process event emitter
 */
Server.createIpem = function()
{
	var _this = this;

	/*
	 * An inter process event emitter which handles the RPC functions
	 * basically two functions
	 *
	 * In a normal case we'd connect straight to this, but in this case
	 * we connect to one thats already registered, ie the one used between
	 * irc-factory <-> irca-backend <-> node-identd
	 *
	 * ... this is changed by using the correct port, and setting onlyConnect
	 * to false instead of true.
	 *
	 * register - local port, remote port, uid
	 * remove	- uid
	 */
	ipem
		.options({
			restart: true,
			delayRestart: 0,
			useSocket: true,
			socket: {
				onlyConnect: true,
				socketPath: null,
				port: 7200,
				host: 'localhost',
				reconnect: true,
				delayReconnect: 1000
			}
		})
		.on('connected', function()
		{
			ipem.broadcast('identd connected', this.to);
		})
		.on('registerIdent', function(localPort, remotePort, uid)
		{
			console.log('registering:', localPort, remotePort, uid);
		})
		.on('removeIdent', function(uid)
		{
			console.log('destroying:', localPort, remotePort, uid);
		})
		.start();
};

Server.start();
// start the process immediately