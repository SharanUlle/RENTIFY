import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/database';
import User from './models/User';
import Product from './models/Product';

const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

const PRODUCTS = [
  {
    title: 'Sony A7 III Full-Frame Mirrorless Camera',
    description: 'Professional full-frame mirrorless camera with 24.2MP BSI sensor, 4K video, 5-axis in-body image stabilization. Includes body only. Perfect for weddings, portraits, and commercial shoots.',
    category: 'Cameras',
    brand: 'Sony',
    model_name: 'A7 III',
    daily_rate: 3500,
    weekly_rate: 20000,
    monthly_rate: 65000,
    deposit: 25000,
    condition: 'like_new' as const,
    images: [
      UNSPLASH('1502920514313-4f8f927c5d7e'),
      UNSPLASH('1617880337426-90e7d6e3b3e3'),
    ],
    city: 'Mumbai',
    state: 'Maharashtra',
  },
  {
    title: 'DJI Mavic 3 Pro Drone',
    description: 'Triple-camera drone with 4/3 CMOS Hasselblad main camera. 43-min max flight time, 15km video transmission range, omnidirectional obstacle sensing. Includes 3 batteries, remote controller, and carrying bag.',
    category: 'Drones',
    brand: 'DJI',
    model_name: 'Mavic 3 Pro',
    daily_rate: 5500,
    weekly_rate: 32000,
    monthly_rate: 105000,
    deposit: 45000,
    condition: 'new' as const,
    images: [
      UNSPLASH('1473968512647-3e447244af8f'),
      UNSPLASH('1508614589041-895b88991e3e'),
    ],
    city: 'Delhi',
    state: 'Delhi',
  },
  {
    title: 'Apple MacBook Pro 16" M3 Max',
    description: 'Apple MacBook Pro 16-inch with M3 Max chip, 36GB unified memory, 1TB SSD. Ideal for video editing, 3D rendering, and software development. macOS Sonoma. Includes MagSafe charger.',
    category: 'Laptops',
    brand: 'Apple',
    model_name: 'MacBook Pro 16" M3 Max',
    daily_rate: 4000,
    weekly_rate: 22000,
    monthly_rate: 68000,
    deposit: 35000,
    condition: 'like_new' as const,
    images: [
      UNSPLASH('1517336714731-489689fd1ca8'),
      UNSPLASH('1611186871428-9736e5b9e3e3'),
    ],
    city: 'Bengaluru',
    state: 'Karnataka',
  },
  {
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    description: 'Industry-leading wireless noise cancellation with Auto NC Optimizer. 30-hour battery life, multipoint connection, crystal clear hands-free calling. Foldable design, includes carry case.',
    category: 'Audio',
    brand: 'Sony',
    model_name: 'WH-1000XM5',
    daily_rate: 750,
    weekly_rate: 4200,
    monthly_rate: 13500,
    deposit: 5000,
    condition: 'good' as const,
    images: [
      UNSPLASH('1505740420928-5e560c06d30e'),
      UNSPLASH('1484704849700-f032b8e23ee5'),
    ],
    city: 'Hyderabad',
    state: 'Telangana',
  },
  {
    title: 'PlayStation 5 Console + 2 Controllers',
    description: 'Sony PlayStation 5 disc edition with two DualSense wireless controllers. 825GB SSD, 4K gaming at 120fps. Includes 5 popular game titles: Spiderman 2, God of War Ragnarök, Horizon Forbidden West, FIFA 24, and GT7.',
    category: 'Gaming',
    brand: 'Sony',
    model_name: 'PlayStation 5',
    daily_rate: 1500,
    weekly_rate: 8500,
    monthly_rate: 26000,
    deposit: 15000,
    condition: 'good' as const,
    images: [
      UNSPLASH('1607853202273-797f1c22a38e'),
      UNSPLASH('1493711662062-fa541adb3fc8'),
    ],
    city: 'Chennai',
    state: 'Tamil Nadu',
  },
  {
    title: 'iPad Pro 12.9" M2 + Apple Pencil',
    description: 'Apple iPad Pro 12.9-inch with M2 chip, 256GB WiFi + Cellular, Liquid Retina XDR display with ProMotion 120Hz. Includes Apple Pencil 2nd gen, Magic Keyboard, and original box. Perfect for design, presentations, and field work.',
    category: 'Tablets',
    brand: 'Apple',
    model_name: 'iPad Pro 12.9" M2',
    daily_rate: 1800,
    weekly_rate: 10000,
    monthly_rate: 30000,
    deposit: 15000,
    condition: 'like_new' as const,
    images: [
      UNSPLASH('1544244015-0df4cec9d435'),
      UNSPLASH('1621761191319-c6fb62004040'),
    ],
    city: 'Pune',
    state: 'Maharashtra',
  },
  {
    title: 'Canon EOS R5 with 24-70mm Lens Kit',
    description: 'Canon EOS R5 mirrorless camera with 45MP full-frame sensor, 8K RAW video recording, IBIS, and Dual Pixel AF II. Kit includes RF 24-70mm f/2.8L USM lens, 3 batteries, dual charger, and 256GB CFexpress card.',
    category: 'Cameras',
    brand: 'Canon',
    model_name: 'EOS R5',
    daily_rate: 4800,
    weekly_rate: 27000,
    monthly_rate: 85000,
    deposit: 45000,
    condition: 'good' as const,
    images: [
      UNSPLASH('1516035069371-29a1b244cc32'),
      UNSPLASH('1510127034890-ba27667c7058'),
    ],
    city: 'Mumbai',
    state: 'Maharashtra',
  },
  {
    title: 'Samsung Galaxy S24 Ultra 512GB',
    description: 'Samsung Galaxy S24 Ultra with 200MP camera, S Pen included, 6.8" QHD+ 120Hz display, 5000mAh battery. Titanium frame. Unlocked for all carriers. Includes original charger, case, and screen protector.',
    category: 'Phones',
    brand: 'Samsung',
    model_name: 'Galaxy S24 Ultra',
    daily_rate: 1200,
    weekly_rate: 7000,
    monthly_rate: 21000,
    deposit: 12000,
    condition: 'new' as const,
    images: [
      UNSPLASH('1610945415814-7cd172dade0e'),
      UNSPLASH('1567581935884-3349723552ca'),
    ],
    city: 'Kolkata',
    state: 'West Bengal',
  },
  {
    title: 'DJI Osmo Action 4 Camera Kit',
    description: 'Action camera with 1/1.3" sensor, 4K/120fps video, RockSteady 3.0 stabilization, -20°C cold resistance, 2.5hr battery life. Kit includes Osmo Action 4, waterproof case, 3 batteries, ND filters, and mounting accessories.',
    category: 'Cameras',
    brand: 'DJI',
    model_name: 'Osmo Action 4',
    daily_rate: 1200,
    weekly_rate: 6800,
    monthly_rate: 21000,
    deposit: 10000,
    condition: 'like_new' as const,
    images: [
      UNSPLASH('1526374965328-7f61d4dc18c5'),
      UNSPLASH('1508614589041-895b88991e3e'),
    ],
    city: 'Ahmedabad',
    state: 'Gujarat',
  },
  {
    title: 'RØDE VideoMic Pro+ Shotgun Microphone',
    description: 'Professional-grade directional microphone for DSLR and mirrorless cameras. High-pass filter, pad switch, -10dB/0dB/+20dB gain settings, integrated Rycote shockmount, rechargeable battery via USB. Perfect for interviews, vlogs, and film sets.',
    category: 'Audio',
    brand: 'RØDE',
    model_name: 'VideoMic Pro+',
    daily_rate: 900,
    weekly_rate: 5000,
    monthly_rate: 15500,
    deposit: 7000,
    condition: 'good' as const,
    images: [
      UNSPLASH('1563207153-4403e3201e8d'),
      UNSPLASH('1598488035139-bdbb2231ce04'),
    ],
    city: 'Jaipur',
    state: 'Rajasthan',
  },
  {
    title: 'Dell XPS 15 9530 Laptop',
    description: 'Dell XPS 15 with Intel Core i9-13900H, 32GB DDR5 RAM, NVIDIA RTX 4070 8GB, 1TB NVMe SSD, 15.6" OLED 3.5K 120Hz display. Ideal for video editing, machine learning, and development. Includes Dell USB-C hub.',
    category: 'Laptops',
    brand: 'Dell',
    model_name: 'XPS 15 9530',
    daily_rate: 2800,
    weekly_rate: 16000,
    monthly_rate: 50000,
    deposit: 25000,
    condition: 'like_new' as const,
    images: [
      UNSPLASH('1588872657578-7efd1f1555c7'),
      UNSPLASH('1496181133206-80ce9b88a853'),
    ],
    city: 'Bengaluru',
    state: 'Karnataka',
  },
  {
    title: 'Nintendo Switch OLED + 10 Games',
    description: 'Nintendo Switch OLED model with white Joy-Con controllers and 7" OLED screen. Bundle includes 10 physical game cartridges: Zelda TotK, Mario Kart 8, Smash Bros Ultimate, Animal Crossing, and more. Includes dock, Joy-Con grip, and carrying case.',
    category: 'Gaming',
    brand: 'Nintendo',
    model_name: 'Switch OLED',
    daily_rate: 800,
    weekly_rate: 4500,
    monthly_rate: 14000,
    deposit: 8000,
    condition: 'good' as const,
    images: [
      UNSPLASH('1585296823585-d0a2cf0ffec7'),
      UNSPLASH('1493711662062-fa541adb3fc8'),
    ],
    city: 'Noida',
    state: 'Uttar Pradesh',
  },
];

async function seed() {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Create owner user
  let owner = await User.findOne({ where: { email: 'owner@rentify.com' } });
  if (!owner) {
    owner = await User.create({
      name: 'Alex Rivera',
      email: 'owner@rentify.com',
      password: 'password123',
      phone: '+1-555-0100',
      role: 'both',
      is_verified: true,
    });
    console.log('✅ Owner user created: owner@rentify.com / password123');
  } else {
    console.log('ℹ️  Owner user already exists');
  }

  // Create renter user
  let renter = await User.findOne({ where: { email: 'renter@rentify.com' } });
  if (!renter) {
    await User.create({
      name: 'Jordan Lee',
      email: 'renter@rentify.com',
      password: 'password123',
      phone: '+1-555-0200',
      role: 'renter',
      is_verified: true,
    });
    console.log('✅ Renter user created: renter@rentify.com / password123');
  }

  // Seed products
  let created = 0;
  for (const p of PRODUCTS) {
    const exists = await Product.findOne({ where: { title: p.title } });
    if (!exists) {
      await Product.create({ ...p, owner_id: owner.id });
      created++;
    }
  }
  console.log(`✅ ${created} products seeded (${PRODUCTS.length - created} already existed)`);
  console.log('\n🎉 Seed complete!\n');
  console.log('  Login as owner:  owner@rentify.com  / password123');
  console.log('  Login as renter: renter@rentify.com / password123\n');
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
