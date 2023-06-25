import { CreateUserDto } from './create-user.dto';

export class RegisteredUserDto extends CreateUserDto {
  id: string;

  copy(copyObject: any): void {
    for (const property in copyObject) {
      this[property] = copyObject[property];
    }
  }
  safeCopy(copyObject: any): void {
    for (const property in copyObject) {
      if (property in this
        && copyObject[property] !== null
        && copyObject[property] !== undefined
        && copyObject[property] != '') {
        this[property] = copyObject[property];
      }
    }
  }
}
