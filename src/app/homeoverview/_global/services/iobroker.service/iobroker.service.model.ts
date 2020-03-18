export enum CONNECTION_STATUS {
    disconnected, //  not reconncting && not connected
    reconnecting, // not connected
    connected, // connected and data not loaded
    loaded, // connected and data loaded
}