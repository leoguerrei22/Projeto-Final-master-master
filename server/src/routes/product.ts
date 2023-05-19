import express from 'express';
import BaseAction from '../actions/base-action';
import { CrudService } from '../services/crud.service';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

const actions = new BaseAction(new CrudService('product'));

router.get('/', (req, res) => actions.all(req, res));
router.get('/:id', (req, res) => actions.detail(req, res));
router.post('/', requireRole(3),(req, res) => actions.create(req, res));
router.put('/:id', requireRole(3),(req, res) => actions.update(req, res));
router.delete('/:id', requireRole(3),(req, res) => actions.delete(req, res));

export default router;