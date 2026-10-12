import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const errorMessageExtract = (errors: ValidationError[]) => {
  const getFirstMessage = (error: ValidationError): string | null => {
    if (error.constraints) {
      // Return the first constraint message
      return Object.values(error.constraints)[0];
    }
    if (error.children && error.children.length > 0) {
      // Recursively check children
      for (const child of error.children) {
        const message = getFirstMessage(child);
        if (message) return message;
      }
    }
    return null;
  };

  const firstMessage =
    errors.map(getFirstMessage).find((msg) => msg !== null) ||
    'Validation error';

  return new HttpException(
    {
      statusCode: HttpStatus.BAD_REQUEST,
      success: false,
      message: firstMessage,
    },
    HttpStatus.BAD_REQUEST,
  );
};
