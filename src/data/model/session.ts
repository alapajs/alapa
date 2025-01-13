import { Entity, PrimaryColumn, Index, BaseEntity } from "typeorm";
import { NullColumn, TextColumn } from "../../utils";

@Entity("sessions")
export class SessionDatabase extends BaseEntity {
  @PrimaryColumn("varchar", { length: 255 })
  id: string;

  @TextColumn()
  data: string;

  @Index()
  @NullColumn()
  expiredAt: number;
}
