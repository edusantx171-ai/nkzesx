# Sistema de Cadastro de Clientes

## Visão Geral
Sistema web para gerenciamento de cadastro de clientes com autenticação segura. Desenvolvido em Node.js com Express, SQLite e interface moderna com efeito glassmorphism.

## Estado Atual
O projeto foi importado do GitHub e está completamente funcional no Replit. Todas as configurações foram ajustadas para o ambiente Replit.

## Mudanças Recentes (25/10/2025)
- Corrigido nome do arquivo package.json (estava como packpage.json)
- Atualizado servidor para usar porta 5000 (obrigatório no Replit)
- Configurado servidor para bind em 0.0.0.0 para funcionar no Replit
- Workflow configurado e testado
- Deploy configurado para VM (necessário por usar SQLite)
- Implementado design dark mode moderno e intuitivo
- Melhorado sistema de login com mensagens de erro seguras
- Organização visual aprimorada com seções bem definidas
- Interface responsiva para mobile
- **Transformado formulário de cadastro em quiz interativo**
- Adicionado barra de progresso visual
- Implementado navegação entre perguntas (anterior/próximo)
- Adicionado campo "extra" para informações adicionais do cliente
- Lista de clientes mostra todas as informações completas em cards expandidos

## Arquitetura do Projeto

### Backend (server.js)
- **Framework**: Express.js
- **Banco de Dados**: SQLite (database.db)
- **Autenticação**: bcrypt + express-session
- **Porta**: 5000 (0.0.0.0)

### Frontend (public/)
- **HTML**: index.html - Interface de login e cadastro
- **CSS**: style.css - Design glassmorphism com gradientes roxos
- **JavaScript**: script.js - Validação de login e manipulação de clientes

### Estrutura do Banco de Dados

#### Tabela: users
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password (TEXT - hash bcrypt)

#### Tabela: clientes
- id (INTEGER PRIMARY KEY)
- nome (TEXT)
- emails (TEXT)
- pedidos_recentes (TEXT)
- carrinho (TEXT)
- cartao (TEXT)
- assinaturas (TEXT)
- dispositivos (TEXT)
- endereco (TEXT)
- vale (REAL)
- extra (TEXT) - informações adicionais do cliente
- data_cadastro (TEXT)

## Credenciais Padrão
- **Usuário**: Sky
- **Senha**: Skandin00

**IMPORTANTE**: As credenciais padrão são apenas para desenvolvimento inicial. Em produção, altere a senha e considere implementar um sistema de gerenciamento de usuários mais robusto.

## Como Usar

1. Acesse a aplicação no preview do Replit
2. Faça login com as credenciais padrão (veja seção Credenciais Padrão)
3. Use o quiz interativo para cadastrar novos clientes:
   - Responda 10 perguntas sobre o cliente
   - Use os botões "Anterior" e "Próximo" para navegar
   - Pressione Enter para avançar (exceto no campo de texto extra)
   - A barra de progresso mostra o andamento
   - Na última pergunta, adicione informações extras se necessário
4. Visualize todos os clientes cadastrados em cards detalhados
5. Clique em "Sair do Sistema" para fazer logout

## Funcionalidades do Quiz
- **Barra de Progresso**: Acompanhe visualmente o progresso do cadastro
- **Navegação Intuitiva**: Volte e edite respostas anteriores
- **Campo Extra**: Adicione informações adicionais importantes
- **Validação**: Sistema valida se o nome foi preenchido antes de salvar
- **Animações Suaves**: Transições elegantes entre perguntas
- **Edição de Clientes**: Use o mesmo quiz para editar informações existentes

## Funcionalidades de Gerenciamento
- **Visualização Minimizada**: Clientes aparecem com resumo (e-mail e valor do vale)
- **Ver Mais/Menos**: Expandir/recolher detalhes completos do cliente
- **Editar Cliente**: Carrega dados no quiz para edição
- **Remover Cliente**: Exclusão com confirmação de segurança
- **Ordenação**: Clientes mais recentes aparecem primeiro

## Dependências
- express: ^4.18.2
- sqlite3: ^5.1.6
- bcrypt: ^5.1.1
- express-session: ^1.17.3
- body-parser: ^1.20.2

## Deployment
Configurado para deployment em VM (necessário para manter o estado do banco SQLite). O deployment usa Node.js sem build steps.
