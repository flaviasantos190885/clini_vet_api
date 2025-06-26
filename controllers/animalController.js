const supabase = require('../config/supabase');

class AnimalController {
  // Listar todos os animais
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('animais')
        .select(`
          *,
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone,
            email
          )
        `)
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

  // Buscar animal por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('animais')
        .select(`
          *,
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone,
            email
          )
        `)
        .eq('id_animal', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Animal não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo animal
  async criar(req, res) {
    try {
      const { id_cliente, nome, especie, raca, data_nascimento, sexo, peso, observacoes } = req.body;

      // Validação básica
      if (!id_cliente || !nome || !especie) {
        return res.status(400).json({ erro: 'ID do cliente, nome e espécie são obrigatórios' });
      }

      const dadosAnimal = {
        id_cliente,
        nome,
        especie,
        raca,
        data_nascimento,
        sexo,
        peso,
        observacoes,
        data_cadastro: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('animais')
        .insert([dadosAnimal])
        .select(`
          *,
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone,
            email
          )
        `);

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Animal cadastrado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar animal
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, especie, raca, data_nascimento, sexo, peso, observacoes } = req.body;

      const dadosAtualizacao = {
        nome,
        especie,
        raca,
        data_nascimento,
        sexo,
        peso,
        observacoes,
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('animais')
        .update(dadosAtualizacao)
        .eq('id_animal', id)
        .select(`
          *,
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone,
            email
          )
        `);

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Animal não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Animal atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir animal
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('animais')
        .delete()
        .eq('id_animal', id);

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.json({
        sucesso: true,
        mensagem: 'Animal excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Buscar prontuários do animal
  async buscarProntuarios(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('prontuarios')
        .select(`
          *,
          usuarios:id_veterinario (
            id_usuario,
            nome,
            perfil
          )
        `)
        .eq('id_animal', id)
        .order('data_atendimento', { ascending: false });

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

module.exports = new AnimalController();