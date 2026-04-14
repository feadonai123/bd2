import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ schema: "public", name: "bd2_sistema_e_saude" })
@Index("idx_atendimento_data", ["data_do_atendimento"])
@Index("idx_codigo_unidade", ["codigo_unidade"])
@Index("idx_codigo_procedimento", ["codigo_procedimento"])
@Index("idx_codigo_cid", ["codigo_cid"])
@Index("idx_cod_usuario", ["cod_usuario"])
@Index("idx_cod_profissional", ["cod_profissional"])
@Index("idx_municipio", ["municipio"])
@Index("idx_bairro", ["bairro"])
export class Bd2SistemaESaude {
  @PrimaryColumn({ type: "timestamp without time zone" })
  data_do_atendimento!: Date;

  @Column({ type: "timestamp without time zone", nullable: true })
  data_de_nascimento!: Date | null;

  @Column({ type: "character varying", length: 1, nullable: true })
  sexo!: string | null;

  @Column({ type: "integer", nullable: true })
  codigo_tipo_unidade!: number | null;

  @Column({ type: "character varying", length: 50, nullable: true })
  tipo_unidade!: string | null;

  @PrimaryColumn({ type: "character varying", length: 150 })
  codigo_unidade!: string;

  @Column({ type: "character varying", length: 80, nullable: true })
  descricao_unidade!: string | null;

  @Column({ type: "character varying", length: 12, nullable: true })
  codigo_procedimento!: string | null;

  @Column({ type: "character varying", length: 255, nullable: true })
  descricao_procedimento!: string | null;

  @Column({ type: "character varying", length: 8, nullable: true })
  codigo_cbo!: string | null;

  @Column({ type: "character varying", length: 200, nullable: true })
  descricao_cbo!: string | null;

  @PrimaryColumn({ type: "character varying", length: 4 })
  codigo_cid!: string;

  @Column({ type: "character varying", length: 150, nullable: true })
  descricao_cid!: string | null;

  @Column({ type: "character varying", length: 3, nullable: true })
  solicitacao_exames!: string | null;

  @Column({ type: "integer", nullable: true })
  qtde_prescrita_farmacia_curitibana!: number | null;

  @Column({ type: "integer", nullable: true })
  qtde_dispensada_farmacia_curitibana!: number | null;

  @Column({ type: "integer", nullable: true })
  qtde_medicamento_nao_padronizado!: number | null;

  @Column({ type: "character varying", length: 3, nullable: true })
  encaminhamento_especialista!: string | null;

  @Column({ type: "character varying", length: 255, nullable: true })
  area_atuacao!: string | null;

  @Column({ type: "character varying", length: 3, nullable: true })
  desencadeou_internamento!: string | null;

  @Column({ type: "timestamp without time zone", nullable: true })
  data_internamento!: Date | null;

  @Column({ type: "character varying", length: 80, nullable: true })
  estabelecimento_solicitante!: string | null;

  @Column({ type: "character varying", length: 80, nullable: true })
  estabelecimento_destino!: string | null;

  @Column({ type: "character varying", length: 4, nullable: true })
  cid_internamento!: string | null;

  @Column({ type: "character varying", length: 30, nullable: true })
  tratamento_domicilio!: string | null;

  @Column({ type: "character varying", length: 40, nullable: true })
  abastecimento!: string | null;

  @Column({ type: "character varying", length: 3, nullable: true })
  energia_eletrica!: string | null;

  @Column({ type: "character varying", length: 60, nullable: true })
  tipo_habitacao!: string | null;

  @Column({ type: "character varying", length: 30, nullable: true })
  destino_lixo!: string | null;

  @Column({ type: "character varying", length: 30, nullable: true })
  fezes_urina!: string | null;

  @Column({ type: "integer", nullable: true })
  comodos!: number | null;

  @Column({ type: "character varying", length: 100, nullable: true })
  servicos_caso_doenca!: string | null;

  @Column({ type: "character varying", length: 40, nullable: true })
  grupo_comunitario!: string | null;

  @Column({ type: "character varying", length: 40, nullable: true })
  meio_comunicacao!: string | null;

  @Column({ type: "character varying", length: 100, nullable: true })
  meio_transporte!: string | null;

  @Column({ type: "character varying", length: 50, nullable: true })
  municipio!: string | null;

  @Column({ type: "character varying", length: 72, nullable: true })
  bairro!: string | null;

  @Column({ type: "character varying", length: 20, nullable: true })
  nacionalidade!: string | null;

  @PrimaryColumn({ type: "integer" })
  cod_usuario!: number;

  @Column({ type: "integer", nullable: true })
  origem_usuario!: number | null;

  @Column({ type: "integer", nullable: true })
  residente!: number | null;

  @Column({ type: "integer", nullable: true })
  cod_profissional!: number | null;

}
