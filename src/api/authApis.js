import { extractData, userAuthFetch, userRawFetch } from './server';

export const signIn = data =>
  userAuthFetch.post('/register', data).then(extractData);

export const verifyOtp = data =>
  userAuthFetch.post('/login', data).then(extractData);

export const updateUserType = data =>
  userAuthFetch.post('/editusertype', data).then(extractData);

export const getArchitectWorkTypes = data =>
  userAuthFetch.get('/viewworktype').then(extractData);

export const saveArchitectWorkTypes = data =>
  userRawFetch.post('/saveworktype', data).then(extractData);

export const saveProject = data =>
  userRawFetch.post('/saveproject', data).then(extractData);

export const getCustomerWorkTypes = data =>
  userAuthFetch.get('/viewcustomerworktype').then(extractData);

export const saveCustomerWorkTypes = data =>
  userRawFetch.post('/savecustomerworktype', data).then(extractData);

export const userDelete = data =>
  userAuthFetch.post('/deleteaccount', data).then(extractData);

export const logout = () => userAuthFetch.post('/logout').then(extractData);

// JWT Authentication API
export const jwtLogin = (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  return userRawFetch.post('/wp-json/jwt-auth/v1/token', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(extractData);
};

// Register API
export const register = (username, email, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('email', email);
  params.append('password', password);

  return userRawFetch.post('/wp-json/custom-api/v1/register', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(extractData);
};

//Forgot password API
export const forgotPassword = (email) => {
  const params = new URLSearchParams();
  params.append('email', email);

  return userRawFetch.post('wp-json/custom-api/v1/forgot-password?email', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(extractData);
};