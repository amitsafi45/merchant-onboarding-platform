import { RiskDecisionAction } from '@app/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, ValidateIf } from 'class-validator';

export class RiskDecisionDto {
  @ApiProperty({
    description: 'Unique identifier of the application',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  applicationId: string;

  @ApiProperty({
    description: 'Risk decision action',
    enum: RiskDecisionAction,
    example: RiskDecisionAction.APPROVED,
  })
  @IsEnum(RiskDecisionAction)
  action: RiskDecisionAction;

  @ApiPropertyOptional({
    description: 'Required when the action is REJECTED or REQUEST_INFORMATION.',
    example: 'Additional documentation is required.',
  })
  @ValidateIf(
    (dto: RiskDecisionDto) => dto.action !== RiskDecisionAction.APPROVED,
  )
  @IsString()
  reason: string;
}
