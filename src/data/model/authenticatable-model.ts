import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { NullColumn } from "../../utils/columns";
import { Model } from "../../models";

/**
 * Abstract model for an authenticatable user entity with various personal, security, and engagement properties.
 * Used to store user-related data including login details, preferences, security, and audit information.
 */
export abstract class AuthenticatableModel extends Model {
  /**
   * The user's first name.
   */
  @NullColumn()
  firstName: string;

  /**
   * The user's last name.
   */
  @NullColumn()
  lastName: string;

  /**
   * The user's middle name (if applicable).
   */
  @NullColumn()
  middleName: string;

  /**
   * The user's current status (e.g., 'active', 'inactive', 'suspended').
   */
  @NullColumn()
  status: string;

  /**
   * The user's gender.
   */
  @NullColumn()
  gender: string;

  /**
   * The unique username for the user.
   */
  @NullColumn({ unique: true })
  username: string;

  /**
   * The unique email address of the user.
   */
  @NullColumn({ unique: true })
  email: string;

  /**
   * Indicates whether the user's email has been verified.
   */
  @NullColumn({ default: false })
  emailVerified: boolean;

  /**
   * The hashed password of the user.
   */
  @NullColumn()
  password: string;

  /**
   * Token used for user login sessions.
   */
  @NullColumn()
  loginToken: string;

  /**
   * Token used for resetting the user's password.
   */
  @NullColumn()
  resetToken: string;

  /**
   * Expiry time for the password reset token.
   */
  @NullColumn()
  resetTokenExpiresTime: string;

  /**
   * The country of residence of the user.
   */
  @NullColumn()
  country: string;

  /**
   * The user's role (e.g., 'admin', 'user', 'moderator').
   */
  @NullColumn({ default: "user" })
  role: string;

  /**
   * The unique phone number of the user.
   */
  @NullColumn({ unique: true })
  phoneNumber: string;

  /**
   * The user's home or office address.
   */
  @NullColumn()
  address: string;

  /**
   * The URL to the user's profile picture.
   */
  @NullColumn()
  profilePicture: string;

  /**
   * The user's date of birth.
   */
  @NullColumn()
  dateOfBirth: Date;

  /**
   * Indicates whether the user has enabled email notifications.
   */
  @NullColumn()
  isEmailNotificationsEnabled: boolean;

  /**
   * Indicates whether the user has enabled two-factor authentication.
   */
  @NullColumn()
  isTwoFactorEnabled: boolean;

  /**
   * The date and time when the user account was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the user account was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Timestamp for soft deletion of the user account.
   */
  @DeleteDateColumn() // Soft delete timestamp
  deletedAt: Date;

  /**
   * Indicates whether the user's account is active.
   */
  @NullColumn({ default: true })
  isActive: boolean;

  /**
   * The timestamp of the last login by the user.
   */
  @NullColumn()
  lastLoginAt: Date;

  /**
   * The number of failed login attempts made by the user.
   */
  @NullColumn()
  failedLoginAttempts: number;

  /**
   * The timestamp indicating when the user's account will be unlocked after too many failed login attempts.
   */
  @NullColumn()
  lockoutExpiresAt: Date;

  /**
   * The user's preferred language for the platform.
   */
  @NullColumn()
  languagePreference: string;

  /**
   * The timezone of the user, useful for scheduling events or activities.
   */
  @NullColumn()
  timezone: string;

  /**
   * The current subscription status of the user (e.g., 'free', 'premium').
   */
  @NullColumn()
  subscriptionStatus: string;

  /**
   * The specific subscription plan the user is on (e.g., 'basic', 'enterprise').
   */
  @NullColumn()
  subscriptionPlan: string;

  /**
   * A list of the user's social media profiles or links.
   */
  @NullColumn()
  socialMediaLinks: string;

  /**
   * A short description or "about" section where the user can introduce themselves or share relevant details.
   * This can be used to describe the user's interests, profession, or any personal information.
   */
  @NullColumn()
  aboutYourself: string;

  /**
   * The user's personal or business website URL.
   */
  @NullColumn()
  websiteUrl: string;

  /**
   * The secret used for generating one-time passwords (OTP) for two-factor authentication.
   */
  @NullColumn()
  otpSecret: string;

  /**
   * The timestamp of the last password change by the user.
   */
  @NullColumn()
  lastPasswordChangeAt: Date;

  /**
   * The name of the external authentication provider, if the user authenticated via an external service (e.g., 'google', 'facebook').
   */
  @NullColumn()
  externalAuthProvider: string;

  /**
   * The unique identifier from the external authentication provider.
   */
  @NullColumn()
  externalAuthId: string;

  // Additional fields for engagement and audit
  /**
   * Whether the user has opted in to receive marketing emails.
   */
  @NullColumn()
  emailOptIn: boolean;

  /**
   * Whether the user has opted in to receive SMS notifications or phone-based alerts.
   */
  @NullColumn()
  phoneOptIn: boolean;

  /**
   * Whether the user has enabled push notifications for mobile or web apps.
   */
  @NullColumn()
  pushNotificationsEnabled: boolean;

  /**
   * Flag for whether the user account is marked as deleted.
   */
  @NullColumn()
  isDeleted: boolean;

  /**
   * The referral code generated for the user, used in referral programs.
   */
  @NullColumn()
  referralCode: string;

  /**
   * The ID or username of the user who referred the current user.
   */
  @NullColumn()
  referredBy: string;

  /**
   * The timestamp of when the user accepted the terms and conditions.
   */
  @NullColumn()
  termsAcceptedAt: Date;

  /**
   * The timestamp of when the user accepted the privacy policy.
   */
  @NullColumn()
  privacyPolicyAcceptedAt: Date;

  /**
   * The type of user account (e.g., 'personal', 'business').
   */
  @NullColumn({ default: "personal" })
  accountType: string;

  /**
   * The user's preferred method of communication (e.g., 'email', 'phone').
   */
  @NullColumn()
  preferredContactMethod: string;

  /**
   * The timestamp of the most recent activity by the user on the platform.
   */
  @NullColumn()
  lastActivityAt: Date;

  /**
   * The verification status of the user's account (e.g., 'verified', 'pending', 'rejected').
   */
  @NullColumn()
  accountVerificationStatus: string;

  /**
   * Recovery codes for two-factor authentication in case the user loses their authentication method.
   */
  @NullColumn()
  twoFactorRecoveryCodes: string;

  /**
   * Whether the user has installed the mobile app for push notifications and other interactions.
   */
  @NullColumn()
  mobileAppInstalled: boolean;

  /**
   * The method of login used by the user (e.g., 'email', 'google', 'facebook').
   */
  @NullColumn()
  loginMethod: string;

  /**
   * The timestamp of when the user last saw a notification from the platform.
   */
  @NullColumn()
  lastNotificationSeenAt: Date;

  /**
   * The timestamp indicating when the user's account will be unlocked after it was locked (e.g., due to security issues).
   */
  @NullColumn()
  accountLockedUntil: Date;

  /**
   * Whether the user has been verified (e.g., email verification, admin verification).
   */
  @NullColumn()
  isVerified: boolean;

  /**
   * Whether the user has given feedback or filled out a survey.
   */
  @NullColumn()
  feedbackGiven: boolean;

  /**
   * The total number of support tickets opened by the user.
   */
  @NullColumn()
  customerSupportTicketCount: number;

  /**
   * Whether the user has opted in for marketing or promotional messages.
   */
  @NullColumn()
  marketingOptIn: boolean;

  /**
   * Indicates whether the user is a VIP customer with special privileges or benefits.
   */
  @NullColumn()
  isVIP: boolean;
}
