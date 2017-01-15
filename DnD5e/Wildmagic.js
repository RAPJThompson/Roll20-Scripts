var baseChaos = 5;
var ChaosAdj = 0;
var totalChaos = 5;
var rollOnTable = false;

on("ready", function(){
    baseChaos=5;
	ChaosAdj=0;
	totalChaos = 5;
	log("Wildsurge Ready.")
});

on("chat:message", function(msg) {
  if(msg.type == "api" && msg.content.indexOf("!ChaosMagic ") !== -1) {
		ChaosAdj = msg.content.split(" ")[1];
		totalChaos = parseInt(baseChaos) + parseInt(ChaosAdj);
		sendChat("Wildsurge", "/w gm Total chaos chance = " + totalChaos + ".");
   }
  if(msg.type == "api" && msg.content.indexOf("!WildSurge") !== -1) {
        rollOnTable = true;   
  }
  log(msg.content);
  if(msg.content.indexOf("spell_level") !== -1){
      log("Is a Spell.")
	  var character = findObjs({_type: "character" , name: msg.who});
	  if (character.length !== 0){
	    log("There is a character.");    
	    character= character[0];
	    if (getAttrByName(character.id,"class_and_level").indexOf("Sorcerer") !== -1){
		    log("Found the Sorcerer")
		    var randomChanceRoll = randomInteger(100);
            log("Random chance= " + randomChanceRoll);
            if(randomChanceRoll <= totalChaos) {
		        rollOnTable=true;
            }
	    }
	  }
  }
  if(rollOnTable) {
    var randomRoll = randomInteger(100);
    log("Random = " + randomRoll);
    switch(true) {
        case (randomRoll <= 2):
            sendChat(msg.who, "Wild Surge Result: Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls.");
            break;
        case (randomRoll >= 3 && randomRoll <= 4):
            sendChat(msg.who, "Wild Surge Result: For the next minute, you can see any invisible creature if you have line of sight to it.");
            break;
        case (randomRoll >= 5 && randomRoll <= 6):
            sendChat(msg.who, "Wild Surge Result: A modron chosen and controlled by the DM appears in an unoccupied space within 5 feet of you, then disappears 1 minute later.");
            break;
        case (randomRoll >= 7 && randomRoll <= 8):
            sendChat(msg.who, "Wild Surge Result: You cast fireball as a 3rd-level spell centered on yourself.");
            break;
        case (randomRoll >= 9 && randomRoll <= 10):
            sendChat(msg.who, "Wild Surge Result: You cast magic missile as a 5th-level spell. ");
            break;
        case (randomRoll >= 11 && randomRoll <= 12):
            sendChat(msg.who, "Wild Surge Result: Roll a d10. Your height changes by a number of inches equal to the roll. If the roll is odd, you shrink. If the roll is even, you grow.");
            break;
        case (randomRoll >= 13 && randomRoll <= 14):
            sendChat(msg.who, "Wild Surge Result: You cast confusion centered on yourself. ");
            break;
        case (randomRoll >= 15 && randomRoll <= 16):
            sendChat(msg.who, "Wild Surge Result: For the next minute, you regain 5 hit points at the start of each of your turns.");
            break;
        case (randomRoll >= 17 && randomRoll <= 18):
            sendChat(msg.who, "Wild Surge Result: You grow a long beard made of feathers that remains until you sneeze, at which point the feathers explode out from your face.");
            break;
        case (randomRoll >= 19 && randomRoll <= 20):
            sendChat(msg.who, "Wild Surge Result: You cast grease centered on yourself.");
            break;
        case (randomRoll >= 21 && randomRoll <= 22):
            sendChat(msg.who, "Wild Surge Result: Creatures have disadvantage on saving throws against the next spell you cast in the next minute that involves a saving throw.");
            break;
        case (randomRoll >= 23 && randomRoll <= 24):
            sendChat(msg.who, "Wild Surge Result: Your skin turns a vibrant shade of blue. A remove curse spell can end this effect.");
            break;
        case (randomRoll >= 25 && randomRoll <= 26):
            sendChat(msg.who, "Wild Surge Result: An eye appears on your forehead for the next minute. During that time, you have advantage on Wisdom (Perception) checks that rely on sight.");
            break;
        case (randomRoll >= 27 && randomRoll <= 28):
            sendChat(msg.who, "Wild Surge Result: For the next minute, all your spells with a casting time of 1 action have a casting time of 1 bonus action.");
            break;
        case (randomRoll >= 29 && randomRoll <= 30):
            sendChat(msg.who, "Wild Surge Result: You teleport up to 60 feet to an unoccupied space of your choice that you can see. ");
            break;
        case (randomRoll >= 31 && randomRoll <= 32):
            sendChat(msg.who, "Wild Surge Result: You are transported to the Astral Plane until the end of your next turn, after which time you return to the space you previously occupied or the nearest unoccupied space if that space is occupied.");
            break;
        case (randomRoll >= 33 && randomRoll <= 34):
            sendChat(msg.who, "Wild Surge Result: Maximize the damage of the next damaging spell you cast within the next minute. ");
            break;
        case (randomRoll >= 35 && randomRoll <= 36):
            sendChat(msg.who, "Wild Surge Result: Roll a d10. Your age changes by a number of years equal to the roll. If the roll is odd, you get younger (minimum 1 year old). If the roll is even, you get older.");
            break;
        case (randomRoll >= 37 && randomRoll <= 38):
            sendChat(msg.who, "Wild Surge Result: 1d6 flumphs controlled by the Dm appear in unoccupied spaces within 60 feet of you and are frightened of you. They vanish after 1 minute.");
            break;
        case (randomRoll >= 39 && randomRoll <= 40):
            sendChat(msg.who, "Wild Surge Result: You regain 2d10 hit points. ");
            break;
        case (randomRoll >= 41 && randomRoll <= 42):
            sendChat(msg.who, "Wild Surge Result: You turn into a potted plant until the start of your next turn. While a plant, you are incapacitated and have vulnerability to all damage. If you drop to 0 hit points, your pot breaks, and your form reverts.");
            break;
        case (randomRoll >= 43 && randomRoll <= 44):
            sendChat(msg.who, "Wild Surge Result: For the next minute, you can teleport up to 20 feet as a bonus action on each of your turns.");
            break;
        case (randomRoll >= 45 && randomRoll <= 46):
            sendChat(msg.who, "Wild Surge Result: You cast levitate on yourself.");
            break;
        case (randomRoll >= 47 && randomRoll <= 48):
            sendChat(msg.who, "Wild Surge Result: A unicorn controlled by the DM appears in a space within 5 feet of you, then disappears 1 minute later.");
            break;
        case (randomRoll >= 49 && randomRoll <= 50):
            sendChat(msg.who, "Wild Surge Result: You can’t speak for the next minute. Whenever you try, pink bubbles float out of your mouth.");
            break;
        case (randomRoll >= 51 && randomRoll <= 52):
            sendChat(msg.who, "Wild Surge Result: A spectral shield hovers near you for the next minute, granting you a +2 bonus to AC and immunity to magic missile.");
            break;
        case (randomRoll >= 53 && randomRoll <= 54):
            sendChat(msg.who, "Wild Surge Result: You are immune to being intoxicated by alcohol for the next 5d6 days.");
            break;
        case (randomRoll >= 55 && randomRoll <= 56):
            sendChat(msg.who, "Wild Surge Result: Your hair falls out but grows back within 24 hours.");
            break;
        case (randomRoll >= 57 && randomRoll <= 58):
            sendChat(msg.who, "Wild Surge Result: or the next minute, any flammable object you touch that isn’t being worn or carried by another creature bursts into flame.");
            break;
        case (randomRoll >= 59 && randomRoll <= 60):
            sendChat(msg.who, "Wild Surge Result: You regain your lowest-level expended spell slot.");
            break;
        case (randomRoll >= 61 && randomRoll <= 62):
            sendChat(msg.who, "Wild Surge Result: For the next minute, you must shout when you speak.");
            break;
        case (randomRoll >= 63 && randomRoll <= 64):
            sendChat(msg.who, "Wild Surge Result: You cast fog cloud centered on yourself.");
            break;
        case (randomRoll >= 65 && randomRoll <= 66):
            sendChat(msg.who, "Wild Surge Result: Up to three creatures you choose within 30 feet of you take 4d10 lightning damage.");
            break;
        case (randomRoll >= 67 && randomRoll <= 68):
            sendChat(msg.who, "Wild Surge Result: You are frightened by the nearest creature until the end of your next turn.");
            break;
        case (randomRoll >= 69 && randomRoll <= 70):
            sendChat(msg.who, "Wild Surge Result: Each creature within 30 feet of you becomes invisible for the next minute. The invisibility ends on a creature when it attacks or casts a spell.");
            break;
        case (randomRoll >= 71 && randomRoll <= 72):
            sendChat(msg.who, "Wild Surge Result: You gain resistance to all damage for the next minute.");
            break;
        case (randomRoll >= 73 && randomRoll <= 74):
            sendChat(msg.who, "Wild Surge Result: A random creature within 60 feet of you becomes poisoned for 1d4 hours.");
            break;
        case (randomRoll >= 75 && randomRoll <= 76):
            sendChat(msg.who, "Wild Surge Result: You glow with bright light in a 30-foot radius for the next minute. Any creature that ends its turn within 5 feet of you is blinded until the end of its next turn.");
            break;
        case (randomRoll >= 77 && randomRoll <= 78):
            sendChat(msg.who, "Wild Surge Result: You cast polymorph on yourself. If you fail the saving throw, you turn into a sheep for the spell’s duration.");
            break;
        case (randomRoll >= 79 && randomRoll <= 80):
            sendChat(msg.who, "Wild Surge Result: Illusory butterflies and flower petals flutter in the air within 10 feet of you for the next minute.");
            break;
        case (randomRoll >= 81 && randomRoll <= 82):
            sendChat(msg.who, "Wild Surge Result: You can take one additional action immediately.");
            break;
        case (randomRoll >= 83 && randomRoll <= 84):
            sendChat(msg.who, "Wild Surge Result: Each creature within 30 feet of you takes 1d10 necrotic damage. You regain hit points equal to the sum of the necrotic damage dealt.");
            break;
        case (randomRoll >= 85 && randomRoll <= 86):
            sendChat(msg.who, "Wild Surge Result: You cast mirror image.");
            break;
        case (randomRoll >= 87 && randomRoll <= 88):
            sendChat(msg.who, "Wild Surge Result: You cast fly on a random creature within 60 feet of you.");
            break;
        case (randomRoll >= 89 && randomRoll <= 90):
            sendChat(msg.who, "Wild Surge Result: You become invisible for the next minute. During that time, other creatures can’t hear you. The invisibility ends if you attack or cast a spell.");
            break;
        case (randomRoll >= 91 && randomRoll <= 92):
            sendChat(msg.who, "Wild Surge Result: If you die within the next minute, you immediately come back to life as if by the reincarnate spell.");
            break;
        case (randomRoll >= 93 && randomRoll <= 44):
            sendChat(msg.who, "Wild Surge Result: Your size increases by one size category for the next minute.");
            break;
        case (randomRoll >= 95 && randomRoll <= 96):
            sendChat(msg.who, "Wild Surge Result: You and all creatures within 30 feet of you gain vulnerability to piercing damage for the next minute.");
            break;
        case (randomRoll >= 97 && randomRoll <= 98):
            sendChat(msg.who, "Wild Surge Result: You are surrounded by faint, ethereal music for the For the next minute.");
            break;
        case (randomRoll >= 99 && randomRoll <= 100):
            sendChat(msg.who, "Wild Surge Result: You regain all expended sorcery points.");
            break;
        default:
            sendChat(msg.who, "Wild Surge Result: Table Error");
    }
	rollOnTable = false;
  }
});
