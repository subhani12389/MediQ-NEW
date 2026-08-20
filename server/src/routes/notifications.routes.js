import { Router } from 'express';

const router = Router();

// Simulated Edge Function / Notification Webhook Endpoint
router.post('/send-alert', (req, res) => {
  const { phone, email, token_number, estimated_wait_minutes, message_type } = req.body;

  console.log(`\n🔔 [MediQ Notification Engine - Edge Function Hook]`);
  console.log(`   Type: ${message_type || 'SMS_SMART_LEAVE_ALERT'}`);
  console.log(`   To Phone: ${phone || '+91 9876543210'}`);
  console.log(`   To Email: ${email || 'patient@mediq.com'}`);
  console.log(`   Message: "MediQ Alert for Token #${token_number || 'A-103'}: Your turn is ~${estimated_wait_minutes || 10} minutes away! Please start heading to the hospital OPD now."\n`);

  return res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    delivery: 'simulated_sms_and_email',
    details: {
      recipient: phone || email,
      token_number,
      estimated_wait_minutes
    }
  });
});

export default router;
