export declare function addMessage(user: string, message: string): Promise<{
    id: string;
    user: string;
    message: string;
    createdAt: Date;
}>;
export declare function getMessages(): Promise<{
    id: string;
    user: string;
    message: string;
    createdAt: Date;
}[]>;
