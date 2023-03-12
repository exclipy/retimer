const fs = require("fs");

const files = fs.readdirSync("./");
for (const file of files) {
  const result = file.match(new RegExp("(.*)\\.json"));
  if (result) {
    const stem = result[1];
    const json = require(`./${file}`);
    const outputFilename = `${stem}.ogg`;
    fs.writeFileSync(outputFilename, Buffer.from(json.audioContent, "base64"));
    console.log(file, "converted to", outputFilename);
  }
}
