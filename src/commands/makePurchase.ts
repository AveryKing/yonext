import * as WebSocket from 'ws';
import { prisma } from '../lib/database';
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

export const handleMakePurchase = async (ws: WebSocket, payload: MakePurchaseInbound): Promise<void> => {
    try {
        const { store: storeId, item, from } = payload;
        const { id: itemId, qty: itemQuantity } = item;

        const store = await prisma.store.findUnique({
            where: { storeId: Number(storeId) },
            select: {
                storeId: true,
                items: true
            },
        });

        if (!store) return sendError(ws, `Store ${storeId} does not exist`);

        if (!store.items.some(i => i.itemId === itemId))
            return sendError(ws, `Item ${itemId} is not available in store ${storeId}`);

        const player = await prisma.player.findUnique({
            where: { playerId: Number(from) },
            select: {
                playerId: true,
                money: true,
                inventoryItems: true
            },
        });

        if (!player) return sendError(ws, `Player ${from} does not exist`);

        const itemPrice = store.items.find(i => i.itemId === itemId)!.price;
        if (player.money < itemPrice * itemQuantity)
            return sendError(ws, `Unable to purchase item due to insufficient funds`);

        await prisma.player.update({
            where: { playerId: Number(from) },
            data: {
                money: player.money - itemPrice * itemQuantity,
                inventoryItems: {
                    create: Array(itemQuantity).fill({
                        item: {
                            connect: {
                                itemId
                            }
                        }
                    })
                }
            }
        });


    } catch (error) {
        console.error('Error handling makePurchase command:', error);
    }
};
