// d1Client.ts

/**
 * Represents a response info object from Cloudflare.
 */
export interface ResponseInfo
{
    code: number; // minimum: 1000
    message: string;
}

/**
 * Represents the meta information of a query result.
 */
export interface QueryMeta
{
    changed_db?: boolean;
    changes?: number;
    duration?: number;
    last_row_id?: number;
    rows_read?: number;
    rows_written?: number;
    size_after?: number;
}

/**
 * Represents an individual query result.
 */
export interface QueryResult<T = unknown>
{
    meta?: QueryMeta;
    results?: T[];
    success?: boolean;
}

/**
 * Represents the complete response from a D1 query.
 */
export interface D1QueryResponse<T = unknown>
{
    errors: ResponseInfo[];
    messages: ResponseInfo[];
    result: QueryResult<T>[];
    success: boolean;
}

export class D1Client
{
    private accountId: string;
    private databaseId: string;
    private apiKey: string;
    private baseUrl: string;

    constructor()
    {
        // Retrieve credentials from environment variables.
        this.accountId = process.env.D1_ACCOUNT_ID as string;
        this.databaseId = process.env.D1_DATABASE_ID as string;
        this.apiKey = process.env.CLOUDFLARE_API_KEY as string;

        if (!this.accountId || !this.databaseId || !this.apiKey)
        {
            throw new Error(
                'Missing required environment variables: D1_ACCOUNT_ID, D1_DATABASE_ID, CLOUDFLARE_EMAIL, CLOUDFLARE_API_KEY'
            );
        }

        // Construct the base URL for D1 REST API requests.
        this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}`;
    }

    /**
     * Executes a SQL query against the D1 database.
     *
     * @param sql - The SQL query string.
     * @param params - Optional array of binding parameters.
     * @returns A promise resolving to the D1 query response.
     */
    async query<T = unknown>(sql: string, params: any[] = []): Promise<D1QueryResponse<T>>
    {
        const url = `${this.baseUrl}/query`;

        // Build the payload including binding parameters if provided.
        const payload: { sql: string; params?: any[] } = {sql};
        if (params.length > 0)
        {
            payload.params = params;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok)
        {
            const errorText = await response.text();
            throw new Error(
                `Error executing query: ${response.status} ${response.statusText}: ${errorText}`
            );
        }

        // Parse and return the response using the defined type.
        return response.json();
    }
}
