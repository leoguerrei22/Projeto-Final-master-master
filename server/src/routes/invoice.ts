import express from 'express';
import BaseAction from '../actions/base-action';
import { CrudService } from '../services/crud.service';
import ReservationService from '../services/reservation.service';

const router = express.Router();

const actions = new BaseAction(new ReservationService('invoice'));

router.get('/', (req, res) => actions.getAllInvoices(req, res));
router.get('/:id', (req, res) => actions.getInvoiceById(req, res));
router.post('/', (req, res) => actions.create(req, res));
router.put('/:id', (req, res) => actions.update(req, res));
router.delete('/:id', (req, res) => actions.delete(req, res));

export default router;