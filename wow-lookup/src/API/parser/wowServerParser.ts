
/**
 * function used to parse the response with the servers and put it in a usable format
 * @param {Object} serversData Dictionary returned by the API
 * @returns Array with every single server in the game
 */
function parseServers(serversData: Record<string, Record<string, Record<string, Array<Record<string, string>>>>>) : {label: string, value: string}[]{
  let returnDict: {label: string, value: string}[] = [];
  Object.entries(serversData.data).forEach((region, i) => {
    region[1].realms.forEach((server, j) => {
      returnDict.push({
        label: server.name + "-" + region[0],
        value: server.slug + "&" + region[0],
      });
    });
  });
  return returnDict;
}
export default parseServers;
