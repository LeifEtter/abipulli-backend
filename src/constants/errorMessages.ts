const errorMessages = {
  emailNotFound: {
    code: 0,
    msg: "Kein Nutzer mit dieser Email konnte gefunden werden",
  },
  emailAlreadyRegistered: {
    code: 1,
    msg: "Ein Nutzer mit dieser Email ist bereits registriert",
  },
  faultyLoginCredentials: {
    code: 2,
    msg: "Email und/oder Passwort ist falsch",
  },
};

export type ErrorCode = keyof typeof errorMessages;

export function getErr(errorCode: ErrorCode) {
  return errorMessages[errorCode];
}
