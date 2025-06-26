# Postman Collection - Veterinary Clinic API

Esta pasta contém os arquivos de configuração do Postman para testar a API da Clínica Veterinária Bem Estar Animal.

## Arquivos Incluídos

### 1. `Veterinary_Clinic_API.postman_collection.json`
Coleção completa com todos os endpoints da API organizados por categorias:

- **🏠 Status & Info**: Endpoints para verificar status da API
- **👥 Clientes**: CRUD completo para gerenciamento de clientes
- **🐕 Animais**: CRUD completo para gerenciamento de animais
- **📋 Prontuários**: CRUD completo para prontuários médicos
- **📅 Agendamentos**: CRUD completo para agendamentos
- **📦 Produtos**: CRUD completo para produtos e controle de estoque

### 2. `Veterinary_Clinic_Environment.postman_environment.json`
Ambiente de desenvolvimento com variáveis pré-configuradas:

- `base_url`: URL base da API (http://localhost:3000)
- `cliente_id`, `animal_id`, `prontuario_id`, etc.: IDs para testes

## Como Importar no Postman

### Método 1: Importação Direta
1. Abra o Postman
2. Clique em "Import" no canto superior esquerdo
3. Selecione "Upload Files"
4. Importe os dois arquivos JSON:
   - `Veterinary_Clinic_API.postman_collection.json`
   - `Veterinary_Clinic_Environment.postman_environment.json`

### Método 2: Arrastar e Soltar
1. Abra o Postman
2. Arraste os arquivos JSON diretamente para a interface do Postman

## Configuração

### 1. Selecionar o Ambiente
- No canto superior direito do Postman, selecione "Veterinary Clinic - Development"

### 2. Configurar URL Base
- Se sua API estiver rodando em uma porta diferente, altere a variável `base_url` no ambiente

### 3. Testar Conexão
- Execute primeiro o request "API Status" para verificar se a conexão está funcionando

## Funcionalidades Incluídas

### ✅ Testes Automáticos
Cada requisição inclui testes automáticos que verificam:
- Status code de sucesso (200 ou 201)
- Presença do campo 'sucesso' na resposta
- Tempo de resposta menor que 5 segundos

### 🔄 Variáveis Dinâmicas
- IDs são armazenados automaticamente em variáveis para reutilização
- URL base configurável para diferentes ambientes

### 📝 Documentação Completa
- Cada endpoint possui descrição detalhada
- Exemplos de payload para requisições POST/PUT
- Parâmetros de query documentados

## Exemplos de Uso

### 1. Fluxo Completo de Teste
1. **Status da API**: Verificar se a API está funcionando
2. **Criar Cliente**: Cadastrar um novo cliente
3. **Criar Animal**: Cadastrar um animal para o cliente
4. **Criar Agendamento**: Agendar uma consulta
5. **Criar Prontuário**: Registrar o atendimento
6. **Gerenciar Produtos**: Controlar estoque

### 2. Cenários de Teste
- **Dados Válidos**: Testar com dados corretos
- **Dados Inválidos**: Testar validações (campos obrigatórios)
- **IDs Inexistentes**: Testar tratamento de erros 404
- **Relacionamentos**: Testar busca de dados relacionados

## Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `base_url` | URL base da API | `http://localhost:3000` |
| `cliente_id` | ID do cliente para testes | (vazio) |
| `animal_id` | ID do animal para testes | (vazio) |
| `prontuario_id` | ID do prontuário para testes | (vazio) |
| `agendamento_id` | ID do agendamento para testes | (vazio) |
| `produto_id` | ID do produto para testes | (vazio) |

## Dicas de Uso

### 🎯 Ordem Recomendada de Testes
1. Sempre teste o status da API primeiro
2. Crie clientes antes de criar animais
3. Crie animais antes de criar agendamentos/prontuários
4. Use os endpoints de listagem para verificar os dados criados

### 🔍 Debugging
- Use o Console do Postman para ver logs detalhados
- Verifique as variáveis de ambiente se algum ID não estiver sendo encontrado
- Confirme se a API está rodando na porta correta

### 📊 Relatórios
- Use o Runner do Postman para executar toda a coleção
- Gere relatórios de teste automatizados
- Configure testes de performance se necessário

## Suporte

Se encontrar problemas:
1. Verifique se a API está rodando (`npm run dev`)
2. Confirme se o Supabase está configurado corretamente
3. Verifique as variáveis de ambiente no arquivo `.env`
4. Consulte os logs do servidor para erros detalhados