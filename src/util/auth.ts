import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export function requiresPayload(
  body: any,
  response: Response,
  requiredValues: Set<string> | string[]): boolean {
  for (const key of requiredValues) {
    if (!(key in body)) {
      response.status(HttpStatus.NOT_ACCEPTABLE).send();
      return false;
    }
  }
  return true;
}

export function requiresClassForm(
  body: any,
  response: Response,
  instance: any): boolean {
  for (const key in Object.getOwnPropertyNames(instance)) {
    if (!(key in body)) {
      response.status(HttpStatus.NOT_ACCEPTABLE).send();
      return false;
    }
  }
  return true;
}
