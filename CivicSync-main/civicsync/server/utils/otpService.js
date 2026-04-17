// Mock OTP Service — in production, integrate with SMS gateway like Twilio
const otpStore = new Map();

const generateOTP = (mobile) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(mobile, { otp, expiry: Date.now() + 5 * 60 * 1000 }); // 5 min expiry
  console.log(`[MOCK OTP] Mobile: ${mobile}, OTP: ${otp}`);
  return otp;
};

const verifyOTP = (mobile, otp) => {
  const stored = otpStore.get(mobile);
  if (!stored) return false;
  if (Date.now() > stored.expiry) {
    otpStore.delete(mobile);
    return false;
  }
  if (stored.otp === otp) {
    otpStore.delete(mobile);
    return true;
  }
  return false;
};

module.exports = { generateOTP, verifyOTP };
