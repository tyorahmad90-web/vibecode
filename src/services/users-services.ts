import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface RegisterUserPayload {
  name?: string;
  email?: string;
  password?: string;
}

export async function registerUserService(payload: RegisterUserPayload) {
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    return { error: 'nama, email, dan password wajib diisi' };
  }

  // Pengecekan apakah email sudah terdaftar
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { error: 'email sudah terdaftar' };
  }

  // Hash password menggunakan bcrypt (via Bun.password)
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 10,
  });

  // Simpan user baru ke database
  await db.insert(users).values({
    nama: name,
    email: email,
    password: hashedPassword,
  });

  return { data: 'oke' };
}
