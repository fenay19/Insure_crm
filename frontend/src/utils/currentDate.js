export const currentDate = () => {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = currentDate.toLocaleString('en-us', { month: 'short' }); // Get abbreviated month name
  const year = currentDate.getFullYear();

  const hours = currentDate.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const ampm = currentDate.getHours() >= 12 ? 'pm' : 'am';

  return `${day}-${month}-${year} ${hours}:${minutes}${ampm}`;
};

export const extractPrefixAndNumber = (str) => {
  const match = str.match(/^([A-Za-z]+)-\d{4}-(\d+)$/);
  return match ? match[1] + match[2].replace(/^0+/, '') : '';
};

export const convertToWords = (num) => {
  const belowTwenty = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen'
  ];

  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const thousands = 'Thousand';
  const lakhs = 'Lakh';
  const crores = 'Crore';

 const convert = (n) => {
  if (n === 0) return '';
  if (n < 20) return belowTwenty[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + belowTwenty[n % 10] : '');
  if (n < 1000) return belowTwenty[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
  if (n < 100000) return convert(Math.floor(n / 1000)) + ' ' + thousands + (n % 1000 ? ' ' + convert(n % 1000) : '');
  if (n < 10000000) return convert(Math.floor(n / 100000)) + ' ' + lakhs + (n % 100000 ? ' ' + convert(n % 100000) : '');
  return convert(Math.floor(n / 10000000)) + ' ' + crores + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
};

return num === 0 ? 'Zero RUPEES ONLY' : convert(num).trim() + ' RUPEES ONLY';

};


export const patientSavedData = JSON.parse(window.localStorage.getItem('patientSavedData'));
