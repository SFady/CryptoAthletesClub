import sql from '@/lib/db';

// Fetch all users
export async function getUsers() {
  const users = await sql`SELECT * FROM users;`;
  return users;
}

// Insert a new user
export async function addUser(name, email) {
  const result = await sql`
    INSERT INTO users (name, email)
    VALUES (${name}, ${email})
    RETURNING *;
  `;
  return result[0];
}
