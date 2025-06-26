const express = require('express');
const animalController = require('../controllers/animalController');

const router = express.Router();

// Rotas para animais
router.get('/', animalController.listar);
router.get('/:id', animalController.buscarPorId);
router.post('/', animalController.criar);
router.put('/:id', animalController.atualizar);
router.delete('/:id', animalController.excluir);
router.get('/:id/prontuarios', animalController.buscarProntuarios);

module.exports = router;