# BD2 — Análise exploratória de atendimentos de saúde

Projeto acadêmico de Banco de Dados (Tarefa 3, UTFPR) para consultar e analisar registros de atendimentos de saúde na tabela PostgreSQL `public.bd2_sistema_e_saude`. O código usa TypeScript e TypeORM para acessar os dados e gera gráficos PNG com Chart.js no Node.js.

O projeto é um conjunto de scripts de terminal: não há servidor HTTP nem interface web. A documentação descreve uma base chamada `postgiscwb`, com **2.256.598 registros**; esse número é o informado nos documentos, não uma contagem realizada ao instalar ou executar o projeto.

## O que está implementado

- Verificação da conexão com PostgreSQL e leitura de uma amostra de cinco registros via entidade TypeORM.
- Volume mensal de atendimentos.
- Ranking de bairros e municípios por quantidade de atendimentos.
- Ranking dos códigos CID mais frequentes.
- Distribuição mensal por tipo de unidade, em barras empilhadas.
- Histograma da idade estimada no momento do atendimento.

Os seis gráficos já versionados estão em [`output/`](output/). As análises contam **registros de atendimentos**, não pessoas únicas nem taxas populacionais. Campos de bairro, município e tipo de unidade nulos ou em branco são agrupados como `(vazio)`. O histograma ignora datas ausentes e, por padrão, restringe as idades estimadas ao intervalo de 0 a 100 anos.

**Propostas, não implementações:** os cruzamentos com chuva e ruído urbano descritos em [`docs/perguntas-avancadas-fatores-ambientais.md`](docs/perguntas-avancadas-fatores-ambientais.md) dependem de fontes externas e de integração adicional. Não há scripts de ingestão ambiental, cruzamentos ou resultados dessas análises no código atual. As propostas não demonstram causalidade.

## Tecnologias

- **Node.js e npm**, com módulos ES e execução de TypeScript pelo **tsx**.
- **TypeScript 5.9** e configuração com decorators para as entidades.
- **TypeORM 0.3**, **pg**, **reflect-metadata** e **PostgreSQL** para acesso à base.
- **dotenv** para carregar a configuração de ambiente.
- **Chart.js 4** e **chartjs-node-canvas 5** para renderizar PNGs sem navegador.

As faixas de versões das dependências estão em [`package.json`](package.json). O repositório não fixa a versão de Node.js em `engines` e não versiona `package-lock.json`.

## Estrutura

```text
src/
  data-source.ts              # Conexão PostgreSQL e configuração do TypeORM
  index.ts                   # Verificação de conexão e amostra de registros
  entities/                  # Mapeamento de Bd2SistemaESaude
  repositories/              # Consultas de amostra e agregações
  scripts/                   # Scripts de geração dos gráficos
  utils/chart.ts             # Renderização e gravação de PNGs
  migrations/                # Apenas .gitkeep; sem migrations implementadas
docs/                        # Descrição da base, análises e materiais acadêmicos
output/                      # Gráficos PNG já gerados
17239-373-13830-1-10-20210917.pdf  # Artigo de referência
sbc_template.pdf             # Template SBC
package.json                 # Dependências e comandos disponíveis
tsconfig.json                # Configuração TypeScript
```

## Pré-requisitos

- Git, Node.js e npm instalados. Use uma versão de Node.js compatível com as dependências; não há versão mínima declarada pelo projeto.
- Acesso autorizado a um PostgreSQL com a tabela **já criada e populada** em `public.bd2_sistema_e_saude`, compatível com [`src/entities/Bd2SistemaESaude.ts`](src/entities/Bd2SistemaESaude.ts). Para executar as consultas e os gráficos, use preferencialmente um usuário com permissão de leitura.
- Ambiente capaz de instalar as dependências nativas do canvas usadas por `chartjs-node-canvas`. Se não houver binário compatível para o sistema/arquitetura, a instalação pode exigir ferramentas de compilação e bibliotecas gráficas do sistema.

O repositório **não inclui dump, dataset, importador nem migration inicial** para preparar a base. Obtenha os dados e o procedimento de carga com os responsáveis pelo projeto; instalar as dependências não cria os dados.

A entidade mapeia uma chave primária composta por `data_do_atendimento`, `codigo_unidade`, `codigo_cid` e `cod_usuario`. Consulte o [dicionário de dados e as decisões de modelagem](docs/documentacao-da-base.md) para os demais campos.

## Instalação e configuração

```sh
git clone https://github.com/feadonai123/bd2.git
cd bd2
npm install
```

Execute os comandos seguintes na raiz do projeto. A conexão é definida pela variável **`DATABASE_URL`**, carregada também de `.env` pelo `dotenv`. Sem um valor, a configuração lança o erro `DATABASE_URL is not set`.

Exemplo **fictício**, somente para ilustrar o formato da variável:

```dotenv
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/NOME_DO_BANCO
```

Substitua os marcadores pelos parâmetros do seu ambiente autorizado. Caracteres especiais no usuário ou na senha precisam de codificação apropriada para uma URL.

**Segurança:** já existe um `.env` versionado no repositório e ele não está ignorado pelo `.gitignore`. Não reproduza seus valores, não presuma que sejam válidos e não faça commit de credenciais. Prefira fornecer `DATABASE_URL` pelo ambiente do processo, sem gravar segredos no clone ou no histórico do terminal. Se optar por configurar o `.env` localmente, não publique essa alteração. Não compartilhe saídas com dados pessoais ou identificadores de pacientes.

Em [`src/data-source.ts`](src/data-source.ts), a conexão tem `ssl: false` e `synchronize: false`: o código atual não usa SSL nem sincroniza automaticamente o schema. Um servidor que exija SSL precisará de adequação dessa configuração; não desative exigências de segurança do servidor para executar os scripts.

## Execução

### Verificar os tipos

```sh
npm run typecheck
```

Esse comando verifica o TypeScript sem emitir arquivos e não depende de conexão com o banco. Não há script de testes automatizados nem de build no `package.json` atual.

### Verificar a conexão e consultar uma amostra

Com a base acessível e `DATABASE_URL` configurada:

```sh
npm run dev
```

O comando consulta o nome do banco e a hora do servidor, imprime até cinco registros da entidade e encerra a conexão. Não inicia um serviço persistente. **A amostra pode conter dados sensíveis**; execute apenas em ambiente autorizado e não publique os logs.

### Gerar os gráficos

Todos os comandos abaixo consultam o PostgreSQL configurado:

| Comando | Saída em `output/` | Parâmetros opcionais (padrão) |
| --- | --- | --- |
| `npm run chart:volume` | `volume-atendimentos-mensal.png` | — |
| `npm run chart:top-locais` | `top-bairros.png` e `top-municipios.png` | `TOP_N=20` |
| `npm run chart:top-cid` | `top-cid.png` | `TOP_N=25` |
| `npm run chart:tipo-unidade` | `tipo-unidade-por-mes.png` | `TOP_TIPOS=6` |
| `npm run chart:idade` | `idade-histograma.png` | `BIN_SIZE=5`, `MAX_AGE=100` |

`TOP_TIPOS` seleciona os tipos de unidade mais frequentes; os demais são agrupados em `OUTROS`. `BIN_SIZE` define a largura das faixas etárias em anos e `MAX_AGE` o limite superior de idade considerado.

Exemplos de personalização em um shell POSIX (Linux/macOS), após configurar a conexão:

```sh
TOP_N=30 npm run chart:top-cid
TOP_TIPOS=4 npm run chart:tipo-unidade
BIN_SIZE=10 MAX_AGE=90 npm run chart:idade
```

Use valores inteiros coerentes e positivos para os limites e tamanhos de faixa: os scripts convertem essas variáveis para números sem validação adicional. O utilitário cria a pasta de saída se necessário e **sobrescreve** os PNGs de mesmo nome. Os resultados dependem dos dados disponíveis no banco utilizado; não há garantia de reproduzir os mesmos valores das imagens versionadas.

### Migrations (opcional, não é uma etapa de instalação)

O `package.json` disponibiliza os comandos abaixo para manutenção do schema:

```sh
npm run migration:generate -- NomeDaAlteracao
npm run migration:run
npm run migration:revert
```

A geração compara a entidade ao banco configurado e grava a migration em `src/migrations/`. A execução aplica migrations pendentes e a reversão desfaz a última aplicada. **Não há migrations implementadas na versão atual**, portanto esses comandos não substituem a criação e a carga prévia da base. Revise qualquer migration gerada antes de aplicá-la: ela pode propor alterações no schema e requer permissões diferentes das consultas de leitura.

## Documentação e referências

- [Documentação da base](docs/documentacao-da-base.md): atributos, chave composta, quantidade documentada de registros e problemas de preparação/modelagem.
- [Descrição dos dados](docs/descricao-dos-dados.md): gráficos existentes e orientações de interpretação.
- [Relatório consolidado no formato SBC](docs/relatorio-consolidado-sbc.md): contexto acadêmico, perguntas básicas e propostas avançadas.
- [Perguntas avançadas sobre fatores ambientais](docs/perguntas-avancadas-fatores-ambientais.md): hipóteses e requisitos para análises futuras com chuva e ruído.
- [Tarefa 3 (PDF)](docs/Tarefa%203.pdf), [artigo de referência](17239-373-13830-1-10-20210917.pdf) e [template SBC](sbc_template.pdf): materiais acadêmicos incluídos no repositório.
