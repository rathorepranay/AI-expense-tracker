export const CURRENCIES = [
  { symbol: "₹", label: "INR (₹)", locale: "en-IN" },
  { symbol: "$", label: "USD ($)", locale: "en-US" },
  { symbol: "€", label: "EUR (€)", locale: "de-DE" },
  { symbol: "£", label: "GBP (£)", locale: "en-GB" },
  { symbol: "¥", label: "JPY (¥)", locale: "ja-JP" },
];

export const getCurrencyInfo = () => {
  const symbol = localStorage.getItem("currency_symbol") || "₹";
  return CURRENCIES.find(c => c.symbol === symbol) || CURRENCIES[0];
};

export const getCurrencySymbol = () => {
  return getCurrencyInfo().symbol;
};

export const formatCurrency = (amount) => {
  const { symbol, locale } = getCurrencyInfo();
  return `${symbol}${Number(amount).toLocaleString(locale)}`;
};
