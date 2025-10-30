const User = require('../models/user');

// GET /api/admin/users
exports.listUsers = async (req, res, next) => {
  try {
    // Return required fields: Name, Email, Phone, Status (blocked/unblocked), Joined
    const users = await User.find()
      .select('fullName email phone isBlocked createdAt role')
      .sort({ createdAt: -1 });
    const data = users.map(u => ({
      id: u._id,
      name: u.fullName || '',
      email: u.email || '',
      phone: u.phone || '',
      status: u.isBlocked ? 'Blocked' : 'Active',
      role: u.role,
      joined: u.createdAt,
    }));
    res.json({ success: true, users: data });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/block/:userId
exports.blockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
    if (req.user._id.toString() === userId) return res.status(400).json({ success: false, message: 'Cannot block yourself' });

    const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User blocked', user: { id: user._id, isBlocked: user.isBlocked } });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/unblock/:userId
exports.unblockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

    const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User unblocked', user: { id: user._id, isBlocked: user.isBlocked } });
  } catch (err) {
    next(err);
  }
};
