import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hash = async (password) => {
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed
}

export const compare = async (password, hashedPassword) => {
    const compare = await bcrypt.compare(password, hashedPassword);
    return compare;
}