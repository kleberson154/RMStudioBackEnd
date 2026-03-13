import { Router } from 'express'
import {
  create,
  list,
  listByDate,
  finalize,
  cancel,
  remove,
  hasPendingByCpf,
  getByDataAndHorario
} from '../controllers/appointment.controller.js'
import { auth } from '../middlewares/auth.js'

const router = Router()

/**
 * @openapi
 * /agendamentos:
 *   post:
 *     tags:
 *       - Agendamentos
 *     summary: Criar agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 example: 2026-02-11T10:00:00Z
 *     responses:
 *       201:
 *         description: Agendamento criado
 */
router.post('/', create)

/**
 * @openapi
 * /agendamentos:
 *   get:
 *     tags:
 *       - Agendamentos
 *     summary: Listar agendamentos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
router.get('/', auth, list)

/**
 * @openapi
 * /agendamentos/cpf/{cpf}/pendente:
 *   get:
 *     tags:
 *       - Agendamentos
 *     summary: Verificar se CPF possui agendamento pendente
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *           example: 12345678900
 *     responses:
 *       200:
 *         description: Retorna se existe agendamento pendente para o CPF
 *       400:
 *         description: CPF inválido
 */
router.get('/cpf/:cpf/pendente', hasPendingByCpf)

/**
 * @openapi
 * /agendamentos/{data}/{horario}:
 *   get:
 *     tags:
 *       - Agendamentos
 *     summary: Verificar disponibilidade de horário
 *     parameters:
 *       - in: path
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-02-11
 *       - in: path
 *         name: horario
 *         required: true
 *         schema:
 *           type: string
 *           example: 10
 *     responses:
 *       200:
 *         description: Disponibilidade do horário
 *       500:
 *         description: Erro ao buscar disponibilidade
 */
router.get('/:data/:horario', getByDataAndHorario)

/**
 * @openapi
 * /agendamentos/{date}:
 *   get:
 *     tags:
 *       - Agendamentos
 *     summary: Listar agendamentos por data
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-02-11
 *     responses:
 *       200:
 *         description: Lista de agendamentos por data
 */
router.get('/:date', listByDate)

/**
 * @openapi
 * /agendamentos/{id}/finalizar:
 *   patch:
 *     tags:
 *       - Agendamentos
 *     summary: Finalizar agendamento
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
 *         description: Agendamento finalizado
 *       404:
 *         description: Agendamento não encontrado
 */
router.patch('/:id/finalizar', auth, finalize)

/**
 * @openapi
 * /agendamentos/{id}/cancelar:
 *   patch:
 *     tags:
 *       - Agendamentos
 *     summary: Cancelar agendamento
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
 *         description: Agendamento cancelado
 *       404:
 *         description: Agendamento não encontrado
 */
router.patch('/:id/cancelar', auth, cancel)

/**
 * @openapi
 * /agendamentos/{id}:
 *   delete:
 *     tags:
 *       - Agendamentos
 *     summary: Deletar agendamento
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
 *         description: Agendamento deletado
 *       404:
 *         description: Agendamento não encontrado
 */
router.delete('/:id', auth, remove)

export default router
