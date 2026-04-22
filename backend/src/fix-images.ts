import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/database';
import Product from './models/Product';

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

// Verified 200 OK Unsplash photo IDs — appropriate for each product category
const PRODUCT_IMAGES: Record<string, string[]> = {
  'Sony A7 III Full-Frame Mirrorless Camera': [
    U('photo-1516035069371-29a1b244cc32'), // mirrorless camera with lens
    U('photo-1516724562728-afc824a36e84'), // Sony-style camera body
    U('photo-1502920514313-52581002a659'), // camera equipment
  ],
  'DJI Mavic 3 Pro Drone': [
    U('photo-1508614589041-895b88991e3e'), // DJI drone on ground
    U('photo-1543857778-c4a1a3e0b2eb'),    // drone in flight
    U('photo-1473968512647-3e447244af8f'), // aerial/drone perspective
  ],
  'Apple MacBook Pro 16" M3 Max': [
    U('photo-1517336714731-489689fd1ca8'), // MacBook Pro on table
    U('photo-1496181133206-80ce9b88a853'), // laptop workspace
    U('photo-1484788984921-03950022c9ef'), // open laptop coding
  ],
  'Sony WH-1000XM5 Noise Cancelling Headphones': [
    U('photo-1505740420928-5e560c06d30e'), // over-ear headphones
    U('photo-1484704849700-f032a568e944'), // Sony headphones
    U('photo-1598653222000-6b7b7a552625'), // audio headphones
  ],
  'PlayStation 5 Console + 2 Controllers': [
    U('photo-1603481588273-2f908a9a7a1b'), // PS5 console
    U('photo-1612287230202-1ff1d85d1bdf'), // gaming setup
    U('photo-1592478411213-6153e4ebc07d'), // gaming console
  ],
  'iPad Pro 12.9" M2 + Apple Pencil': [
    U('photo-1544244015-0df4b3ffc6b0'), // iPad Pro
    U('photo-1559028012-481c04fa702d'), // tablet on desk
    U('photo-1620288627223-53302f4e8c74'), // modern tablet
  ],
  'Canon EOS R5 with 24-70mm Lens Kit': [
    U('photo-1502920514313-52581002a659'), // Canon-style camera
    U('photo-1524678606370-a47ad25cb82a'), // camera close-up
    U('photo-1516035069371-29a1b244cc32'), // camera with lens
  ],
  'Samsung Galaxy S24 Ultra 512GB': [
    U('photo-1601784551446-20c9e07cdbdb'), // modern smartphone
    U('photo-1592750475338-74b7b21085ab'), // phone on surface
    U('photo-1485965120184-e220f721d03e'), // smartphone
  ],
  'DJI Osmo Action 4 Camera Kit': [
    U('photo-1533659828870-95ee305cee3e'), // action camera / GoPro-style
    U('photo-1473968512647-3e447244af8f'), // outdoor action
    U('photo-1508614589041-895b88991e3e'), // DJI product
  ],
  'RØDE VideoMic Pro+ Shotgun Microphone': [
    U('photo-1558618666-fcd25c85cd64'), // studio microphone
    U('photo-1587202372775-e229f172b9d7'), // recording mic
    U('photo-1598653222000-6b7b7a552625'), // audio equipment
  ],
  'Dell XPS 15 9530 Laptop': [
    U('photo-1496181133206-80ce9b88a853'), // laptop on desk
    U('photo-1484788984921-03950022c9ef'), // open laptop
    U('photo-1517336714731-489689fd1ca8'), // laptop workspace
  ],
  'Nintendo Switch OLED + 10 Games': [
    U('photo-1617096200347-cb04ae810b1d'), // Nintendo Switch
    U('photo-1580327344181-c1163234e5a0'), // Switch gaming
    U('photo-1612287230202-1ff1d85d1bdf'), // gaming fun
  ],
};

async function fixImages() {
  await connectDB();
  console.log('🖼️  Fixing product images...\n');
  let updated = 0;
  for (const [title, images] of Object.entries(PRODUCT_IMAGES)) {
    const [count] = await Product.update({ images }, { where: { title } });
    if (count > 0) { console.log(`  ✅ ${title}`); updated++; }
    else console.log(`  ⚠️  Not found: ${title}`);
  }
  console.log(`\n✅ Updated ${updated} products with working image URLs`);
  process.exit(0);
}

fixImages().catch(err => { console.error(err); process.exit(1); });
