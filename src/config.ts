require('dotenv').config();

const {
  JWT_SECRET = 'secret',
  PORT = '3000',
  MONGODB_URL = 'mongodb://localhost:27017/mestodb ',
  HOST = 'localhost',
} = process.env;

export default {
  JWT_SECRET,
  PORT,
  MONGODB_URL,
  HOST,
};
