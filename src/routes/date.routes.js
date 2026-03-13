import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import {
  addDayBlock,
  getDaysBlocks,
  removeDayBlock,
  addCustomHours,
  getCustomHours,
  removeCustomHours
} from '../controllers/date.controller.js'

const router = Router()

// Rotas para dias bloqueados

/**
 * @openapi
 * /datas:
 *   get:
 *     tags:
 *       - Datas
 *     summary: Listar dias bloqueados
 *     responses:
 *       200:
 *         description: Lista de dias bloqueados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   daysBlock:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: '2026-03-15'
 *                   hoursCustomized:
 *                     type: array
 *                     items:
 *                       type: object
 *       500:
 *         description: Erro interno
 */
router.get('/', getDaysBlocks)

/**
 * @openapi
 * /datas:
 *   post:
 *     tags:
 *       - Datas
 *     summary: Bloquear um dia
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dayBlock
 *             properties:
 *               dayBlock:
 *                 type: string
 *                 example: '2026-03-15'
 *     responses:
 *       201:
 *         description: Data bloqueada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
router.post('/', auth, addDayBlock)

/**
 * @openapi
 * /datas:
 *   delete:
 *     tags:
 *       - Datas
 *     summary: Desbloquear um dia
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dayBlock
 *             properties:
 *               dayBlock:
 *                 type: string
 *                 example: '2026-03-15'
 *     responses:
 *       200:
 *         description: Data desbloqueada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
router.delete('/', auth, removeDayBlock)

// Rotas para horários customizados de funcionamento

/**
 * @openapi
 * /datas/horarios:
 *   get:
 *     tags:
 *       - Datas
 *     summary: Listar horários customizados de funcionamento
 *     responses:
 *       200:
 *         description: Lista de horários customizados por data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: '2026-03-15'
 *                   hoursToWork:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: '9'
 *       500:
 *         description: Erro interno
 */
router.get('/horarios', getCustomHours)

/**
 * @openapi
 * /datas/horarios:
 *   post:
 *     tags:
 *       - Datas
 *     summary: Definir horários customizados para uma data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - hoursToWork
 *             properties:
 *               date:
 *                 type: string
 *                 example: '2026-03-15'
 *               hoursToWork:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: '9'
 *     responses:
 *       201:
 *         description: Horário de funcionamento definido com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
router.post('/horarios', auth, addCustomHours)

/**
 * @openapi
 * /datas/horarios:
 *   delete:
 *     tags:
 *       - Datas
 *     summary: Remover horários customizados de uma data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 example: '2026-03-15'
 *     responses:
 *       200:
 *         description: Horário customizado removido com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
router.delete('/horarios', auth, removeCustomHours)

export default router
