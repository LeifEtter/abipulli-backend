export interface ErrorInfo {
  code: number;
  msg: string;
}

type ErrorName =
  | "emailNotFound"
  | "emailAlreadyRegistered"
  | "faultyLoginCredentials"
  | "faultySSOCredentials"
  | "faultyToken"
  | "missingToken"
  | "rolePowerTooLow"
  | "paramIdMissing"
  | "paramIdMalformed"
  | "resourceNotFound"
  | "resourceNotOwned";

export const errorMessages: Record<ErrorName, ErrorInfo> = {
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
  faultySSOCredentials: {
    code: 3,
    msg: "Dein Google IDToken ist ungültig",
  },
  faultyToken: {
    code: 4,
    msg: "Der Token ist abgelaufen oder wurde ungültig gemacht. Bitte Logge dich nochmals ein",
  },
  missingToken: {
    code: 5,
    msg: "Deine Anfrage enthält keinen Token. Bitte füge einen 'jwt_token' als Cookie hinzu.",
  },
  rolePowerTooLow: {
    code: 6,
    msg: "Dein Power Level ist zu tief für Zugriff auf diesen Endpunkt.",
  },
  paramIdMissing: {
    code: 7,
    msg: "Bitte füge ein id in der Endpunkt url hinzu (e.g. http://.../endpunkt/5)",
  },
  paramIdMalformed: {
    code: 7,
    msg: "Stelle sicher dass du eine ID als nummer angegeben hast",
  },
  resourceNotFound: {
    code: 8,
    msg: "Es konnte kein Objekt mit der von dir angegebenen ID gefunden werden",
  },
  resourceNotOwned: {
    code: 9,
    msg: "Das Objekt was du bearbeiten willst wurde von einen anderen Nutzer erstellt",
  },
};
