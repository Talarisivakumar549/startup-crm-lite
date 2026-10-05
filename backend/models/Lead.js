import mongoose from 'mongoose';

/**
 * Lead Schema defining the Lead model in MongoDB.
 * Stores lead contact details, company, source, status, and notes, linked to a User owner.
 */
const leadSchema = new mongoose.Schema(
  {
    /**
     * The full name of the lead contact person.
     * Constraints: Required, trimmed, minimum length of 2, maximum length of 100.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minLength: [2, 'Lead name must be at least 2 characters long'],
      maxLength: [100, 'Lead name cannot exceed 100 characters']
    },
    /**
     * The company or organization name the lead represents.
     * Constraints: Required, trimmed.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    /**
     * The email address of the lead.
     * Constraints: Required, trimmed, validated for correct email format.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      validate: {
        validator: function (v) {
          // Standard regex for email validation
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Email must be a valid email address'
      }
    },
    /**
     * The phone number of the lead.
     * Constraints: Optional, trimmed.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true
    },
    /**
     * The current status of the lead.
     * Constraints: Enum exactly matching frontend values.
     * Defaults to 'New'.
     * @type {String}
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid lead status'
      },
      default: 'New'
    },
    /**
     * The acquisition source of the lead.
     * Constraints: Enum exactly matching frontend values.
     * Defaults to 'Website'.
     * @type {String}
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: '{VALUE} is not a valid lead source'
      },
      default: 'Website'
    },
    /**
     * Additional notes, follow-up logs, or details about the lead.
     * Constraints: Optional, maximum length of 1000 characters.
     * @type {String}
     */
    notes: {
      type: String,
      maxLength: [1000, 'Notes cannot exceed 1000 characters']
    },
    /**
     * The financial value of the deal.
     * Constraints: Optional, must be non-negative.
     * @type {Number}
     */
    value: {
      type: Number,
      default: 0,
      min: [0, 'Deal value cannot be negative']
    },
    /**
     * Reference to the User (owner/creator) of the lead.
     * Constraints: Required, links to 'User' collection.
     * @type {mongoose.Schema.Types.ObjectId}
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner (User) is required']
    }
  },
  {
    timestamps: true,
    // Ensure virtuals are included in JSON/Object conversions
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual field to compute the age of the lead in days since creation.
 * Useful for analytics and measuring lead pipeline velocity.
 * @returns {Number} Number of days since creation.
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) {
    return 0;
  }
  const differenceInMs = Date.now() - this.createdAt.getTime();
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
  return Math.floor(differenceInDays);
});

// Compound index on owner and status for fast filtered dashboard/pipeline queries
leadSchema.index({ owner: 1, status: 1 });

// Index on email for fast lookups
leadSchema.index({ email: 1 });

// Compound index on owner and source for fast stats/filtering
leadSchema.index({ owner: 1, source: 1 });

// Compound index on owner and createdAt for fast sorting and date-range queries
leadSchema.index({ owner: 1, createdAt: -1 });

// Indexes on name and company for fast autocomplete / regex searching under owner isolation
leadSchema.index({ owner: 1, name: 1 });
leadSchema.index({ owner: 1, company: 1 });

// Create the Lead model
const Lead = mongoose.model('Lead', leadSchema);

// Export both the model and the schema separately
export { leadSchema, Lead };
export default Lead;
