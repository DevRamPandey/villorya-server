const User = require('../models/user');

// Validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s]{2,80}$/;
const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit
const zipRegex = /^[A-Za-z0-9\- ]{3,12}$/;

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-otp -otpExpiresAt -__v -password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// Update profile (name, email, profilePic). phone is non-editable.
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    const { fullName, email } = req.body;

    if (fullName) {
      if (!nameRegex.test(fullName)) return res.status(400).json({ success: false, message: 'Invalid full name' });
      updates.fullName = fullName;
    }

    if (email) {
      if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: 'Invalid email' });
      // ensure email uniqueness
      const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
      updates.email = email;
    }

    if (req.file) {
      // multer places uploaded file info in req.file
      updates.profilePic = req.file.path; // relative path stored
    }

    const updated = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select('-password -otp -otpExpiresAt -__v');
    res.json({ success: true, user: updated });
  } catch (err) {
    next(err);
  }
};

// Addresses: list
exports.listAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (err) {
    next(err);
  }
};

// Add address
// Body: { label, country, street, city, state, zip }
exports.addAddress = async (req, res, next) => {
  try {
    const { label, country, street, city, state, zip } = req.body;
    if (!street || !city || !country) {
      return res.status(400).json({ success: false, message: 'country, street and city are required' });
    }
    if (zip && !zipRegex.test(zip)) return res.status(400).json({ success: false, message: 'Invalid ZIP/Postal code' });

    const address = { label, country, street, city, state, zip };
    const user = await User.findById(req.user._id);
    user.addresses.push(address);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

// Update address
// PUT /api/user/address/:addressId
// Body: { label, country, street, city, state, zip }
exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    if (!addressId) return res.status(400).json({ success: false, message: 'addressId required' });

    const updates = req.body;
    if (updates.zip && !zipRegex.test(updates.zip)) return res.status(400).json({ success: false, message: 'Invalid ZIP' });

    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });

    // Update allowed fields
    ['label', 'country', 'street', 'city', 'state', 'zip'].forEach(field => {
      if (updates[field] !== undefined) addr[field] = updates[field];
    });

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

// Delete address
exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
    addr.remove();
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};
