export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return 'Rs. 0';
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};

export const getDiscount = (price, salePrice) => {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

export const generateOrderNumber = () => {
  return `LEF-${Math.floor(100000 + Math.random() * 900000)}`;
};

export const cities = [
  'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta',
  'Sialkot','Gujranwala','Hyderabad','Bahawalpur','Sargodha','Abbottabad','Sukkur',
  'Larkana','Sheikhupura','Rahim Yar Khan','Jhang','Mardan','Gujrat','Kasur','Dera Ghazi Khan',
  'Nawabshah','Mingora','Mirpur Khas','Okara','Sahiwal','Wah','Chiniot','Muzaffarabad',
];

export const shippingRates = {
  standard: 199,
  express:  349,
  lahore:   149,
};

export const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');