export const responseCreator = (body, src, func, status = 200) => {
  return [body, status, src, func];
};