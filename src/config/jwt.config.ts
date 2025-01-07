export default () => ({
  authJwtSecret: 'pRojEct2023',

  authTokenCookieName: 'token',
  authTokenExpiredTime: 24 * 60 * 60 * 1000,
  authRefreshTokenCookieName: 'refreshToken',
  authRefreshTokenExpiredTime: 168 * 60 * 60 * 1000,

  isLive: false,
});
