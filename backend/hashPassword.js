// backend/hashPassword.js
import bcrypt from "bcryptjs";

const plain = "atlas123"; // your real password
const hash = await bcrypt.hash(plain, 10);
console.log("Hashed password:", hash);
