import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public', 'documents');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const docs = [
  // Institucional
  { file: 'estatutos-del-partido.pdf', title: 'Estatutos del Partido', content: 'ESTATUTOS DE PROTECCIÓN CIVIL ESPAÑOLA (PCE)' },
  { file: 'codigo-etico-de-conducta.pdf', title: 'Código Ético y de Conducta', content: 'CÓDIGO ÉTICO DE PCE' },
  { file: 'organigrama-directiva.pdf', title: 'Organigrama y Estructura Directiva', content: 'ORGANIGRAMA NACIONAL 2024' },
  { file: 'reglamento-organizacion.pdf', title: 'Reglamento de Organización Nacional', content: 'REGLAMENTO DE ORGNIZACIÓN - PCE' },

  // Economica
  { file: 'presupuestos-2024.pdf', title: 'Presupuestos Generales 2024', content: 'PRESUPUESTOS GENERALES 2024' },
  { file: 'cuentas-anuales-2023.pdf', title: 'Cuentas Anuales Ejercicio 2023', content: 'CUENTAS ANUALES 2023' },
  { file: 'auditoria-externa-2023.pdf', title: 'Informe de Auditoría Externa 2023', content: 'AUDITORIA EXTERNA 2023' },
  { file: 'registro-donaciones.pdf', title: 'Registro de Donaciones', content: 'REGISTRO DE DONACIONES 2023-2024' },
  { file: 'subvenciones-publicas.pdf', title: 'Subvenciones Públicas Recibidas', content: 'SUBVENCIONES PUBLICAS RECIBIDAS' },

  // Contratos
  { file: 'contratos-menores-2023.pdf', title: 'Relación de Contratos Menores 2023', content: 'CONTRATOS MENORES 2023' },
  { file: 'contratos-proveedores.pdf', title: 'Contratos con Proveedores', content: 'CONTRATOS PROVEEDORES' },
  { file: 'convenios-entidades.pdf', title: 'Convenios Suscritos con Entidades', content: 'CONVENIOS ENTIDADES' },

  // Cargos
  { file: 'retribuciones-cargos.pdf', title: 'Retribuciones de Altos Cargos y Directivos', content: 'RETRIBUCIONES ALTOS CARGOS 2024' },
  { file: 'gastos-representacion.pdf', title: 'Gastos de Representación y Dietas', content: 'GASTOS DE REPRESENTACION' },
  { file: 'declaracion-bienes.pdf', title: 'Declaración de Bienes y Rentas', content: 'DECLARACION DE BIENES' }
];

docs.forEach(docInfo => {
  const filePath = path.join(dir, docInfo.file);
  const title = docInfo.title;
  
  // Minimal valid PDF format
  const stream = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 100 >>
stream
BT /F1 20 Tf 50 700 Td (PROTECCION CIVIL ESPANOLA - PCE) Tj ET
BT /F1 16 Tf 50 670 Td (${title}) Tj ET
BT /F1 12 Tf 50 640 Td (Documento oficial autogenerado.) Tj ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000228 00000 n 
0000000316 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
450
%%EOF`;

  fs.writeFileSync(filePath, stream);
  console.log('Created:', docInfo.file);
});
