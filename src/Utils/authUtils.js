import { LogUserOut } from '../redux/auth/authActions';

/**
 * Generic logout function that handles user logout and navigation reset
 * @param {Function} dispatch - Redux dispatch function
 * @param {Object} navigation - React Navigation navigation object
 * @param {Function} onSuccess - Optional callback called after successful logout
 * @param {Function} onFailure - Optional callback called if logout fails
 */
export const handleLogout = (dispatch, navigation, onSuccess, onFailure) => {
    dispatch(
        LogUserOut({
            onSuccess: () => {
                console.log('Logout successful - navigating to Splash');
                // Reset navigation to Splash screen (same as Profile.js)
                if (navigation) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                    });
                }
                if (onSuccess && typeof onSuccess === 'function') {
                    onSuccess();
                }
            },
            onFailure: (error) => {
                console.log('Logout failed:', error);
                // Still navigate to Splash even if logout fails to ensure user is logged out
                if (navigation) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                    });
                }
                if (onFailure && typeof onFailure === 'function') {
                    onFailure(error);
                }
            },
        })
    );
};

/**
 * Check if an error is a JWT token expiration/invalid token error
 * @param {Object} error - Error object from API response
 * @returns {boolean} - True if error is JWT token related
 */
export const isJWTTokenExpired = (error) => {
    if (!error) return false;

    // Check for 403 status with jwt_auth_invalid_token code
    // Standard axios error structure: error.response.status and error.response.data
    if (error?.response?.status === 403) {
        const errorData = error?.response?.data;

        // Check direct code field: error.response.data.code
        if (errorData?.code === 'jwt_auth_invalid_token') {
            return true;
        }

        // Check nested data structure: error.response.data.data.code
        if (errorData?.data?.code === 'jwt_auth_invalid_token') {
            return true;
        }
    }

    // Handle already parsed/transformed error structure (if error was logged/transformed)
    // Structure: { status: 403, data: { code: 'jwt_auth_invalid_token', ... } }
    if (error?.status === 403) {
        if (error?.data?.code === 'jwt_auth_invalid_token') {
            return true;
        }
        // Also check nested structure
        if (error?.data?.data?.code === 'jwt_auth_invalid_token') {
            return true;
        }
    }

    return false;
};

