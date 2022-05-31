module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    console.log("FATAL EROOR JWTPRIVATE KEY IS NOT FOUND");
    process.exit(1);
  }
};
