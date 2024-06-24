import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let clonedUserService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of the users service
    //this will not affect the database but all the function
    //will run correctly, we just modify the response of it.
    const users: User[] = [];
    clonedUserService = {
      find: (email: string) => {
        const filteredUsers = users?.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users?.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: clonedUserService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hased password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error that user signs up with email that being used', async () => {
    await service.signup('bbbb@asdf.com', 'asdf');
    await expect(service.signup('bbbb@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throw if signin is called with an unused email', async () => {
    await expect(service.signin('asdfaaaaa@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  //I dont think this is a correct way to do this
  it('throws if an invalid password is provided', async () => {
    await service.signup('asdf@asdf.com', 'mypassword');

    await expect(service.signin('asdf@asdf.com', 'lasssss')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('justintimber@gmail.com', 'lasssss');
    const user = await service.signin('justintimber@gmail.com', 'lasssss');
    expect(user).toBeDefined();
  });
});
