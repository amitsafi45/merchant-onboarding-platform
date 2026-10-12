import { DataSource } from 'typeorm';
import { Admin } from '@app/typeorm-source';
import { AdminRole } from '@app/common';
import * as bcrypt from 'bcrypt';

export async function seedAdmins(dataSource: DataSource): Promise<void> {
  try {
    const adminRepository = dataSource.getRepository(Admin);

    const admins = [
      {
        name: 'System Admin',
        email: 'admin@gmail.com',
        password: 'Demo@123',
        role: AdminRole.ADMIN,
      },
      {
        name: 'Reviewer One',
        email: 'reviewer.one@gmail.com',
        password: 'Demo@123',
        role: AdminRole.REVIEWER,
      },
      {
        name: 'Reviewer Two',
        email: 'reviewer.two@gmail.com',
        password: 'Demo@123',
        role: AdminRole.REVIEWER,
      },
    ];

    for (const admin of admins) {
      const existingAdmin = await adminRepository.findOne({
        where: { email: admin.email },
      });

      if (existingAdmin) {
        continue;
      }

      const password = await bcrypt.hash(admin.password, 12);

      await adminRepository.save({
        ...admin,
        password,
      });
    }

    console.log('Admin seeding completed.');
  } catch (error) {
    console.error('Admin seeding failed:', error);
    throw error;
  }
}
