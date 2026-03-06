import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  attachments?: Array<{
    filename: string
    content: string | Buffer
  }>
}

export async function sendEmail(options: EmailOptions) {
  try {
    const { to, subject, html, text, from = 'FreeGeny <noreply@freegeny.com>', attachments } = options

    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      attachments,
    })

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error)
      throw new Error(error.message)
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Erreur email service:', error)
    throw error
  }
}

// Templates d'emails
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Bienvenue sur FreeGeny!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Bienvenue ${name} !</h1>
        <p>Merci de rejoindre FreeGeny, la plateforme éducative qui transforme l'apprentissage.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/dashboard" 
           style="background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Accéder à mon dashboard
        </a>
      </div>
    `
  }),

  passwordReset: (token: string) => ({
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Réinitialisation du mot de passe</h1>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/auth/reset-password?token=${token}" 
           style="background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #64748b; font-size: 14px;">Ce lien expire dans 1 heure.</p>
      </div>
    `
  }),

  notification: (title: string, message: string, actionUrl?: string) => ({
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">${title}</h1>
        <p>${message}</p>
        ${actionUrl ? `
          <a href="${actionUrl}" 
             style="background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Voir les détails
          </a>
        ` : ''}
      </div>
    `
  })
}
