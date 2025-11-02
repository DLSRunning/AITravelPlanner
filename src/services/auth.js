const KEY = 'rtp_user'


export function login({ username }) {
    const user = { id: Date.now(), username }
    localStorage.setItem(KEY, JSON.stringify(user))
    return user
}


export function logout() {
    localStorage.removeItem(KEY)
}


export function currentUser() {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
}