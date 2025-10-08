import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
) {
}
  /**
   * Loads rules into the engine based on the user's intention.
   * @param intention The user's intention (e.g., 'decorate', 'feel', 'gift').
   */
  async create(User: CreateUserDto): Promise<User> {
    let UserNew = await this.userRepository.save(User);
    return UserNew;
  }

  /**
   * Returns all users.
   * @returns Array of users.
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Returns a user by its ID.
   * @param id User UUID.
   * @throws NotFoundException if user is not found.
   * @returns The user.
   */
 async findOne(id: string): Promise<User> {
    const User = await this.userRepository.findOneBy({ id }); 
    if (User == null ) throw new NotFoundException();
    return User;
  }

  /**
   * Returns a user by email.
   * @param email User email.
   * @returns The user or null if not found.
   */
  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });;
  }

  /**
   * Updates a user by its ID.
   * @param id User UUID.
   * @param user Data to update.
   * @throws NotFoundException if user is not found.
   * @returns The updated user.
   */
  async update(id: string, User: UpdateUserDto): Promise<User> {
    const result = await this.userRepository.update(id, User);
    if (!result.affected ||  result.affected < 1 ) throw new NotFoundException();
    return this.findOne(id);
  }

  /**
   * Deletes a user by its ID.
   * @param id User UUID.
   * @throws NotFoundException if user is not found.
   * @returns The deleted user.
   */
  remove(id: string): Promise<User> {
    const UserDelete = this.findOne(id);
    this.userRepository.delete(id);
    if (UserDelete == null ) throw new NotFoundException();
    return UserDelete;
  }
}
