const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const USERNAME = 'username'

export const tokenStorage = {
  getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN)
  },
  getRefreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN)
  },
  getUsername() {
    return sessionStorage.getItem(USERNAME) || 'Utilizador'
  },
  setSession({ access, refresh, username }) {
    sessionStorage.setItem(ACCESS_TOKEN, access)
    sessionStorage.setItem(REFRESH_TOKEN, refresh)
    sessionStorage.setItem(USERNAME, username)
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    localStorage.removeItem(USERNAME)
  },
  updateAccessToken(access, refresh) {
    sessionStorage.setItem(ACCESS_TOKEN, access)
    if (refresh) sessionStorage.setItem(REFRESH_TOKEN, refresh)
  },
  clear() {
    sessionStorage.removeItem(ACCESS_TOKEN)
    sessionStorage.removeItem(REFRESH_TOKEN)
    sessionStorage.removeItem(USERNAME)
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    localStorage.removeItem(USERNAME)
  },
}

