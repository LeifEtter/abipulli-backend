export const omitKey = (obj: any, key: string) => {
  const newObj = { ...obj, [key]: undefined };
  return newObj;
};
