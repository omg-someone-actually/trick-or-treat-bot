const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');

function save_users(users){
    fs.writeFile("users.json", users, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }}); 
}

function add_candy(member){
    fs.readFile("users.json", function(err, data) {
      
        if (err) throw err;
       
        var users = JSON.parse(JSON.stringify(data));
          
        if (!(member in users)){
            users[member] = {};
            users[member]["candy"] = 0;
            users[member]["tricks"] = 0;
        }
        users[member]["candy"] ++;
        save_users(JSON.stringify(users))
    })
}

function add_trick(member){
    fs.readFile("users.json", function(err, data) {
      
        if (err) throw err;
       
        var users = JSON.parse(JSON.stringify(data));
          
        if (!(member in users)){
            users[member] = {};
            users[member]["candy"] = 0;
            users[member]["tricks"] = 0;
        }
        users[member]["tricks"] ++;
        save_users(JSON.stringify(users))
    })

};

function get_candy(member){
    var data = fs.readFileSync("users.json")
       
        var users = JSON.parse(JSON.stringify(data));

        if (!(member in users)){
            users[member] = {};
            users[member]["candy"] = 0;
            users[member]["tricks"] = 0;
            save_users(JSON.stringify(users))
        }
          
        return users[member]['candy']

};

function get_tricks(member){
    var data = fs.readFileSync("users.json")
             
        var users = JSON.parse(JSON.stringify(data));

        if (!(member in users)){
            users[member] = {};
            users[member]["candy"] = 0;
            users[member]["tricks"] = 0;
            save_users(JSON.stringify(users))
            
        }
        return users[member]['tricks']
}

function randint(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    );
  };
  
  bot.ready_to_trick_or_treat = false;

  bot.on("ready", async () => {
    await bot.guilds.cache.get('guild_id').commands.set([]);
    if (!bot.application?.owner) bot.application?.fetch();

    bot.guilds.cache.get('guild_id')?.commands.create({
        name: "bag",
        description: "See your treats and tricks!"
    });

    bot.guilds.cache.get('guild_id')?.commands.create({
        name: "trick-or-treat",
        description: "Trick or treat?!"
    });
  })

bot.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'bag') {
        await interaction.reply(`Candy: ${get_candy(interaction.user.id)}\nTricks: ${get_tricks(interaction.user.id)}`);
  }
    if (interaction.commandName == "trick-or-treat"){
        if (bot.ready_to_trick_or_treat){
            if (randint(0, 1) == 0){
                await interaction.reply("Hey there! Enjoy your candy.")
                add_candy(interaction.user.id)
           }
             else {
               await interaction.reply("Not this time, boo!")
               add_trick(interaction.user.id)
           }
             bot.ready_to_trick_or_treat = false;
        }
    }
})
  
  bot.on("messageCreate", async (message) => {
      if (message.author.bot) return;
      if (randint(1, 50) == 32) {
          message.channel.send("Trick or treat!");
          bot.ready_to_trick_or_treat = true;
    }
  })

bot.login("bot_token");
