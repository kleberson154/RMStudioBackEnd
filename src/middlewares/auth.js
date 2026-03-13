import jwt from 'jsonwebtoken'

export function auth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).send('Token não fornecido')

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader

  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).send('Token inválido')
  }
}
