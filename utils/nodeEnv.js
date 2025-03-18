require('dotenv/config')
const nodeEnv = process.env.NODE_ENV

const resetRedirectURL =
  nodeEnv === 'production'
    ? process.env.RESET_ACCOUNT_PROD_URL
    : process.env.RESET_ACCOUNT_DEV_URL

const verifyRedirectURL =
  nodeEnv === 'production'
    ? process.env.VERIFY_ACCOUNT_PROD_URL
    : process.env.VERIFY_ACCOUNT_DEV_URL

module.exports = { resetRedirectURL, verifyRedirectURL }
