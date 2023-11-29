import { APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { expect, describe, it, beforeEach } from '@jest/globals';
import mockEvent, { mockMondayEvent } from '../../mocks/event';
import { ASSIGNEES_COLUMN_ID } from '../../config/consts';

let mockEventClone = structuredClone(mockEvent);
let mockMondayEventClone = structuredClone(mockMondayEvent);

describe('Unit test for app handler', function () {
    beforeEach(() => {
        // Reset mockEventClone to a fresh clone of mockEvent before each test
        mockEventClone = structuredClone(mockEvent);
        mockMondayEventClone = structuredClone(mockMondayEvent);
    });

    it('verifies successful response', async () => {
        const result: APIGatewayProxyResult = await lambdaHandler(mockEventClone);

        expect(result.statusCode).toEqual(200);
    });

    it('verifies successful response with wrong column ID', async () => {
        mockMondayEventClone.event.columnId = 'not the right column id';

        mockEventClone.body = JSON.stringify(mockMondayEventClone);

        const result: APIGatewayProxyResult = await lambdaHandler(mockEventClone);
        const { message } = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(message.includes(`not the ${ASSIGNEES_COLUMN_ID} column`)).toBeTruthy();
    });

    it('verifies successful response with modified column ID', async () => {
        mockMondayEventClone.event.columnId = ASSIGNEES_COLUMN_ID;
        mockMondayEventClone.event.value.linkedPulseIds = [
            { linkedPulseId: 78364654 },
            { linkedPulseId: 78364655 },
            { linkedPulseId: 78364656 },
            { linkedPulseId: 78364657 },
            { linkedPulseId: 78364658 },
        ];
        mockEventClone.body = JSON.stringify(mockMondayEventClone);

        const result: APIGatewayProxyResult = await lambdaHandler(mockEventClone);
        const { message } = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(message).toBe(`assignedItemsCount count is 5`);
    });
});
