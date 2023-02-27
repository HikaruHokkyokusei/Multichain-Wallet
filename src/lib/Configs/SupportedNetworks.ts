export interface SupportedNetworkData {
    "name": string,
    "symbol": string,
    "type": string,
    "decimals": number
}

export let supportedNetworkList: SupportedNetworkData[] = [
    { "name": "Bitcoin", "symbol": "BTC", "type": "btc", "decimals": 8 },
    { "name": "Ethereum", "symbol": "ETH", "type": "eth", "decimals": 18 },
    { "name": "Binance Smart Chain", "symbol": "BNB", "type": "bsc", "decimals": 18 },
    { "name": "Polygon", "symbol": "MATIC", "type": "polygon", "decimals": 18 },
    { "name": "XRP Ripple", "symbol": "XRP", "type": "xrp", "decimals": 6 }
];