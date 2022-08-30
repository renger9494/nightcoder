import { FileType, FileDto, TemplateDto } from '@/utils/api'

/* export function getTemplateImageUrl(template: TemplateDto, fileType: FileType): string | null {
  const previewImage = template.files.find((f) => f.type == fileType)

  return previewImage?.fullPath ?? null
} */

export function getTemplateImageUrl(template: TemplateDto, fileType: FileType): FileDto | undefined {
  if (!template.files) return undefined
  const previewImage = template.files.find((f) => f.type == fileType)

  return previewImage
}
