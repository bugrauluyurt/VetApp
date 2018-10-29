export const USERNAME_MIN_LENGTH = 3;
export const FIRSTNAME_MIN_LENGTH = 2;
export const LASTNAME_MIN_LENGTH = 2;
export const PASSWORD_MIN_LENGTH = 6;
export const FAKE_API_RETENTION_TIME = 2500;

export const users = [
  {
    id: 1,
    userName: 'john_doe',
    email: 'john_doe@gmail.com',
    password: '123456',
    firstName: 'John',
    lastName: 'Doe'
  },
  {
    id: 2,
    userName: 'jane_doe',
    email: 'jane_doe@gmail.com',
    password: '123456',
    firstName: 'Jane',
    lastName: 'Doe'
  },
];

export function getFakeToken(type) {
  const token = {
    access_token: 'fake-jwt-token',
    expires_in: 60000000,
  };
  if (type) {
    token.type = type;
  }
  return token;
}

export function resolveUser(userDetails, isNew) {
  return {
    id: isNew ? users.length + 1 : userDetails.id,
    userName: userDetails.userName,
    email: userDetails.email,
    password: userDetails.password,
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    token: getFakeToken(),
  };
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function getSignUpResponse({
  userName, email, password, firstName, lastName
}) {
  const response = {};
  if (!userName || !email || !password) {
    response.isValid = false;
    response.error = { message: 'Invalid params', type: 1 };
    return response;
  }
  const validityCheckObj = {
    isUserNameValid: userName.length >= USERNAME_MIN_LENGTH,
    isFirstNameValid: firstName.length >= FIRSTNAME_MIN_LENGTH,
    isLastNameValid: lastName.length >= LASTNAME_MIN_LENGTH,
    isEmailValid: validateEmail(email),
    isPasswordValid: password.length >= PASSWORD_MIN_LENGTH
  };
  let errorMessage;
  let errorMessageType;
  let isValid = true;
  Object.keys(validityCheckObj).some((validityKey) => {
    const isNotValid = !validityCheckObj[validityKey];
    if (isNotValid) {
      isValid = false;
      switch (validityKey) {
        case 'isUserNameValid':
          errorMessageType = 2;
          errorMessage = `Username length should be greater than three ${USERNAME_MIN_LENGTH}`;
          break;
        case 'isFirstNameValid':
          errorMessageType = 3;
          errorMessage = `Firstname length should be greater than three ${FIRSTNAME_MIN_LENGTH}`;
          break;
        case 'isLastNameValid':
          errorMessageType = 4;
          errorMessage = `Lastname length should be greater than three ${LASTNAME_MIN_LENGTH}`;
          break;
        case 'isEmailValid':
          errorMessageType = 5;
          errorMessage = 'Please enter a valid email address';
          break;
        case 'isPasswordValid':
          errorMessageType = 6;
          errorMessage = 'Password invalid';
          break;
        default:
          errorMessage = undefined;
      }
    }
    return isNotValid;
  });
  response.isValid = isValid;
  if (errorMessage && errorMessageType) {
    response.error = { message: errorMessage, type: errorMessageType };
  }
  if (isValid) {
    response.userData = { userName, email, password };
  }
  return response;
}
