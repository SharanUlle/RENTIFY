import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/database';
import Product from './models/Product';

// INR pricing for all seeded products
const PRICES: Array<{ title: string; daily_rate: number; weekly_rate: number; monthly_rate: number; deposit: number; city: string; state: string }> = [
  { title: 'Sony A7 III Full-Frame Mirrorless Camera',   daily_rate: 3500,  weekly_rate: 20000, monthly_rate: 65000,  deposit: 25000, city: 'Mumbai',     state: 'Maharashtra' },
  { title: 'DJI Mavic 3 Pro Drone',                      daily_rate: 5500,  weekly_rate: 32000, monthly_rate: 105000, deposit: 45000, city: 'Delhi',      state: 'Delhi' },
  { title: 'Apple MacBook Pro 16" M3 Max',               daily_rate: 4000,  weekly_rate: 22000, monthly_rate: 68000,  deposit: 35000, city: 'Bengaluru',  state: 'Karnataka' },
  { title: 'Sony WH-1000XM5 Noise Cancelling Headphones',daily_rate: 750,   weekly_rate: 4200,  monthly_rate: 13500,  deposit: 5000,  city: 'Hyderabad',  state: 'Telangana' },
  { title: 'PlayStation 5 Console + 2 Controllers',      daily_rate: 1500,  weekly_rate: 8500,  monthly_rate: 26000,  deposit: 15000, city: 'Chennai',    state: 'Tamil Nadu' },
  { title: 'iPad Pro 12.9" M2 + Apple Pencil',           daily_rate: 1800,  weekly_rate: 10000, monthly_rate: 30000,  deposit: 15000, city: 'Pune',       state: 'Maharashtra' },
  { title: 'Canon EOS R5 with 24-70mm Lens Kit',         daily_rate: 4800,  weekly_rate: 27000, monthly_rate: 85000,  deposit: 45000, city: 'Mumbai',     state: 'Maharashtra' },
  { title: 'Samsung Galaxy S24 Ultra 512GB',             daily_rate: 1200,  weekly_rate: 7000,  monthly_rate: 21000,  deposit: 12000, city: 'Kolkata',    state: 'West Bengal' },
  { title: 'DJI Osmo Action 4 Camera Kit',               daily_rate: 1200,  weekly_rate: 6800,  monthly_rate: 21000,  deposit: 10000, city: 'Ahmedabad',  state: 'Gujarat' },
  { title: 'RØDE VideoMic Pro+ Shotgun Microphone',      daily_rate: 900,   weekly_rate: 5000,  monthly_rate: 15500,  deposit: 7000,  city: 'Jaipur',     state: 'Rajasthan' },
  { title: 'Dell XPS 15 9530 Laptop',                    daily_rate: 2800,  weekly_rate: 16000, monthly_rate: 50000,  deposit: 25000, city: 'Bengaluru',  state: 'Karnataka' },
  { title: 'Nintendo Switch OLED + 10 Games',            daily_rate: 800,   weekly_rate: 4500,  monthly_rate: 14000,  deposit: 8000,  city: 'Noida',      state: 'Uttar Pradesh' },
];

async function fixPrices() {
  await connectDB();
  console.log('💰 Updating product prices to INR...\n');
  let updated = 0;
  for (const p of PRICES) {
    const { title, ...fields } = p;
    const [count] = await Product.update(fields, { where: { title } });
    if (count > 0) { console.log(`  ✅ ${title}`); updated++; }
    else console.log(`  ⚠️  Not found: ${title}`);
  }
  console.log(`\n✅ Updated ${updated} products to INR pricing`);
  process.exit(0);
}

fixPrices().catch(err => { console.error(err); process.exit(1); });
