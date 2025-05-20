import axios from 'axios';

const API_BASE_URL = 'https://api.r2rgloble.com/api/v1/now-payments';

export const createPayment = async (paymentData) => {
  const response = await axios.post(`${API_BASE_URL}/create-payment`, paymentData);
  return response.data;
};

export const getPaymentStatus = async (paymentId) => {
  const response = await axios.get(`${API_BASE_URL}/payment-status/${paymentId}`);
  return response.data;
};

export const getCurrencies = async () => {
  const response = await axios.get(`${API_BASE_URL}/currencies`);
  return response.data;
};

export const getMinAmount = async (currencyFrom, currencyTo) => {
  const response = await axios.get(
    `${API_BASE_URL}/min-amount/${currencyFrom}/${currencyTo}`
  );
  return response.data;
};