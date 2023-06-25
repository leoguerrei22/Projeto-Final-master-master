import express from 'express';
import BaseAction from '../actions/base-action';
import ReservationService from '../services/reservation.service';

const router = express.Router();

const actions = new BaseAction(new ReservationService('invoice'));

router.get('/', (req, res) => actions.getAllInvoices(req, res));
router.get('/:id', (req, res) => actions.getInvoiceById(req, res));
router.post('/', (req, res) => actions.create(req, res));
router.put('/:id', (req, res) => actions.update(req, res));
router.delete('/:id', (req, res) => actions.delete(req, res));
router.post('/:id/email', async (req, res) => {
    const invoiceId = req.params.id;  // Acessando o ID da invoice a partir dos parâmetros da URL
    const userEmail = req.body.email;
    try {
        await actions.sendInvoiceEmail(+invoiceId, userEmail);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


export default router;
