export default defineEventHandler(async (event) => {
  try {
    // Importar pdfkit solo en servidor
    const PDFDocument = (await import('pdfkit')).default
    const QRCode = (await import('qrcode')).default

    const body = await readBody(event)
    const { nombre, nif, numeroSocio, fechaAlta, validoHasta, email } = body

    if (!nombre || !nif || !numeroSocio) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan datos requeridos (nombre, nif, numeroSocio)'
      })
    }

    // Crear PDF
    const doc = new PDFDocument({
      size: [306, 190], // Tamaño tarjeta ID (85.6 x 53.98 mm)
      margin: 10
    })

    // Generar código QR con datos del socio
    const qrData = JSON.stringify({
      nombre,
      nif,
      numeroSocio,
      email,
      fechaAlta
    })
    const qrImage = await QRCode.toDataURL(qrData, { width: 60 })
    const qrBase64 = qrImage.split(',')[1]
    const qrBuffer = Buffer.from(qrBase64 || '', 'base64')

    // Configuración de colores
    const colorMarro = '#5E2C2C'
    const colorBordeClaro = '#DCC9CA'
    const colorTexto = '#FFFFFF'

    // ===== LADO IZQUIERDO =====
    // Fondo base
    doc.rect(10, 10, 140, 170).fill(colorMarro)
    doc.rect(10, 10, 140, 170).stroke('#8B4444')

    // Título principal
    doc.font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#723233')
      .text('PROTECCIÓN CIVIL', 15, 15, { width: 130, align: 'center' })
      .text('ESPAÑOLA', 15, 26, { width: 130, align: 'center' })

    // Subtítulo
    doc.font('Helvetica-Bold')
      .fontSize(6)
      .fillColor(colorBordeClaro)
      .text('CARNET DE SOCIO', 15, 38, { width: 130, align: 'center' })

    doc.font('Helvetica')
      .fontSize(4)
      .fillColor(colorBordeClaro)
      .text('MEMBERSHIP CARD', 15, 44, { width: 130, align: 'center' })

    // Línea decorativa
    doc.strokeColor('#8B4444').lineWidth(0.5)
    doc.moveTo(15, 48).lineTo(145, 48).stroke()

    // Campos de datos
    doc.font('Helvetica')
      .fontSize(5)
      .fillColor(colorBordeClaro)

    doc.text('Nombre completo:', 15, 52)
    doc.font('Helvetica')
      .fontSize(5.5)
      .fillColor(colorTexto)
      .text(nombre.toUpperCase(), 15, 58, { width: 130 })

    doc.font('Helvetica')
      .fontSize(5)
      .fillColor(colorBordeClaro)
      .text('NIF/NIE', 15, 68)

    doc.fontSize(5.5)
      .fillColor(colorTexto)
      .text(nif.toUpperCase(), 15, 73)

    doc.font('Helvetica-Bold')
      .fontSize(5)
      .fillColor(colorBordeClaro)
      .text('Nº de socio:', 70, 68)

    doc.fontSize(5.5)
      .fillColor(colorTexto)
      .text(numeroSocio, 70, 73)

    doc.font('Helvetica')
      .fontSize(5)
      .fillColor(colorBordeClaro)
      .text('Fecha de alta:', 15, 83)

    doc.fontSize(5.5)
      .fillColor(colorTexto)
      .text(fechaAlta, 15, 88)

    doc.font('Helvetica')
      .fontSize(5)
      .fillColor(colorBordeClaro)
      .text('Válido hasta:', 70, 83)

    doc.fontSize(5.5)
      .fillColor(colorTexto)
      .text(validoHasta, 70, 88)

    // Línea firma
    doc.strokeColor('#8B4444').lineWidth(0.5)
    doc.moveTo(15, 115).lineTo(65, 115).stroke()

    doc.font('Helvetica')
      .fontSize(4)
      .fillColor(colorBordeClaro)
      .text('Firma del socio', 15, 117)

    // Código QR
    doc.image(qrBuffer, 80, 105, { width: 60, height: 60 })

    // Borde del lado izquierdo
    doc.strokeColor('#8B4444').lineWidth(1)
    doc.rect(10, 10, 140, 170).stroke()

    // ===== LADO DERECHO =====
    // Fondo
    doc.rect(160, 10, 136, 170).fill('#E8D6D7')
    doc.rect(160, 10, 136, 170).stroke('#A89B9C')

    // Decoración esquinas (patrón simple)
    doc.strokeColor('#8B5252')
      .lineWidth(0.3)
      .moveTo(165, 15)
      .lineTo(175, 25)
      .stroke()
      .moveTo(165, 25)
      .lineTo(175, 15)
      .stroke()

    // Equivalente en esquina inferior
    doc.moveTo(280, 165)
      .lineTo(290, 175)
      .stroke()
      .moveTo(280, 175)
      .lineTo(290, 165)
      .stroke()

    // Texto central derecho
    doc.font('Helvetica-Bold')
      .fontSize(11)
      .fillColor('#723233')
      .text('✦', 220, 65, { align: 'center' })

    doc.fontSize(6)
      .fillColor('#723233')
      .text('Made in', 165, 85, { width: 126, align: 'center' })

    doc.font('Helvetica-Bold')
      .fontSize(8)
      .text('ESPAÑA', 165, 93, { width: 126, align: 'center' })

    // Barra negra representativa
    doc.rect(160, 130, 136, 8).fill('#1A1A1A')

    // Simular código de barras (líneas verticales)
    doc.strokeColor('#1A1A1A').lineWidth(0.4)
    for (let i = 0; i < 30; i++) {
      const x = 175 + i * 3.5
      doc.moveTo(x, 135).lineTo(x + 1.5, 135).stroke()
    }

    // Número de serie (simulado)
    doc.font('Helvetica-Bold')
      .fontSize(4)
      .fillColor('#1A1A1A')
      .text('900145826', 165, 140, { width: 126, align: 'center' })

    doc.font('Helvetica')
      .fontSize(3)
      .fillColor('#666666')
      .text('Hecho en España', 165, 152, { width: 126, align: 'center' })

    // Borde del lado derecho
    doc.strokeColor('#A89B9C')
      .lineWidth(1)
      .rect(160, 10, 136, 170)
      .stroke()

    // Generar buffer del PDF
    let pdfBuffer = Buffer.alloc(0)
    
    doc.on('data', (chunk: Buffer) => {
      pdfBuffer = Buffer.concat([pdfBuffer, chunk])
    })

    await new Promise((resolve, reject) => {
      doc.on('end', resolve)
      doc.on('error', reject)
      doc.end()
    })

    // Enviar respuesta con el PDF
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `attachment; filename="carnet_socio_${numeroSocio}.pdf"`)

    return pdfBuffer

  } catch (error) {
    console.error('Error generando carné:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al generar el carné: ' + (error instanceof Error ? error.message : 'Error desconocido')
    })
  }
})
