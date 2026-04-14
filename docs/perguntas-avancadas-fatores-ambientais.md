# Perguntas avançadas (fatores ambientais)

Este documento propõe 2 perguntas avançadas que relacionam a base `public.bd2_sistema_e_saude` a **variáveis ambientais** (ex.: chuva/precipitação, ruído). O objetivo é explorar relações potencialmente interessantes sem confundir correlação com causalidade.

## Premissas e integração de dados

Para responder às perguntas abaixo, é necessário enriquecer a base com uma tabela (ou fonte) ambiental contendo medições por **tempo** e, idealmente, por **local**:

- **Chuva/precipitação**: mm de chuva por dia (ou hora) para Curitiba (ou por estação/região).
- **Ruído**: nível de ruído (ex.: \(L_{eq}\) diário) por região/bairro, quando disponível.

### Como “ligar” com a tabela de saúde

A tabela `bd2_sistema_e_saude` já fornece:

- **Tempo**: `data_do_atendimento` (timestamp)
- **Local**: `municipio`, `bairro` (strings)

Sugestão prática de *join*:

- **Granularidade diária**: `date(data_do_atendimento)` \(\rightarrow\) `data_dia` na tabela ambiental
- **Local**:
  - se o ambiental for só “Curitiba (cidade)”: join apenas por dia;
  - se houver dados por bairro/região: normalizar strings e join por (`data_dia`, `bairro`/`regiao`).

> Recomendação: criar uma tabela auxiliar `dim_bairro` para padronizar grafias (apelidos/abreviações) e facilitar o cruzamento com dados externos.

---

## Pergunta avançada 1 (chuva/precipitação)

### Pergunta
**Dias (ou semanas) mais chuvosos estão associados a mudanças no volume e no perfil dos atendimentos?**

### Por que é interessante
Chuva forte pode afetar mobilidade, exposição a patógenos, agravamento de sintomas, acidentes e a escolha do tipo de serviço (ex.: maior procura por UPA).

### Como responder (tabela + gráficos)

1) **Tabela de base (diária)**: para cada dia, calcular:
- total de atendimentos
- total por `tipo_unidade` (ex.: BASICO vs UPA)
- indicadores por CID/grupo CID (separar por capítulos CID ou Top CIDs)

2) **Acoplar chuva**: adicionar `precipitacao_mm` do dia (ou soma/ média diária).

3) **Gráficos recomendados**
- **Dispersão**: \(precipitacao\_mm\) (x) vs **atendimentos do dia** (y), com linha de tendência.
- **Boxplot por faixas de chuva**: categorizar chuva em bins (0, 0–5, 5–20, >20mm) e comparar distribuição do volume diário.
- **Efeito defasado (lag)**: comparar chuva em \(t\) com atendimentos em \(t+1\), \(t+2\), ..., \(t+7\) (para capturar impacto tardio).

### Cuidados / vieses
- **Sazonalidade**: chuva é sazonal e o volume de atendimentos também pode ser; controle por mês/estação.
- **Dia da semana/feriados**: comparar sempre com ajuste por calendário.
- **Causalidade**: correlação não prova que chuva causa atendimento; é um indicativo exploratório.

---

## Pergunta avançada 2 (ruído urbano)

### Pergunta
**O nível de ruído urbano está associado a maior frequência de certos diagnósticos (ex.: cefaleia `R51`) ou a maior procura por determinados tipos de unidade?**

### Por que é interessante
Ruído se correlaciona com estresse, qualidade do sono, e pode ter associação com sintomas (ex.: cefaleia, ansiedade) e com padrões urbanos (tráfego, densidade, atividade econômica).

### Como responder (tabela + gráficos)

1) **Definir a métrica de ruído**
- diária (média/mediana de \(L_{eq}\)) por bairro/região, ou
- mensal por bairro/região (se a fonte for agregada).

2) **Definir o recorte clínico**
Exemplos:
- frequência de `codigo_cid = 'R51'` (cefaleia)
- conjunto de CIDs por capítulo (se você mapear CID \(\rightarrow\) capítulo)

3) **Gráficos recomendados**
- **Mapa de calor (bairro × mês)**: ruído vs taxa de atendimento (normalizar por população, se disponível).
- **Dispersão por bairro**: ruído médio (x) vs taxa de um CID específico (y), com destaque para outliers.
- **Ranking**: Top bairros por ruído e comparar com Top bairros por um CID-alvo (sobreposição parcial).

### Cuidados / vieses
- **Confundimento urbano**: ruído pode ser proxy de densidade/fluxo; ideal controlar por população, renda, densidade (se você tiver essas dimensões).
- **Normalização**: use **taxas** (ex.: atendimentos por 10 mil habitantes) quando cruzar por bairro.
- **Cobertura da medição**: ruído pode ter poucas estações/pontos; explicitar limitações.

---

## Próximos passos (práticos)

- **Definir a fonte ambiental**:
  - chuva: INMET / Simepar / dados abertos municipais
  - ruído: medições municipais, estudos, ou proxies (tráfego) se não houver ruído direto
- **Criar tabelas no Postgres** (ex.: `public.clima_diario`, `public.ruido_bairro_mes`) para facilitar *joins*
- **Gerar gráficos** com o mesmo pipeline do projeto (scripts TS + `output/`)

