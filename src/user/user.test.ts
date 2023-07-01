import { HttpStatus } from '@nestjs/common';
import { describe, expect, test } from '@jest/globals';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

const userService = new UserService();

let id: string = null;

describe('Users module', () => {
  test('The user registers', async () => {
    const newUser = new CreateUserDto();
    newUser.name = 'Miguel Tajardo Lombardo Ortiz';
    newUser.email = 'mail@mail.com';
    newUser.password = 'primeraContra chida';

    const [status, user] = await userService.create(newUser);
    expect(status).toBe(HttpStatus.CREATED);
    expect(user).not.toBe(null);
    id = user._id;
  });

  test('Fetch user information', async () => {
    const [status, user] = await userService.findOne(id);
    expect(status).toBe(HttpStatus.OK);
    expect(user).not.toBe(null);
  });

  test('Update the user information', async () => {
    const newData = {
      role: 1,
      isAdmin: false,
      gender: 'unknown',
    };

    const [status, info] = await userService.update(id, newData);
    expect(status).toBe(HttpStatus.OK);
    expect(info).not.toBe(null);
  });

  test('Delete user', async () => {
    const status = await userService.remove(id);
    expect(status).toBe(HttpStatus.NO_CONTENT);
  });
});
