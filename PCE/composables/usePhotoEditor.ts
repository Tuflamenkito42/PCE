// @ts-nocheck
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
  const photoCropAreaRef = ref<HTMLElement | null>(null)
  const photoNaturalWidth = ref(0)
  const photoNaturalHeight = ref(0)
  const photoBaseScale = ref(1)

  const CARD_TEMPLATE_WIDTH = 1408
  const CARD_TEMPLATE_HEIGHT = 768
  const CARD_PHOTO_SLOT_WIDTH_RATIO = 0.112
  const CARD_PHOTO_SLOT_HEIGHT_RATIO = 0.246
  const PHOTO_ASPECT_RATIO = (CARD_TEMPLATE_WIDTH * CARD_PHOTO_SLOT_WIDTH_RATIO) / (CARD_TEMPLATE_HEIGHT * CARD_PHOTO_SLOT_HEIGHT_RATIO)

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
    reader.onload = async () => {
      const dataUrl = String(reader.result || '')
      if (!dataUrl) return

      const sourceImage = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('No se pudo leer la foto seleccionada'))
        img.src = dataUrl
      })

      photoNaturalWidth.value = sourceImage.naturalWidth || sourceImage.width || 0
      photoNaturalHeight.value = sourceImage.naturalHeight || sourceImage.height || 0
      photoPreview.value = dataUrl
      photoFile.value = file
      resetEditorValues()

      await nextTick()
      updatePhotoBaseScale()
    }
    reader.readAsDataURL(file)
  }

  const updatePhotoBaseScale = () => {
    const cropAreaEl = photoCropAreaRef.value
    const naturalW = photoNaturalWidth.value
    const naturalH = photoNaturalHeight.value

    if (!cropAreaEl || !naturalW || !naturalH) {
      photoBaseScale.value = 1
      return
    }

    const cropW = cropAreaEl.clientWidth || 1
    const cropH = cropAreaEl.clientHeight || Math.round(cropW / PHOTO_ASPECT_RATIO)
    const fitScale = Math.max(cropW / naturalW, cropH / naturalH)
    photoBaseScale.value = Number(fitScale.toFixed(6))
  }

  const resetEditorValues = () => {
    photoZoom.value = 1
    photoPanX.value = 0
    photoPanY.value = 0
  }

  const resetPhotoTransform = () => {
    resetEditorValues()
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

  const handlePhotoWheel = (e: WheelEvent) => {
    const direction = e.deltaY > 0 ? -1 : 1
    const step = direction * 0.08
    const nextZoom = Math.max(0.5, Math.min(3, photoZoom.value + step))
    photoZoom.value = Number(nextZoom.toFixed(2))
  }

  const cancelPhotoEdit = () => {
    photoPreview.value = ''
    photoFile.value = null
    photoNaturalWidth.value = 0
    photoNaturalHeight.value = 0
    photoBaseScale.value = 1
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

        const cropAreaEl = photoCropAreaRef.value
        const containerWidth = cropAreaEl?.clientWidth || 280
        const containerHeight = cropAreaEl?.clientHeight || Math.round(containerWidth / PHOTO_ASPECT_RATIO)
        const outputWidth = 560
        const outputHeight = Math.round(outputWidth / PHOTO_ASPECT_RATIO)

        canvas.width = outputWidth
        canvas.height = outputHeight

        const img = new Image()
        img.onload = () => {
          const fitScale = photoBaseScale.value > 0
            ? photoBaseScale.value
            : Math.max(containerWidth / img.width, containerHeight / img.height)
          const effectiveScale = fitScale * photoZoom.value

          const scaledWidth = img.width * effectiveScale
          const scaledHeight = img.height * effectiveScale
          const x = (containerWidth - scaledWidth) / 2 + photoPanX.value
          const y = (containerHeight - scaledHeight) / 2 + photoPanY.value

          const scaleX = outputWidth / containerWidth
          const scaleY = outputHeight / containerHeight
          ctx.drawImage(img, x * scaleX, y * scaleY, scaledWidth * scaleX, scaledHeight * scaleY)

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
    photoBaseScale,
    photoDragging,
    photoError,
    photoSuccess,
    savingPhoto,
    photoCropAreaRef,
    photoAspectRatio: PHOTO_ASPECT_RATIO,
    handlePhotoSelect,
    startDrag,
    doDrag,
    endDrag,
    handlePhotoWheel,
    resetPhotoTransform,
    cancelPhotoEdit,
    cropAndExportPhoto,
    resetEditorValues,
    updatePhotoBaseScale
  }
}
