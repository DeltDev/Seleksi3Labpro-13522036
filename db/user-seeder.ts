import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {SeededUserFactory} from './user-factory';
import * as bcrypt from 'bcrypt';
import { User } from '../src/entity/user.entity';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    //seeding 10 admin
    for (let i = 0; i < 10; i++) {
      const adminUser = SeededUserFactory.createSeededUser(i, 'admin');
      await this.createUser(adminUser);
    }

    //seeding 10 user biasa
    for (let i = 0; i < 10; i++) {
      const regularUser = SeededUserFactory.createSeededUser(i, 'regular');
      await this.createUser(regularUser);
    }

    console.log('Seeding complete.');
  }

  private async createUser(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = this.userRepository.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    await this.userRepository.save(user);
  }
}
