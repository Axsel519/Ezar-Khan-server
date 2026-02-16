import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from '../schemas/coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const coupon = new this.couponModel({
      ...createCouponDto,
      code: createCouponDto.code.toUpperCase(),
    });
    return coupon.save();
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponModel.find().exec();
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const updateData = { ...updateCouponDto };
    if (updateCouponDto.code) {
      updateData.code = updateCouponDto.code.toUpperCase();
    }

    const coupon = await this.couponModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async remove(id: string): Promise<void> {
    const result = await this.couponModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Coupon not found');
    }
  }

  async validateCoupon(code: string): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() }).exec();

    if (!coupon) {
      return { valid: false, message: 'Coupon not found' };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'Coupon is not active' };
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return { valid: false, message: 'Coupon has expired' };
    }

    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }

    return { valid: true, coupon };
  }

  async applyCoupon(code: string): Promise<Coupon> {
    const validation = await this.validateCoupon(code);
    
    if (!validation.valid || !validation.coupon) {
      throw new BadRequestException(validation.message);
    }

    validation.coupon.usageCount += 1;
    return validation.coupon.save();
  }
}
