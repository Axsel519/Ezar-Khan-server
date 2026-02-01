import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { Product } from '../schemas/product.schema';
import { UserRole } from '../common/enums/user-role.enum';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const productModel = app.get<Model<Product>>(getModelToken(Product.name));

  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await userModel.deleteMany({});
  await productModel.deleteMany({});
  console.log('✅ Cleared existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await userModel.create({
    email: 'admin@example.com',
    password: adminPassword,
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    phone: '+1234567890',
    address: '123 Admin Street, Admin City',
  });
  console.log('✅ Created admin user');

  // Create customer users
  const customerPassword = await bcrypt.hash('Customer@123', 10);
  const customers = await userModel.insertMany([
    {
      email: 'john@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CUSTOMER,
      phone: '+1234567891',
      address: '456 Customer Ave, Customer City',
    },
    {
      email: 'jane@example.com',
      password: customerPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.CUSTOMER,
      phone: '+1234567892',
      address: '789 Buyer Blvd, Buyer Town',
    },
  ]);
  console.log('✅ Created customer users');

  // Create products
  const products = await productModel.insertMany([
    {
      name: 'Wireless Bluetooth Headphones',
      description:
        'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
      price: 199.99,
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      ],
      rating: 4.5,
      reviewCount: 128,
      isActive: true,
      category: 'Electronics',
      brand: 'AudioTech',
    },
    {
      name: 'Smart Watch Pro',
      description:
        'Advanced fitness tracker with heart rate monitor, GPS, and 7-day battery life. Water resistant up to 50m.',
      price: 299.99,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'],
      rating: 4.7,
      reviewCount: 256,
      isActive: true,
      category: 'Electronics',
      brand: 'TechWear',
    },
    {
      name: 'Laptop Backpack',
      description:
        'Durable laptop backpack with USB charging port, water-resistant material, and multiple compartments.',
      price: 49.99,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62'],
      rating: 4.3,
      reviewCount: 89,
      isActive: true,
      category: 'Accessories',
      brand: 'TravelGear',
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description:
        'RGB mechanical keyboard with customizable keys, anti-ghosting, and ergonomic design.',
      price: 129.99,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3'],
      rating: 4.6,
      reviewCount: 174,
      isActive: true,
      category: 'Gaming',
      brand: 'GamePro',
    },
    {
      name: 'Wireless Mouse',
      description:
        'Ergonomic wireless mouse with adjustable DPI, 6 programmable buttons, and long battery life.',
      price: 39.99,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46'],
      rating: 4.4,
      reviewCount: 203,
      isActive: true,
      category: 'Accessories',
      brand: 'TechMouse',
    },
    {
      name: '4K Webcam',
      description:
        'Professional 4K webcam with auto-focus, built-in microphone, and wide-angle lens.',
      price: 89.99,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04'],
      rating: 4.5,
      reviewCount: 142,
      isActive: true,
      category: 'Electronics',
      brand: 'StreamTech',
    },
    {
      name: 'Portable SSD 1TB',
      description:
        'Ultra-fast portable SSD with USB-C connection, shock-resistant, and compact design.',
      price: 149.99,
      stock: 70,
      images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b'],
      rating: 4.8,
      reviewCount: 312,
      isActive: true,
      category: 'Storage',
      brand: 'DataDrive',
    },
    {
      name: 'USB-C Hub',
      description:
        '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.',
      price: 34.99,
      stock: 120,
      images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f'],
      rating: 4.2,
      reviewCount: 95,
      isActive: true,
      category: 'Accessories',
      brand: 'ConnectHub',
    },
    {
      name: 'Desk Lamp LED',
      description:
        'Adjustable LED desk lamp with touch control, multiple brightness levels, and USB charging port.',
      price: 44.99,
      stock: 55,
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'],
      rating: 4.4,
      reviewCount: 167,
      isActive: true,
      category: 'Office',
      brand: 'LightWorks',
    },
    {
      name: 'Phone Stand',
      description:
        'Adjustable aluminum phone stand compatible with all smartphones and tablets.',
      price: 19.99,
      stock: 150,
      images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb'],
      rating: 4.1,
      reviewCount: 78,
      isActive: true,
      category: 'Accessories',
      brand: 'StandPro',
    },
  ]);
  console.log('✅ Created products');

  console.log('\n🎉 Database seeding completed successfully!\n');
  console.log('📧 Admin credentials:');
  console.log('   Email: admin@example.com');
  console.log('   Password: Admin@123456\n');
  console.log('📧 Customer credentials:');
  console.log('   Email: john@example.com');
  console.log('   Password: Customer@123\n');
  console.log('   Email: jane@example.com');
  console.log('   Password: Customer@123\n');

  await app.close();
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
