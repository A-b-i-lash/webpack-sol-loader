const path = require("path");
const solc = require("solc");
const fs = require("fs");

function getFindImports(resourcePath) {
  return function findImports(relativePath) {
    const source = fs.readFileSync(
      path.join(path.dirname(resourcePath), relativePath),
      "utf8"
    );
    return { contents: source };
  };
}

module.exports = async function (source) {
  await solc.loadRemoteVersion(
    "v0.8.17+commit.8df45f5f",
    function (err, solcSnapshot) {
      /* ... */
    }
  );

  const filename = path.basename(this.resourcePath);
  const input = {
    language: "Solidity",
    sources: {
      [filename]: {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const output = JSON.parse(
    solc.compile(JSON.stringify(input), {
      import: getFindImports(this.resourcePath),
    })
  );
  if (output.errors) {
    throw new Error(JSON.stringify(output.errors));
  }

  const contractNames = Object.keys(output.contracts[filename]);
  const contracts = contractNames.map((name) => ({
    bytecode: "0x" + output.contracts[filename][name].evm.bytecode.object,
    abi: output.contracts[filename][name].abi,
  }));

  if (contracts.length === 1) {
    return `export default ${JSON.stringify(contracts[0])}`;
  }

  return `export default ${JSON.stringify(contracts)}`;
};
