import { ref, reactive } from 'vue'

export const usePhotoEditor = () => {
  const photoPreview = ref('')
  const photoFile = ref<File | null>(null)
  const photoZoom = ref(1)
  const photoPanX = ref(0)
  const photoPanY = ref(0)
  const photoDragging = ref(false)
  const dragStartX = ref(0)
  const dragStartY = ref(0)
  const dragStartPanX = ref(0)
  const dragStartPanY = ref(0)
  const photoError = ref('')
  const photoSuccess = ref('')
  const savingPhoto = ref(false)

  const handlePhotoSelect = async (event: Event) => {
    photoError.value = ''
    photoSuccess.value = ''
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      photoError.value = 'Por favor selecciona una imagen válida.'
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      photoError.value = 'La imagen debe pesar menos de 5MB.'
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      photoPreview.value = reader.result as string
      photoFile.value = file
      resetEditorValues()
    }
    reader.readAsDataURL(file)
  }

  const resetEditorValues = () => {
    photoZoom.value = 1
    photoPanX.value = 0
    photoPanY.value = 0
  }

  const startDrag = (e: MouseEvent) => {
    if (!photoPreview.value) return
    photoDragging.value = true
    dragStartX.value = e.clientX
    dragStartY.value = e.clientY
    dragStartPanX.value = photoPanX.value
    dragStartPanY.value = photoPanY.value
  }

  const doDrag = (e: MouseEvent) => {
    if (!photoDragging.value) return
    const dx = e.clientX - dragStartX.value
    const dy = e.clientY - dragStartY.value
    photoPanX.value = dragStartPanX.value + dx
    photoPanY.value = dragStartPanY.value + dy
  }

  const endDrag = () => {
    photoDragging.value = false
  }

  const cancelPhotoEdit = () => {
    photoPreview.value = ''
    photoFile.value = null
    resetEditorValues()
    photoError.value = ''
    photoSuccess.value = ''
  }

  const cropAndExportPhoto = async (): Promise<Blob | null> => {
    if (!photoFile.value || !photoPreview.value) return null

    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('No se pudo inicializar canvas')
        }

        const cropSize = 300
        canvas.width = cropSize
        canvas.height = cropSize

        const img = new Image()
        img.onload = () => {
          const scaledWidth = img.width * photoZoom.value
          const scaledHeight = img.height * photoZoom.value
          const x = (cropSize - scaledWidth) / 2 + photoPanX.value
          const y = (cropSize - scaledHeight) / 2 + photoPanY.value

          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('No se pudo exportar la imagen'))
                return
              }
              resolve(blob)
            },
            'image/jpeg',
            0.9
          )
        }
        img.onerror = () => {
          reject(new Error('Error al procesar la imagen'))
        }
        img.src = photoPreview.value
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    photoPreview,
    photoFile,
    photoZoom,
    photoPanX,
    photoPanY,
    photoDragging,
    photoError,
    photoSuccess,
    savingPhoto,
    handlePhotoSelect,
    startDrag,
    doDrag,
    endDrag,
    cancelPhotoEdit,
    cropAndExportPhoto,
    resetEditorValues
  }
}
