const path = require('path')
const solc = require('solc')

module.exports = function (source) {
    const filename = path.basename(this.resourcePath)
    const input = {
        language: 'Solidity',
        sources: {
            [filename]: {
                content: source
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }

    const output = JSON.parse(solc.compile(JSON.stringify(input)))
    const contractNames = Object.keys(output.contracts[filename])
    const contracts = contractNames.map(name => ({
        bytecode: '0x' + output.contracts[filename][name].evm.bytecode.object,
        abi: output.contracts[filename][name].abi
    }))

    if (contracts.length === 1) {
        return `export default ${JSON.stringify(contracts[0])}`;
    }

    return `export default ${JSON.stringify(contracts)}`;
}
