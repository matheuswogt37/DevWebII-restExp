# Introdução
Este trabalho tem como objetivo ser uma experiência REST para criar um cardápio online de acordo com os seguintes requisitos:
- Criar uma API REST seguindo os princípios RESTful:
    - Uso correto dos verbos HTTP (GET, POST, PUT, DELETE, PATCH).
    - Recursos identificados por URLs significativas (ex: /usuarios, /produtos/123).
    - Uso adequado de códigos de status HTTP (200, 201, 400, 404, 500, etc.).
    - HATEOAS (opcional): forneça links para açõoes relacionadas nos retornos da API.
- A API deve expor pelo menos dois recursos (ex: usuário e produtos), com operações CRUD completas.
- Os dados devem ser retornados em formato JSON, com estrutura consistente e clara.
- A API deve ter paginação, ordenação e filtros nos endpoints de listagem.

Foi optado por realizar um cardapio online com entrega na sua mesa com três recursos significativos:
1. Usuário
    - Id
    - Nome
    - Email
    - Senha
2. Produto
    - Nome
    - Imagem
    - Preço
3. Pedido
    - Id
    - Usuário relacionado
    - Mesa
    - Lista de produtos pedidos
        - Produto relacionado
        - Quantidade
    - Hora do pedido
    - Anotação extra do cliente

## CRUD

1. Usuário
    - Create
        - Criar a conta
    - Read
        - Ler as informações da conta (nome, email)
    - Update
        - Alterar as informações da conta (nome, email, senha)
    - Delete
        - Deletar a conta
2. Produto
    - Read
        - Ler as informaçẽos do produto (nome, imagem, categoria, preço)
3. Pedido
    - Create
        - Criar um novo pedido
    - Read
        - Ler as informações de seus pedidos
    - Update
        - Alterar a quantidade de produtos no seu pedido
    - Delete
        - Deletar algum produto no seu pedido

