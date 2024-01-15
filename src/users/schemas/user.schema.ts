import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  fullName: string;
  @Prop({ required: true, })
  email: string;
  @Prop()
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);
