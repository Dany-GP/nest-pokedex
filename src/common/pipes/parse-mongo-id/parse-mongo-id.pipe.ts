import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata);
    if (isValidObjectId(value)) {
      return value;
    } else {
      throw new BadRequestException(`${value} is not a valid MongoId`)
    }
  }
}
