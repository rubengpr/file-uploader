import { Router } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma.js'

const router = Router();
const stripeSecret = process.env.STRIPE_SK_TEST;
if (!stripeSecret) {
  throw { message: 'Missing STRIPE_SK_TEST environment variable', statusCode: 500 }
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

async function fulfillCheckout(session: any) {
  const userId = session.metadata.userId;
  const planType = session.metadata.planType;
  const stripeSubscriptionId = session.subscription;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.plan.create({
        data: {
          userId,
          planType,
          status: 'active',
          stripeSubscriptionId 
        }
      });
      
      await tx.user.update({
        where: { id: userId },
        data: { currentPlan: planType }
      });
    });
  } catch (err) {
    console.error('Error in transaction - plan creation or user update failed:', err);
  }
}

export default router; 