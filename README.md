# 📦 Cade? - API de Rastreamento Centralizada

O **"Cade?"** é uma API centralizada de rastreio open source, desenvolvida para unificar o acompanhamento de encomendas de diferentes transportadoras (como Amazon, Correios, Mercado Livre, Jadlog, entre outras) em um único ecossistema.

Ao receber um código de rastreio (ou CPF/CNPJ) e o ID do provedor, a API consulta o status do pacote através de microserviços/plugins acoplados e retorna os dados em um formato padronizado. O projeto foi projetado para servir como base para futuros aplicativos mobile (Android/iOS) e skills da Alexa, permitindo que os usuários finais gerenciem seus pacotes ou perguntem por voz: *"Cadê meu tênis?"*.

## 🏗️ Arquitetura e Tecnologias

Para evitar a complexidade de gerenciar múltiplos scrapings e integrações diretas no núcleo da API, o projeto utiliza uma **arquitetura modular baseada em plugins (wrappers) com injeção automática**.

* O núcleo da aplicação lida com a autenticação de usuários (JWT), contas, rotas HTTP e banco de dados.
* Cada transportadora é isolada em um plugin próprio dentro da pasta `src/providers/implementations/`.
* **Registro Automático:** A API lê a pasta de plugins dinamicamente e registra as instâncias em memória ao iniciar o servidor. Nenhuma alteração no core é necessária para adicionar novos provedores!
* O wrapper traduz a resposta (XML, JSON, HTML) para um DTO de retorno padronizado para o sistema.
* **Ecossistema:** Desenvolvido em **Node.js** com **NestJS** e **TypeScript** (ESM). Utiliza **Prisma ORM** com **PostgreSQL** para persistência e **Swagger** para documentação.

## 🚀 Como Rodar Localmente

Siga os passos abaixo para configurar o ambiente de desenvolvimento na sua máquina.

### 1. Pré-requisitos

* **Node.js**: v26.8.2 (O projeto utiliza o `mise` para gestão de versões. Rode `mise install` se aplicável).
* **Docker**: Para rodar o banco de dados PostgreSQL isolado.

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/cade-api.git
cd cade-api
npm install
```

### 3. Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto contendo as credenciais do banco e a chave JWT:

```env
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/cade_db?schema=public"
JWT_SECRET="sua_chave_secreta_aqui"
```

### 4. Subindo a Infraestrutura

Levante o contêiner do PostgreSQL usando o Docker Compose:

```bash
docker compose up -d
```

Gere o cliente do Prisma e crie as tabelas no banco de dados:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Popule o banco de dados com os provedores iniciais (Seed dinâmico):

```bash
npx prisma db seed
```

### 5. Executando a API

Inicie o servidor de desenvolvimento:

```bash
npm run start:dev
```

A API estará rodando! Você pode acessar a **Documentação Interativa (Swagger)** e testar os endpoints em:
👉 `http://localhost:3000/docs`

## 🔌 Como Adicionar um Novo Provedor (Plugin)

A arquitetura do "Cade?" foi feita para a comunidade! O sistema é **plug and play**. Qualquer pessoa pode adicionar um novo provedor (ex: Jadlog, Azul Cargo) em passos bem simples:

### Passo 1: Crie o Wrapper

Dentro de `src/providers/implementations/`, crie um arquivo para sua transportadora seguindo o padrão de nomenclatura `<id_do_provedor>.provider.ts` (ex: `jadlog.provider.ts`). Implemente a interface `ProviderPlugin`. O retorno deve ser um `TrackingResult` padronizado.

```typescript
import { ProviderPlugin, TrackingResult } from '../interfaces/provider-plugin.interface.js';

export class JadlogProvider implements ProviderPlugin {
  async getTracking(trackingCode: string, document?: string): Promise<TrackingResult> {
    // 1. Faça a requisição real para a transportadora aqui
    // 2. Retorne o objeto formatado:
    return {
      currentStatus: 'EM_TRANSITO',
      currentDescription: 'Objeto em trânsito',
      history: [/* histórico de eventos */]
    };
  }
}
```

### Passo 2: (Automático!) Reconhecimento Dinâmico

Você **não precisa** alterar nenhum serviço central ou injetar sua classe manualmente! A API utiliza uma varredura dinâmica no módulo NestJS. Ao salvar o arquivo na pasta `implementations`, o sistema extrai o ID do arquivo (`jadlog`) e já o deixa disponível para os usuários finais automaticamente.

### Passo 3: Crie o Seed Dinâmico

Para que o novo provedor seja listado nas consultas do banco de dados, adicione um arquivo orquestrado em `prisma/seeds/jadlog.seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  await prisma.provider.upsert({
    where: { id: 'jadlog' },
    update: {},
    create: {
      id: 'jadlog', // Este ID DEVE ser o mesmo do nome do arquivo .provider.ts
      name: 'Jadlog Logística',
      active: true,
      requiresDocument: true, // true se exigir CPF/CNPJ
    },
  });
  console.log('📦 Provedor inserido: Jadlog');
}
```

*Na próxima vez que alguém rodar `npx prisma db seed` ou subir a API do zero, seu provedor entrará no banco automaticamente.*

## 🤝 Como Abrir um Pull Request (PR)

Quer contribuir com um novo provedor ou melhoria?

1. Faça um **Fork** do repositório.
2. Crie uma branch para a sua feature (`git checkout -b feature/novo-provedor-jadlog`).
3. Desenvolva o plugin, teste localmente e faça o commit (`git commit -m "feat: adiciona plugin de rastreio da Jadlog"`).
4. Faça o push para o seu fork (`git push origin feature/novo-provedor-jadlog`).
5. Abra o **Pull Request** no repositório original detalhando a transportadora e se ela exige CPF/CNPJ.

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE). Você é livre para usar, modificar, distribuir e integrar esta API em seus próprios projetos comerciais ou open source.