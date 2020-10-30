//Featuring the webex-node-bot-framework - https://www.npmjs.com/package/webex-node-bot-framework

var framework = require('webex-node-bot-framework');
var webhook = require('webex-node-bot-framework/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(express.static('images'));
const config = require("./config.json");

// init framework
var framework = new framework(config);
framework.start();
console.log("Starting framework, please wait...");

framework.on("initialized", function () {
  console.log("framework is all fired up! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// If actorId is set, it means that user has just added your bot to a new space
// If not, the framework has discovered your bot in an existing space
framework.on('spawn', (bot, id, actorId) => {
  if (!actorId) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    console.log(`While starting up, the framework found our bot in a space called: ${bot.room.title}`);
  } else {
    // When actorId is present it means someone added your bot got added to a new space
    // Lets find out more about them..
    var msg = 'You can say `bored` to get the list of entertainment I can provide. You can also say `help` to explore other functions. \n\n I`m here to bring entertainment to you and your teammates to overcome the lack of socializing during the COVID-19 pandemic.';
    bot.webex.people.get(actorId).then((user) => {
      msg = `Hello there ${user.displayName}. ${msg}`; 
    }).catch((e) => {
      console.error(`Failed to lookup user details in framwork.on("spawn"): ${e.message}`);
      msg = `Hello there, ${msg}. My name is Bond and I'm here to bring entertainment for you and your team.`;  
    }).finally(() => {
      // Say hello, and tell users what you do!
      if (bot.isDirect) {
        bot.say('markdown', msg);
      } else {
        let botName = bot.person.displayName;
        msg += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* ${botName}.`;
        bot.say('markdown', msg);
      }
    });
  }
});


//Process incoming messages

let responded = false;
/* On mention with command
ex User enters @botname help, the bot will write back in markdown
*/
framework.hears(/help|what can i (do|say)|what (can|do) you do/i, function (bot, trigger) {
  console.log(`someone needs help! They asked ${trigger.text}`);
  responded = true;
  bot.say(`Hello ${trigger.person.displayName}.`)
    .then(() => sendHelp(bot))
    .catch((e) => console.error(`Problem in help hander: ${e.message}`));
});


/* On mention with command
ex User enters @botname help, the bot will write back in markdown
*/
framework.hears(/bored|what can i do |what (can|do) you do/i, function (bot, trigger) {
    console.log(`someone is bored! They asked ${trigger.text}`);
    responded = true;
    bot.say(`Hello ${trigger.person.displayName}.`)
      .then(() => sendGame(bot))
      .catch((e) => console.error(`Problem in help hander: ${e.message}`));
  });


/* On mention with command
ex User enters @botname Snake Game, the bot will write back in markdown
*/
framework.hears('Snake', function (bot) {
    console.log("Snake Game command received");
    responded = true;
    bot.say("markdown", "The primary purpose for the [Snake](https://slither.io) is to consume the blocks and grow your snake as much as possible. \n * The key is to consume blocks and avoid being eaten by other large snakes. Good luck!");
  });

  
/* On mention with command
ex User enters @botname Skribbl Game, the bot will write back in markdown
*/
framework.hears('Skribbl', function (bot) {
    console.log("Skribbl Game command received");
    responded = true;
    bot.say("markdown", "The [Skribbl](https://skribbl.io/) is a multi-player game designed to bring the team together. \n * When it's your turn to draw, you will have to choose a word from three options and visualize that word in 80 seconds, alternatively when somebody else is drawing, you have to type your guess into the chat to gain points. Be quick! The earlier you guess a word, the more points you get! Good luck!");
  });


/* On mention with command
ex User enters @botname Cards Game, the bot will write back in markdown
*/
framework.hears('Cards', function (bot) {
    console.log("Cards Game command received");
    responded = true;
    bot.say("markdown", "The [Cards](https://playingcards.io/) is a multi-player card games designed to bring the team together. There are numerous options to choose from: \n * Go Fish \n * Joking Hazard \n * Hearts \n * and more! \n\n Check out the link to explore options to play with your peers! Good luck!");
  });


/* On mention with command
ex User enters @botname Shooting Game, the bot will write back in markdown
*/
framework.hears('Shooting Game', function (bot) {
    console.log("Shooting Game command received");
    responded = true;
    bot.say("markdown", "The [Shooting Game](https://krunker.io/) is a single- and multi-player game designed to bring retro-themed entertainment. \n * You can host the game if you'd like to invite others and join you! Invite them for a friendly competition to blow off steam! \n Just remember to have fun! Good luck!");
  });



  /* On mention with command, using other trigger data, can use lite markdown formatting
ex User enters @botname 'info' phrase, the bot will provide personal details
*/
framework.hears('info', function (bot, trigger) {
  console.log("info command received");
  responded = true;
  //the "trigger" parameter gives you access to data about the user who entered the command
  let personAvatar = trigger.person.avatar;
  let personEmail = trigger.person.emails[0];
  let personDisplayName = trigger.person.displayName;
  let outputString = `Here is your personal information: \n\n\n **Name:** ${personDisplayName}  \n\n\n **Email:** ${personEmail} \n\n\n **Avatar URL:** ${personAvatar}`;
  bot.say("markdown", outputString);
});

/* On mention with bot data 
ex User enters @botname 'space' phrase, the bot will provide details about that particular space
*/
framework.hears('space', function (bot) {
  console.log("space. the final frontier");
  responded = true;
  let roomTitle = bot.room.title;
  let spaceID = bot.room.id;
  let roomType = bot.room.type;

  let outputString = `The title of this space: ${roomTitle} \n\n The roomID of this space: ${spaceID} \n\n The type of this space: ${roomType}`;

  console.log(outputString);
  bot.say("markdown", outputString)
    .catch((e) => console.error(`bot.say failed: ${e.message}`));

});

/* 
   Say hi to every member in the space
   This demonstrates how developers can access the webex
   sdk to call any Webex API.  API Doc: https://webex.github.io/webex-js-sdk/api/
*/
framework.hears("say hi to everyone", function (bot) {
  console.log("say hi to everyone.  Its a party");
  responded = true;
  // Use the webex SDK to get the list of users in this space
  bot.webex.memberships.list({roomId: bot.room.id})
    .then((memberships) => {
      for (const member of memberships.items) {
        if (member.personId === bot.person.id) {
          // Skip myself!
          continue;
        }
        let displayName = (member.personDisplayName) ? member.personDisplayName : member.personEmail;
        bot.say(`Hello ${displayName}`);
      }
    })
    .catch((e) => {
      console.error(`Call to sdk.memberships.get() failed: ${e.messages}`);
      bot.say('Hello everybody!');
    });
});

// Buttons & Cards data
let cardJSON =
{
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  type: 'AdaptiveCard',
  version: '1.0',
  body:
    [{
      type: 'ColumnSet',
      columns:
        [{
          type: 'Column',
          width: '5',
          items:
            [{
              type: 'Image',
              url: 'Your avatar appears here!',
              size: 'large',
              horizontalAlignment: "Center",
              style: 'person'
            },
            {
              type: 'TextBlock',
              text: 'Your name will be here!',
              size: 'medium',
              horizontalAlignment: "Center",
              weight: 'Bolder'
            },
            {
              type: 'TextBlock',
              text: 'And your email goes here!',
              size: 'small',
              horizontalAlignment: "Center",
              isSubtle: true,
              wrap: false
            }]
        }]
    }]
};

/* On mention with card example
ex User enters @botname 'card me' phrase, the bot will produce a personalized card - https://developer.webex.com/docs/api/guides/cards
*/
framework.hears('card me', function (bot, trigger) {
  console.log("someone asked for a card");
  responded = true;
  let avatar = trigger.person.avatar;

  cardJSON.body[0].columns[0].items[0].url = (avatar) ? avatar : `${config.webhookUrl}/missing-avatar.jpg`;
  cardJSON.body[0].columns[0].items[1].text = trigger.person.displayName;
  cardJSON.body[0].columns[0].items[2].text = trigger.person.emails[0];
  bot.sendCard(cardJSON, 'This is customizable fallback text for clients that do not support buttons & cards');
});



/* On mention with unexpected bot command
   Its a good practice is to gracefully handle unexpected input
*/
framework.hears(/.*/, function (bot, trigger) {
  // This will fire for any input so only respond if we haven't already
  if (!responded) {
    console.log(`catch-all handler fired for user input: ${trigger.text}`);
    bot.say(`Sorry, I can't respond to "${trigger.text}" yet. Please try again.`)
      .then(() => sendHelp(bot))
      .catch((e) => console.error(`Problem in the unexepected command hander: ${e.message}`));
  }
  responded = false;
});

function sendHelp(bot) {
  bot.say("markdown", 'These are the commands I can respond to:', '\n\n ' +
    '1. **info**  (get your personal details) \n' +
    '2. **space**  (get details about this space) \n' +
    '3. **card me** (a cool card!) \n' +
    '4. **say hi to everyone** (everyone gets a greeting using a call to the Webex SDK) \n' +
    '5. **help** (what you are reading now)');
}

// This function lists the game options the bot is able to provide//
function sendGame(bot) {
    bot.say("markdown", "These are the lists of games I have: ", '\n\n ' +
    '1. **Snake** (single player) \n' +
    '2. **Skribbl** (multi-player) \n' +
    '3. **Cards** (multi-player) \n' +
    '4. **Shooting Games** (single and multi-player) \n\n' +
    'If you have any suggestions to our game pool, please contact us. We appreciate it!'
    );
}


//Server config & housekeeping
// Health Check
app.get('/', function (req, res) {
  res.send(`I'm alive.`);
});

app.post('/', webhook(framework));

var server = app.listen(config.port, function () {
  framework.debug('framework listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function () {
  framework.debug('stoppping...');
  server.close();
  framework.stop().then(function () {
    process.exit();
  });
});
