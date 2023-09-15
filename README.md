# Store Manager 🏪

Este projeto representa minha jornada de construção bem-sucedida de uma API RESTful de gerenciamento de vendas no formato dropshipping. Durante o desenvolvimento deste projeto, adquiri várias habilidades cruciais relacionadas ao desenvolvimento web e à criação de uma arquitetura robusta.

## Principais Realizações

Aqui estão algumas das principais realizações e aprendizados que obtive durante este projeto:

### Arquitetura MSC (Model-Service-Controller)

- **Model**: Aprendi a criar a camada Model para lidar com o acesso e a manipulação de dados no banco de dados MySQL. Isso incluiu a implementação de funções como `findAll`, `findById`, `insert`, e mais. Também me concentrei em escrever testes unitários para garantir a confiabilidade dessas funções.

- **Service**: Na camada Service, implementei a lógica de negócios da aplicação. Isso envolveu funções como `createProduct`, `createSale`, e outras, onde validei os dados usando o módulo Joi e criei contratos de retorno confiáveis. Mais uma vez, os testes unitários desempenharam um papel fundamental na garantia da integridade dessas funções.

- **Controller**: Na camada Controller, mapeei as rotas para suas respectivas funções e lidei com as requisições HTTP. Isso incluiu funções como `listProducts`, `updateProduct`, e assim por diante. Aqui, também me concentrei em validações específicas da camada Controller e escrevi testes correspondentes.

### Banco de Dados MySQL e Docker

- Me familiarizei com a integração do Node.js com o banco de dados MySQL, permitindo a gestão eficiente de dados.

- Aprendi a utilizar o Docker e o docker-compose para criar ambientes de desenvolvimento com containers separados para a aplicação e o banco de dados.

### Testes Unitários

- Desenvolvi uma sólida prática de escrever testes unitários para cada camada da aplicação, garantindo que as funcionalidades permanecessem confiáveis e livres de bugs.

### Padrão REST

- Apliquei o padrão REST na construção da API, garantindo uma interface uniforme e intuitiva para interações com a aplicação.

## Requisitos Atendidos

Durante a conclusão deste projeto, atendi a uma série de requisitos, demonstrando minha capacidade de criar uma aplicação robusta e altamente testada. Alguns dos requisitos incluem:

- Listagem de produtos e vendas.
- Cadastro e validações de produtos e vendas.
- Atualização e exclusão de produtos.
- Pesquisa de produtos por termos.
- Cobertura de testes unitários em várias camadas da aplicação.
