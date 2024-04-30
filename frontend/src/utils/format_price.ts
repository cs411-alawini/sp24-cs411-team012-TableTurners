/**
 * formatPrice()
 * Format numerical price into string
 * @param price floating point representation of price
 * @returns price formatted as a string
 */
export default function formatPrice(price: number) {
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return USDollar.format(price);
}
