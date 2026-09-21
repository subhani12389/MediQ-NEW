import { store } from '../data/store.js';

export const sendAlert = async (req, res) => {
  try {
    const { phone, email, token_number, estimated_wait_minutes, message_type } = req.body;

    console.log(`\n🔔 [MediQ Notification Engine - Web Push / SMS Hook]`);
    console.log(`   Type: ${message_type || 'SMS_SMART_LEAVE_ALERT'}`);
    console.log(`   Target: ${phone || email || 'Patient'}`);
    console.log(`   Message: "MediQ OPD Alert: Your turn for Token #${token_number} is ~${estimated_wait_minutes} mins away."\n`);

    return res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      delivery: 'simulated_webpush_and_sms',
      details: { recipient: phone || email, token_number, estimated_wait_minutes }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send notification' });
  }
};
