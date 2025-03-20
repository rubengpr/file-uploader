import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

export default async function sendSimpleMessage() {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "API_KEY",
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net/v3"
  });
  try {
    const data = await mg.messages.create("sandboxb5d2be74224a41dea971019701b3b088.mailgun.org", {
      from: "Mailgun Sandbox <postmaster@sandboxb5d2be74224a41dea971019701b3b088.mailgun.org>",
      to: ["Ruben <rubengpr@gmail.com>"],
      subject: "Hello Ruben",
      text: "Congratulations Ruben, you just sent an email with Mailgun! You are truly awesome!",
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}