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

        if (!store) {
            sendError(ws, `Store ${storeId} does not exist`);
            return;
        } else if (!store.items.some(i => i.itemId === itemId)) {
            sendError(ws, `Item ${itemId} is not available in store ${storeId}`);
            return;
        }

        // Continue with the purchase logic...

    } catch (error) {
        console.error('Error handling makePurchase command:', error);
    }
};
