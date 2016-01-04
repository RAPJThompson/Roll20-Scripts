/*on("ready", function(){
    init();
});

function init(){
    log("Event Sequencer ready.");
}

on("change:campaign:playerpageid", function() {
    init();
});
*/


on("chat:message", function(msg) {

 if(msg.type == "api" && msg.content.toLowerCase().indexOf("!events") !== -1) {
    log(" ");
    var selected = msg.selected;
    var eventToken;
    if (!selected) { sendChat("JEEVES", "/w GM Nothing selected."); return; }
    
	
    //check to see whether the object selected represents an event sequence. Return if it doesn't.
    eventToken = getObj("graphic", selected[0]._id);
    var eventRepresentsID = eventToken.get("represents");
	var eventCharacter = getObj("character", eventRepresentsID);
	var eventName = eventCharacter.get("name");
	if (eventName.indexOf("Event") == -1) {
        SendChat("JEEVES", "I'm sorry, but that is not an event character.");
		return;
	}

    eventObjects = findObjs({_pageid: selected.get("_pageid"), _type: "graphic" , represents: eventRepresentsID});		//these are all of the objects that the event sequence has
	
    //need to take the signpost out of the array
    //log("Starting search for Signpost");
    //log("Array has length of " + eventObjects.length);
    for(var i=0; i<eventObjects.length; i++) {
        //log("Checking for Signpost");
        if (eventObjects[i].get("name").toLowerCase().indexOf("event") !== -1) {
            //log("Removing Signpost");
            var holderObject = eventObjects[i];
            eventObjects[i] = eventObjects[eventObjects.length-1];
            eventObjects[eventObjects.length-1] = holderObject;
            eventObjects.pop();
            break;
        }
    }
    
	customPrintNames(eventObjects); 	//check array order before sort	by printing them to the log
    eventObjects = quicksort(eventObjects, compareGraphics);
	customPrintNames(eventObjects); 	//check array order after sort by printing them to the log
	
	//get the total number of events in the sequence 
	var stagesInSequence = parseInt(eventObjects[eventObjects.length-1].get("name"));
	//log("Num of Stages: " +stagesInSequence);
	//get current stage of sequence
	var currentStage = -1;
	for (var i=0; i<eventObjects.length; i++){
		if (eventObjects[i].get("layer") == "map"){
			currentStage = parseInt(eventObjects[i].get("name"));
			break;
		}
	}
	if (currentStage == -1) {
		sendChat("JEEVES", "/w GM I'm sorry, but I couldn't determine what stage this event is currently at.");
		return;
	}
	//log("Currently on stage " + currentStage);
	
	//now check whether it is to move forward or back, assume it was meant to go forwards unless otherwise stated
	var nextStage = -1;
	if (msg.content.toLowerCase().indexOf("back") !== -1) {
		if (currentStage == 1) {
			sendChat("JEEVES", "/w GM You are at the beginning of this sequence. I will take it to it's final state.");
			nextStage = stagesInSequence;
		} else {
			nextStage = currentStage-1;
		}
		
		for (var i=0; i<eventObjects.length; i++){
			if (parseInt(eventObjects[i].get("name")) == nextStage){
				eventObjects[i].set("layer", "map");
			} else {
				eventObjects[i].set("layer", "walls");
			}
		}
	} else {
		if (currentStage == stagesInSequence) {
			sendChat("JEEVES", "/w GM You are at the end of this sequence. I will return it to it's starting state.");
			nextStage = 1;
		} else {
			nextStage = currentStage+1;
		}
		
		for (var i=0; i<eventObjects.length; i++){
			if (parseInt(eventObjects[i].get("name")) == nextStage){
				eventObjects[i].set("layer", "map");
			} else {
				eventObjects[i].set("layer", "walls");
			}
		}
	}
    eventToken.set("bar1_value", nextStage);
    eventToken.set("bar1_max", stagesInSequence);
 }
});

//Generalized quicksort
function quicksort(arr, customSort){
  //if no customSort is provided
  if(!customSort) {
    log("No custom sorting function provided.");
    customSort = function(a, b) {
      return a < b;
    };
  }
  //if array is empty
  if (arr.length === 0) {
    return [];
  }
  var left = [];
  var right = [];
  var pivot = arr[0];
  //go through each element in array
  for (var i = 1; i < arr.length; i++) {
    if (customSort(arr[i], pivot)) {
     left.push(arr[i]);
    } else {
      right.push(arr[i]);
     }
  }
  return quicksort(left, customSort).concat(pivot, quicksort(right, customSort));
};

//Custom compare function to compare two graphic objects that have integers as their names.
function compareGraphics(graphicA, graphicB) {
	var valueA;
	var valueB;
	valueA = parseInt(graphicA.get("name"));
	valueB = parseInt(graphicB.get("name"));
	
	return valueA < valueB;
}

//custom print funtion to print Roll20 Object names. Useful for testing purposes.
function customPrintNames(array) {
	var stringtoPrint = " ";
	for(var i = 0; i < array.length; i++) {
		stringtoPrint = stringtoPrint + array[i].get("name") + " ";
	}
	//log("Final object order" + stringtoPrint);
}

