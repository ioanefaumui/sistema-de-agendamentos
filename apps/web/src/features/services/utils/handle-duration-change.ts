export function handleDurationChange(
  e: React.ChangeEvent<HTMLInputElement>,
  fieldOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
): void {
  let value = e.currentTarget.value.replace(/\D/g, "");
  let numericValue = parseInt(value, 10) || 0;

  if (numericValue > 1440) {
    numericValue = 1440;
    value = "1440";
  }

  e.currentTarget.value = value;

  fieldOnChange(e);
}
