export interface IBoardRelationsColumnValue {
    changed_at?: string;
    linkedPulseIds?: { linkedPulseId: number }[];
}

export interface MondayUpdateItemEvent {
    app: string;
    type: string;
    triggerTime: string;
    subscriptionId: number;
    userId: number;
    originalTriggerUuid: string | null;
    boardId: number;
    groupId: string;
    pulseId: number;
    pulseName: string;
    columnId: string;
    columnType: string;
    columnTitle: string;
    value: IBoardRelationsColumnValue;
    previousValue: IBoardRelationsColumnValue;
    changedAt: number;
    isTopGroup: boolean;
    triggerUuid: string;
    challenge?: string;
}

export type UpdateColumnValueVariables = {
    volunteerId: number;
    boardId: number;
    columnId: string;
    value: string;
};
