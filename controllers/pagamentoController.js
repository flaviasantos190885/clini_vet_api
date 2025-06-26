const supabase = require('../config/supabase');

class PagamentoController {
  // Listar todos os pagamentos
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('pagamentos')
        .select(`
          *,
          faturas:id_fatura (
            id_fatura,
            valor_total,
            status_fatura
          )
        `)
        .order('data_pagamento', { ascending: false });

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

  // Buscar pagamento por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('pagamentos')
        .select(`
          *,
          faturas:id_fatura (
            id_fatura,
            valor_total,
            status_fatura
          )
        `)
        .eq('id_pagamento', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Pagamento não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo pagamento
  async criar(req, res) {
    try {
      const { 
        id_fatura, 
        valor_pago, 
        forma_pagamento, 
        observacoes 
      } = req.body; 

      if (!id_fatura || !valor_pago || !forma_pagamento) {
        return res.status(400).json({ erro: 'ID da fatura, valor pago e forma de pagamento são obrigatórios' });
      }

      const dadosPagamento = {
        id_fatura,
        data_pagamento: new Date().toISOString(), // Gerado automaticamente
        valor_pago,
        forma_pagamento,
        observacoes,
      };

      const { data, error } = await supabase
        .from('pagamentos')
        .insert([dadosPagamento])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Pagamento registrado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar pagamento
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { 
        valor_pago, 
        forma_pagamento, 
        observacoes 
      } = req.body; 

      const dadosAtualizacao = {
        valor_pago,
        forma_pagamento,
        observacoes,
      };

      const { data, error } = await supabase
        .from('pagamentos')
        .update(dadosAtualizacao)
        .eq('id_pagamento', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Pagamento não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Pagamento atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir pagamento
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('pagamentos')
        .delete()
        .eq('id_pagamento', id);

      if (error) {
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Pagamento excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new PagamentoController();