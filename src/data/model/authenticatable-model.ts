import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { NullColumn, PrimaryKeyColumn } from "../../utils/columns";
import { Model } from "../../models";

export abstract class AuthenticatableModel extends Model {
  @PrimaryKeyColumn()
  id: string;

  @NullColumn()
  firstName: string;

  @NullColumn()
  lastName: string;

  @NullColumn()
  middleName: string;

  @NullColumn({ unique: true })
  username: string;

  @NullColumn({ unique: true })
  email: string;

  @NullColumn({ default: false })
  emailVerified: boolean;

  @NullColumn()
  password: string;

  @NullColumn()
  loginToken: string;

  @NullColumn()
  resetToken: string;

  @NullColumn()
  resetTokenExpiresTime: string;

  @NullColumn()
  country: string;

  @NullColumn()
  role: string;

  @NullColumn({ unique: true })
  phoneNumber: string;

  @NullColumn()
  address: string; //

  @NullColumn()
  profilePicture: string;

  @NullColumn()
  dateOfBirth: Date;

  @NullColumn()
  gender: string;

  @NullColumn()
  isEmailNotificationsEnabled: boolean;

  @NullColumn()
  isTwoFactorEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @NullColumn({ default: true })
  isActive: boolean;
}
