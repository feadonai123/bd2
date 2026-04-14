# Como gerar o PDF no template SBC

O arquivo principal do relatório é `relatorio_sbc.tex` (na raiz do projeto).

## Opção A) Overleaf (recomendado)

1. Acesse o Overleaf e crie um projeto em branco.
2. Faça upload de:
   - `relatorio_sbc.tex`
   - a pasta `output/` (ou, no mínimo, as imagens usadas no `.tex`)
3. Compile (PDFLaTeX).

## Opção B) TeX Live / MikTeX (Windows)

1. Instale uma distribuição LaTeX (TeX Live ou MikTeX).
2. No terminal, na pasta do projeto, rode:

```bash
pdflatex relatorio_sbc.tex
pdflatex relatorio_sbc.tex
```

O PDF será gerado como `relatorio_sbc.pdf`.

