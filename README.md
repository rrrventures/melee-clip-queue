# melee-clip-queue

Work in progress quick way to filter [smash brothers melee](https://en.wikipedia.org/wiki/Super_Smash_Bros._Melee) .slp replays by animations and make a queue of clips that you can play on [clippi](https://github.com/vinceau/project-clippi). Meant as a way to learn exactly how much you are sucking in different in-game situations such as: follow ups on grabs/hits, when are you missing techs, etc. **Disclaimer**: project done to learn some js to understand whats going on in the whole Slippi ecosystem eventually. 


## Requirements 

- Some JavaScript runtime environment. I use [node](https://nodejs.org/)
- [Slippi-js](https://github.com/project-slippi/slippi-js). It provides tools for parsing .slp files into structured data and can be used to compute stats

## How to use

Clone the repository

```
git clone https://github.com/rrrventures/melee-clip-queue
```

Install slippi-js in that directory, open a cmd in that directory and run the createQueue.js file with the parameters to filter

```
// This are the parameters
node createQueue.js animationState playerDisplayName pathToReplays onHit animationPlayerSelf

// Actual example
node createQueue.js 216 Ilde C:/melee-clip-queue true true
```
- animationState: Number of the animation you're looking to get clipped. It is based on the list put together by Dan Salvato and other contributors [here](https://docs.google.com/spreadsheets/d/1JX2w-r2fuvWuNgGb6D3Cs4wHQKLFegZe2jhbBuIhCG8/preview#gid=13). Some animations are wrong though, the ones about special moves at least. In the example, 216 corresponds to catchWait (a succesful grab)
- playerDisplayName: Displayed name in the slippi game, not the connnect code
- pathToReplays: Full path to folder of the project. Probably a bad idea but for now it works, the json output needs to have the full path to the replays so the queue of clips works properly on clippi
- onHit: true/false value depending if you want that the animation hits/whiffs. For animations that this parameter doesn't make sense (like walking) this parameter is ignored
- animationPlayerSelf: true/false value if you want to search for the playerDisplayName animation or his opponents. The idea is that maybe you want to know what you are doing after getting grabbed, so in that case you would use this parameter as true.

After running it succesfully, a .json file called `output.json` should be in the folder, that can be loaded to clippi to replay the moments it found.
