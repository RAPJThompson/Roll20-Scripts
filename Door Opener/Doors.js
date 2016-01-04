var allDoors;
var allDoorGraphics;
var doorCharacter;
var doorColour = "#00ffff";

on("ready", function(){
    initDoors();
});

//treats all cyan coloured lines as "doors"

function initDoors(){
    allDoors = findObjs({ _pageid: Campaign().get("playerpageid"), _type: "path" , stroke: doorColour});
    sendChat("JARVIS", "/w GM I've connected to " + allDoors.length + " doors.");
    
    doorCharacter = findObjs({_type: "character", name: "Doors"})[0];
    allDoorGraphics =  findObjs({_pageid: Campaign().get("playerpageid"), _type: "graphic" , represents: doorCharacter.id});    
    sendChat("JARVIS", "/w GM I've located " + allDoorGraphics.length + " door graphics.");
}

on("change:campaign:playerpageid", function() {
    initDoors();
});

on("chat:message", function(msg) {
 if(msg.type == "api" && msg.content.toLowerCase().indexOf("!doors refresh") !== -1) { initDoors(); return;}
 if(msg.type == "api" && msg.content.toLowerCase().indexOf("!doors") !== -1) {

    var selected = msg.selected;
    var openerToken;
    if (!selected) { sendChat("JARVIS", "Nothing selected."); return; }
    openerToken = getObj("graphic", selected[0]._id);
    if (openerToken.get("_pageid") !== Campaign().get("playerpageid")) {sendChat("JARVIS", "/w GM Changing the Player Page before trying to open and close doors would seem to be more productive. ");return;}
    var targetDoor = findClosestDoor(openerToken);
    
    if (targetDoor.get("layer") == "walls"){
        targetDoor.set("layer", "gmlayer");
        log("Moving line to gm layer.");
    } else {
        targetDoor.set("layer", "walls");
        log("Moving line to dynamic lighting layer.");
    }
    
    var targetGraphics = findClosestGraphics(openerToken);
    _.each(targetGraphics, function(door){
        if (door){
            if (door.get("layer") == "walls") {
                door.set("layer", "map");
                log("Moving graphic to token layer.");
            } else {
                door.set("layer", "walls");
                log("Moving graphic to gm layer.");
            }
        }
    });
    
 }
});



function findClosestDoor(opener) {
    
    var openerX = opener.get("left");
    var openerY = opener.get("top");
    var closest;
    var closestValue = -1;
    log("Searching for Dynamic Lighting Door");
    _.each(allDoors, function(door){
            var doorX = door.get("left");
            var doorY = door.get("top");
            var distance = calculateDistance(openerX, openerY, doorX, doorY);
            
        if (closestValue == -1){
            closest = door;
            closestValue = distance;
        } else {
            if (distance < closestValue){
                closest = door;
                closestValue = distance;
            }
        }
    });

    return closest;
    
}

function findClosestGraphics(opener) {
    
    var openerX = opener.get("left");
    var openerY = opener.get("top");
    var closestTokenLayer;
    var closestGMLayer;
    var closestValueTokenLayer = -1;
    var closestValueGMLayer = -1;
    var closestGraphics;

    log("Searching for Closest Door");
    _.each(allDoorGraphics, function(door){
            var doorX = door.get("left");
            var doorY = door.get("top");
            var distance = calculateDistance(openerX, openerY, doorX, doorY);
            
        if (door.get("layer") == "map") {
            if (closestValueTokenLayer == -1){
                closestTokenLayer = door;
                closestValueTokenLayer = distance;
            } else {
                if (distance < closestValueTokenLayer){
                    closestTokenLayer = door;
                    closestValueTokenLayer = distance;
                }
            }
        } else if (door.get("layer") == "walls") { 
            if (closestValueGMLayer == -1){
                closestGMLayer = door;
                closestValueGMLayer = distance;
            } else {
                if (distance < closestValueGMLayer){
                    closestGMLayer = door;
                    closestValueGMLayer = distance;
                }
            }
            
        }
    });
    
    closestGraphics = [closestGMLayer, closestTokenLayer]
    return closestGraphics;
    
}

function calculateDistance(openerX, openerY, doorX, doorY){
    var deltaX = Math.abs(openerX-doorX);
    var deltaY = Math.abs(openerY-doorY);

    var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    return distance;
}