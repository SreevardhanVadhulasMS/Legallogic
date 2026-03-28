import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    caseId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    viabilityScore: {
      type: Number,
      required: true,
    },
    status: {
      type: String, // e.g., 'strong', 'ready', 'needs-more'
      required: true,
    },
    keyPoints: {
      type: [String],
      default: [],
    },
    nextAction: {
      type: String,
      default: 'Review AI Analysis',
    },
    advisor: {
      type: String,
      default: null, // assigned later in the flow
    }
  },
  { timestamps: true }
);

const Case = mongoose.model('Case', caseSchema);

export default Case;
