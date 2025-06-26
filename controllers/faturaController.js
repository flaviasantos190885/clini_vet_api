const supabase = require('../config/supabase');

class FaturaController {
  // Listar todas as faturas
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('faturas')
        .select(`
          *,
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone,
            email
          )
        `)
        .order('data_emissao', { ascending: false });

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

  // Buscar fatura por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('faturas')
        .select(`
          *,
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone,
            email
          )
        `)
        .eq('id_fatura', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Fatura não encontrada' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar nova fatura
  async criar(req, res) {
    try {
      const { 
        id_atendimento, // Não é FK no CSV, apenas uma coluna
        id_cliente, 
        data_vencimento, 
        valor_total, 
        status_fatura, 
        observacoes 
      } = req.body; 

      if (!id_cliente || !data_vencimento || !valor_total) {
        return res.status(400).json({ erro: 'ID do cliente, data de vencimento e valor total são obrigatórios' });
      }

      const dadosFatura = {
        id_atendimento: id_atendimento || null, // Permite ser nulo se não fornecido
        id_cliente,
        data_emissao: new Date().toISOString(), // Gerado automaticamente
        data_vencimento,
        valor_total,
        status_fatura: status_fatura || 'Pendente', // Valor padrão
        observacoes,
      };

      const { data, error } = await supabase
        .from('faturas')
        .insert([dadosFatura])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Fatura criada com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar fatura
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { 
        id_atendimento, // Não é FK no CSV, apenas uma coluna
        id_cliente, // Pode não ser atualizável, dependendo da regra de negócio
        data_vencimento, 
        valor_total, 
        status_fatura, 
        observacoes 
      } = req.body; 

      const dadosAtualizacao = {
        id_atendimento,
        id_cliente, // Cuidado ao permitir atualização de FKs
        data_vencimento,
        valor_total,
        status_fatura,
        observacoes,
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('faturas')
        .update(dadosAtualizacao)
        .eq('id_fatura', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Fatura não encontrada' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Fatura atualizada com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir fatura
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('faturas')
        .delete()
        .eq('id_fatura', id);

      if (error) {
        // Este erro é onde a FK aparece se a fatura tiver itens, pagamentos, etc.
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Fatura excluída com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new FaturaController();