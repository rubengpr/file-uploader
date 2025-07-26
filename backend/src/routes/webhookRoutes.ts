import { Router } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SK_TEST);

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
  const plan = session.metadata.plan
  const stripeSubscriptionId = session.stripeSubscriptionId

  try {
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        plan,
        status: 'active',
        stripeSubscriptionId 
      }
    })
  } catch (err) {
    console.log('something wnet wrong', err)
  }
}

export default router; 