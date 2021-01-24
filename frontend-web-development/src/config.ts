const config = {
  port: parseInt(process.env.LISTEN_PORT, 10),
  cookies: {
    encryptionKey: process.env.COOKIE_ENCRYPTION_KEY,
    secure: process.env.COOKIE_SECURE === 'true',
    maxAgeInDays: parseFloat(process.env.COOKIE_MAX_AGE_IN_DAYS)
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PWD
  }
}

export default config
