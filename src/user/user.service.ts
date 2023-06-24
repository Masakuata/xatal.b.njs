import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisteredUserDto } from './dto/registered-user.dto';
import { DbConnection } from '../db-connection';

@Injectable()
export class UserService {
  static readonly logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto): Promise<[HttpStatus, RegisteredUserDto | null]> {
    if (await this.isRegistered(createUserDto.email)) {
      return [HttpStatus.CONFLICT, null];
    }

    let status: HttpStatus;
    let user: RegisteredUserDto = null;

    const query = 'INSERT INTO User (email, password) VALUES (?, ?)';
    const response = await DbConnection.insert(query, [createUserDto.email, createUserDto.password]);

    if (response === null) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      user = new RegisteredUserDto();
      user.copy(createUserDto);
      user.id = response.insertId.toString();
      status = HttpStatus.CREATED;
    }

    return [status, user];
  }

  async findAll(): Promise<[HttpStatus, RegisteredUserDto[]]> {
    const query = 'SELECT id, email, password FROM User WHERE status = 1';

    let users: RegisteredUserDto[] = [];
    let status: HttpStatus = HttpStatus.NO_CONTENT;

    const response = await DbConnection.select(query, null);
    if (response) {
      for (let row of response) {
        let auxUser = new RegisteredUserDto();
        auxUser.id = row['id'];
        auxUser.email = row['email'];
        auxUser.password = row['password'];
        users.push(auxUser);
      }
      if (users.length > 0) {
        status = HttpStatus.OK;
      }
    }

    return [status, users];
  }

  async findOne(id: string): Promise<[HttpStatus, RegisteredUserDto]> {
    const query = 'SELECT * FROM User WHERE id = ?';
    let user: RegisteredUserDto = null;
    let status: HttpStatus = HttpStatus.NOT_FOUND;

    const response = await DbConnection.select(query, [id]);
    if (response && response.length > 0) {
      user = new RegisteredUserDto();
      for (let property in response[0]) {
        user[property] = response[0][property];
      }
      status = HttpStatus.OK;
    }

    return [status, user];
  }

  async isRegistered(email: string): Promise<boolean | null> {
    let returnValue: boolean | null = null;
    const query: string = 'SELECT COUNT(id) AS TOTAL FROM User WHERE email = ?';

    const response = await DbConnection.select(query, [email]);
    if (response) {
      returnValue = response[0]['TOTAL'] === 1;
    }

    return returnValue;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<[HttpStatus, RegisteredUserDto]> {
    let status: HttpStatus = HttpStatus.NOT_FOUND;
    let user: RegisteredUserDto = null;

    const [_, registeredUser] = await this.findOne(id);
    if (!registeredUser) {
      return [status, user];
    }
    if (updateUserDto.name !== null
      && updateUserDto.name !== undefined
      && updateUserDto.name !== '') {
      registeredUser.name = updateUserDto.name;
    }
    if (updateUserDto.email !== null
      && updateUserDto.email !== undefined
      && updateUserDto.email !== '') {
      registeredUser.email = updateUserDto.email;
    }
    if (updateUserDto.password !== null
      && updateUserDto.password !== undefined
      && updateUserDto.password !== '') {
      registeredUser.password = updateUserDto.password;
    }

    const query = 'UPDATE User SET email = ?, password = ? WHERE id = ?';

    const response = await DbConnection.insert(
      query,
      [registeredUser.email, registeredUser.password, id],
    );
    if (response && response.affectedRows > 0) {
      user = registeredUser;
    }

    return [status, user];
  }

  async remove(id: string): Promise<HttpStatus> {
    let status: HttpStatus = HttpStatus.NOT_FOUND;
    const query = 'DELETE FROM User WHERE id = ?';

    const response = await DbConnection.insert(query, [id]);
    if (response && response.affectedRows == 1) {
      status = HttpStatus.NO_CONTENT;
    }

    return status;
  }
}
