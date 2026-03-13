import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function register(req, res) {
  const { usuario, senha } = req.body
  const hash = await bcrypt.hash(senha, 10)

  await User.create({ usuario, senha: hash })

  res.send('Usuario registrado com sucesso')
}

export async function login(req, res) {
  const { usuario, senha } = req.body

  const user = await User.findOne({ usuario })

  if (!user) return res.status(401).send('Usuario ou senha invalidos')

  const isMatch = await bcrypt.compare(senha, user.senha)

  if (!isMatch) return res.status(401).send('Usuário ou senha inválidos')

  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'
  const REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'your_refresh_jwt_secret'

  // criar access token (curta duração)
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h'
    }
  )

  // criar refresh token (longa duração)
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
    }
  )

  user.refreshTokens = user.refreshTokens || []
  user.refreshTokens.push(refreshToken)
  await user.save()

  return res.status(200).json({ accessToken, refreshToken })
}

export async function refreshToken(req, res) {
  const { refreshToken: token } = req.body

  if (!token) {
    return res.status(401).send('Refresh token não fornecido')
  }

  try {
    const REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'your_refresh_jwt_secret'
    const decoded = jwt.verify(token, REFRESH_SECRET)

    const user = await User.findById(decoded.id)

    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(401).send('Refresh token inválido')
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

    // Remover o refresh token antigo do banco de dados
    user.refreshTokens = user.refreshTokens.filter(t => t !== token)

    // Criar novo access token
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h'
      }
    )

    // Criar novo refresh token
    const newRefreshToken = jwt.sign(
      { id: user._id, email: user.email },
      REFRESH_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
      }
    )

    // Adicionar novo refresh token ao banco
    user.refreshTokens.push(newRefreshToken)
    await user.save()

    return res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch (error) {
    return res.status(401).send('Refresh token expirado ou inválido')
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken: token } = req.body

    if (!token) {
      return res.status(400).send('Refresh token não fornecido')
    }

    const REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'your_refresh_jwt_secret'

    const decoded = jwt.verify(token, REFRESH_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(400).send('Usuário não encontrado')
    }

    user.refreshTokens = []
    await user.save()
    return res.status(200).send('Logout realizado com sucesso')
  } catch (error) {
    return res.status(400).send('Erro ao realizar logout')
  }
}
