export const moneyMask = (event: React.FormEvent<HTMLInputElement>) => {
  const { value } = event.currentTarget;
  return value
    .replace(/\D/g, "")
    .replace(/(\d)(\d{2})$/, "$1,$2")
    .replace(/(?=(\d{3})+(\D))\B/g, ".");
};
