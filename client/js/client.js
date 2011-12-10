var socket = io.connect('http://' + window.location.hostname);
var players = [];
var player = null;
var id = -1;

var stage = null;

socket.on('init', function (data) 
{
	player = players[data.id];
	id = data.id;
});

socket.on('players', function(data)
{
	newPlayers(data);
	player = players[id];
	drawPlayers();
});

socket.on('say', function (data) 
{
	var element = document.getElementById('player_'+data.id).innerHTML = '[' + data.msg + ']';
});

function newPlayers(playersData)
{
	players = [];
	for(key in playersData)
	{
		var playerData = playersData[key];
		var tPlayer = new Player(playerData);
		players.push(tPlayer);
	}
	
}


function drawPlayers()
{
	
	var html = "";
	for(var i = 0; i < players.length; i++)
	{
		var tPlayer = players[i];
		html += '<div class="player" id="player_' + tPlayer.id + '">[]</div>';
	}
	console.log(html);
	stage.innerHTML = html;
}

window.onload = function()
{
	stage = document.getElementById('stage');
	socket.emit('init');
	
	
	var input = document.getElementById('input');
	input.focus();
	input.onkeydown = function(e)
	{
		console.log(e.keyCode);
		if(e.keyCode == 13)
		{
			console.log(input.value);
			
			socket.emit('say', {id: player.id, msg:input.value});
			
			input.value = '';
			return false;
		}
	}
}


