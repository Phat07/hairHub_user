export const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND", // Replace 'USD' with your desired currency code
    // minimumFractionDigits: 5, // Adjust decimal places as needed
  }).format(value);
};
