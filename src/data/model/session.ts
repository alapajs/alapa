import { Entity, Column, PrimaryColumn, Index, BaseEntity } from "typeorm";
import { NullColumn } from "../../utils";

@Entity("sessions")
export class SessionDatabase extends BaseEntity {
  @PrimaryColumn("varchar", { length: 255 })
  id!: string;

  @NullColumn({
    type: process.env.DATABASE_TYPE == "mysql" ? "longtext" : "text",
  })
  data!: string;

  @Index()
  @Column("bigint")
  expiredAt!: number;
}
