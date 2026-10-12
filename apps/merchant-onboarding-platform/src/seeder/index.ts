import { AppDataSource } from '@app/typeorm-source';
import { seedAdmins } from './admin.seeder';
import { seedSeller } from './seller.seeder';

async function seedDatabase(): Promise<void> {
  await AppDataSource.initialize();

  try {
    await seedAdmins(AppDataSource);
    await seedSeller(AppDataSource);
  } finally {
    await AppDataSource.destroy();
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Database seeding failed:', error);
  process.exitCode = 1;
});
