import { sendContactEmail } from "../services/email.service.js";

export async function sendContactMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: "Todos os campos são obrigatórios" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Email inválido" 
      });
    }

    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({ 
      success: true,
      message: "Mensagem enviada com sucesso! Responderemos em breve." 
    });
  } catch (err) {
    console.error("Erro ao enviar mensagem de contato:", err);
    res.status(500).json({ 
      error: "Erro ao enviar mensagem. Por favor, tenta novamente mais tarde." 
    });
  }
}
