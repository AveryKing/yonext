import { prisma } from "../services/database";


export const sellInventoryItem = async (ws: any, command: any) => {
    // command.from is the player id
    // command.piidList is the list of playeritemids to sell

    // get the price of each item. delete the items from players inventory and credit them half the price

    const items = await prisma.inventoryItems.findMany({
        where: {
            playerId: command.from,
            playerItemId: {
                in: command.piidList.map((i: any) => Number(i))
            }
        },
        include: {
            item: true
        }
    });

    let total = 0;

    for (const item of items) {
        total += item?.item?.price!;
    }

    const credit = total / 2;

    await prisma.inventoryItems.deleteMany({
        where: {
            playerItemId: {
                in: command.piidList
            }
        }
    });

    await prisma.player.update({
        where: {
            playerId: command.from
        },
        data: {
            money: {
                increment: credit
            }
        }
    });
}