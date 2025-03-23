import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

export default async function sendSimpleMessageTemplate(email: string, token: string) {
  const mailgun = new Mailgun(FormData);

  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "API_KEY",
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net/v3"
  });

  try {
    const data = await mg.messages.create("folded.me", {
      from: "Folded <mailing@folded.me>",
      to: [`Ruben <${email}>`],
      subject: "Recover your Folded password",
      template: "Recover password template",
      "h:X-Mailgun-Variables": JSON.stringify({
        test: "test",
        token,
      }),
    });
    console.log(data); // logs response data
  } catch (error) {
    console.log(error); // logs any error
  }
}