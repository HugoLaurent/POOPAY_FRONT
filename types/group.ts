export type Member = {
    id?: number | string;
    name: string;
    totalEarned?: number;
};

export type GroupData = {
    id: number;
    name: string;
    admin_user_id: number | string;
    admin_name?: string;
    max_members?: number;
    members: Member[];
    createdAt?: string;
    updatedAt?: string;
    leader?: string;
    userPlace?: number;
    winnerLastMonth?: { name: string };
};
