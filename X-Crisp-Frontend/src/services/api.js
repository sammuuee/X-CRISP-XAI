import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001'
const TOKEN_KEY = 'x-crisp-token'
const USER_KEY = 'x-crisp-user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
}

export function setSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function registerAccount(payload) {
  const { data } = await axios.post(`${API_URL}/auth/register`, payload)
  setSession(data)
  return data
}

export async function loginAccount(payload) {
  const { data } = await axios.post(`${API_URL}/auth/login`, payload)
  setSession(data)
  return data
}

export async function logoutAccount() {
  try {
    await axios.post(`${API_URL}/auth/logout`, null, { headers: authHeaders() })
  } finally {
    clearSession()
  }
}

export async function fetchCompanies() {
  const { data } = await axios.get(`${API_URL}/companies`)
  return data
}

export async function analyzeSequence(payload) {
  const { data } = await axios.post(`${API_URL}/analyze`, payload, { headers: authHeaders() })
  return data
}

export async function fetchHistory() {
  const { data } = await axios.get(`${API_URL}/history`, { headers: authHeaders() })
  return data
}
