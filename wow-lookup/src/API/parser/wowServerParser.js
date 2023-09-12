
/**
 * function used to parse the response with the servers and put it in a usable format
 * @param {Object} serversData Dictionary returned by the API
 * @returns Array with every single server in the game
 */
function parseServers(serversData) {
  let returnDict = [];
  Object.entries(serversData.data).map((region, i) => {
    region[1].realms.map((server, j) => {
      returnDict.push({
        label: server.name + "-" + region[0],
        value: server.slug + "&" + region[0],
      });
      return null;
    });
    return null;
  });
  return returnDict;
}
export default parseServers;
