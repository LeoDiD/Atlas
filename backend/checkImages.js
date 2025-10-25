import mongoose from 'mongoose';
import Menu from './models/menu.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/atlasdb')
  .then(async () => {
    console.log('🔗 Connected to MongoDB\n');
    
    const items = await Menu.find({});
    console.log(`📦 Total items in database: ${items.length}\n`);
    
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   Category: ${item.category}`);
      console.log(`   Image path: ${item.image || 'NULL'}`);
      console.log(`   Available: ${item.available !== false ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
