import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema defining the user model in MongoDB.
 * Stores authentication details, profile info, role, and status.
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * The full name of the user.
     * Must be between 2 and 50 characters, trimmed.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
      maxLength: [50, 'Name cannot exceed 50 characters']
    },
    /**
     * The unique email address of the user.
     * Automatically lowercased, trimmed, and validated for email format.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
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
     * The hashed password of the user.
     * Must be at least 6 characters. Never stored as plain text.
     * @type {String}
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters long']
    },
    /**
     * The role of the user (admin or user).
     * Defaults to 'user'.
     * @type {String}
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role'
      },
      default: 'user'
    },
    /**
     * The phone number of the user.
     * @type {String}
     */
    phoneNumber: {
      type: String,
      trim: true,
      default: ''
    },
    /**
     * The profile picture URL or path of the user.
     * @type {String}
     */
    profilePicture: {
      type: String,
      trim: true,
      default: ''
    },
    /**
     * Flag indicating if the user account is active.
     * Defaults to true.
     * @type {Boolean}
     */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Pre-save middleware to hash the password before saving to the database.
 * Only hashes the password if it has been modified or is new.
 */
userSchema.pre('save', async function () {
  // If the password field hasn't been modified, skip hashing
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt with 10 rounds
  const salt = await bcrypt.genSalt(10);
  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare a plain text candidate password with the hashed password.
 * @param {string} candidatePassword - The plain text password to compare.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Override the default toJSON method to remove the password field from the JSON output.
 * Ensures sensitive data is not leaked when returning user objects in API responses.
 * @returns {Object} Plain JavaScript object representation of the user, without password.
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Create the User model
const User = mongoose.model('User', userSchema);

// Export both the model and the schema separately
export { userSchema, User };
export default User;
