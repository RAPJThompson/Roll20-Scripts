/*
This script requires three character sheets, one called ToHitToWound, another called ToHitToPen and a third called Saves.
ToHitToWound needs the following attributes:
    TwinLinked
    ToHitRerollOne1
    ToHitRerollAll1
    Tesla
    WoundReroll1
	WoundRerollFails
	PrecisionShots
	Rending
	Gauss
	
ToHitToPen needs the following attributes:
	TwinLinked
	ToHitRerollOne1
	ToHitRerollAll1
	Tesla
	Rending
	Armourbane
	Gauss
	Lance
	Ordinance
	Melta
	TankHunters
	
Saves needs the following attributes
	rerollFails
	rerollSuccesses
	rerollFNPFails
*/
var ToHitToWoundAttributes = ["TwinLinked", "ToHitRerollOne1", "ToHitRerollAll1", "Tesla", "WoundReroll1", "WoundRerollFails", "PrecisionShots", "Rending", "Gauss"];
var ToHitToPenAttributes = ["TwinLinked", "ToHitRerollOne1" ,"ToHitRerollAll1", "Tesla", "Rending", "Armourbane","Gauss","Lance","Ordinance","Melta","TankHunters"];
var SavesAttributes = new Array("rerollFails", "rerollSuccesses", "rerollFNPFails");

var macros = ["Saves", "ScatterDie", "ToHitToPen", "ToHitToWound"];
var charactersList = ["Saves", "ToHitToPen", "ToHitToWound"];

on("ready", function() {
	checkCharacters();
	checkMacros();
});

on("chat:message", function(msg) {
    /*message should be one of:
        "!40k ScatterDie b" where:
                    b = "Shooter's Balistic Skill"
        "!40k ToHitToWound x y z" where:
                    x = "How many" 
                    y = "What hits" 
                    z = "Wounds on what"
                OR
        "!40k ToHitToPen x y a b" where:
                    x = "How many" 
                    y = "What hits"
                    a = "Strength"
                    b = "Armour Value"
                OR
        "!40k Saves x y f" where:
                    x = "How many" 
                    y = "What saves"
                    f = "Feel no pain target"  (7 or higher (or 0) if the unit doesn't have a feel no pain, )
    */
  if(msg.type == "api" && msg.content.indexOf("!40k") !== -1) {
    if (msg.content.indexOf("ScatterDie") !== -1){
        var parts = msg.content.toLowerCase().split(' ');
        var bs = parts[2];
        rollScatter(bs);
    } else {
        var totalHits;
        var parts = msg.content.toLowerCase().split(' ');
        var amount = parts[2];
        var hit = parts[3];
        
		if (amount == 0) {
			sendChat("GOD", "Cancelling command. 0 Dice to be rolled.");
		}
		
        if (msg.content.indexOf("ToHitToWound") !== -1){
            totalHits = rollHits("wound", amount, hit);
            var wound = parts[4];
            rollWounds(totalHits, wound);
        }
         
        if (msg.content.indexOf("ToHitToPen") !== -1){
            totalHits = rollHits("pen", amount, hit);
            var strength = parts[4];
            var armour = parts[5];
            rollPens(totalHits, strength, armour);
        }
        
        if (msg.content.indexOf("Saves") !== -1){
            var fnp = parts[4];
            rollSaves(amount, hit, fnp);
        }
    }
  }  
  
});

function rollHits(str, amount, hit){
    var character = findObjs({_type: "character", name: "ToHitToWound"})[0];
    
    if (str == "wound") {
        character = findObjs({_type: "character", name: "ToHitToWound"})[0];
    } else if (str == "pen") {
        character = findObjs({_type: "character", name: "ToHitToPen"})[0];
    } else {
        sendChat("GOD", "Error with rollHits()");
		return -1;
    }

    var twinlinked = ((getAttrByName(character.id, "TwinLinked") == "y") ? true : false);
    var rerollOne1 = ((getAttrByName(character.id, "ToHitRerollOne1") == 'y') ? true : false);
    var rerollAll1 = ((getAttrByName(character.id, "ToHitRerollAll1") == 'y') ? true : false);
    var tesla = ((getAttrByName(character.id, "Tesla") == 'y') ? true : false);
    
    var hitNumList = new Array(); //this will keep track of all the dice results
    var numHit = 0; //this will keep track of how many successes there were
    var teslaNum = 0; //number of tesla shots came up 6s
    var hitNumRolled = 0; //how many dice rolled
    var numReRolled = 0; //how many dice rerolled, no matter the reason
    var rerolledOne1Rolled = false; //boolean to keep track of whether the one allowed reroll has been rolled
    var numReRolled1s = 0; //number of rerolled ones
    for (var i=0; i<amount; i++ ){
        var newNum = randomInteger(6)
        hitNumRolled++;
        hitNumList.push(newNum);
        if (newNum >= hit) {
            numHit++;
        } else if (twinlinked) {
            numReRolled++;
            continue;
        }
        
        if ((newNum == 1) && ((rerollAll1)||(rerollOne1 && !rerolledOne1Rolled))) {
            hitNumRolled++;
            numReRolled1s++;
            rerolledOne1Rolled = true;
            continue;
        } 
        if ((newNum == 6) && tesla){
            numHit = numHit + 2;
            teslaNum++;
        }
    }
    
    for (var i=0; i<numReRolled; i++ ){
        var newNumAgain = randomInteger(6)
        hitNumRolled++;
        hitNumList.push(newNumAgain);
        if (newNumAgain >= hit) {
            numHit++;
        }
    }
    
    sendChat("GOD", "**HITS**");
    sendChat("GOD", "I rolled **" + amount + "** times.");
    sendChat("GOD", "**"+ hit + "**'s to Hit." +" \nI got: **" + hitNumList + "**.");
    
    if (numReRolled > 0) {
        switch (true){
            case twinlinked:
                sendChat("GOD", "**" + numReRolled + "**" + " rerolled because of Twinlinked.");
                break;
            case (rerollOne1 || rerollAll1):
                sendChat("GOD", "**" + numReRolled + "**" + " ones rerolled.");
        }
    }
    
    if ((numHit <= 0) || (numHit >= 2)) {
        sendChat("GOD", "That means you got **" + numHit + "** hits.");
    } else {
        sendChat("GOD", "That means you got **1** hit.");
    }
    
    if (tesla) {
        sendChat("GOD", "**" + teslaNum*2 + "**" + " from Tesla.");
    }
    return numHit;
}

function rollWounds(amount, target) {
    if (amount == 0) {
        sendChat("GOD", "No Wounds");
        return;
    }
    var character = findObjs({_type: "character", name: "ToHitToWound"})[0];
    var reroll1s = ((getAttrByName(character.id, "WoundReroll1") == "y") ? true : false);
    var rerollFails = ((getAttrByName(character.id, "WoundRerollFails") == "y") ? true : false);
    var precisionShots = ((getAttrByName(character.id, "PrecisionShots") == "y") ? true : false);
    var rending = ((getAttrByName(character.id, "Rending") == "y") ? true : false);
    var gauss = ((getAttrByName(character.id, "Gauss") == "y") ? true : false);
    
    var numList = new Array();
    var numWounds = 0;
    var num1Rerolled = 0;
    var numRerolled = 0;
    var numPrecisionShots = 0;
    var numRending = 0;
    var numGauss = 0;

    
    for (var i=0; i<amount; i++ ){
        var randomNum = randomInteger(6);
        numList.push(randomNum);
        var wound = false;
        if (randomNum >= target) {
            numWounds++;
            wound = true;
        } else if (rerollFails) {
            numRerolled++;
            continue;
        } 
        
        if ((randomNum == 1) && reroll1s && !rerollFails) {
            numRerolled++;
            num1Rerolled++;
        }
        
        if (randomNum == 6) {
            if(precisionShots) {
                numPrecisionShots++;
            }
            if (rending) {
                numRending++;
                if (wound == false) {
                    numWounds++;
                }
            }
            if (gauss) {
                numGauss++;
                if (wound == false) {
                    numWounds++;
                }
            }
        }
    }

    for (var i=0; i<numRerolled; i++){
        var secondRandomNum = randomInteger(6)
        numList.push(secondRandomNum);
        var wound = false;
        if (secondRandomNum >= target) {
            numWounds++;
            wound = true;
        } 
        
        if (randomNum == 6) {
            if(precisionShots) {
                numPrecisionShots++;
            }
            if (rending) {
                numRending++;
                if (wound == false) {
                    numWounds++;
                }
            }
            if (gauss) {
                numGauss++;
                if (wound == false) {
                    numWounds++;
                }
            }
        }
    }

    sendChat("GOD", "**WOUNDS**");
    sendChat("GOD", "I rolled **" + amount + "** times.");
    sendChat("GOD", "**"+ target + "**'s to Wound." +" \nI got: **" + numList + "**.");
    
    if (numRerolled > 0) {
        if (numRerolled == 1){
            if (num1Rerolled == 1) {
                sendChat("GOD", "**1** one rerolled.");
            } else {
                sendChat("GOD", "**1** fail rerolled.");
            }
        } else if ((numRerolled == num1Rerolled)) {
                sendChat("GOD", "**" + numRerolled + "** ones rerolled.");
        } else if (num1Rerolled > 0) {
            if (num1Rerolled == 1) {
                    sendChat("GOD", "**1** one rerolled.");
                } else {
                    sendChat("GOD", "**" + num1Rerolled + "** ones rerolled.");
                }
                var otherRerolled = numRerolled-num1Rerolled;
                sendChat("GOD", "**" + otherRerolled + "** other fails rerolled.");
        } else {
            sendChat("GOD", "**" + numRerolled + "** fails rerolled.");
        }
    }
    
    if ((numWounds <= 0) || (numWounds >= 2)) {
        sendChat("GOD", "That means you got **" + numWounds + "** wounds.");
    } else {
        sendChat("GOD", "That means you got **1** wound.");
    }
    
    if ((precisionShots && rending) && (numPrecisionShots == numRending)) {
        if (numPrecisionShots == 0) {
            //don't clutter with sending negatives
        } else if (numPrecisionShots == 1) {
                sendChat("GOD", "**1** of them was Rending and a Precision Shot.");
            } else {
                sendChat("GOD", "**" + numPrecisionShots + "** of them are Rending and Precision Shots.");
        }
    } else {
        if (numPrecisionShots > 0) {
            if (numPrecisionShots == 1) {
                sendChat("GOD", "**1** of them was a Precision Shot.");
            } else {
                sendChat("GOD", "**" + numPrecisionShots + "** of them are Precision Shots.");
            }
        }
        if (numRending > 0) {
            if (numRending == 1) {
                sendChat("GOD", "**1** of them was Rending.");
            } else {
                sendChat("GOD", "**" + numRending + "** of them are Rending.");
            }
        }
    }
    if (gauss && numGauss>0) {
        if (numGauss == 1) {
                sendChat("GOD", "**1** of them was due to Gauss.");
            } else {
                sendChat("GOD", "**" + numGauss + "** of them are due to Gauss.");
            }
    }
    sendChat("GOD", "-------------------------------");
}


/*
        -Armourbane (2d6)
        -Gauss (6 is auto glance - if isn't pen already) done
    	-Lance (Lower of Armor or 12) done
		-Melta (2d6)
		-Ordinance (2d6 take higher)
		-Rending (on 6s - just list them) done
		-Tank Hunters (reroll failed penetrations - should prompt regarding reroll glances)
*/
function rollPens(amount, strength, armour){
    if (amount == 0) {
        sendChat("GOD", "No Glances or Pens");
        return;
    }
    var character = findObjs({_type: "character", name: "ToHitToPen"})[0];
    
    var reroll1s = ((getAttrByName(character.id, "WoundReroll1") == "y") ? true : false);
    var rerollFails = ((getAttrByName(character.id, "WoundRerollFails") == "y") ? true : false);
    var rending = ((getAttrByName(character.id, "Rending") == "y") ? true : false);
    var armourbane = ((getAttrByName(character.id, "Armourbane") == "y") ? true : false);
    var gauss = ((getAttrByName(character.id, "Gauss") == "y") ? true : false);
    var lance = ((getAttrByName(character.id, "Lance") == "y") ? true : false);
    var ordinance = ((getAttrByName(character.id, "Ordinance") == "y") ? true : false);
    var melta = ((getAttrByName(character.id, "Melta") == "y") ? true : false);
    var tankHunters = ((getAttrByName(character.id, "TankHunters") == "y") ? true : false);
    
    var numList = new Array();
    var numPens = 0;
    var numGlances = 0;
    var num1Rerolled = 0;
    var numRerolled = 0;
    var numPrecisionShots = 0;
    var numRendingGlance = 0;
    var numRendingPen = 0;
    var numGauss = 0;
    
    var tankHunterRerolls = 0;
    var tankHunterGlances = 0;
    
    
    if (lance){
       armour = (Math.min(armour, 12));
    }
    var target = armour-strength;
        
    for (var i=0; i<amount; i++ ){
        var randomNum = randomInteger(6);
        var randomNum2 = 0;
        var twoNumTotal = 0;
        if (melta || armourbane) {
            randomNum2 = randomInteger(6);
            var tupleNums = [randomNum, randomNum2];
            twoNumTotal = randomNum + randomNum2;
            numList.push(tupleNums);
        } else if (ordinance) {
            randomNum2 = randomInteger(6);
            var tupleNums = [randomNum, randomNum2];
            twoNumTotal = Math.max(randomNum, randomNum2);
            numList.push(tupleNums);
        } else {
            numList.push(randomNum);
        }
        
        if (randomNum == 6 || randomNum2 == 6) {
            if (rending) {
				var rendingNum = randomInteger(3);
				numList.push("+"+rendingNum);
				if (melta || armourbane) {
					twoNumTotal += rendingNum;
				} else {
					secondRandomNum += rendingNum;
				}
			}
			if (melta || armourbane) {
				twoNumTotal += rendingNum;
			} else {
				randomNum += rendingNum;
			}
        }
		
        if ((randomNum > target) || (twoNumTotal > target)) {
            numPens++;
        } else if ((randomNum == target) || (twoNumTotal == target)) {
            tankHunterGlances++;
            numGlances++;
        } else if (rerollFails) {
            numRerolled++;
            continue;
        } else if (tankHunters) {
            tankHunterRerolls++;
            numRerolled++;
            continue;
        }
            
        if (((randomNum == 1) || (randomNum2 == 1)) && reroll1s && !rerollFails) {
            numRerolled++;
            num1Rerolled++;
            continue;
        }
            
            
        if(gauss && ((randomNum < target) || (twoNumTotal< target))) {
            numGlances++;
            numGauss++;
			continue;
        }
        
    }

    for (var i=0; i<numRerolled; i++){
        var secondRandomNum = randomInteger(6);
        var twoNumTotal;
        var randomNum2;
		var rendingNum;
        if (melta || armourbane) {
            randomNum2 = randomInteger(6);
            twoNumTotal = secondRandomNum + randomNum2;
        }
        numList.push(secondRandomNum);
        
        
        if (secondRandomNum == 6 || randomNum2 == 6) {
            if (rending) {
                numRending++;
                rendingNum = randomInteger(3);
				numList.push("+"+rendingNum);
				        if (melta || armourbane) {
							twoNumTotal += rendingNum;
						} else {
							secondRandomNum += rendingNum;
						}
            }
            if(gauss && ((secondRandomNum < target) || (twoNumTotal< target))) {
                numGlances++;
                numGauss++;
				continue;
            }
        }

		if ((secondRandomNum > target) || (twoNumTotal > target)) {
			numPens++;
		} else if ((secondRandomNum == target) || (twoNumTotal > target)) {
			numGlances++;
		}

    }
    
    sendChat("GOD", "**PENS**");
    sendChat("GOD", "I rolled **" + amount + "** times.");
    if (lance) {
        sendChat("GOD", "**"+ target + "**'s to Glance with Lancing." +" \nI got: **" + numList + "**.");
    } else {
        sendChat("GOD", "**"+ target + "**'s to Glance." +" \nI got: **" + numList + "**.");
    }
    
    if (numRerolled > 0) {
        if (numRerolled == 1){
            if (num1Rerolled == 1) {
                sendChat("GOD", "**1** one rerolled.");
            } else {
                sendChat("GOD", "**1** fail rerolled.");
            }
        } else if ((numRerolled == num1Rerolled)) {
                sendChat("GOD", "**" + numRerolled + "** ones rerolled.");
        } else if (num1Rerolled > 0) {
            if (num1Rerolled == 1) {
                    sendChat("GOD", "**1** one rerolled.");
                } else {
                    sendChat("GOD", "**" + num1Rerolled + "** ones rerolled.");
                }
                var otherRerolled = numRerolled-num1Rerolled;
                sendChat("GOD", "**" + otherRerolled + "** other fails rerolled.");
        } else {
            sendChat("GOD", "**" + numRerolled + "** fails rerolled.");
        }
    }
    
    
    var pensOutputString  = "That means you got **";
    if (numGlances == 1) {
        pensOutputString = pensOutputString + "1** glance ";
    } else {
        pensOutputString = pensOutputString + numGlances + "** glances ";
    }
    
    if (numPens == 1) {
        pensOutputString = pensOutputString + "and **1** pen.";
    } else {
       pensOutputString = pensOutputString + "and **" + numPens + "** pens.";
    }
    
    sendChat("GOD", pensOutputString);

    
    if ((numRendingGlance > 0) || (numRendingPen > 0)) {
        if (numRendingGlance == 0){

        } else if (numRendingGlance == 1) {
            sendChat("GOD", "**1** of the Glances was due to Rending.");
        } else  {
            sendChat("GOD", "**" + numRendingGlance + "** of the Glances were due to Rending.");
        }
            
        if (numRendingPen == 0){
                
        } else if (numRendingPen == 1){
            sendChat("GOD", "**1** of the Pens was due to Rending.");
        } else {
            sendChat("GOD", "**" + numRendingPen + "** of the Pens were due to Rending.");
        }
    }
    
    if (tankHunterGlances > 0 && tankHunters){
            sendChat("GOD", "You can choose to reroll **" + tankHunterGlances + "** of the Glances because Tank Hunters.");
    }
    sendChat("GOD", "-------------------------------");
}


function rollSaves(amount, target, fnp) {
    var character = findObjs({_type: "character", name: "Saves"})[0];
    
    var rerollFails = ((getAttrByName(character.id, "rerollFails") == "y") ? true : false);
    var rerollSuccesses = ((getAttrByName(character.id, "rerollSuccesses") == "y") ? true : false);
    var rerollFNPFails = ((getAttrByName(character.id, "rerollFNPFails") == "y") ? true : false);
    
    var numSaves = 0;
    var numList = new Array();
    
    var fnpOn = ((fnp>1) && (fnp<7));
    var fnpSaves = 0;
    var fnpList = new Array();
    var fnpAmount = 0;
    
    var rerollFailsNum = 0;
    var rerollSuccessesNum = 0;
    var rerollFNPNum = 0;
    
    for (var i=0; i<amount; i++ ){
        var randomNum = randomInteger(6);
        if (randomNum >= target) {
            numSaves++;
            if (rerollSuccesses) {
                rerollSuccessesNum++;
            }
        } else if (rerollFails) {
            rerollFailsNum++;
        }
        numList.push(randomNum);
    }
    
    for (var i=0; i<rerollFailsNum; i++ ){
        var randomNum = randomInteger(6);
        if (randomNum >= target) {
            numSaves++;
        }
        numList.push(randomNum);
    }
    
    for (var i=0; i<rerollSuccessesNum; i++ ){
        var randomNum = randomInteger(6);
        if (randomNum >= target) {
            numSaves++;
        }
        numList.push(randomNum);
    }

    if ((numSaves < amount) && fnpOn){
        var fnpAmount = amount-numSaves;
        for (var i=0; i<fnpAmount; i++){
            var randomNum2 = randomInteger(6);
            if (randomNum2 >= fnp) {
                fnpSaves++;
            } else if (rerollFNPFails){
                rerollFNPNum++;
            }
        fnpList.push(randomNum2);
        }
    }
    
    for (var i=0; i<rerollFNPNum; i++ ){
        var randomNum = randomInteger(6);
        if (randomNum >= fnp) {
            fnpSaves++;
        }
        fnpList.push(randomNum);
    }
    
    sendChat("GOD", "**SAVES**");
    sendChat("GOD", "I rolled **" + amount + "** times.");
    sendChat("GOD", "**"+ target + "**'s to Save." +" \nI got: **" + numList + "**.");
    
    if (rerollFails) {
        sendChat("GOD", "Rerolling **"+ rerollFailsNum + "** failures.");
    }
    if (rerollSuccesses){
        sendChat("GOD", "Rerolling **"+ rerollSuccessesNum + "** successes.");
    }
    sendChat("GOD", "Saving **"+ numSaves + "** times.");
    
    if (fnpOn) {
        sendChat("GOD", "**FEEL NO PAIN**");
        sendChat("GOD", "\n Then I rolled **" + fnpAmount + "** times for Feel No Pain.");
        sendChat("GOD", "**"+ fnp + "**'s to Feel No Pain." +" \nI got: **" + fnpList + "**.");
        if (rerollFNPFails) {
            sendChat("GOD", "Rerolling **"+ rerollFNPNum + "** Feel No Pain Failures.");
        }
        sendChat("GOD", "Saving **"+ fnpSaves + "** more times.");
    }
    
    var totalSaved = numSaves + fnpSaves;
    var totalUnsaved = amount - totalSaved;
    sendChat("GOD", "So, in the end **" + totalSaved + "** saved and **" + totalUnsaved + "** unsaved.");
    sendChat("GOD", "-------------------------------");
}

/*This function takes an integer as a parameter and subtracts it from the scatter rolled 
*The scatter odds are 4/6, and the directions are the 8 compass directions 
*/
function rollScatter(bs) {
    sendChat("GOD", "**SCATTER**");
    var scatterDie = randomInteger(6);
    if (scatterDie <= 2) {						//the Wargaming scatter dice have Direct hit on 2 sides and misses on the other 4
        sendChat("GOD", "**Direct Hit**!");
    } else {
        var directionInt = randomInteger(8);
        var direction = "";
        var distanceOne = randomInteger(6);
        var distanceTwo = randomInteger(6);
        var distanceTotal = distanceOne + distanceTwo - bs;
        
        switch (true){
            case directionInt == 1:
                direction = "North";
                break;
            case directionInt == 2:
                direction = "North-East";        
                break;
            case directionInt == 3:
                direction = "East";
                break;
            case directionInt == 4:
                direction = "South-East"
                break;
            case directionInt == 5:
                direction = "South";
                break;
            case directionInt == 6:
                direction = "South-West";
                break;
            case directionInt == 7:
                direction = "West";
                break;
            case directionInt == 8:
                direction = "North-West";
                break;
        }
        sendChat("GOD", "Your shot misses and scatters **" + distanceTotal + "** inches **" + direction + "**.");
    }
    sendChat("GOD", "-------------------------------");
}

function checkCharacters(){
	_.each(charactersList, function(characterName){
		var character = findObjs({_type: "character", name: characterName})[0];
		var attributeList;
        
        switch (characterName) {
            case "Saves":
                attributeList = SavesAttributes;
                break;
            case "ToHitToPen":
				attributeList = ToHitToPenAttributes;
                break;
            case "ToHitToWound":
				attributeList = ToHitToWoundAttributes;
                break;
        } 
        
		if (!character) {
			createObj("character", {name: characterName});
			character = findObjs({_type: "character", name: characterName})[0];
			character_id = character.id;
			_.each(attributeList,function(attribute){
				createObj('attribute', {
						characterid: character_id,
						name: attribute,
						current: "n",
						max: ""
				});
			});
		} else {
			var character_id = character.id;
			_.each(attributeList,function(attribute){
				var attributeObj = findObjs({ type: 'attribute', characterid: character_id, name: attribute})[0];
				if (!attributeObj) {
					newAttribute = createObj('attribute', {
						characterid: character_id,
						name: attribute,
						current: "n",
						max: ""
					});
				}
			});
		}
		
	});
}

//If there are multiple GM's registered to the game this will somewhat randomly allocate ownership of all of the macros to one of them.
function checkMacros() {

	_.each(macros,function(macroName){

		var macro = findObjs({_type: "macro", name: macroName})[0];
    	var playerList = findObjs({_type: "player"});
		var playerID = playerList[0].id;
		var GMFound = false;
		
		_.find(playerList,function(player){ 
            var thisID = player.id;
              if(playerIsGM(thisID)){
                  playerID = thisID;
                  return thisID;
              }
            });
		
        var GMid = playerID;

		if(!macro) {
			switch(macroName) {
				case "Saves":
					createObj('macro', {name: macroName, action: "!40k Saves ?{Roll How Many Dice?|0} ?{Saves on a What?|0} ?{Feel No Pain of?|0}", visibleto: "all", playerid: GMid, istokenaction: false});
                    break;
				case "ScatterDie":
					createObj('macro', {name: macroName, action: "!40k ScatterDie ?{Ballistic Skill|0}", visibleto: "all", playerid: GMid, istokenaction: false});
					break;
				case "ToHitToPen":
					createObj('macro', {name: macroName, action: "!40k ToHitToPen ?{Roll How Many Dice?|0} ?{Hits on a What?|0} ?{Strength?|0} ?{Against Armor?|0}", visibleto: "all", playerid: GMid, istokenaction: false});
					break;
				case "ToHitToWound":
					createObj('macro', {name: macroName, action: "!40k ToHitToWound ?{Roll How Many Dice?|0} ?{Hits on a What?|0} ?{Wounds on a What?|0}", visibleto: "all", playerid: GMid, istokenaction: false});
					break;
			}
		} else {
            
			switch(macroName) {
				case "Saves":
					if (macro.get("action") != "!40k Saves ?{Roll How Many Dice?|0} ?{Saves on a What?|0} ?{Feel No Pain of?|0}") {
						macro.set("action", "!40k Saves ?{Roll How Many Dice?|0} ?{Saves on a What?|0} ?{Feel No Pain of?|0}");
					}
					break;
				case "ScatterDie":
					if (macro.get("action") != "!40k ScatterDie ?{Ballistic Skill|0}") {
						macro.set("action", "!40k ScatterDie ?{Ballistic Skill|0}");
					}
					break;
				case "ToHitToPen":
					if (macro.get("action") != "!40k ToHitToPen ?{Roll How Many Dice?|0} ?{Hits on a What?|0} ?{Strength?|0} ?{Against Armor?|0}") {
						macro.set("action", "!40k ToHitToPen ?{Roll How Many Dice?|0} ?{Hits on a What?|0} ?{Strength?|0} ?{Against Armor?|0}");
					}
					break;
				case "ToHitToWound":
					if (macro.get("action") != "!40k ToHitToWound ?{Roll How Many Dice?|0} ?{Hits on a What?|0} ?{Wounds on a What?|0}") {
						macro.set("action", "!40k ToHitToWound ?{Roll How Many Dice?|0} ?{Hits on a What?|0} ?{Wounds on a What?|0}");
					}
					break;
			}
		}
		
	});
}