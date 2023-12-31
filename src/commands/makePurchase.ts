import * as WebSocket from 'ws';
import { prisma } from '../services/database';
import { sendError } from './util/error';

type MakePurchaseInbound = {
    store: {
        storeId: number;
        storeCategoryId: number;
    };
    item: {
        id: number;
        qty: number;
    };
    from: string;
    lockCode: null | string;
};

// Assuming you have the necessary imports and types defined

export const handleMakePurchase = async (ws: WebSocket, payload: MakePurchaseInbound) => {
    try {
        const { store, item, from } = payload;
        const { id: itemId, qty: itemQuantity } = item;

        // Fetch item details from Prisma
        const itemDetails = await prisma.item.findUnique({
            where: { itemId: itemId },
            include: {
                category: true,
                inventoryItems: true,
            },
        });

        // Fetch store details from Prisma
        const storeDetails = await prisma.store.findUnique({
            where: { storeId: Number(store.storeId) },
            include: {
                items: true,
            },
        });

        // Fetch player details from Prisma
        const playerDetails = await prisma.player.findUnique({
            where: { playerId: Number(from) },
        });

        if (!itemDetails || !storeDetails || !playerDetails) {
            return sendError(ws, "Failed to fetch necessary data from the database");
        }

        const itemPrice = itemDetails.price * itemQuantity;

        if (playerDetails.money < itemPrice) {
            return sendError(ws, "Unable to purchase item due to insufficient funds");
        }

        // Update player's money and add purchased items to inventory. Save the playerItemIds of the new items to an array
        const purchasedItems = await prisma.$transaction([
            prisma.player.update({
                where: { playerId: Number(from) },
                data: {
                    money: playerDetails.money - itemPrice,
                    inventoryItems: {
                        create: Array(itemQuantity).fill({
                            item: {
                                connect: {
                                    itemId: itemId,
                                },
                            },
                        }),
                    },
                },
                select: {
                    inventoryItems: {
                        select: {
                            playerItemId: true,
                        },
                    },
                },
            }),
        ]);

        let playerItemIds = purchasedItems.map(i => i.inventoryItems.map(x => x.playerItemId)).flat();

        // Construct the response payload
        const responsePayload = {
            balance: playerDetails.money - itemPrice,
            success: "true",
            _cmd: "makePurchase",
            inventory: [
                {
                    swf: "",
                    assetTypeId: 0,
                    startItem: 0,
                    is_buyable: 1,
                    playerItemIds: playerItemIds, // this should be the playerItemIds of the newly created inventoryitems
                    activeInStore: 1,
                    description: itemDetails.description,
                    customData: {},
                    metaData: "",
                    price: itemPrice,
                    is_rentable: 0,
                    currency: "coins",
                    playerId: Number(from), // FIX
                    quantity: itemQuantity,
                    newItem: true,
                    price_cash: "0",
                    version: 1,
                    playerItemId: playerItemIds[0],
                    trade_limit: "1",
                    rental: 0,
                    tags: "",
                    itemId: itemDetails.itemId.toString(),
                    filename: itemDetails.filename,
                    name: itemDetails.name,
                    paid: itemPrice,
                    parentCategoryId: itemDetails.category.parentId ?? "0",
                    category: itemDetails.category.name,
                    categoryId: itemDetails.categoryId.toString(),
                    can_consume: "0",
                },
            ],
        };

        // Send the response
        console.log(responsePayload)
        //ws.send(JSON.stringify(responsePayload));
        ws.send(JSON.stringify({ "balance": 31, "success": "true", "_cmd": "makePurchase", "inventory": [{ "swf": "", "assetTypeId": 0, "startItem": 0, "is_buyable": 1, "playerItemIds": [21626976288], "activeInStore": 1, "description": "A straight cable snake for\r\nmusicians.", "customData": {}, "metaData": "", "price": 350, "is_rentable": 0, "currency": "coins", "playerId": 187901763, "quantity": 1, "newItem": true, "price_cash": "0", "version": 1, "playerItemId": 21626976288, "trade_limit": "1", "rental": 0, "tags": "", "itemId": "29888", "filename": "MwrRckCab02", "name": "Bundled Straight Cables", "paid": 350, "parentCategoryId": "5", "category": "Electronics", "categoryId": "2010", "can_consume": "0" }] }))

    } catch (error) {
        console.error('Error handling makePurchase command:', error);
        // Handle the error and send an appropriate error response if needed
    }
};

