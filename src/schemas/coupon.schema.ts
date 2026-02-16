import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Coupon extends Document {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ required: true, min: 0, max: 100 })
  discountPercentage: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  expiresAt?: Date;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop({ type: Number })
  maxUsage?: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
