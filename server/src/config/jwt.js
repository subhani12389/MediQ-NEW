import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mediq_super_secret_jwt_key_2026';

export const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      hospital_id: user.hospital_id || null,
      department_id: user.department_id || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
