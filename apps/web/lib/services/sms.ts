// Service SMS avec Twilio pour l'Afrique
import twilio from 'twilio'

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

interface SMSOptions {
  to: string
  message: string
  from?: string
}

export async function sendSMS(options: SMSOptions) {
  try {
    if (!twilioClient) {
      console.warn('Twilio non configuré, SMS simulé:', options)
      return { success: true, simulated: true }
    }

    const { to, message, from = process.env.TWILIO_PHONE_NUMBER } = options

    // Normaliser le numéro (format international)
    const normalizedNumber = normalizePhoneNumber(to)

    const result = await twilioClient.messages.create({
      body: message,
      from,
      to: normalizedNumber,
    })

    return { success: true, sid: result.sid }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS:', error)
    throw error
  }
}

// Normaliser les numéros de téléphone africains
function normalizePhoneNumber(phone: string): string {
  // Supprimer espaces et caractères spéciaux
  let cleaned = phone.replace(/[\s\-\.\(\)]/g, '')
  
  // Si commence par 0, ajouter l'indicatif du pays
  if (cleaned.startsWith('0')) {
    // Par défaut Sénégal (+221), peut être configuré
    cleaned = '+221' + cleaned.substring(1)
  }
  
  // Si ne commence pas par +, l'ajouter
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }
  
  return cleaned
}

// Templates SMS
export const smsTemplates = {
  verificationCode: (code: string) => 
    `Votre code de vérification FreeGeny est: ${code}. Ne le partagez avec personne.`,

  passwordReset: (token: string) => 
    `Réinitialisation mot de passe FreeGeny. Cliquez: ${process.env.NEXTAUTH_URL}/auth/reset?token=${token.substring(0, 20)}...`,

  appointmentReminder: (date: string, time: string, title: string) => 
    `Rappel FreeGeny: ${title} le ${date} à ${time}.`,

  progressAlert: (studentName: string, subject: string, score: number) => 
    `${studentName} a obtenu ${score}/20 en ${subject} sur FreeGeny. Consultez les détails dans l'app.`,
}

// Envoi de SMS en masse pour les notifications
export async function sendBulkSMS(numbers: string[], message: string) {
  const results = await Promise.allSettled(
    numbers.map(number => sendSMS({ to: number, message }))
  )
  
  const succeeded = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length
  
  return { succeeded, failed, total: numbers.length }
}
