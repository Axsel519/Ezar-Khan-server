import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { UserRole } from '../common/enums/user-role.enum';

async function makeAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));

  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: npm run make-admin <email>');
    process.exit(1);
  }

  console.log(`🔧 Looking for user: ${email}...`);

  const user = await userModel.findOne({ email });

  if (!user) {
    console.error(`❌ User with email ${email} not found!`);
    process.exit(1);
  }

  if (user.role === UserRole.ADMIN) {
    console.log(`✅ User ${email} is already an ADMIN`);
  } else {
    user.role = UserRole.ADMIN;
    await user.save();
    console.log(`✅ Successfully upgraded ${email} to ADMIN role!`);
  }

  await app.close();
  process.exit(0);
}

makeAdmin().catch((error) => {
  console.error('❌ Failed to make admin:', error);
  process.exit(1);
});
