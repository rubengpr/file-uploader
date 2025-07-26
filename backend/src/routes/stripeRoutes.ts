import { Router } from 'express';
import Stripe from 'stripe'
import authenticateToken from '../middleware/authMiddleware.js';

const router = Router()
const stripeSecret = process.env.STRIPE_SK_TEST;
if (!stripeSecret) {
  throw new Error('Missing STRIPE_SK_TEST environment variable');
}
const stripe = new Stripe(stripeSecret);

router.use(authenticateToken);

const planToPriceId = {
  standard: 'price_1Ro5NBPOFQZ2ihniAhwoEzs0',
  max: 'price_1Ro5NjPOFQZ2ihnihoWbHbs5'
}

router.post('/create-checkout-session', async(req: any, res: any) => {
    const { plan, userId } = req.body

    const priceId = planToPriceId[plan]

    if (!plan) {
      return res.status(400).json({ error: 'Missing plan required field' })
    }

    if (!planToPriceId.hasOwnProperty(plan)) {
      return res.status(400).json({ error: 'Invalid plan value' })
    }

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId required field' })
    }
  
    try {
        const session = await stripe.checkout.sessions.create({
            success_url: 'https://folded.me/settings',
            cancel_url: 'https://folded.me/settings',
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            mode: 'subscription',
            metadata: {
              userId,
              plan
            }
        })

        res.json({ url: session.url })
    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
})

export default router