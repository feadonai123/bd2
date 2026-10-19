# BD2 — Análise exploratória de atendimentos de saúde

Projeto da disciplina de Banco de Dados (Tarefa 3), com scripts TypeScript para consultar registros de atendimentos no PostgreSQL e gerar gráficos PNG. O ponto de entrada verifica a conexão e apresenta uma amostra de cinco registros; não há servidor HTTP ou interface web implementados.

## Tecnologias

- Node.js e TypeScript, com módulos ES e execução por `tsx`.
- PostgreSQL, driver `pg` e TypeORM para conexão, mapeamento da tabela e consultas SQL.
- `dotenv` para carregar a configuração de ambiente.
- Chart.js e `chartjs-node-canvas` para renderização dos gráficos.
- `ts-node` para os comandos de migrations do TypeORM.

As dependências e suas faixas de versão estão em [package.json](package.json); a configuração do TypeScript está em [tsconfig.json](tsconfig.json).

## Base utilizada e limites do projeto

O código consulta **`public.bd2_sistema_e_saude`**, mapeada em [Bd2SistemaESaude.ts](src/entities/Bd2SistemaESaude.ts). A tabela reúne datas de atendimento e nascimento, unidade, procedimentos, CID, bairro, município e outros atributos clínicos e administrativos. A chave primária mapeada é composta por `data_do_atendimento`, `codigo_unidade`, `codigo_cid` e `cod_usuario`.

A documentação descreve uma base chamada `postgiscwb`, com 2.256.598 registros. Essa contagem é uma informação registrada nos documentos, não uma medição feita pelo README; a conexão efetiva é determinada por `DATABASE_URL`.

**Propostas, não implementações:** as tabelas `public.clima_diario`, `public.ruido_bairro_mes` e a dimensão auxiliar `dim_bairro` são sugestões da [documentação de fatores ambientais](docs/perguntas-avancadas-fatores-ambientais.md). Não há entidades, migrations ou scripts que implementem essas integrações. As análises de chuva e ruído dependem de dados externos e não fazem parte dos gráficos atuais.

## Estrutura

```text
src/
  index.ts                                # conexão e amostra de registros
  data-source.ts                          # configuração do TypeORM
  entities/Bd2SistemaESaude.ts              # mapeamento da tabela existente
  repositories/Bd2SistemaESaudeRepository.ts # amostra e consultas agregadas
  scripts/chart-*.ts                      # geração dos gráficos
  utils/chart.ts                          # renderização e gravação de PNG
  migrations/                             # contém apenas .gitkeep no estado atual
docs/                                     # documentação e enunciado da tarefa
output/                                   # seis imagens PNG já versionadas
package.json                              # dependências e scripts npm
tsconfig.json                             # configuração do TypeScript
```

A raiz também contém os PDFs de referência listados em [Documentação existente](#documentação-existente).

## Requisitos

- Node.js e npm. O projeto não declara uma versão de Node.js em `engines` nem fornece arquivo de seleção de versão; utilize uma versão compatível com as dependências do `package.json`.
- Acesso autorizado a um PostgreSQL com a tabela `public.bd2_sistema_e_saude` já criada e populada, compatível com a entidade, e permissão de leitura para executar a amostra e os gráficos.
- Para migrations, permissões de alteração de esquema, somente quando houver uma mudança intencional e revisada.
- Ambiente capaz de instalar o backend nativo de canvas usado por `chartjs-node-canvas`. Se não houver binário compatível para o sistema, a instalação pode exigir ferramentas de compilação e bibliotecas do sistema conforme a documentação dessa dependência.

O repositório não fornece dump, carga de dados, provisionamento do PostgreSQL ou migrations iniciais. Instalar as dependências **não cria nem popula a tabela**. O DataSource usa `synchronize: false` e `ssl: false`; conexões que exigem SSL demandam uma adequação dessa configuração, não apenas a troca da URL.

## Instalação e configuração

Na raiz do clone, instale as dependências:

```sh
npm install
```

O `package-lock.json` está ignorado pelo `.gitignore` e não é versionado; por isso, a instalação não é baseada em um lockfile fornecido pelo projeto.

### Variáveis de ambiente

O módulo `src/data-source.ts` carrega `dotenv/config`. Defina `DATABASE_URL` no ambiente do processo ou em um `.env` na raiz, antes de executar os scripts. As demais variáveis são opcionais e controlam os gráficos.

| Variável | Uso | Padrão / exemplo seguro |
| --- | --- | --- |
| `DATABASE_URL` | Conexão PostgreSQL; obrigatória para execução e migrations. | Exemplo fictício: `postgresql://usuario_exemplo:senha_ficticia@localhost:5432/banco_exemplo` |
| `TOP_N` | Quantidade de bairros/municípios ou CIDs no ranking. | `20` em `chart:top-locais`; `25` em `chart:top-cid`. |
| `TOP_TIPOS` | Quantidade de tipos de unidade destacados; os demais são agrupados em `OUTROS`. | `6` |
| `BIN_SIZE` | Largura das faixas etárias, em anos. | `5` |
| `MAX_AGE` | Idade máxima incluída no histograma. | `100` |

Exemplo **inteiramente fictício** de configuração local:

```dotenv
DATABASE_URL=postgresql://usuario_exemplo:senha_ficticia@localhost:5432/banco_exemplo
```

Substitua os valores apenas no seu ambiente autorizado. O repositório já contém um `.env` versionado e o `.gitignore` atual não o ignora: **não publique credenciais reais nem inclua alterações com segredos em commits**. Nenhum valor desse arquivo é reproduzido aqui. O código lança `DATABASE_URL is not set` quando a variável não está definida ou está vazia.

## Execução e scripts disponíveis

Execute os comandos na raiz do projeto. Para conferir os tipos sem consultar o banco:

```sh
npm run typecheck
```

Para inicializar a conexão, consultar o nome do banco e a hora atual e imprimir uma amostra de até cinco registros da entidade:

```sh
npm run dev
```

Apesar do nome `dev`, o script faz uma execução única, encerra a conexão e não inicia um servidor ou modo de observação. A saída inclui dados da amostra: trate os logs conforme as regras de acesso e privacidade da base.

Todos os scripts declarados no `package.json` são:

| Comando | Função |
| --- | --- |
| `npm run dev` | Verificar a conexão e imprimir uma amostra. |
| `npm run typecheck` | Executar `tsc` com `--noEmit`. |
| `npm run chart:volume` | Gerar a série mensal de atendimentos. |
| `npm run chart:top-locais` | Gerar os rankings de bairros e municípios. |
| `npm run chart:top-cid` | Gerar o ranking de CIDs. |
| `npm run chart:tipo-unidade` | Gerar barras empilhadas por mês e tipo de unidade. |
| `npm run chart:idade` | Gerar o histograma de idade no atendimento. |
| `npm run migration:generate -- <nome> [--dryrun] [--pretty] [--check]` | Script destinado a comparar entidade e banco e gerar uma migration em `src/migrations/<nome>`, mas com a limitação de shell descrita abaixo. Substitua `<nome>` pelo nome desejado. |
| `npm run migration:run` | Aplicar migrations pendentes usando `src/data-source.ts`. |
| `npm run migration:revert` | Reverter a última migration executada. |

Os comandos de migrations são ferramentas disponíveis, **não etapas obrigatórias de instalação**: atualmente `src/migrations/` contém apenas `.gitkeep`. Revise o SQL gerado antes de aplicá-lo a qualquer banco. Não há scripts `start`, `build` ou `test` declarados.

**Limitação do script de geração:** no `package.json` atual, `migration:generate` inclui um template literal JavaScript com crases dentro do argumento entre aspas duplas de `node -e`. Em shells POSIX, as crases são interpretadas pelo shell como substituição de comando, comprometendo o JavaScript antes da execução. O script precisa ter esse escape corrigido antes de ser usado nesse ambiente; ele está listado aqui por existir no projeto, não como uma etapa de geração validada. Essa correção não faz parte deste README.

## Geração de gráficos

Com a conexão configurada e os dados disponíveis, os comandos abaixo consultam o PostgreSQL e gravam os respectivos arquivos:

| Comando | Arquivo(s) em `output/` |
| --- | --- |
| `npm run chart:volume` | `volume-atendimentos-mensal.png` |
| `npm run chart:top-locais` | `top-bairros.png`, `top-municipios.png` |
| `npm run chart:top-cid` | `top-cid.png` |
| `npm run chart:tipo-unidade` | `tipo-unidade-por-mes.png` |
| `npm run chart:idade` | `idade-histograma.png` |

A função em `src/utils/chart.ts` cria o diretório de destino quando necessário e grava PNG, substituindo arquivos de mesmo nome. Já existem seis imagens versionadas em [output/](output/); regenerá-las usa o conteúdo do banco configurado, que pode ser diferente da base documentada.

Exemplos de parâmetros opcionais em um shell compatível com a sintaxe POSIX:

```sh
TOP_N=30 npm run chart:top-cid
TOP_N=15 npm run chart:top-locais
TOP_TIPOS=4 npm run chart:tipo-unidade
BIN_SIZE=10 MAX_AGE=90 npm run chart:idade
```

Use valores numéricos adequados (inteiros positivos para quantidades e tamanho das faixas); os scripts convertem as variáveis com `Number` e não implementam validação explícita. O histograma exclui registros sem as datas necessárias e considera idades calculadas entre zero e `MAX_AGE`, agrupadas por `BIN_SIZE`. Nos rankings de locais, valores nulos ou em branco são agrupados como `(vazio)`. Essas consultas contam registros de atendimentos, não pessoas únicas.

## Documentação existente

- [Documentação da base](docs/documentacao-da-base.md): atributos, chave composta e problemas de preparação/modelagem relatados.
- [Descrição dos dados](docs/descricao-dos-dados.md): visualizações existentes, interpretação e reprodução.
- [Relatório consolidado no formato SBC](docs/relatorio-consolidado-sbc.md): apresentação da análise, perguntas e referências.
- [Perguntas avançadas sobre fatores ambientais](docs/perguntas-avancadas-fatores-ambientais.md): propostas de integração com chuva e ruído, dados necessários e limitações.
- [Enunciado — Tarefa 3](docs/Tarefa%203.pdf).
- [Artigo-exemplo](17239-373-13830-1-10-20210917.pdf) e [template SBC](sbc_template.pdf).

Os PDFs são materiais existentes no repositório; não há script declarado para gerar PDFs ou converter os relatórios Markdown.
