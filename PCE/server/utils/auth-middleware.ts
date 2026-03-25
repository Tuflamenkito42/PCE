import { H3Event, createError, getCookie } from 'h3';
import { verifyAuthToken } from './auth-token';

export interface AuthUser {
    id?: number;
    email: string;
    role: string;
    full_name?: string;
    exp?: number;
}

/**
 * Validates that a request has a valid auth token
 * Returns the decoded user data
 */
export const requireAuth = (event: H3Event): AuthUser => {
    const token = getCookie(event, 'auth_token');
    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized: Authentication required'
        });
    }

    try {
        const decoded = verifyAuthToken(token) as AuthUser;
        return decoded;
    } catch (e) {
        throw createError({
            statusCode: 401,
            message: 'Invalid token'
        });
    }
};

/**
 * Validates that a request has admin role
 */
export const requireAdmin = (event: H3Event): AuthUser => {
    const user = requireAuth(event);
    if (user.role !== 'admin') {
        throw createError({
            statusCode: 403,
            message: 'Forbidden: Admin access required'
        });
    }
    return user;
};

/**
 * Gets the current user if authenticated, returns null otherwise
 */
export const getAuthUser = (event: H3Event): AuthUser | null => {
    const token = getCookie(event, 'auth_token');
    if (!token) {
        return null;
    }

    try {
        return verifyAuthToken(token) as AuthUser;
    } catch (e) {
        return null;
    }
};
