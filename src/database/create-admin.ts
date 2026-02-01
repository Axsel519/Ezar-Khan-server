import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { UserRole } from '../common/enums/user-role.enum';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));

  // Get admin details from command line or use defaults
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'Admin@123456';
  const firstName = process.argv[4] || 'Admin';
  const lastName = process.argv[5] || 'User';

  console.log('🔧 Creating admin user...');

  // Check if admin already exists
  const existingAdmin = await userModel.findOne({ email });
  if (existingAdmin) {
    console.log(`⚠️  Admin with email ${email} already exists!`);
    
    // Update to admin role if not already
    if (existingAdmin.role !== UserRole.ADMIN) {
      existingAdmin.role = UserRole.ADMIN;
      await existingAdmin.save();
      console.log(`✅ Updated ${email} to ADMIN role`);
    }
  } else {
    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.ADMIN,
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Admin credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${admin.role}\n`);
  }

  await app.close();
  process.exit(0);
}

createAdmin().catch((error) => {
  console.error('❌ Failed to create admin:', error);
  process.exit(1);
});
