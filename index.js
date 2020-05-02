const discord = require("discord.js");
const fetch = require("node-fetch");
const {
  prefix,
  token,
  unsplashAccessKey,
  unsplashSecretKey,
} = require("./config.json");

// Get a reference and initialize the Unsplash api
const { toJson } = require("unsplash-js");
const Unsplash = require("unsplash-js").default;
const unsplash = new Unsplash({
  accessKey: unsplashAccessKey,
}); // Do NOT confuse between "unsplash" & "Unsplash". Notice the capitalization of "U"

// Initialize fetch
global.fetch = fetch;

// Initialize the Discord client
const client = new discord.Client();

// When the server gets ready, fire this message up
client.once("ready", () => {
  console.log("The Discord bot is listening for commands...");
});

// A method to generate a random number, 0 - max
// Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function generateRandomInteger(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Listen for messages
client.on("message", (message) => {
  if (message.content.startsWith(`${prefix}unsplash`)) {
    const imageType = message.content.substring(10).trim();

    if (imageType == null || imageType === "" || imageType.length == 0) {
      // Fetch random
      unsplash.photos
        .listPhotos(1, 20, "latest")
        .then(toJson)
        .then((res) => {
          let randomNum = generateRandomInteger(res.length);
          let finalResponse = res[randomNum];

          message.channel.send(
            "> Photo by " +
              finalResponse.user.name +
              " on Unsplash. " +
              finalResponse.links.download,
            {
              file:
                finalResponse.urls.thumb == null
                  ? finalResponse.urls.small
                  : finalResponse.urls.thumb,
            }
          );
        });
    } else {
      // Search
      unsplash.search
        .photos(imageType, 1, 20)
        .then(toJson)
        .then((res) => {
          let randomNum = generateRandomInteger(res.results.length);
          let finalResponse = res.results[randomNum];

          message.channel.send(
            "> Photo by " +
              finalResponse.user.name +
              " on Unsplash. " +
              finalResponse.links.download,
            {
              file:
                finalResponse.urls.thumb == null
                  ? finalResponse.urls.small
                  : finalResponse.urls.thumb,
            }
          );
        });
    }
  }
});

client.login(token);
