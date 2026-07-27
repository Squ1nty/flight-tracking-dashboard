// models/SavedFlight.ts

import mongoose, { Schema, Document } from 'mongoose'

export interface ISavedFlight extends Document {
  userId: mongoose.Types.ObjectId
  callsign: string
  airlineName: string
  originCountry: string
  departureIata?: string
  arrivalIata?: string
  savedAt: Date
  nickname?: string
}

const SavedFlightSchema = new Schema<ISavedFlight>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  callsign: {
    type: String,
    required: true,
    trim: true,
  },
  airlineName: {
    type: String,
    default: 'Unknown Airline',
  },
  originCountry: {
    type: String,
    default: 'Unknown',
  },
  departureIata: {
    type: String,
    trim: true,
  },
  arrivalIata: {
    type: String,
    trim: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
  nickname: {
    type: String,
    trim: true,
  },
})

SavedFlightSchema.index({ userId: 1, callsign: 1 }, { unique: true })

export default mongoose.models.SavedFlight ||
  mongoose.model<ISavedFlight>('SavedFlight', SavedFlightSchema)