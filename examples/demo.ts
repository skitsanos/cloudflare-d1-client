// example.ts

import {D1Client} from '../index.ts';

const client = new D1Client();

try
{
    // Example without binding parameters.
    const timeForNonParams = Bun.nanoseconds();
    const sql = 'SELECT * FROM users;';
    const result = await client.query(sql);
    console.log('Query Result:', JSON.stringify(result, null, 2));
    console.log('Time taken for non-params query:', (Bun.nanoseconds() - timeForNonParams) / 1000000, 'ms');

    // Example with binding parameters.
    const timeForParams = Bun.nanoseconds();
    const sqlWithParams = 'SELECT * FROM users WHERE email = ?;';
    const params = [
        process.env.CLOUDFLARE_EMAIL
    ];
    const resultWithParams = await client.query(sqlWithParams, params);
    console.log('Query Result with Params:', JSON.stringify(resultWithParams, null, 2));
    console.log('Time taken for params query:', (Bun.nanoseconds() - timeForParams) / 1000000, 'ms');
}
catch (error)
{
    console.error('Query failed:', error);
}
