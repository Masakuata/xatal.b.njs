import { CreateUserDto } from './create-user.dto';

export class RegisteredUserDto extends CreateUserDto {
  id: string;

  copy(createUser: CreateUserDto): void {
    for (let property in createUser) {
      this[property] = createUser[property];
    }
  }

  safeCopy(createUser: CreateUserDto): void {
    for (let property in createUser) {
      if (createUser[property] !== null
        && createUser[property] !== undefined
        && createUser[property] != '') {
        this[property] = createUser[property];
      }
    }
  }
}
