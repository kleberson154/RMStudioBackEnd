import { Router } from 'express'
import {
  create,
  list,
  getById,
  update,
  remove
} from '../controllers/service.controller.js'
import { auth } from '../middlewares/auth.js'

const router = Router()

/**
 * @openapi
 * /servicos:
 *   post:
 *     tags:
 *       - Serviços
 *     summary: Criar serviço
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - duracaoMinutos
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Corte de cabelo
 *               descricao:
 *                 type: string
 *                 example: Corte com lavagem
 *               preco:
 *                 type: number
 *                 example: 50
 *               duracaoMinutos:
 *                 type: number
 *                 example: 45
 *               ativo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Serviço criado
 */
router.post('/', auth, create)

/**
 * @openapi
 * /servicos:
 *   get:
 *     tags:
 *       - Serviços
 *     summary: Listar serviços
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de serviços
 */
router.get('/', list)

/**
 * @openapi
 * /servicos/{id}:
 *   get:
 *     tags:
 *       - Serviços
 *     summary: Buscar serviço por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *       404:
 *         description: Serviço não encontrado
 */
router.get('/:id', auth, getById)

/**
 * @openapi
 * /servicos/{id}:
 *   put:
 *     tags:
 *       - Serviços
 *     summary: Atualizar serviço
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               duracaoMinutos:
 *                 type: number
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Serviço atualizado
 *       404:
 *         description: Serviço não encontrado
 */
router.put('/:id', auth, update)

/**
 * @openapi
 * /servicos/{id}:
 *   delete:
 *     tags:
 *       - Serviços
 *     summary: Deletar serviço
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço deletado
 *       404:
 *         description: Serviço não encontrado
 */
router.delete('/:id', auth, remove)

export default router
