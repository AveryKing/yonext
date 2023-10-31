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

type GetGameItemListCommand = {
    itemIds: number[];
    cmd: string
};

export const getGameItemList = async (ws: WebSocket, command: GetGameItemListCommand) => {
    const response = {
        "_cmd": "ItemManager.getGameItemList",
        "items": [
            {
                "created_on_date": 1407418257000,
                "room_rating": "0",
                "swf": "",
                "category_name": "Costumes",
                "gender": "0",
                "assetTypeId": 0,
                "item_discount": 0,
                "description": "",
                "crew_members": "0",
                "item_category": "1000",
                "can_gift": "0",
                "item_category_id": "1000",
                "available_time": "2014-08-07 13:30:57.0",
                "item_discount_start": "2022-02-24 15:00:00.0",
                "item_categories.active": "1",
                "zone_permissions": "",
                "price": "0",
                "can_sell": "1",
                "meta_data": "",
                "parent_category": "1",
                "forceRasterize": 0,
                "store_name": "Clothing",
                "refundable": "1",
                "can_charity": "1",
                "store_id": "1032",
                "items.active": "1",
                "item_id": "25207",
                "price_cash": "15",
                "must_consume": "0",
                "version": 1,
                "trade_limit": "1",
                "rental": 0,
                "tags": "",
                "special": "0",
                "is_free_gift": 0,
                "filename": "Ninja",
                "created_on": "2014-08-07 13:30:57.0",
                "default_player_item_qty": "0",
                "name": "Ninja",
                "item_categories.sort_order": "10",
                "items.sort_order": "2715",
                "category": "Costumes",
                "active_in_store": 1,
                "can_consume": "0"
            }
        ],
        "current_time": 1698706149
    }

    ws.send(JSON.stringify(response));
}




