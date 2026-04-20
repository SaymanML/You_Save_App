import axios from 'axios'

const ratesClient = axios.create({
  baseURL: 'https://api.exchangerate-api.com/v4/latest',
  timeout: 8000,
})

export async function fetchUsdInrRate() {
  const response = await ratesClient.get('/INR')
  const rates = response?.data?.rates || {}

  if (typeof rates.USD !== 'number' || rates.USD <= 0) {
    throw new Error('Invalid exchange rate response')
  }

  return {
    usdPerInr: rates.USD,
    inrPerUsd: 1 / rates.USD,
  }
}

