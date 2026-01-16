import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProductBookingDocument = ProductBooking & Document;

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

  @Prop()
  contactName: string;

  @Prop()
  contactPhone: string;

  @Prop()
  relationship: string;
}

@Schema({ _id: false })
export class AcademicInformation {
  @Prop()
  preferredCountry: string;

  @Prop()
  firstPreferredUniversity: string;

  @Prop()
  secondPreferredUniversity: string;

  @Prop()
  thirdPreferredUniversity: string;

  @Prop()
  firstCourseOfStudy: string;

  @Prop()
  secondCourseOfStudy: string;

  @Prop()
  thirdCourseOfStudy: string;

  @Prop()
  levelOfStudy: string;

  @Prop()
  intendedStartDate: Date;

  @Prop()
  englishTestScore: string;

  @Prop()
  previousEducation: string;
}

@Schema({ _id: false })
export class Preference {
  @Prop({ type: Date })
  travelDate: Date;

  @Prop()
  numberOfTravelers: number;

  @Prop()
  roomPreference: string;

  @Prop()
  specialRequests: string;
}

@Schema({ _id: false })
export class TravelInformation {
  @Prop()
  purpose: string;

  @Prop()
  duration: string;

  @Prop()
  arrivalDate: Date;

  @Prop()
  departureDate: Date;

  @Prop()
  accomodationAddress: string;
}

@Schema({ _id: false })
export class DocumentUpload {
  @Prop()
  passportPhoto: string;

  @Prop()
  passportData: string;
}

@Schema({ timestamps: true })
export class ProductBooking {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  nationality: string;

  @Prop({ required: false, type: Date })
  dateOfBirth: Date;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  maritalStatus: string;

  @Prop({ required: false })
  occupation: string;

  @Prop({ required: true })
  emergencyContact: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductPackage',
    required: true,
  })
  productPackage: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  })
  client: mongoose.Types.ObjectId;

  @Prop({ type: Passport })
  passport: Passport;

  @Prop({ type: TravelInformation })
  travelInformation: TravelInformation;

  @Prop({ type: Preference })
  travelPreference: Preference;

  @Prop({ type: AcademicInformation })
  academicInformation: AcademicInformation;

  @Prop({ type: DocumentUpload })
  documentUpload: DocumentUpload;
}

export const ProductBookingSchema =
  SchemaFactory.createForClass(ProductBooking);
