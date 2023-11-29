import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import logger from './utils/logger-winston';
import tryParse from './utils/tryparse';
import { MondayUpdateItemEvent, UpdateColumnValueVariables } from './types';
import { ASSIGNEES_COLUMN_ID, CAPACITY_COLUMN_ID } from './config/consts';
import makeGQLRequest from './utils/graphQlRequestClient';
import { UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD } from './utils/queries';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('hello world', { event });
    try {
        /**
         * we extract the monday event
         */

        const response = {
            statusCode: 200,
            body: {
                message: 'fn run started',
                challenge: 'no challenge found',
            },
        };

        const mondayEvent = tryParse(event.body) as { event: MondayUpdateItemEvent };
        const {
            event: { value, columnId, pulseId, boardId },
        } = mondayEvent;

        logger.info('values', { value, columnId, mondayEvent });

        if (columnId !== ASSIGNEES_COLUMN_ID) {
            response.body.message = `not the ${ASSIGNEES_COLUMN_ID} column`;
            response.body.challenge = mondayEvent.event.challenge || response.body.challenge;

            return {
                ...response,
                body: JSON.stringify(response.body),
            };
        }

        // we count the number of linked pulses
        const assignedItemsCount = value.linkedPulseIds?.length || 0;
        logger.log('🚀 ~ file: app.ts:51 ~ lambdaHandler ~ pulseCount:', { value, pulseCount: assignedItemsCount });

        const variables: UpdateColumnValueVariables = {
            volunteerId: pulseId,
            boardId: boardId,
            columnId: CAPACITY_COLUMN_ID,
            value: assignedItemsCount.toString(),
        };

        await makeGQLRequest(UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD, variables);

        response.body.message = `assignedItemsCount count is ${assignedItemsCount}`;
        return {
            ...response,
            body: JSON.stringify(response.body),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
