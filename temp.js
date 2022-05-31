const bcrpt = require("bcrypt");
async function run() {
  const salt = await bcrpt.genSalt(10);
  console.log(salt);
  const hashed = await bcrpt.hash("12345", salt);
  console.log(hashed);
}
run();
