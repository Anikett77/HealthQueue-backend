// Generate a unique token for appointments
exports.generateToken = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `T${timestamp}${random}`.slice(0, 6); // Format: T123456
};

