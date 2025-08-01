import { Router } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const stripeSecret = process.env.STRIPE_SK_TEST;
if (!stripeSecret) {
  throw new Error('Missing STRIPE_SK_TEST environment variable');
}
const stripe = new Stripe(stripeSecret);

router.post('/stripe', async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await fulfillCheckout(session);
      break;
    }
  }

  res.json({ received: true });
});

async function fulfillCheckout(session) {
  const userId = session.metadata.userId
  const planType = session.metadata.planType
  const stripeSubscriptionId = session.subscription

  try {
    const plan = await prisma.plan.create({
      data: {
        userId,
        planType,
        status: 'active',
        stripeSubscriptionId 
      }
    })
  } catch (err) {
    console.error('Error creating plan:', err);
  }
}

export default router; 