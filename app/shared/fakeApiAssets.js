export const users = [
  {
    id: 1,
    userName: 'john_doe@gmail.com',
    email: 'john_doe@gmail.com',
    password: '1234',
    firstName: 'John',
    lastName: 'Doe'
  },
  {
    id: 2,
    userName: 'jane_doe@gmail.com',
    email: 'jane_doe@gmail.com',
    password: '1234',
    firstName: 'Jane',
    lastName: 'Doe'
  },
];

export function getFakeToken(type) {
  const token = {
    body: 'fake-jwt-token',
    type,
    expirationTime: 60000000,
  };
  if (type) {
    token.type = type;
  }
  return token;
}
