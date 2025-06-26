const supabase = require('../config/supabase');

class ClienteController {
  // Listar todos os clientes
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.json({
        sucesso: true,
        dados: data,
        total: data.length
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Buscar cliente por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id_cliente', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo cliente
  async criar(req, res) {
    try {
      const { nome, cpf, telefone, email, endereco } = req.body;

      // Validação básica
      if (!nome || !cpf) {
        return res.status(400).json({ erro: 'Nome e CPF são obrigatórios' });
      }

      const dadosCliente = {
        nome,
        cpf,
        telefone,
        email,
        endereco,
        data_cadastro: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('clientes')
        .insert([dadosCliente])
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Cliente criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar cliente
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, telefone, email, endereco } = req.body;

      const dadosAtualizacao = {
        nome,
        telefone,
        email,
        endereco,
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('clientes')
        .update(dadosAtualizacao)
        .eq('id_cliente', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Cliente atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir cliente (soft delete)
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('clientes')
        .update({ ativo: false, data_atualizacao: new Date().toISOString() })
        .eq('id_cliente', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

      res.json({
        sucesso: true,
        mensagem: 'Cliente excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Buscar animais do cliente
  async buscarAnimais(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('animais')
        .select('*')
        .eq('id_cliente', id)
        .order('nome');

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.json({
        sucesso: true,
        dados: data,
        total: data.length
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new ClienteController();