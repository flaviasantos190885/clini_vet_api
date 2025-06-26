const express = require('express');
const clienteController = require('../controllers/clienteController');

const router = express.Router();

// Rotas para clientes
router.get('/', clienteController.listar);
router.get('/:id', clienteController.buscarPorId);
router.post('/', clienteController.criar);
router.put('/:id', clienteController.atualizar);
router.delete('/:id', clienteController.excluir);
router.get('/:id/animais', clienteController.buscarAnimais);

module.exports = router;