// Service de stockage cloud avec AWS S3 ou alternative
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

const s3Client = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'freegeny-storage'

interface UploadOptions {
  file: Buffer | Blob | File
  key?: string
  contentType?: string
  metadata?: Record<string, string>
  isPublic?: boolean
}

interface UploadResult {
  key: string
  url: string
  size: number
  contentType: string
}

export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  try {
    const { file, key, contentType, metadata, isPublic = false } = options
    
    // Générer une clé unique si non fournie
    const fileKey = key || `${uuidv4()}-${Date.now()}`
    
    let fileBuffer: Buffer
    let fileSize: number
    
    if (file instanceof File || file instanceof Blob) {
      const arrayBuffer = await file.arrayBuffer()
      fileBuffer = Buffer.from(arrayBuffer)
      fileSize = file.size
    } else {
      fileBuffer = file
      fileSize = file.length
    }

    // Détecter le type de contenu
    const detectedContentType = contentType || 
      (file instanceof File ? file.type : 'application/octet-stream')

    if (s3Client) {
      // Upload vers S3
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: detectedContentType,
        Metadata: metadata,
        ACL: isPublic ? 'public-read' : 'private',
      })

      await s3Client.send(command)

      const url = isPublic
        ? `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
        : await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
          }), { expiresIn: 3600 })

      return {
        key: fileKey,
        url,
        size: fileSize,
        contentType: detectedContentType,
      }
    } else {
      // Mode développement - stockage local simulé
      console.log('S3 non configuré, fichier simulé:', fileKey)
      return {
        key: fileKey,
        url: `/api/files/${fileKey}`,
        size: fileSize,
        contentType: detectedContentType,
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    throw error
  }
}

export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    if (!s3Client) {
      return `/api/files/${key}`
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return await getSignedUrl(s3Client, command, { expiresIn })
  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL signée:', error)
    throw error
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    if (!s3Client) {
      console.log('S3 non configuré, suppression simulée:', key)
      return
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    throw error
  }
}

// Upload spécifique par type
export async function uploadAvatar(file: File, userId: string): Promise<UploadResult> {
  const key = `avatars/${userId}/${uuidv4()}-${file.name}`
  return uploadFile({
    file,
    key,
    contentType: file.type,
    isPublic: true,
    metadata: { userId, type: 'avatar' },
  })
}

export async function uploadExerciseResource(file: File, exerciseId: string, teacherId: string): Promise<UploadResult> {
  const key = `exercises/${teacherId}/${exerciseId}/${uuidv4()}-${file.name}`
  return uploadFile({
    file,
    key,
    contentType: file.type,
    isPublic: false,
    metadata: { exerciseId, teacherId, type: 'exercise-resource' },
  })
}

export async function uploadStudentSubmission(file: File, exerciseId: string, studentId: string): Promise<UploadResult> {
  const key = `submissions/${exerciseId}/${studentId}/${uuidv4()}-${file.name}`
  return uploadFile({
    file,
    key,
    contentType: file.type,
    isPublic: false,
    metadata: { exerciseId, studentId, type: 'student-submission' },
  })
}

// Validation des fichiers
export const allowedFileTypes = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
}

export const maxFileSizes = {
  avatar: 5 * 1024 * 1024, // 5MB
  exercise: 50 * 1024 * 1024, // 50MB
  submission: 100 * 1024 * 1024, // 100MB
}

export function validateFile(file: File, type: keyof typeof maxFileSizes): { valid: boolean; error?: string } {
  const maxSize = maxFileSizes[type]
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `Fichier trop volumineux. Taille maximale: ${maxSize / (1024 * 1024)}MB` 
    }
  }

  const allowedTypes = Object.values(allowedFileTypes).flat()
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Type de fichier non supporté. Types acceptés: ${allowedTypes.join(', ')}` 
    }
  }

  return { valid: true }
}
