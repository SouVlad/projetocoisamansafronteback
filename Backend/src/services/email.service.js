import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

let transporter = null;

export async function initializeEmailTransport() {
  if (transporter) return transporter;

  const hasOAuth = process.env.GOOGLE_CLIENT_ID && 
                   process.env.GOOGLE_CLIENT_SECRET && 
                   process.env.GOOGLE_REFRESH_TOKEN;

  if (hasOAuth) {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || "https://developers.google.com/oauthplayground"
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  return transporter;
}

export async function sendEmailReminder(user, concert) {
  const transport = await initializeEmailTransport();
  
  const formattedDate = new Date(concert.date || concert.startsAt).toLocaleString("pt-PT", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const subject = `Lembrete: Concerto ${concert.title} em 3 dias`;

  const textBody = `Olá ${user.username},

Lembrete: o concerto "${concert.title}" será em ${formattedDate} no ${concert.location}.

Até lá,
Coisa Mansa`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo img { max-width: 200px; height: auto; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 8px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="logo">
      <img src="cid:logo" alt="Coisa Mansa">
    </div>
    <div class="content">
      <p>Olá <strong>${user.username}</strong>,</p>
      <p>Lembrete: o concerto "<strong>${concert.title}</strong>" será em <strong>${formattedDate}</strong> no <strong>${concert.location}</strong>.</p>
      <p>Até lá!</p>
    </div>
    <div class="footer">
      <p>Coisa Mansa - Associação Cultural</p>
    </div>
  </div>
</body>
</html>`;

  const mailOptions = {
    from: `"Coisa Mansa" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject,
    text: textBody,
    html: htmlBody,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../../uploads/logo.png'),
        cid: 'logo' // mesmo cid usado no src="cid:logo" no HTML
      }
    ]
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`Email enviado para ${user.email} | messageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`Erro ao enviar email para ${user.email}:`, err?.message || err);
    throw err;
  }
}

export async function verifyEmailTransport() {
  const transport = await initializeEmailTransport();
  try {
    await transport.verify();
    console.log("Transportador SMTP verificado com sucesso.");
    return true;
  } catch (err) {
    console.error("Falha ao verificar transportador SMTP:", err);
    return false;
  }
}

/**
 * Envia lembrete de evento específico para um utilizador
 */
export async function sendEventReminder(user, event) {
  const transport = await initializeEmailTransport();
  
  const eventDate = new Date(event.startsAt);
  const formattedDate = eventDate.toLocaleString("pt-PT", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString("pt-PT", {
    hour: '2-digit',
    minute: '2-digit'
  });

  const subject = `Lembrete: ${event.title}`;

  // Criar URL do Google Calendar
  const startTime = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = event.endsAt ? new Date(event.endsAt) : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
  const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}&sf=true&output=xml`;

  const textBody = `Olá ${user.username},

A Coisa Mansa criou um novo evento!

🎸 ${event.title}
📍 Local: ${event.location || 'A confirmar'}
🕐 Data: ${formattedDate} às ${formattedTime}

${event.description ? event.description + '\n\n' : ''}Espero que estejam presentes!

Não percas esta oportunidade!

Até lá,
Coisa Mansa`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 0;
    }
    .logo {
      text-align: center;
      padding: 30px 20px 20px;
      background-color: #ffffff;
    }
    .logo img {
      max-width: 200px;
      height: auto;
    }
    .content {
      padding: 20px 30px;
      background-color: #ffffff;
    }
    .greeting {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .intro {
      margin-bottom: 20px;
    }
    .event-box {
      background-color: #f9f9f9;
      border-left: 4px solid #FF6B35;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .event-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 15px;
    }
    .event-detail {
      margin: 10px 0;
      font-size: 14px;
      color: #555;
    }
    .event-icon {
      display: inline-block;
      width: 20px;
      margin-right: 8px;
    }
    .description {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    .calendar-button {
      text-align: center;
      margin: 25px 0;
    }
    .calendar-button a {
      display: inline-block;
      background-color: #4285F4;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 14px;
    }
    .calendar-button a:hover {
      background-color: #3367D6;
    }
    .closing {
      margin: 20px 0;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 12px;
      font-style: italic;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="logo">
      <img src="cid:logo" alt="Coisa Mansa">
    </div>
    <div class="content">
      <div class="greeting">Olá ${user.username},</div>
      <div class="intro">A <strong>Coisa Mansa</strong> criou um novo evento!</div>
      
      <div class="event-box">
        <div class="event-title">🎸 ${event.title}</div>
        <div class="event-detail">
          <span class="event-icon">📍</span>
          <strong>Local:</strong> ${event.location || 'A confirmar'}
        </div>
        <div class="event-detail">
          <span class="event-icon">🕐</span>
          <strong>Data:</strong> ${formattedDate} às ${formattedTime}
        </div>
        ${event.description ? `<div class="description">${event.description}</div>` : ''}
        <div style="margin-top: 15px; font-size: 14px; color: #666;">
          Espero que estejam presentes!
        </div>
      </div>

      <div class="calendar-button">
        <a href="${googleCalendarUrl}" target="_blank">📅 Adicionar ao Google Calendar</a>
      </div>

      <div class="closing">
        Não percas esta oportunidade!
      </div>

      <div class="closing" style="margin-top: 30px;">
        Até lá,<br>
        <em>Coisa Mansa</em>
      </div>
    </div>
    <div class="footer">
      Coisa Mansa - Associação Cultural
    </div>
  </div>
</body>
</html>`;

  const mailOptions = {
    from: `"Coisa Mansa" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject,
    text: textBody,
    html: htmlBody,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../../uploads/logo.png'),
        cid: 'logo'
      }
    ]
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`Lembrete de evento enviado para ${user.email} | messageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`Erro ao enviar lembrete para ${user.email}:`, err?.message || err);
    throw err;
  }
}
