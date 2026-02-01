import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { Product } from '../schemas/product.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    private productsService: ProductsService,
  ) {}

  async create(
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    if (!Types.ObjectId.isValid(createCommentDto.productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel
      .findById(createCommentDto.productId)
      .exec();

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createCommentDto.productId} not found`,
      );
    }

    const comment = new this.commentModel({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(createCommentDto.productId),
      content: createCommentDto.content,
      rating: createCommentDto.rating,
    });

    const savedComment = await comment.save();
    await this.productsService.updateRating(createCommentDto.productId);

    return savedComment;
  }

  async findByProduct(productId: string): Promise<Comment[]> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    return await this.commentModel
      .find({ productId: new Types.ObjectId(productId) })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.commentModel.findById(id).exec();

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    const updatedComment = await comment.save();
    await this.productsService.updateRating(comment.productId.toString());

    return updatedComment;
  }

  async remove(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.commentModel.findById(id).exec();

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const productId = comment.productId.toString();
    await this.commentModel.findByIdAndDelete(id).exec();
    await this.productsService.updateRating(productId);
  }
}
