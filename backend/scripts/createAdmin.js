import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/garage-belle-croix');
    console.log('✅ Connected to MongoDB');

    const email = await question('Email admin: ');
    const password = await question('Mot de passe: ');

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Un utilisateur avec cet email existe déjà');
      process.exit(1);
    }

    const user = new User({
      email,
      password,
      role: 'admin'
    });

    await user.save();
    console.log('✅ Admin créé avec succès');

    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();



