import express from 'express';
import BaseAction from '../actions/base-action';
import ReservationService  from '../services/reservation.service'; 

const router = express.Router();

const actions = new BaseAction(new ReservationService('reservation'));

router.get('/', (req, res) => actions.all(req, res));
router.post('/', (req, res) => actions.createReservation(req, res)); 
router.get('/available-tables', (req, res) => actions.getAvailableTables(req, res));
router.get('/:id', (req, res) => actions.detail(req, res));
router.put('/:id', (req, res) => actions.update(req, res));
router.delete('/:id', (req, res) => actions.delete(req, res));
router.post('/:id/order', (req, res) => actions.addOrderToReservation(req, res));
router.post('/:id/invoice', (req, res) => actions.generateInvoiceForReservation(req, res));

export default router;
