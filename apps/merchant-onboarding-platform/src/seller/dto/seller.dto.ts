import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUrl,
  Matches,
  IsIn,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ApplicationStatus, TransactionType } from '@app/common';
import { ALPHABET_WITH_SPACES_REGEX } from '@app/common/regex';
import { ValidationMessages } from '@app/common/message';

export class CreateMerchantApplicationDto {
  @ApiProperty({
    description: 'Public business name',
    example: 'Himalayan Coffee',
    maxLength: 255,
  })
  @Matches(ALPHABET_WITH_SPACES_REGEX, {
    message: `Business name should contain ${ValidationMessages.ALPHABET_WITH_SPACES}`,
  })
  @IsNotEmpty()
  @MaxLength(255)
  businessName: string;

  @ApiProperty({
    description: 'Official registered business name',
    example: 'Himalayan Coffee Private Limited',
    maxLength: 255,
  })
  @Matches(ALPHABET_WITH_SPACES_REGEX, {
    message: `Legal business name should contain ${ValidationMessages.ALPHABET_WITH_SPACES}`,
  })
  @IsNotEmpty()
  @MaxLength(255)
  legalBusinessName: string;

  @ApiProperty({
    description: 'Type or category of business',
    example: 'RETAIL',
    maxLength: 100,
  })
  @Matches(ALPHABET_WITH_SPACES_REGEX, {
    message: `Business type should contain ${ValidationMessages.ALPHABET_WITH_SPACES}`,
  })
  @IsNotEmpty()
  @MaxLength(100)
  businessType: string;

  @ApiProperty({
    description: 'Full name of the business owner',
    example: 'Ram Sharma',
    maxLength: 255,
  })
  @Matches(ALPHABET_WITH_SPACES_REGEX, {
    message: `Owner name should contain ${ValidationMessages.ALPHABET_WITH_SPACES}`,
  })
  @IsNotEmpty()
  @MaxLength(255)
  ownerName: string;

  @ApiProperty({
    description: 'Business owner email address',
    example: 'ram@example.com',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  ownerEmail: string;

  @ApiProperty({
    description: 'Business owner contact number',
    example: '+9779812345678',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  ownerPhone: string;

  @ApiProperty({
    description: 'Requested processing volume',
    example: '250000.00',
    type: String,
  })
  @IsNumberString()
  requestedProcessingVolume: string;

  @ApiProperty({
    description: 'Requested transaction type',
    enum: TransactionType,
    enumName: 'TransactionType',
    example: TransactionType.BANK_TRANSFER,
  })
  @IsEnum(TransactionType)
  requestedTransactionType: TransactionType;

  @ApiProperty({
    description: 'Business registration number',
    example: 'REG-123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  businessRegistrationNumber?: string;

  @ApiProperty({
    description: 'Business website URL',
    example: 'https://himalayancoffee.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  businessWebsite?: string;

  @ApiProperty({
    description: 'Registered business address',
    example: 'Thamel, Kathmandu, Nepal',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  businessAddress?: string;

  @ApiProperty({
    description: 'Tax identification number',
    example: 'PAN-123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  taxIdentificationNumber?: string;

  @ApiProperty({
    description: 'Merchant application status',
    enum: [ApplicationStatus.DRAFT, ApplicationStatus.SUBMITTED],
    enumName: 'ApplicationStatus',
    example: ApplicationStatus.DRAFT,
    default: ApplicationStatus.DRAFT,
  })
  @IsIn([ApplicationStatus.DRAFT, ApplicationStatus.SUBMITTED])
  status: ApplicationStatus;
}

export class UpdateMerchantApplicationDto extends PartialType(
  CreateMerchantApplicationDto,
) {}
