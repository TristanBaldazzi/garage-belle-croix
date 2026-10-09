import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    });
  }
  return transporter;
}

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/**
 * Envoie une notification au garage pour une nouvelle demande.
 * Ne fait rien si SMTP n'est pas configuré, et n'interrompt jamais la requête en cas d'échec.
 * @param {string} subject
 * @param {Array<[string, any]>} fields paires [libellé, valeur]
 * @param {string} [replyTo]
 */
export async function notifyGarage(subject, fields, replyTo) {
  const mailer = getTransporter();
  const to = process.env.NOTIFY_EMAIL;
  if (!mailer || !to) return;

  const rows = fields
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([label, value]) => `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 12px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join('');

  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      replyTo: replyTo || undefined,
      subject,
      html: `<h2 style="font-family:sans-serif">${escapeHtml(subject)}</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
      text: fields.filter(([, v]) => v).map(([l, v]) => `${l} : ${v}`).join('\n')
    });
  } catch (error) {
    console.error('Erreur envoi e-mail de notification:', error.message);
  }
}
