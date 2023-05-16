    // src/routes/utilizadores.js
    import express from 'express';
    import BaseAction from '../actions/base-action';
    import UsersService from '../services/users.service';

    const router = express.Router();

    const usersActions = new BaseAction(new UsersService());

    router.post('/register', (req, res) => usersActions.create(req, res));
    router.get('/', (req, res) => usersActions.all(req, res)); // nova rota para ler todos os utilizadores
    router.get('/:id', (req, res) => usersActions.detail(req, res));
    router.put('/:id', (req, res) => usersActions.update(req, res));
    router.delete('/:id',(req, res) => usersActions.delete(req, res));
    router.post('/login', (req, res) => usersActions.authenticate(req, res));

    export default router;