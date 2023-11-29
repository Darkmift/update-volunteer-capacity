import { gql } from 'graphql-request';

export const UPDATE_COLUMN_VALUE_FOR_ITEM_IN_BOARD = gql`
    mutation ChangeColumnValueAndMoveItem($volunteerId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(item_id: $volunteerId, board_id: $boardId, column_id: $columnId, value: $value) {
            id
            name
        }
    }
`;
