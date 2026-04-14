import type { DataSource } from "typeorm";
import { Bd2SistemaESaude } from "../entities/Bd2SistemaESaude.js";

export type BucketCountRow = { bucket: string; total: number };
export type LabelCountRow = { label: string; total: number };
export type TopCidRow = {
  codigo_cid: string;
  descricao_cid: string | null;
  total: number;
};
export type AgeHistogramRow = { faixa: string; total: number };

export class Bd2SistemaESaudeRepository {
  constructor(private readonly ds: DataSource) {}

  entityRepo() {
    return this.ds.getRepository(Bd2SistemaESaude);
  }

  async sample(take = 5) {
    return this.entityRepo().find({ take });
  }

  async volumeMensal(): Promise<BucketCountRow[]> {
    return this.ds.query(
      `
      select
        to_char(date_trunc('month', data_do_atendimento), 'YYYY-MM') as bucket,
        count(*)::int as total
      from public.bd2_sistema_e_saude
      group by 1
      order by 1
      `
    );
  }

  async topBairros(n: number): Promise<LabelCountRow[]> {
    const rows: LabelCountRow[] = await this.ds.query(
      `
      select
        coalesce(nullif(trim(bairro), ''), '(vazio)') as label,
        count(*)::int as total
      from public.bd2_sistema_e_saude
      group by 1
      order by total desc
      `
    );
    return rows.slice(0, n);
  }

  async topMunicipios(n: number): Promise<LabelCountRow[]> {
    const rows: LabelCountRow[] = await this.ds.query(
      `
      select
        coalesce(nullif(trim(municipio), ''), '(vazio)') as label,
        count(*)::int as total
      from public.bd2_sistema_e_saude
      group by 1
      order by total desc
      `
    );
    return rows.slice(0, n);
  }

  async topCid(n: number): Promise<TopCidRow[]> {
    return this.ds.query(
      `
      select
        codigo_cid,
        max(descricao_cid) as descricao_cid,
        count(*)::int as total
      from public.bd2_sistema_e_saude
      group by codigo_cid
      order by total desc
      limit $1
      `,
      [n]
    );
  }

  async histogramaIdade(binSize = 5, maxAge = 100): Promise<AgeHistogramRow[]> {
    return this.ds.query(
      `
      with base as (
        select
          floor(extract(epoch from age(data_do_atendimento, data_de_nascimento)) / (365.25*24*60*60))::int as idade
        from public.bd2_sistema_e_saude
        where data_de_nascimento is not null
          and data_do_atendimento is not null
      ),
      filtered as (
        select idade
        from base
        where idade between 0 and $2
      ),
      binned as (
        select
          (idade / $1) * $1 as bin_ini,
          ((idade / $1) * $1 + ($1 - 1)) as bin_fim
        from filtered
      )
      select
        lpad(bin_ini::text, 2, '0') || '-' || lpad(bin_fim::text, 2, '0') as faixa,
        count(*)::int as total
      from binned
      group by bin_ini, bin_fim
      order by bin_ini
      `,
      [binSize, maxAge]
    );
  }
}

