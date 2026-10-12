import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@app/typeorm-source';

export async function seedSeller(dataSource: DataSource): Promise<void> {
  try {
    const userRepository = dataSource.getRepository(User);

    const users = [
      {
        name: 'Alex Morgan',
        email: 'alex@gmail.com',
        password: 'Demo@123',
      },
      {
        name: 'Taylor Smith',
        email: 'taylor@gmail.com',
        password: 'Demo@123',
      },
      {
        name: 'Jordan Lee',
        email: 'jordan@gmail.com',
        password: 'Demo@123',
      },
      {
        name: 'Casey Brown',
        email: 'casey@gmail.com',
        password: 'Demo@123',
      },
    ];

    for (const user of users) {
      const existingUser = await userRepository.findOne({
        where: { email: user.email },
      });

      if (existingUser) {
        continue;
      }

      await userRepository.save({
        ...user,
        password: await bcrypt.hash(user.password, 12),
      });
    }

    console.log('User seeding completed.');
  } catch (error) {
    console.error('User seeding failed:', error);
    throw error;
  } finally {
  }
}
