// src/utils/formatCurrency.js
export const formatCurrency = (value) =>
    new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
    }).format(value);
