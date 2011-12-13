var server = require('http').createServer(handler)
,	io = require('socket.io').listen(server)
,	fs = require('fs')
,	Player = require('Player');
;

server.listen(666);

var players = [];

function handler(req, res)
{
	var file = req.url == '/' ? '/index.html' : req.url;
	fs.readFile(__dirname + "/../client" + file, function(err, data)
	{
		if(err)
		{
			res.writeHead(404);
			return res.end('File not found');
		}
		res.writeHead(200);
		res.end(data);
	});
	
}

function serialize(player)
{
	return {id: player.id, x: player.x, y: player.y};
}

function broadcast(action, data)
{
	for(var i = 0; i < players.length; i++)
	{
		var player = players[i];
		player.socket.emit(action, data);
	}
}

io.sockets.on('connection', function (socket) 
{
	console.log("okej");
	socket.on('init', function (data) 
	{
		console.log("jdska");
		var player = new Player(players.length, socket);
		players.push(player);
		
		var playersData = [];
		
		for(tPlayer in players)
		{
			playersData.push(serialize(players[tPlayer]));
		}
		
		player.socket.emit('init', {
			id: players.length-1
		});
		
		broadcast('players', playersData);
	});
	
	socket.on('say', function(data)
	{
		broadcast('say', data);
	});

});