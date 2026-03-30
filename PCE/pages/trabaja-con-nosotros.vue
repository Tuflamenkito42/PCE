<template>
  <main class="jobs-page container">
    <section class="hero card">
      <p class="eyebrow">{{ lt('Únete al equipo', 'Uneix-te a l\'equip', 'Batu taldera', 'Únete ao equipo') }}</p>
      <h1 class="page-title">{{ lt('Trabaja con nosotros', 'Treballa amb nosaltres', 'Lan egin gurekin', 'Traballa connosco') }}</h1>
      <p class="hero-text">
        {{ lt('Buscamos personas comprometidas para campañas, voluntariado y soporte operativo. Elige una oferta y envía tu candidatura en menos de 2 minutos.', 'Busquem persones compromeses per a campanyes, voluntariat i suport operatiu. Tria una oferta i envia la teva candidatura en menys de 2 minuts.', 'Kanpainetarako, boluntariotzarako eta laguntza operatiborako pertsona konprometituak bilatzen ditugu. Aukeratu eskaintza bat eta bidali hautagaitza 2 minutu baino gutxiagoan.', 'Buscamos persoas comprometidas para campañas, voluntariado e soporte operativo. Escolle unha oferta e envía a túa candidatura en menos de 2 minutos.') }}
      </p>
    </section>

    <section class="offers card">
      <div class="section-head">
        <h2>{{ lt('Ofertas activas', 'Ofertes actives', 'Eskaintza aktiboak', 'Ofertas activas') }}</h2>
        <span class="count">{{ offers.length }} {{ lt('vacantes', 'vacants', 'lanpostu', 'vacantes') }}</span>
      </div>

      <div class="offers-grid">
        <article v-for="offer in localizedOffers" :key="offer.id" class="offer-card" :class="{ selected: form.offerId === offer.id }">
          <div class="offer-meta">
            <span class="badge">{{ offer.type }}</span>
            <span class="badge location">{{ offer.location }}</span>
          </div>
          <h3>{{ offer.title }}</h3>
          <p>{{ offer.description }}</p>
          <ul>
            <li v-for="req in offer.requirements" :key="req">{{ req }}</li>
          </ul>
          <button class="btn-select" type="button" @click="selectOffer(offer.id)">
            {{ form.offerId === offer.id ? lt('Seleccionada', 'Seleccionada', 'Hautatuta', 'Seleccionada') : lt('Seleccionar oferta', 'Seleccionar oferta', 'Eskaintza hautatu', 'Seleccionar oferta') }}
          </button>
        </article>
      </div>
    </section>

    <section class="apply card">
      <h2>{{ lt('Enviar candidatura', 'Enviar candidatura', 'Hautagaitza bidali', 'Enviar candidatura') }}</h2>
      <form class="apply-form" @submit.prevent="submitApplication">
        <div class="grid">
          <div class="field">
            <label for="name">{{ lt('Nombre y apellidos', 'Nom i cognoms', 'Izen-abizenak', 'Nome e apelidos') }}</label>
            <input id="name" v-model="form.fullName" type="text" required :disabled="sending" />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" required :disabled="sending" />
          </div>
          <div class="field">
            <label for="phone">{{ lt('Teléfono', 'Telèfon', 'Telefonoa', 'Teléfono') }}</label>
            <input id="phone" v-model="form.phone" type="tel" required :disabled="sending" />
          </div>
          <div class="field">
            <label for="city">{{ lt('Ciudad', 'Ciutat', 'Hiria', 'Cidade') }}</label>
            <input id="city" v-model="form.city" type="text" required :disabled="sending" />
          </div>
          <div class="field full">
            <label for="availability">{{ lt('Disponibilidad', 'Disponibilitat', 'Eskuragarritasuna', 'Disponibilidade') }}</label>
            <input id="availability" v-model="form.availability" type="text" :placeholder="lt('Ej: fines de semana, tardes, jornada completa', 'Ex: caps de setmana, tardes, jornada completa', 'Adib.: asteburuak, arratsaldeak, lanaldi osoa', 'Ex: fins de semana, tardes, xornada completa')" required :disabled="sending" />
          </div>
          <div class="field full">
            <label for="motivation">{{ lt('Motivación', 'Motivació', 'Motibazioa', 'Motivación') }}</label>
            <textarea id="motivation" v-model="form.motivation" rows="5" required :disabled="sending" :placeholder="lt('Cuéntanos por qué quieres participar', 'Explica ns per què vols participar', 'Kontatu zergatik parte hartu nahi duzun', 'Cóntanos por que queres participar')"></textarea>
          </div>
          <div class="field full">
            <label for="cv">{{ lt('Adjuntar currículum (PDF, DOC, DOCX)', 'Adjuntar currículum (PDF, DOC, DOCX)', 'Curriculuma erantsi (PDF, DOC, DOCX)', 'Anexar currículo (PDF, DOC, DOCX)') }}</label>
            <div class="file-picker" :class="{ hasFile: !!form.cvFile }">
              <input id="cv" ref="cvInput" class="file-input-hidden" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required :disabled="sending" @change="onCvChange" />
              <button class="file-cta" type="button" :disabled="sending" @click="openCvDialog">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>{{ lt('Seleccionar CV', 'Seleccionar CV', 'CV hautatu', 'Seleccionar CV') }}</span>
              </button>
              <span class="file-name" :class="{ empty: !form.cvFile }">
                {{ form.cvFile ? form.cvFile.name : lt('Ningún archivo seleccionado', 'Cap arxiu seleccionat', 'Ez da fitxategirik hautatu', 'Ningún arquivo seleccionado') }}
              </span>
            </div>
            <small class="file-help">{{ lt('Máximo 8MB. Formatos permitidos: PDF, DOC, DOCX.', 'Màxim 8MB. Formats permesos: PDF, DOC, DOCX.', 'Gehienez 8MB. Onartutako formatuak: PDF, DOC, DOCX.', 'Máximo 8MB. Formatos permitidos: PDF, DOC, DOCX.') }}</small>
          </div>
        </div>

        <label class="check">
          <input v-model="form.acceptPolicy" type="checkbox" required :disabled="sending" />
          <span>{{ lt('Acepto la política de privacidad y el tratamiento de datos para procesos de selección.', 'Accepto la política de privacitat i el tractament de dades per a processos de selecció.', 'Pribatutasun politika eta hautaketa-prozesuetarako datuen tratamendua onartzen ditut.', 'Acepto a política de privacidade e o tratamento de datos para procesos de selección.') }}</span>
        </label>

        <button class="btn-submit" type="submit" :disabled="sending">
          {{ sending ? lt('Enviando candidatura...', 'Enviant candidatura...', 'Hautagaitza bidaltzen...', 'Enviando candidatura...') : lt('Enviar candidatura', 'Enviar candidatura', 'Hautagaitza bidali', 'Enviar candidatura') }}
        </button>

        <p v-if="feedback" :class="['feedback', feedbackType]">{{ feedback }}</p>
      </form>
    </section>
  </main>
</template>

<script setup>
const { locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

const offers = [
  {
    id: 'voluntariado-campanas',
    title: {
      es: 'Voluntariado para campañas territoriales',
      ca: 'Voluntariat per a campanyes territorials',
      eu: 'Lurralde-kanpainetarako boluntariotza',
      gl: 'Voluntariado para campañas territoriais'
    },
    type: {
      es: 'Voluntariado',
      ca: 'Voluntariat',
      eu: 'Boluntariotza',
      gl: 'Voluntariado'
    },
    location: {
      es: 'España',
      ca: 'Espanya',
      eu: 'Espainia',
      gl: 'España'
    },
    description: {
      es: 'Apoyo en actos informativos, logística local y atención ciudadana durante campañas.',
      ca: 'Suport en actes informatius, logística local i atenció ciutadana durant campanyes.',
      eu: 'Informazio-ekitaldietan laguntza, tokiko logistika eta herritarren arreta kanpainetan.',
      gl: 'Apoio en actos informativos, loxística local e atención cidadá durante campañas.'
    },
    requirements: {
      es: ['Disponibilidad mínima de 8 horas semanales', 'Capacidad de trabajo en equipo', 'Actitud proactiva'],
      ca: ['Disponibilitat mínima de 8 hores setmanals', 'Capacitat de treball en equip', 'Actitud proactiva'],
      eu: ['Astean gutxienez 8 orduko eskuragarritasuna', 'Taldean lan egiteko gaitasuna', 'Jarrera proaktiboa'],
      gl: ['Disponibilidade mínima de 8 horas semanais', 'Capacidade de traballo en equipo', 'Actitude proactiva']
    }
  },
  {
    id: 'coordinacion-eventos',
    title: {
      es: 'Coordinación de eventos y movilización',
      ca: 'Coordinació d\'esdeveniments i mobilització',
      eu: 'Ekitaldien eta mobilizazioaren koordinazioa',
      gl: 'Coordinación de eventos e mobilización'
    },
    type: {
      es: 'Puesto temporal',
      ca: 'Lloc temporal',
      eu: 'Aldi baterako postua',
      gl: 'Posto temporal'
    },
    location: {
      es: 'Madrid / Barcelona',
      ca: 'Madrid / Barcelona',
      eu: 'Madril / Bartzelona',
      gl: 'Madrid / Barcelona'
    },
    description: {
      es: 'Organización de eventos, coordinación de voluntarios y soporte de operaciones en territorio.',
      ca: 'Organització d\'esdeveniments, coordinació de voluntaris i suport d\'operacions al territori.',
      eu: 'Ekitaldien antolaketa, boluntarioen koordinazioa eta lurraldeko operazioei laguntza.',
      gl: 'Organización de eventos, coordinación de voluntarios e soporte de operacións no territorio.'
    },
    requirements: {
      es: ['Experiencia en organización de eventos', 'Comunicación clara', 'Gestión de incidencias'],
      ca: ['Experiència en organització d\'esdeveniments', 'Comunicació clara', 'Gestió d\'incidències'],
      eu: ['Ekitaldiak antolatzen esperientzia', 'Komunikazio argia', 'Gorabeheren kudeaketa'],
      gl: ['Experiencia en organización de eventos', 'Comunicación clara', 'Xestión de incidencias']
    }
  },
  {
    id: 'equipo-digital',
    title: {
      es: 'Equipo digital y redes',
      ca: 'Equip digital i xarxes',
      eu: 'Talde digitala eta sareak',
      gl: 'Equipo dixital e redes'
    },
    type: {
      es: 'Campaña',
      ca: 'Campanya',
      eu: 'Kanpaina',
      gl: 'Campaña'
    },
    location: {
      es: 'Remoto',
      ca: 'Remot',
      eu: 'Urrunekoa',
      gl: 'Remoto'
    },
    description: {
      es: 'Soporte en contenidos, monitorización básica y difusión de mensajes de campaña.',
      ca: 'Suport en continguts, monitorització bàsica i difusió de missatges de campanya.',
      eu: 'Edukietan laguntza, oinarrizko monitorizazioa eta kanpainako mezuen zabalkundea.',
      gl: 'Soporte en contidos, monitorización básica e difusión de mensaxes de campaña.'
    },
    requirements: {
      es: ['Conocimiento básico de redes sociales', 'Buena redacción', 'Disponibilidad flexible'],
      ca: ['Coneixement bàsic de xarxes socials', 'Bona redacció', 'Disponibilitat flexible'],
      eu: ['Sare sozialen oinarrizko ezagutza', 'Idazketa ona', 'Esku-hartze malgua'],
      gl: ['Coñecemento básico de redes sociais', 'Boa redacción', 'Disponibilidade flexible']
    }
  },
  {
    id: 'logistica-territorial',
    title: {
      es: 'Apoyo logístico territorial',
      ca: 'Suport logístic territorial',
      eu: 'Lurraldeko laguntza logistikoa',
      gl: 'Apoio loxístico territorial'
    },
    type: {
      es: 'Voluntariado',
      ca: 'Voluntariat',
      eu: 'Boluntariotza',
      gl: 'Voluntariado'
    },
    location: {
      es: 'Sevilla / Málaga / Valencia',
      ca: 'Sevilla / Màlaga / València',
      eu: 'Sevilla / Malaga / Valentzia',
      gl: 'Sevilla / Málaga / Valencia'
    },
    description: {
      es: 'Gestión de materiales, rutas y soporte de operaciones para actos y campañas locales.',
      ca: 'Gestió de materials, rutes i suport d\'operacions per a actes i campanyes locals.',
      eu: 'Tokiko ekitaldi eta kanpainetarako materialen kudeaketa, ibilbideak eta operazio-laguntza.',
      gl: 'Xestión de materiais, rutas e soporte de operacións para actos e campañas locais.'
    },
    requirements: {
      es: ['Organización y puntualidad', 'Disponibilidad en fines de semana', 'Capacidad para resolver imprevistos'],
      ca: ['Organització i puntualitat', 'Disponibilitat els caps de setmana', 'Capacitat per resoldre imprevistos'],
      eu: ['Antolaketa eta puntualtasuna', 'Asteburuetan eskuragarritasuna', 'Ustekabeei irtenbidea emateko gaitasuna'],
      gl: ['Organización e puntualidade', 'Disponibilidade en fins de semana', 'Capacidade para resolver imprevistos']
    }
  },
  {
    id: 'analista-datos-campana',
    title: {
      es: 'Analista de datos de campaña',
      ca: 'Analista de dades de campanya',
      eu: 'Kanpainako datuen analista',
      gl: 'Analista de datos de campaña'
    },
    type: {
      es: 'Puesto temporal',
      ca: 'Lloc temporal',
      eu: 'Aldi baterako postua',
      gl: 'Posto temporal'
    },
    location: {
      es: 'Remoto / Híbrido',
      ca: 'Remot / Híbrid',
      eu: 'Urrunekoa / Hibridoa',
      gl: 'Remoto / Híbrido'
    },
    description: {
      es: 'Seguimiento de KPIs, informes semanales y apoyo a decisiones estratégicas de campaña.',
      ca: 'Seguiment de KPIs, informes setmanals i suport a decisions estratègiques de campanya.',
      eu: 'KPIen jarraipena, asteko txostenak eta kanpainako erabaki estrategikoetarako laguntza.',
      gl: 'Seguimento de KPIs, informes semanais e apoio ás decisións estratéxicas de campaña.'
    },
    requirements: {
      es: ['Manejo de hojas de cálculo', 'Capacidad analítica', 'Comunicación de conclusiones clara'],
      ca: ['Domini de fulls de càlcul', 'Capacitat analítica', 'Comunicació clara de conclusions'],
      eu: ['Kalkulu-orriak erabiltzeko gaitasuna', 'Gaitasun analitikoa', 'Ondorioak argi komunikatzea'],
      gl: ['Manexo de follas de cálculo', 'Capacidade analítica', 'Comunicación clara de conclusións']
    }
  },
  {
    id: 'atencion-ciudadana',
    title: {
      es: 'Atención ciudadana y soporte',
      ca: 'Atenció ciutadana i suport',
      eu: 'Herritarren arreta eta laguntza',
      gl: 'Atención cidadá e soporte'
    },
    type: {
      es: 'Campaña',
      ca: 'Campanya',
      eu: 'Kanpaina',
      gl: 'Campaña'
    },
    location: {
      es: 'Bilbao / Zaragoza / Vigo',
      ca: 'Bilbao / Saragossa / Vigo',
      eu: 'Bilbo / Zaragoza / Vigo',
      gl: 'Bilbao / Zaragoza / Vigo'
    },
    description: {
      es: 'Respuesta a consultas de ciudadanos, registro de incidencias y derivación a equipos internos.',
      ca: 'Resposta a consultes de ciutadans, registre d\'incidències i derivació a equips interns.',
      eu: 'Herritarren kontsultei erantzutea, gorabeherak erregistratzea eta barne-taldeetara bideratzea.',
      gl: 'Resposta a consultas da cidadanía, rexistro de incidencias e derivación a equipos internos.'
    },
    requirements: {
      es: ['Empatía y trato cordial', 'Comunicación escrita correcta', 'Gestión ordenada de información'],
      ca: ['Empatia i tracte cordial', 'Comunicació escrita correcta', 'Gestió ordenada d\'informació'],
      eu: ['Enpatia eta tratu adeitsua', 'Idatzizko komunikazio zuzena', 'Informazioa modu ordenatuan kudeatzea'],
      gl: ['Empatía e trato cordial', 'Comunicación escrita correcta', 'Xestión ordenada da información']
    }
  },
  {
    id: 'diseno-audiovisual',
    title: {
      es: 'Diseño gráfico y audiovisual',
      ca: 'Disseny gràfic i audiovisual',
      eu: 'Diseinu grafikoa eta ikus-entzunezkoa',
      gl: 'Deseño gráfico e audiovisual'
    },
    type: {
      es: 'Puesto temporal',
      ca: 'Lloc temporal',
      eu: 'Aldi baterako postua',
      gl: 'Posto temporal'
    },
    location: {
      es: 'Remoto',
      ca: 'Remot',
      eu: 'Urrunekoa',
      gl: 'Remoto'
    },
    description: {
      es: 'Creación de piezas visuales para redes, cartelería digital y vídeos cortos de campaña.',
      ca: 'Creació de peces visuals per a xarxes, cartelleria digital i vídeos curts de campanya.',
      eu: 'Sareetarako pieza bisualak, kartel digitalak eta kanpainako bideo laburrak sortzea.',
      gl: 'Creación de pezas visuais para redes, cartelería dixital e vídeos curtos de campaña.'
    },
    requirements: {
      es: ['Manejo de herramientas de diseño', 'Criterio visual', 'Entrega en plazos ajustados'],
      ca: ['Domini d\'eines de disseny', 'Criteri visual', 'Lliurament en terminis ajustats'],
      eu: ['Diseinu tresnen erabilera', 'Irizpide bisuala', 'Epe estuetan entregatzeko gaitasuna'],
      gl: ['Manexo de ferramentas de deseño', 'Criterio visual', 'Entrega en prazos axustados']
    }
  },
  {
    id: 'coordinacion-voluntariado',
    title: {
      es: 'Coordinación de voluntariado',
      ca: 'Coordinació de voluntariat',
      eu: 'Boluntarioen koordinazioa',
      gl: 'Coordinación de voluntariado'
    },
    type: {
      es: 'Campaña',
      ca: 'Campanya',
      eu: 'Kanpaina',
      gl: 'Campaña'
    },
    location: {
      es: 'España',
      ca: 'Espanya',
      eu: 'Espainia',
      gl: 'España'
    },
    description: {
      es: 'Planificación de turnos, seguimiento de equipos y acompañamiento a nuevos voluntarios.',
      ca: 'Planificació de torns, seguiment d\'equips i acompanyament de nous voluntaris.',
      eu: 'Txanden plangintza, taldeen jarraipena eta boluntario berrien laguntza.',
      gl: 'Planificación de quendas, seguimento de equipos e acompañamento a novos voluntarios.'
    },
    requirements: {
      es: ['Liderazgo colaborativo', 'Organización de equipos', 'Resolución de conflictos'],
      ca: ['Lideratge col·laboratiu', 'Organització d\'equips', 'Resolució de conflictes'],
      eu: ['Lidergo kolaboratiboa', 'Taldeen antolaketa', 'Gatazkak konpontzeko gaitasuna'],
      gl: ['Liderado colaborativo', 'Organización de equipos', 'Resolución de conflitos']
    }
  },
  {
    id: 'fotografia-campana',
    title: {
      es: 'Fotografía y cobertura de campaña',
      ca: 'Fotografia i cobertura de campanya',
      eu: 'Argazkigintza eta kanpainaren estaldura',
      gl: 'Fotografía e cobertura de campaña'
    },
    type: {
      es: 'Voluntariado',
      ca: 'Voluntariat',
      eu: 'Boluntariotza',
      gl: 'Voluntariado'
    },
    location: {
      es: 'Madrid / Valencia',
      ca: 'Madrid / València',
      eu: 'Madril / Valentzia',
      gl: 'Madrid / Valencia'
    },
    description: {
      es: 'Cobertura fotográfica de actos, edición básica y organización del material visual.',
      ca: 'Cobertura fotogràfica d\'actes, edició bàsica i organització del material visual.',
      eu: 'Ekitaldien argazki-estaldura, oinarrizko edizioa eta material bisualaren antolaketa.',
      gl: 'Cobertura fotográfica de actos, edición básica e organización do material visual.'
    },
    requirements: {
      es: ['Manejo básico de cámara', 'Sensibilidad visual', 'Disponibilidad en eventos presenciales'],
      ca: ['Maneig bàsic de càmera', 'Sensibilitat visual', 'Disponibilitat en esdeveniments presencials'],
      eu: ['Kamera erabiltzeko oinarrizko gaitasuna', 'Sentsibilitate bisuala', 'Aurrez aurreko ekitaldietan eskuragarritasuna'],
      gl: ['Manexo básico de cámara', 'Sensibilidade visual', 'Disponibilidade en eventos presenciais']
    }
  },
  {
    id: 'soporte-juridico-campana',
    title: {
      es: 'Soporte jurídico de campaña',
      ca: 'Suport jurídic de campanya',
      eu: 'Kanpainarako laguntza juridikoa',
      gl: 'Soporte xurídico de campaña'
    },
    type: {
      es: 'Puesto temporal',
      ca: 'Lloc temporal',
      eu: 'Aldi baterako postua',
      gl: 'Posto temporal'
    },
    location: {
      es: 'Barcelona / Remoto',
      ca: 'Barcelona / Remot',
      eu: 'Bartzelona / Urrunekoa',
      gl: 'Barcelona / Remoto'
    },
    description: {
      es: 'Apoyo en revisión documental, cumplimiento normativo y asesoramiento operativo.',
      ca: 'Suport en revisió documental, compliment normatiu i assessorament operatiu.',
      eu: 'Dokumentuen berrikuspena, araudia betetzea eta aholku operatiboa.',
      gl: 'Apoio en revisión documental, cumprimento normativo e asesoramento operativo.'
    },
    requirements: {
      es: ['Conocimientos jurídicos básicos', 'Rigor documental', 'Comunicación profesional'],
      ca: ['Coneixements jurídics bàsics', 'Rigor documental', 'Comunicació professional'],
      eu: ['Oinarrizko ezagutza juridikoak', 'Dokumentazio-zorroztasuna', 'Komunikazio profesionala'],
      gl: ['Coñecementos xurídicos básicos', 'Rigor documental', 'Comunicación profesional']
    }
  }
]

const lang = computed(() => {
  const current = locale.value
  if (current === 'ca' || current === 'eu' || current === 'gl') return current
  return 'es'
})

const localizedOffers = computed(() => {
  return offers.map((offer) => ({
    id: offer.id,
    title: offer.title[lang.value],
    type: offer.type[lang.value],
    location: offer.location[lang.value],
    description: offer.description[lang.value],
    requirements: offer.requirements[lang.value]
  }))
})

const form = reactive({
  offerId: offers[0].id,
  fullName: '',
  email: '',
  phone: '',
  city: '',
  availability: '',
  motivation: '',
  cvFile: null,
  acceptPolicy: false
})

const sending = ref(false)
const feedback = ref('')
const feedbackType = ref('success')
const cvInput = ref(null)

const onCvChange = (event) => {
  const target = event.target
  const file = target?.files?.[0]
  form.cvFile = file || null
}

const openCvDialog = () => {
  if (!cvInput.value) return
  cvInput.value.click()
}

const selectOffer = (offerId) => {
  form.offerId = offerId
}

const submitApplication = async () => {
  if (!form.offerId) {
    feedback.value = lt('Selecciona una oferta antes de enviar.', 'Selecciona una oferta abans d enviar.', 'Hautatu eskaintza bat bidali aurretik.', 'Selecciona unha oferta antes de enviar.')
    feedbackType.value = 'error'
    return
  }

  if (!form.cvFile) {
    feedback.value = lt('Adjunta tu currículum para continuar.', 'Adjunta el teu currículum per continuar.', 'Erantsi zure curriculuma jarraitzeko.', 'Anexa o teu currículo para continuar.')
    feedbackType.value = 'error'
    return
  }

  sending.value = true
  feedback.value = ''

  try {
    const payload = new FormData()
    payload.append('offerId', form.offerId)
    payload.append('fullName', form.fullName)
    payload.append('email', form.email)
    payload.append('phone', form.phone)
    payload.append('city', form.city)
    payload.append('availability', form.availability)
    payload.append('motivation', form.motivation)
    payload.append('cv', form.cvFile)

    const response = await $fetch('/api/jobs/apply', {
      method: 'POST',
      body: payload
    })

    feedback.value = response?.message || lt('Candidatura enviada correctamente.', 'Candidatura enviada correctament.', 'Hautagaitza ondo bidali da.', 'Candidatura enviada correctamente.')
    feedbackType.value = 'success'
    form.fullName = ''
    form.email = ''
    form.phone = ''
    form.city = ''
    form.availability = ''
    form.motivation = ''
    form.cvFile = null
    form.acceptPolicy = false
    form.offerId = offers[0].id
    if (cvInput.value) {
      cvInput.value.value = ''
    }
  } catch (error) {
    feedback.value = error?.data?.message || lt('No se pudo enviar la candidatura.', 'No s ha pogut enviar la candidatura.', 'Ezin izan da hautagaitza bidali.', 'Non se puido enviar a candidatura.')
    feedbackType.value = 'error'
  } finally {
    sending.value = false
  }
}

useHead(() => ({
  title: `${lt('Trabaja con nosotros', 'Treballa amb nosaltres', 'Lan egin gurekin', 'Traballa connosco')} - PCE`,
  meta: [
    {
      name: 'description',
      content: 'Ofertas de trabajo, campañas y voluntariado en PCE. Envía tu candidatura online.'
    }
  ]
}))
</script>

<style scoped>
.jobs-page {
  padding: 48px 20px 64px;
  display: grid;
  gap: 26px;
}

.card {
  background: rgba(94, 44, 44, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
}

.eyebrow {
  color: #dcc9ca;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  font-size: 0.82rem;
  margin: 0 0 8px;
}

.page-title {
  margin: 0;
  color: #fff;
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 3rem);
}

.hero-text {
  color: #eadfe0;
  max-width: 900px;
  line-height: 1.7;
  margin: 12px 0 0;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.section-head h2,
.apply h2 {
  margin: 0;
  color: #fff;
  font-family: 'Cinzel', serif;
}

.count {
  color: #f5eaea;
  background: rgba(0, 0, 0, 0.22);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.86rem;
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 14px;
}

.offer-card {
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
}

.offer-card.selected {
  border-color: #f5d8b6;
  box-shadow: 0 0 0 2px rgba(245, 216, 182, 0.3);
}

.offer-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.13);
  color: #fff;
}

.badge.location {
  background: rgba(245, 216, 182, 0.2);
}

.offer-card h3 {
  margin: 0 0 8px;
  color: #fff;
  font-size: 1.08rem;
}

.offer-card p,
.offer-card li {
  color: #dfcbcc;
  line-height: 1.45;
  font-size: 0.94rem;
}

.offer-card ul {
  margin: 8px 0 12px;
  padding-left: 18px;
}

.btn-select {
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 700;
  background: #b9afb0;
  color: #3f2020;
  cursor: pointer;
}

.apply-form {
  margin-top: 14px;
}

.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field.full {
  grid-column: 1 / -1;
}

.field label {
  color: #f2e9e9;
  font-size: 0.84rem;
  letter-spacing: 0.8px;
}

.field input,
.field textarea {
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.18);
  color: #fff;
  padding: 12px;
}

.file-input-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.file-picker {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(0, 0, 0, 0.18);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.file-picker.hasFile {
  border-color: rgba(190, 255, 211, 0.7);
  box-shadow: 0 0 0 1px rgba(190, 255, 211, 0.2) inset;
}

.file-picker .file-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(180deg, #f4eeef 0%, #e7dddf 100%);
  color: #3f1f1f;
  border: 1px solid rgba(100, 46, 46, 0.35);
  border-radius: 10px;
  padding: 10px 15px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.file-picker .file-cta:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  filter: brightness(1.02);
}

.file-picker .file-cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.file-name {
  color: #f2e9e9;
  font-size: 0.92rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.file-name.empty {
  color: rgba(242, 233, 233, 0.7);
}

.file-help {
  color: rgba(242, 233, 233, 0.75);
  font-size: 0.78rem;
  margin-top: 6px;
}

.check {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  color: #e6d7d7;
  align-items: flex-start;
  font-size: 0.9rem;
}

.btn-submit {
  margin-top: 14px;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  background: #f5d8b6;
  color: #422121;
  font-weight: 800;
  cursor: pointer;
}

.btn-submit:disabled,
.btn-select:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.feedback {
  margin-top: 14px;
  font-size: 0.92rem;
  font-weight: 600;
}

.feedback.success {
  color: #b6f0c5;
}

.feedback.error {
  color: #ffbaba;
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
