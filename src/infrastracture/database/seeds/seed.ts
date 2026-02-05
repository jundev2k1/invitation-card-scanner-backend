import 'dotenv/config';
import { createPool, DatabasePool, sql } from "slonik";

const pool = createPool(process.env.DATABASE_URL!);

// Seed the database
async function seed() {
  await seedUser(pool);

  console.log('✅ Seed data inserted');
}

// Run the seed and close the connection if failed
seed().catch((ex) => {
  console.error('Seed failed', ex);
  pool.then(p => p.end());
});

const users = [
  // Root account
  {
    id: '019c2c31-f608-7557-ad61-bd601a1af6d7',
    username: 'root_account',
    email: 'root@example.com',
    nickname: 'Root',
    password: '$argon2id$v=19$m=65536,t=3,p=4$myuQUQA8ZA/g+R34sY86QQ$afHDX9KWwcQXi4NFekLPkx5XjVhF3gBrSahWZVLhUzw',
    sex: 'M',
    phoneNumber: '',
    avatarUrl: '',
    status: 2,
    bio: 'I am root.',
    role: 'ROOT'
  },
]

async function seedUser(pool: Promise<DatabasePool>) {
  (await pool).transaction(async (tx) => {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const isExist = await tx.oneFirst(sql.unsafe`SELECT EXISTS(SELECT 1 FROM users WHERE id = ${user.id});`);
      if (isExist) continue;
      
      await tx.query(sql.unsafe`SELECT create_user(
        ${user.id},
        ${user.username},
        ${user.email},
        ${user.nickname},
        ${user.phoneNumber},
        ${user.password},
        ${user.sex},
        ${user.bio},
        ${user.avatarUrl},
        ${user.status},
        ${user.role}
      );`);
    }
  }).finally(() => pool.then(p => p.end()));
}
