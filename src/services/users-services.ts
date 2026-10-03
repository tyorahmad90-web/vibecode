import { db } from '../db';
import { users, sessions } from '../db/schema';
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

export interface LoginUserPayload {
  email?: string;
  password?: string;
}

export async function loginUserService(payload: LoginUserPayload) {
  const { email, password } = payload;

  if (!email || !password) {
    return { error: 'email atau password salah' };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const foundUser = user[0];
  if (!foundUser) {
    return { error: 'email atau password salah' };
  }

  const isValidPassword = await Bun.password.verify(password, foundUser.password);
  
  if (!isValidPassword) {
    return { error: 'email atau password salah' };
  }

  const token = crypto.randomUUID();

  await db.insert(sessions).values({
    token: token,
    user_id: foundUser.id,
  });

  return { data: token };
}
