import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { type } from 'ramda';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (type(value) === 'String') {
      return value;
    }

    const { error, value: result } = Joi.validate(value, this.schema);

    if (error) {
      throw new BadRequestException('Validation failed', error.toString());
    }

    return result;
  }
}
