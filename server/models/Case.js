import mongoose from "mongoose";

/* ---------------- Sub Schemas ---------------- */

// Notes for each case
const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Hearing / schedule entries
const scheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Hearing",
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Timeline activity entries
const timelineSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      default: "",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

/* ---------------- Main Case Schema ---------------- */

const caseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    caseId: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    viabilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    status: {
      type: String, // strong / ready / needs-more
      required: true,
      trim: true,
    },

    keyPoints: {
      type: [String],
      default: [],
    },

    nextAction: {
      type: String,
      default: "Review AI Analysis",
      trim: true,
    },

    advisor: {
      type: String,
      default: null,
      trim: true,
    },

    // UI Progress bar support
    progress: {
      type: Number,
      default: 25,
      min: 0,
      max: 100,
    },

    // Quick Notes
    notes: {
      type: [noteSchema],
      default: [],
    },

    // Hearings / Calendar data
    schedule: {
      type: [scheduleSchema],
      default: [],
    },

    // Auto activity feed
    timeline: {
      type: [timelineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Case = mongoose.model("Case", caseSchema);

export default Case;