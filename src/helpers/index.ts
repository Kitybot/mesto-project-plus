import { Response } from 'express';
import mongoose from 'mongoose';
import CodesHTTPStatus from '../types/codes';

interface MongooseError extends mongoose.Error {
  keyValue?: Record<string, string>;
}

export const handleErrors = (err: MongooseError | { statusCode?: number; message: string }, res: Response) => {
  if (isMongooseError(err)) {
    if (err instanceof mongoose.Error.CastError || err instanceof mongoose.Error.ValidationError) {
      res.status(CodesHTTPStatus.BAD_REQUEST).json({
        message: `Переданы некорректные данные: ${err.message}`,
      });
    } else if (err.name === 'MongoServerError') {
      if (err.keyValue) {
        res.status(CodesHTTPStatus.CONFLICT).json({
          message: `Повторное использование ${Object.keys(err.keyValue)[0]} - ${Object.values(err.keyValue)[0]}, который должен быть уникальным. Используйте другой ${Object.keys(err.keyValue)[0]}.`,
        });
      }
    }
  } else if (!err.statusCode) {
    res.status(CodesHTTPStatus.DEFAULT).json({
      message: 'На сервере произошла ошибка',
    });
  } else {
    res.status(err.statusCode).json({ message: err.message });
  }
};

function isMongooseError(err: any): err is MongooseError {
  return err instanceof mongoose.Error;
}
export default handleErrors;