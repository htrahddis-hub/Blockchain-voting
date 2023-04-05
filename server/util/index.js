export const isEmail = (email) => {
  if (
    email !== "" &&
    email.match(/^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
  )
    return true;
  return false;
};
