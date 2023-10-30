import * as WebSocket from 'ws';
import { prisma } from '../lib/database';
import { sendError } from './util/error';

type ActivatePlayerInbound = {
    playerId: string;
    sn_uid: string;
    ck: number;
    mode: number;
    versionMinor: string;
    referral: string;
    sessionId: string;
};

export const handleActivatePlayer = async (ws: WebSocket, payload: ActivatePlayerInbound) => {
    try {
        const { playerId } = payload;

        const prismaData = await prisma.player.findUnique({
            where: { playerId: Number(playerId) },
            select: {
                name: true,
                money: true,
                // Add other properties as needed
            },
        });

        if (!prismaData) {
            sendError(ws, `Player ${playerId} not found in YoNext database`);
        } else {
            // Continue with the player activation logic...
            const { name: hardcodedName, money: hardcodedMoney } = prismaData;
            const response = constructActivatePlayerResponse(playerId, hardcodedName, hardcodedMoney);

            // Send the response back to the client
            console.log(JSON.stringify(response));
            ws.send(JSON.stringify(response));
        }
    } catch (error) {
        console.error('Error handling activatePlayer command:', error);
    }
};

// Helper function to construct the response for "activatePlayer" command
const constructActivatePlayerResponse = (playerId: string, name: string, money: number) => {
    return {
        yoNext: true,
        hitNewUserDailyLoginLimit: false,
        settings: 6,
        isEmployee: false,
        throwableItemTypes: '["WHITE_SNOWBALL","WATER_BALLOON"]',
        sessionId: `${playerId}_1698595678`,
        speed: 0,
        pzone_edit_allowed: false,
        result: true,
        _cmd: 'activatePlayer',
        subscriptionStatus: false,
        subscriptionPaymentOk: false,
        defaultZoneName: 'h103285427',
        promosParticipated: [],
        playerId: Number(playerId),
        player: {
            inWelcomeParty: true,
            walkAction: 0,
            lastLogin: '2023-10-29 16:03:25.0',
            maxEquippable: 20,
            nextEquippableUpgrade: {
                cost: 1000,
                currency_type: 0,
                increase_by: 1,
                upgrade_slot: 1,
            },
            gender: 2,
            badgeId: 3,
            newUserFlagged: false,
            onlineStatus: 2,
            playerGroups: [
                { name: 'Birthday', id: 78 },
                { name: 'Received Starter Pack', id: 121 },
                { name: 'Occasional Player (OP)', id: 258 },
                { name: 'HTML5 Rollout Non-Payers', id: 290 },
                { name: 'Costume Challenge Gem Rewards', id: 464 },
            ],
            locale: '',
            createdOn: '2022-07-06 23:09:33.0',
            platform: 'dotcom',
            followingPet: 21382352401,
            entranceAction: 0,
            relationship_status: 0,
            dotcomLoginCount: 2184,
            cash: 31,
            playerId: Number(playerId),
            speechBalloonColor: '16711728',
            drunk_effect: '',
            idleAction: 0,
            firstTime: 0,
            money: money, // Hardcoded money value
            mod_level: 0,
            name: name, // Hardcoded name value
            clothing: [
                // Add clothing items as needed
            ],
            tempAppearanceItems: {},
        },
        energy: 100,
    };
};
