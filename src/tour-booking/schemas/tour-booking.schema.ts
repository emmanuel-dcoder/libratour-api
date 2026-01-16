import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TourBookingDocument = TourBooking & Document;

@Schema({ _id: false })
export class Passport {
  @Prop()
  number: string;

  @Prop()
  placeOfIssue: string;

  @Prop({ type: Date })
  passportIssueDate: Date;

  @Prop({ type: Date })
  passportExpiryDate: Date;
}

@Schema({ _id: false })
export class TravelPreference {
  @Prop({ type: Date })
  travelDate: Date;

  @Prop()
  numberOfTravelers: number;

  @Prop()
  roomPreference: string;

  @Prop()
  specialRequests: string;
}

@Schema({ timestamps: true })
export class TourBooking {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  nationality: string;

  @Prop({ required: false, type: Date })
  dateOfBirth: Date;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  emergencyContact: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourPackage',
    required: true,
  })
  tourPackage: mongoose.Types.ObjectId;

  @Prop({ type: Passport })
  passport: Passport;

  @Prop({ type: TravelPreference })
  travelPreference: TravelPreference;
}

export const TourBookingSchema = SchemaFactory.createForClass(TourBooking);
