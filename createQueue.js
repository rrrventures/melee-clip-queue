// Define function for the replays so as to call it in the cmd

const movesThatHit = {
  Jab1 : '44',
  Jab2 : '45',
  Jab3 : '46',
  DashAttack : '50',
  MidFtilt : '53',
  Uptilt : '56',
  Downtilt : '57',
  MidFsmash : '60',
  Upsmash : '63',
  Downsmash : '64',
  Nair : '65',
  Fair : '66',
  Bair : '67',
  Uair : '68',
  Dair : '69'
};

// 358 upb startup sheik
// 359 upb puff sheik
// 360 upb after puff


function createQueue(idYouWant, playerYouWant, path_to_replays, onHit = 'false', animationPlayerSelf = 'true'){

	// Parameters of search
	connectCodeId = 'ILDE#538'; // Not used yet
	displayNameId = playerYouWant; //maybe you want to search an oponnent, last stock situations, side of the screen
	stageId = 'any';      // Not used yet
	characterId = 'any';  // Not used yet
	stateId = idYouWant;  // Wiki of ids at: https://docs.google.com/spreadsheets/d/1JX2w-r2fuvWuNgGb6D3Cs4wHQKLFegZe2jhbBuIhCG8/preview#gid=13
	hit = onHit === 'true';          // Some animations actually make sense to have this in case you want to filter hits/whiffs
	animationPlayerSelf = animationPlayerSelf === 'true'

	
	const { SlippiGame } = require("@slippi/slippi-js");

	// Reading the files in the folder you want
	const fs = require('fs');
	const files = fs.readdirSync('replays');
	const filesFull = files.map(function(file){return path_to_replays + 'replays/' + file})
	const games = filesFull.map(function(game){return new SlippiGame(game)}) 

	let output = {
	  "mode": "queue",
	  "replay": "",
	  "isRealTimeMode": false,
	  "outputOverlayFiles": true,
	  "queue": []
	};

	function GetLastFrame(game) {
	  let lf = game.getLatestFrame();
	  if (lf == null) return null;
	  if (lf == undefined) return null;
	  return lf.frame;
	}

	

	// The idea here is to clip all the grabs that happened
	momentCount = 0

	for (num in games) {
	  game =  games[num];

	  // Get all the info from the game
	  settings = game.getSettings(); // has connectCode id and port
	  frames = game.getFrames();
	  lastframe = GetLastFrame(game);
	  metadata = game.getMetadata();


	  // Get proper player index because maybe you're not in the same port in all the replays
	  // If you choose animationPlayerSelf to be false, the index should switch
	  if (animationPlayerSelf){
		playerIndex = settings.players.findIndex(x => x.displayName === displayNameId); 
		oponnentIndex = Math.abs(playerIndex - 1)
	  } else {
	  	oponnentIndex = settings.players.findIndex(x => x.displayName === displayNameId); 
		playerIndex = Math.abs(oponnentIndex - 1)
	  }

	  // This because maybe you used an animation that couldn't actually hit (landing, walking, waiting, etc.), so small check
	  moveThatHits = Object.values(movesThatHit).includes(stateId);
	  if (!movesThatHit){
	  	hit = false; 
	  }

	  // Loop through frames and create a list of frames in the game where the action happened
	  stateFrame = {}; 
	  lastState = -123;
	  pre = 0;
	  state = 0;
	  for (let n = -123; n < lastframe; n++){ //walk through all the frames
	  	pre = frames[n].players[playerIndex].pre;
	  	post = frames[n].players[playerIndex].post;

	  	statePre = pre.actionStateId;
	  	statePost = post.actionStateId;

	  	
	  	if (!hit) {
		  	if (statePre == stateId && (n > (lastState + 50))) {
		  		stateFrame['actionID' + n + playerIndex] = pre.frame;
		  		lastState = n;
		  	}
	  	} else {
	  		preOponnent = frames[n].players[oponnentIndex].pre;
	  		postOponnent = frames[n].players[oponnentIndex].post;

	  		if ((statePre == stateId && (n > (lastState + 50))) && (preOponnent.percent != postOponnent.percent)) {
		  		stateFrame['actionID' + n + playerIndex] = pre.frame;
		  		lastState = n;

	  		}
	  	}
	 }


	  for (state in stateFrame){
	    output.queue[momentCount] = {
	                  "path" : filesFull[num],
	                  "startFrame" : Math.max(-123, stateFrame[state] - 180),
	                  "endFrame" : Math.min(lastframe, stateFrame[state] + 400)
	            }
	          momentCount++ 
	  }

	}

	// Save the file as .json. Don't actually remember how to playback a json file in slippi
	// Clippi it is
	let output_path_and_filename = 'output.json';
	let jsonText = JSON.stringify(output);
	fs.writeFile(`${output_path_and_filename}`, jsonText, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("Replay clip queue file was saved!");
	});

}



createQueue(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6]);


