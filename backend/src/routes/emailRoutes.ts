import { Router } from 'express';
import sendSimpleMessage from '../utils/sendEmail.ts';

const router = Router();

router.post('/simple-email', async (req, res) => {
    try {
        await sendSimpleMessage();
        res.status(200).json({ message: "Email sent successfully. Check your inbox!" });
    } catch (err) {
        res.status(500).json({ message: "Failed to send the email" })
    }
});

export default router;