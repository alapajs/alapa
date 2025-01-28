import { Entity, PrimaryColumn, Index, BaseEntity, Column } from "typeorm";
import { NullColumn, TextColumn } from "../../utils";

@Entity("sessions")
export class SessionDatabase extends BaseEntity {
  @PrimaryColumn("varchar", { length: 255 })
  id: string;

  @TextColumn()
  data: string;

  @Index()
  @NullColumn()
  @Column("bigint", { nullable: true })
  expiredAt: number; // Make sure to use a type that matches your timestamp needs
}
