// import bcrypt from "bcryptjs";

// export async function hashPassword(password:string) {
//     const salt = await bcrypt.genSalt(10)
//     return bcrypt.hash(password, salt)
// }

// export async function comparePassword(
//     password: string, 
//     hashedPassword: string
//     ) {
//     return bcrypt.compare(password, hashedPassword)
// }


import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  if (!password) {
    throw new Error("Password is required for hashing");
  }

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  if (!password || !hashedPassword) {
    throw new Error("Password or hash missing for comparison");
  }

  return bcrypt.compare(password, hashedPassword);
}
