const supabase = require('../config/supabase');

class VeterinarioController {
  // Listar todos os veterinários
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('veterinarios')
        .select('*')
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

  // Buscar veterinário por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('veterinarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Veterinário não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo veterinário
  async criar(req, res) {
    try {
      // APENAS 'nome' conforme seu CSV. Removidas data_cadastro e data_atualizacao.
      const { nome } = req.body; 

      if (!nome) {
        return res.status(400).json({ erro: 'Nome do veterinário é obrigatório' });
      }

      const dadosVeterinario = {
        nome
        // As colunas data_cadastro e data_atualizacao NÃO existem no schema do CSV para 'veterinarios',
        // então não devem ser incluídas aqui.
      };

      const { data, error } = await supabase
        .from('veterinarios')
        .insert([dadosVeterinario])
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Veterinário criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar veterinário
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      // APENAS 'nome' conforme seu CSV. Removida data_atualizacao.
      const { nome } = req.body; 

      const dadosAtualizacao = {
        nome
        // A coluna data_atualizacao NÃO existe no schema do CSV para 'veterinarios',
        // então não deve ser incluída aqui.
      };

      const { data, error } = await supabase
        .from('veterinarios')
        .update(dadosAtualizacao)
        .eq('id', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Veterinário não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Veterinário atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir veterinário (hard delete)
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('veterinarios')
        .delete()
        .eq('id', id);

      if (error) {
        // Se houver agendamentos ou prontuários vinculados e a FK for RESTRICT/NO ACTION,
        // o banco de dados retornará um erro de violação de chave estrangeira aqui.
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Veterinário excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new VeterinarioController();