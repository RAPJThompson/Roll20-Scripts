var macros = ["Saves", "ScatterDie", "ToHitToPen", "ToHitToWound"];

on("chat:message", function(){
    if(msg.type == "api" && msg.content.indexOf("!Remove40kMacros") !== -1) {
        _.each(macros,function(macroName){
            var macro = findObjs({_type: "macro", name: macroName})[0];
            log("Deleting macro: " + macroName);
            macro.remove();
        });
    }
});
