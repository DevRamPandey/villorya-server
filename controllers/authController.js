const User = require('../models/user');
const generateToken = require('../utils/genrateToken');

const OTP_DEFAULT = '123456';
const OTP_TTL_MINUTES = 10; 

const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit starting 6-9
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // create a user with email and password
        const user = await User.findOne({ email });

        console.log(user);
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({
            success:true,
            message:"Successfully logged in.",
            token: generateToken(user._id),
            user: { id: user._id, email: user.email }
        });
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        const admin = await User.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        admin.password = newPassword;
        await admin.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid Indian phone number' });
    }

    // Find or create user by phone
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
    }

    // Set default OTP and expiry
    user.otp = OTP_DEFAULT;
    user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    await user.save();

    // Here you'd normally send SMS. For now, we return a message that OTP was "sent".
    return res.json({
      success: true,
      message: `OTP sent to ${phone}.`,
      expiresAt: user.otpExpiresAt,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/verify-otp
// Body: { phone: "...", otp: "123456" }
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone' });
    }
    if (!otp || typeof otp !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: 'User not found. Request OTP first.' });

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'No OTP requested. Call get-otp first.' });
    }
    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'OTP expired. Request a new OTP.' });
    }
    if (otp !== user.otp) {
      return res.status(400).json({ success: false, message: 'Wrong OTP' });
    }

    // OTP is valid - clear otp fields and create JWT
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    // ensure user has role and possibly email/password left blank (they can later set)
    if (!user.role) user.role = 'user';
    await user.save();

    const token = generateToken(user._id);
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    next(err);
  }
};
