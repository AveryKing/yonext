import * as WebSocket from 'ws';
import { prisma } from '../services/database';
import { sendError } from './util/error';
import { InventoryItemTag } from '@prisma/client';

interface InventoryItem {
    itemType: string;
    assetTypeId: number;
    startItem: number;
    aggregateCount: number;
    playerItemIds: number[];
    canConsume: number;
    tradeLimit: number;
    room: string;
    playerItemId: number;
    filter: string;
    itemId: number;
    locationTypeId: number;
    locationId: number;
    parentCategory: number;
    categoryId: number;
    playerId: number;
    status: number;
}

type InventoryManagerCommand = {
    filter: InventoryItemTag;
    searchString: string;
    startIndex: number;
    fullyLoaded: boolean;
    _cmd: string;
    pageSize: number;
    batchSize: number;
    tempCostume: any;
    from: number;
};

export const getInventory = async (ws: WebSocket, command: any) => {

    // get inventory items from the database
    // remove duplicate item ids

    let items = await prisma.inventoryItems.findMany({
        where: {
            playerId: command.from
        },
        include: {
            item: true
        }
    });

    // remove duplicate item ids from items
    items = items.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.itemId === thing.itemId
        ))
    )



    const inventory = items.map(i => {
        return {
            "fg": 0,
            "swf": "",
            "assetTypeId": "0",
            "startItem": "0",
            "activeInStore": 0,
            "customData": {},
            "can_gift": "1",
            "metaData": "",
            "price": "1000",
            "forceRasterize": "0",
            "playerId": i.playerId,
            "newItem": false,
            "g": "2",
            "price_cash": "0",
            "version": 1001,
            "playerItemId": i.playerItemId,
            "trade_limit": "1",
            "rental": 0,
            "tags": "",
            "itemId": i.itemId,
            "filename": i.item?.filename,
            "name": i.item?.name,
            "parentCategoryId": "3",
            "category": "Costumes",
            "categoryId": "2025",
            "can_consume": "0"
        }
    })

    const response = {
        "itemsInUse": [],
        "_cmd": "getInventory",
        "inventory": inventory,
        "expiredItems": [],
        "done": true,
        "serialNo": 1
    };

    console.log(response);
    ws.send(JSON.stringify(response));
}

export const getPageInventoryByFilter = async (ws: WebSocket, command: InventoryManagerCommand): Promise<void> => {
    const { filter, startIndex, batchSize, from } = command;

    try {

        // Fetch inventory items from the database based on the filter
        const items = await prisma.inventoryItems.findMany({
            where: {
                playerId: from,
                tag: filter
            },
            // take: batchSize || 41,
            // skip: startIndex || 0,
        });

        // {"itemType":"DEFAULT","assetTypeId":0,"startItem":0,"aggregateCount":1,"playerItemIds":[21541872317],"canConsume":0,"tradeLimit":0,"room":"",//"playerItemId":0,"filter":"IN_USE","itemId":106,"locationTypeId":3,"locationId":2,"parentCategory":0,"categoryId":0,"playerId":187901763,"status":0}
        var responseItems = items.map(i => ({
            itemType: "DEFAULT",
            assetTypeId: 0,
            startItem: 0,
            aggregateCount: 1,
            playerItemIds: [i.playerItemId],
            canConsume: 0,
            tradeLimit: 0,
            room: "",
            playerItemId: i.playerItemId,
            filter: i.tag,
            itemId: i.itemId,
            locationTypeId: 3,
            locationId: 2,
            parentCategory: 0,
            categoryId: 0,
            playerId: from,
            status: 0
        }));

        // Construct the response
        const response = {
            filter,
            searchString: '',
            startIndex,
            fullyLoaded: true,
            _cmd: 'InventoryManager.getPageInventoryByFilter',
            pageSize: 0,
            batchSize,
            items: responseItems,
            startLocationTypeId: -1,
            startItemId: -1,
            requiredIndex: 0,
        };

        // Send the response through WebSocket
        ws.send(JSON.stringify(response));

    } catch (error) {
        console.error('Error handling InventoryManager command:', error);
        // Handle the error and send an appropriate error response if needed
        sendError(ws, 'Failed to handle InventoryManager command');
    }
}

export const getTabInventoryByFilter = async (ws: WebSocket, command: InventoryManagerCommand): Promise<void> => {
    const { filter, startIndex, batchSize, from } = command;

    try {

        // Fetch inventory items from the database based on the filter
        const items = await prisma.inventoryItems.findMany({
            where: {
                playerId: from,
                tag: filter
            },
            // take: batchSize || 41,
            // skip: startIndex || 0,
        });

        // {"itemType":"DEFAULT","assetTypeId":0,"startItem":0,"aggregateCount":1,"playerItemIds":[21541872317],"canConsume":0,"tradeLimit":0,"room":"",//"playerItemId":0,"filter":"IN_USE","itemId":106,"locationTypeId":3,"locationId":2,"parentCategory":0,"categoryId":0,"playerId":187901763,"status":0}
        var responseItems = items.map(i => ({
            itemType: "DEFAULT",
            assetTypeId: 0,
            startItem: 0,
            aggregateCount: 1,
            playerItemIds: [i.playerItemId],
            canConsume: 0,
            tradeLimit: 0,
            room: "",
            playerItemId: i.playerItemId,
            filter: i.tag,
            itemId: i.itemId,
            locationTypeId: 3,
            locationId: 2,
            parentCategory: 0,
            categoryId: 0,
            playerId: from,
            status: 0
        }));

        // Construct the response
        const response = {
            filter,
            searchString: '',
            startIndex,
            fullyLoaded: true,
            _cmd: 'InventoryManager.getPageInventoryByFilter',
            pageSize: 0,
            batchSize,
            items: responseItems,
            startLocationTypeId: -1,
            startItemId: -1,
            requiredIndex: 0,
        };

        console.log(response);
        // Send the response through WebSocket
        ws.send(JSON.stringify(response));

    } catch (error) {
        console.error('Error handling InventoryManager command:', error);
        // Handle the error and send an appropriate error response if needed
        sendError(ws, 'Failed to handle InventoryManager command');
    }
};

export const getItemPiidsForDelete = async (ws: WebSocket, command: any) => {

    const { from, itemId, amount } = command;


    const items = await prisma.inventoryItems.findMany({
        where: {
            playerId: from,
            itemId: itemId
        },
        take: amount
    });

    if (items.length < amount) {
        sendError(ws, `You have requested to delete more of this item than you own.`)
    }
        const response = {
            itemId: itemId,
            piids: items.map(i => i.playerItemId),
            _cmd: "InventoryManager.getItemPiidsForDelete"
        }

        ws.send(JSON.stringify(response));
    }