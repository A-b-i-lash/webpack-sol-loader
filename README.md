# Loader for .sol files and typescript support.

Compiles `.sol` with [Solidity compiler](https://github.com/ethereum/solc-js).
Provides following object depending on imported `.sol` file.

```ts
interface SolidityDocument {
    abi: AbiItem,
    bytecode: string,
    contracts: undefined
}

interface SolidityDocumentCollection {
    contracts: SolidityDocument[]
}
```

## Installation

```bash
npm install webpack-sol-loader --save-dev
```

## Usage

Create webpack-sol-loader.d.ts file
```ts
import wallet from './wallet.sol'
// => returns SolidityDocument or SolidityDocumentCollection that are written above.
```

### Example webpack config

At your project's `webpack.config.ts`:

```ts
const config: Configuration = {
	module: {
		rules: [{
			test: /\.sol?$/,
			use: {
				loader: 'webpack-sol-loader'
			}
		}]
	}
}
```

## Types

Create file webpack-sol-loader.d.ts and include the following:

```ts
type AbiType = 'function' | 'constructor' | 'event' | 'fallback' | 'receive';
type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable';

interface AbiInput {
    name: string;
    type: string;
    indexed?: boolean;
    components?: AbiInput[];
    internalType?: string;
}

interface AbiOutput {
    name: string;
    type: string;
    components?: AbiOutput[];
    internalType?: string;
}

interface AbiItem {
    anonymous?: boolean;
    constant?: boolean;
    inputs?: AbiInput[];
    name?: string;
    outputs?: AbiOutput[];
    payable?: boolean;
    stateMutability?: StateMutabilityType;
    type: AbiType;
    gas?: number;
}

interface SolidityDocument {
    abi: AbiItem,
    bytecode: string,
    contracts: undefined
}

interface SolidityDocumentCollection {
    abi: undefined,
    source: undefined,
    bytecode: undefined
    contracts: SolidityDocument[]
}

declare module '*.sol' {
    const value: SolidityDocument | SolidityDocumentCollection
    export default value
}
```