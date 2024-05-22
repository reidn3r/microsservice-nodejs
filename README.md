<h2 align="center"> Sistema Distribuído: Microsserviços para Registro e Validação de Usuários </h2>
<p align="center"> Projeto desenvolvido com a finalidade de entender mais sobre Message Brokers (04/2024) </p>

<hr>

## Rotas:

- Microsserviço de confirmação de email:
    1. GET /confirm/:url/:email:
        - Confirma registro

    2. GET /confirm/new/:email
        - Gera novo link de confirmação de registro

* Microsserviço de criação de registro:
    1. POST /user/new
        - Recebe name, email e password no corpo da requisição e armazena os dados em disco. Em seguida, é gerado um link de confirmação de cadastro.
            - Redis: Armazena parte do link (uuid) como um par chave-valor, onde a chave é "email::xyz", onde "xyz" é o email cadastrado, de forma que cada chave seja única, e o valor é o uuid gerado, usado como parte da url de confirmação de cadastro.
        - Logo após, uma mensagem é publicada em uma fila específica e o serviço de confirmação de email é capaz de receber a mensagem.

    2. GET /user/all
        - Encontra todos os usuários, com registro confirmado ou não.


### 💻 Stack
Principais tecnologias utilizadas:
- RabbitMQ
- PostgreSQL
- Redis
- Fastify
- Prisma
- Docker/Docker Compose

<hr>

### Arquitetura:
