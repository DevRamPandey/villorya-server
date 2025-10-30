const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
  label: { type: String, trim: true },
  country: { type: String, trim: true },
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zip: { type: String, trim: true },
}, { _id: true });

// Validation regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit
const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;

const userSchema = new mongoose.Schema({
  // Email — required only for admin
  email: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return emailRegex.test(v);
      },
      message: 'Invalid email format',
    },
  },

  // Password — required only for admin
  password: {
    type: String,
    validate: {
      validator: function (v) {
        if (this.role === 'admin' && !v) return false;
        return true;
      },
      message: 'Password is required for admin accounts',
    },
  },

  fullName: { type: String, trim: true },

  // Phone — required only for users
  phone: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        if (this.role === 'user' && !v) return false;
        if (!v) return true;
        return phoneRegex.test(v);
      },
      message: 'Invalid Indian phone number format',
    },
  },

  // Role: user / admin
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // ✅ Root admin flag
  isRootAdmin: { type: Boolean, default: false },

  // ✅ Permissions for admins (only applicable when role = admin)
  permissions: {
    type: [String],
    default: [],
  },

  // ✅ Track who created this admin/user 
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Profile picture
  profilePic: {
    type: String,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return urlRegex.test(v);
      },
      message: 'Invalid profile picture URL',
    },
  },

  addresses: [addressSchema],

  isBlocked: { type: Boolean, default: false },

  // OTP fields
  otp: { type: String },
  otpExpiresAt: { type: Date },
}, { timestamps: true });

// 🔒 Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();

  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🚫 Prevent root admin from being deleted or blocked
userSchema.pre('remove', function (next) {
  if (this.isRootAdmin) {
    const err = new Error('Root admin cannot be deleted');
    err.statusCode = 403;
    return next(err);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
