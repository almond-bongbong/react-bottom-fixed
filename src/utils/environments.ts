/**
 * Check if the code is running on the server
 * @returns true if the code is running on the server, false otherwise
 */
export const isServer = () => typeof window === 'undefined';

/**
 * Check if the code is running on the client
 * @returns true if the code is running on the client, false otherwise
 */
export const isBrowser = () => typeof window !== 'undefined';
