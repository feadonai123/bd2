# Documentação da base `bd2_sistema_e_saude`

Este documento descreve a tabela utilizada no projeto, seus atributos, uma visão geral (descrição dos dados) e os principais problemas encontrados durante a preparação e inserção/modelagem.

## Visão geral

- **Banco**: `postgiscwb`
- **Schema/Tabela**: `public.bd2_sistema_e_saude`
- **Quantidade de tuplas**: **2.256.598** registros

## Chave primária (problema encontrado e solução)

Durante a modelagem, foi identificado que **nenhum campo isolado** era suficiente para atuar como identificador único dos registros (isto é, havia duplicidades naturais para colunas como data, unidade, CID ou usuário).

Para resolver, foi necessário **testar combinações (chaves conjuntas)** até obter unicidade. A chave primária definida foi a composição:

- `data_do_atendimento`
- `codigo_unidade`
- `codigo_cid`
- `cod_usuario`

Essa decisão permite ao TypeORM mapear a tabela com consistência (evitando colisões de chave) e também ajuda a prevenir inserções duplicadas para o mesmo evento/registro lógico.

## Descrição dos atributos

Os atributos abaixo são os principais campos presentes na tabela e seu significado (alto nível). Os tipos e tamanhos seguem o schema do PostgreSQL (ex.: `varchar(n)`).

| Atributo | Tipo | Descrição (resumo) |
|---|---:|---|
| `data_do_atendimento` | `timestamp` | Data/hora do atendimento (marca temporal do registro). |
| `data_de_nascimento` | `timestamp` | Data de nascimento (quando disponível). |
| `sexo` | `varchar(1)` | Sexo do usuário (ex.: `M`, `F`). |
| `codigo_tipo_unidade` | `int4` | Código do tipo de unidade. |
| `tipo_unidade` | `varchar(50)` | Tipo de unidade (ex.: `BASICO`, `UPA`). |
| `codigo_unidade` | `varchar(150)` | Código identificador da unidade. |
| `descricao_unidade` | `varchar(80)` | Descrição/nome da unidade. |
| `codigo_procedimento` | `varchar(12)` | Código do procedimento. |
| `descricao_procedimento` | `varchar(255)` | Descrição do procedimento. |
| `codigo_cbo` | `varchar(8)` | Código CBO do profissional. |
| `descricao_cbo` | `varchar(200)` | Descrição do CBO. |
| `codigo_cid` | `varchar(4)` | Código CID (diagnóstico/classificação). |
| `descricao_cid` | `varchar(150)` | Descrição do CID. |
| `solicitacao_exames` | `varchar(3)` | Indica solicitação de exames (ex.: `Sim`/`Nao`). |
| `qtde_prescrita_farmacia_curitibana` | `int4` | Quantidade prescrita (farmácia). |
| `qtde_dispensada_farmacia_curitibana` | `int4` | Quantidade dispensada (farmácia). |
| `qtde_medicamento_nao_padronizado` | `int4` | Quantidade de medicamento não padronizado. |
| `encaminhamento_especialista` | `varchar(3)` | Indica encaminhamento a especialista (`Sim`/`Nao`). |
| `area_atuacao` | `varchar(255)` | Área de atuação associada ao atendimento. |
| `desencadeou_internamento` | `varchar(3)` | Indica se desencadeou internamento (`Sim`/`Nao`). |
| `data_internamento` | `timestamp` | Data/hora do internamento (quando existir). |
| `estabelecimento_solicitante` | `varchar(80)` | Estabelecimento solicitante. |
| `estabelecimento_destino` | `varchar(80)` | Estabelecimento destino. |
| `cid_internamento` | `varchar(4)` | CID associado ao internamento. |
| `tratamento_domicilio` | `varchar(30)` | Tipo de tratamento domiciliar. |
| `abastecimento` | `varchar(40)` | Informação de abastecimento (quando preenchido). |
| `energia_eletrica` | `varchar(3)` | Indica energia elétrica (`Sim`/`Nao`). |
| `tipo_habitacao` | `varchar(60)` | Tipo de habitação. |
| `destino_lixo` | `varchar(30)` | Destino do lixo. |
| `fezes_urina` | `varchar(30)` | Saneamento (fezes/urina). |
| `comodos` | `int4` | Número de cômodos. |
| `servicos_caso_doenca` | `varchar(100)` | Serviço procurado em caso de doença. |
| `grupo_comunitario` | `varchar(40)` | Participação em grupo comunitário. |
| `meio_comunicacao` | `varchar(40)` | Meios de comunicação. |
| `meio_transporte` | `varchar(100)` | Meio(s) de transporte. |
| `municipio` | `varchar(50)` | Município. |
| `bairro` | `varchar(72)` | Bairro. |
| `nacionalidade` | `varchar(20)` | Nacionalidade. |
| `cod_usuario` | `int4` | Código do usuário (identificador interno). |
| `origem_usuario` | `int4` | Origem do usuário. |
| `residente` | `int4` | Indicador de residência (quando existente). |
| `cod_profissional` | `int4` | Código do profissional. |

## Descrição dos dados (resumo e visualizações)

Para uma análise inicial do dataset, foram produzidos gráficos em `output/`:

- **Série temporal mensal** do volume de atendimentos.
- **Top bairros** e **Top municípios** por volume.
- **Top CIDs** por frequência.
- **Barras empilhadas** por mês e `tipo_unidade`.
- **Histograma de idade** (idade estimada por `data_do_atendimento - data_de_nascimento`).

Os detalhes e interpretações dessas visualizações estão em `docs/descricao-dos-dados.md`.

## Problemas encontrados na inserção / preparação

- **Definição de chave primária**: não havia coluna única confiável; foi necessário testar chaves compostas até encontrar uma combinação que garantisse unicidade (`data_do_atendimento`, `codigo_unidade`, `codigo_cid`, `cod_usuario`).
- **Conformidade do schema vs Entity (TypeORM)**: ao iniciar migrations, diferenças como `varchar` sem `length` e ausência de `@Index` faziam o TypeORM propor alterações agressivas. A Entity foi ajustada para **bater 100%** com o banco (incluindo `length` e índices).

## Exemplo de tupla (amostra)

A tabela abaixo mostra um exemplo de registro extraído da base para ilustrar o formato dos dados. Para evitar expor identificadores completos, o campo `cod_usuario` foi parcialmente mascarado.

| Campo | Valor |
|---|---|
| `data_do_atendimento` | 2024-10-04 10:33:39 |
| `data_de_nascimento` | 1994-06-27 03:00:00 |
| `sexo` | M |
| `tipo_unidade` | BASICO |
| `codigo_unidade` | 5406617 |
| `descricao_unidade` | UMS VILA SANDRA PSF |
| `codigo_cid` | Z760 |
| `descricao_cid` | EMISSAO DE PRESCRICAO DE REPETICAO |
| `bairro` | CAMPO COMPRIDO |
| `municipio` | CURITIBA |
| `solicitacao_exames` | Sim |
| `encaminhamento_especialista` | Nao |
| `desencadeou_internamento` | Nao |
| `cod_usuario` | 12*** |

