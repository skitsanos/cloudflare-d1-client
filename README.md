# D1Client

A lightweight, TypeScript-based REST client for executing plain SQL queries against Cloudflare D1 using Bearer token authentication.

> **Note:** Due to inconsistencies in the Cloudflare documentation, this client uses a Bearer token for authentication. To obtain your API token, visit [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) and create a token with D1 Edit (read/write) access.

## Overview

D1Client provides a simple, type-safe way to interact with Cloudflare D1 directly from your server-side environment (e.g., Bun or Node.js). It supports parameterized queries to help prevent SQL injection attacks and parses the detailed response JSON returned by the D1 REST API.

## Features

- **Plain SQL Queries:** Execute raw SQL queries without an ORM.
- **Parameterized Queries:** Supports optional binding parameters to prevent SQL injection.
- **TypeScript Support:** Leverages TypeScript for type safety with well-defined response interfaces.
- **Bearer Token Authentication:** Uses a Bearer token for secure authentication.
- **Environment-Configured:** Reads all required credentials from environment variables.

## Installation

1. Copy the `cloudflare-d1-client/index.ts` file into your project.
2. Ensure your project is set up for TypeScript.
3. If using Bun, make sure Bun is configured to run TypeScript projects.

## Environment Variables

Before using the client, set the following environment variables:

- `D1_ACCOUNT_ID` – Your Cloudflare account ID.
- `D1_DATABASE_ID` – Your Cloudflare D1 database ID.
- `CLOUDFLARE_API_KEY` – Your Cloudflare API token (with D1 Edit access).

## Usage Example

Below is an example of how to use the D1Client in your project:

```typescript
import D1Client from './cloudflare-d1-client';

(async () => {
  // Initialize the D1 client
  const client = new D1Client();

  try {
    // Example query with binding parameters
    const sqlWithParams = "SELECT * FROM myTable WHERE field = ? OR field = ?;";
    const params = ["firstParam", "secondParam"];
    const responseWithParams = await client.query(sqlWithParams, params);
    console.log("Query Result with Params:", responseWithParams);

    // Example query without binding parameters
    const sqlWithoutParams = "SELECT * FROM myTable;";
    const responseWithoutParams = await client.query(sqlWithoutParams);
    console.log("Query Result without Params:", responseWithoutParams);
  } catch (error) {
    console.error("Query failed:", error);
  }
})();
