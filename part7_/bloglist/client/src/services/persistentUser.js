const key = 'loggedBlogappUser'

export const getUser = () => {
  const user = localStorage.getItem(key)
  return user ? JSON.parse(user) : null
}

export const saveUser = (user) => {
  localStorage.setItem(key, JSON.stringify(user))
}

export const removeUser = () => {
  localStorage.removeItem(key)
}
