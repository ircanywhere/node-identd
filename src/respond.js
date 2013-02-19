/*
 * node-ident
 * 
 * An ident daemon in node with a MongoDB and JSON backend
 * Implemented as per: http://www.ietf.org/rfc/rfc1413.txt
 *
 * Copyright (c) 2013 IRCAnywhere <support@ircanywhere.com>.
 * Rights to this code are as documented in LICENSE.
 */

/*
 * Respond
 *
 * A respond object containing register, get, remove methods
 */
var Respond = {
	records: []
};

/*
 * Respond::register
 *
 * A method creating a uid with the local port, remote port, uid
 */
Respond.register = function(localPort, remotePort, uid)
{
	var _this = this;

	_this.remove(uid);
	// first we remove any exisiting uid records

	var record = {
		localPort: parseInt(localPort),
		remotePort: parseInt(remotePort),
		uid: uid
	};
	// create a record

	_this.records.push(record);
	// push it to the records array
};

/*
 * Respond::get
 *
 * A method to find records that make an exact match
 */
Respond.get = function(localPort, remotePort)
{
	var _this = this,
		match = false,
		localPort = parseInt(localPort),
		remotePort = parseInt(remotePort);

	for (var rid in _this.records)
	{
		var record = _this.records[rid];

		if (record.localPort == localPort && record.remotePort == remotePort)
		{
			match = record;
			break;
		}
	}
	// loop through the records until we find an exact match

	return match;
};

/*
 * Respond::remove
 *
 * A method removing any records with this uid
 */
Respond.remove = function(uid)
{
	var _this = this;

	for (var rid in _this.records)
	{
		var record = _this.records[rid];

		if (record.uid == uid)
		{
			delete _this.records[rid];
		}
	}
	// loop through the records deleting ones that match
};

/*
 * Respond::respond
 *
 * A method to create a string response from a record
 */
Respond.respond = function(localPort, remotePort, record)
{
	var _this = this,
		ports = localPort + ', ' + remotePort,
		response = (record == false) ? ports + ' ERROR : NO-USER' : ports + ' USERID : UNIX : ' + record.uid;
	// create a response

	setTimeout(function()
	{
		_this.remove(record.uid);
		// remove the record
	}, 60000);
	// set a timeout to remove it in a minute

	return response;
	// return the response
};

exports.respond = Respond;