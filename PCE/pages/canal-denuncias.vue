<template>
  <main class="reporting-page container">
    <section class="hero card">
      <div class="hero-grid">
        <div>
          <p class="eyebrow">{{ lt('Canal Seguro', 'Canal Segur', 'Kanal Segurua', 'Canle Segura') }}</p>
          <h1>{{ lt('Canal de Denuncias', 'Canal de Denúncies', 'Salaketa Kanala', 'Canle de Denuncias') }}</h1>
          <p>
            {{ lt(
              'Este formulario permite comunicar incidencias de forma responsable. El equipo revisa cada caso de manera confidencial.',
              'Aquest formulari permet comunicar incidències de forma responsable. L\'equip revisa cada cas de manera confidencial.',
              'Formulario honek gorabeherak modu arduratsuan jakinarazteko aukera ematen du. Taldeak kasu bakoitza konfidentzialtasunez aztertzen du.',
              'Este formulario permite comunicar incidencias de forma responsable. O equipo revisa cada caso de maneira confidencial.'
            ) }}
          </p>

          <div class="hero-points">
            <div class="point">
              <strong>{{ lt('Confidencialidad', 'Confidencialitat', 'Konfidentzialtasuna', 'Confidencialidade') }}</strong>
              <span>{{ lt('Tu comunicación se gestiona de forma reservada.', 'La teva comunicació es gestiona de manera reservada.', 'Zure komunikazioa modu erreserbatuan kudeatzen da.', 'A túa comunicación xestiónase de forma reservada.') }}</span>
            </div>
            <div class="point">
              <strong>{{ lt('Revisión', 'Revisió', 'Berrikuspena', 'Revisión') }}</strong>
              <span>{{ lt('Cada caso se analiza con criterio y responsabilidad.', 'Cada cas s\'analitza amb criteri i responsabilitat.', 'Kasu bakoitza irizpide eta arduraz aztertzen da.', 'Cada caso analízase con criterio e responsabilidade.') }}</span>
            </div>
            <div class="point">
              <strong>{{ lt('Seguimiento', 'Seguiment', 'Jarraipena', 'Seguimento') }}</strong>
              <span>{{ lt('Si procede, recibirás respuesta por correo electrónico.', 'Si escau, rebràs resposta per correu electrònic.', 'Dagokionean, erantzuna jasoko duzu posta elektronikoz.', 'Se procede, recibirás resposta por correo electrónico.') }}</span>
            </div>
          </div>
        </div>

        <aside class="hero-side">
          <h2>{{ lt('Cómo funciona', 'Com funciona', 'Nola funtzionatzen du', 'Como funciona') }}</h2>
          <ol>
            <li>{{ lt('Rellena el formulario con el máximo detalle posible.', 'Omple el formulari amb el màxim detall possible.', 'Bete formularioa ahalik eta xehetasun handienarekin.', 'Enche o formulario co máximo detalle posible.') }}</li>
            <li>{{ lt('Nuestro equipo revisa la información recibida.', 'El nostre equip revisa la informació rebuda.', 'Gure taldeak jasotako informazioa aztertzen du.', 'O noso equipo revisa a información recibida.') }}</li>
            <li>{{ lt('Si es necesario, se te contactará por email.', 'Si cal, se\'t contactarà per correu electrònic.', 'Beharrezkoa bada, email bidez jarriko gara zurekin harremanetan.', 'Se é necesario, contactarase contigo por email.') }}</li>
          </ol>
        </aside>
      </div>
    </section>

    <section class="form-shell card">
      <form class="reporting-form" @submit.prevent="handleSubmit">
        <div class="form-header">
          <h2>{{ lt('Formulario de Comunicación', 'Formulari de Comunicació', 'Jakinarazpen Formularioa', 'Formulario de Comunicación') }}</h2>
          <p>{{ lt('Completa los campos para registrar la incidencia.', 'Completa els camps per registrar la incidència.', 'Bete eremuak gorabehera erregistratzeko.', 'Completa os campos para rexistrar a incidencia.') }}</p>
        </div>

        <fieldset class="form-group-box">
          <legend>{{ lt('Datos de contacto', 'Dades de contacte', 'Harremanetarako datuak', 'Datos de contacto') }}</legend>

          <div class="row">
            <div class="field">
              <label for="name">{{ lt('Nombre', 'Nom', 'Izena', 'Nome') }}</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                minlength="2"
                maxlength="100"
                :disabled="loading"
                :placeholder="lt('Nombre y apellidos', 'Nom i cognoms', 'Izen-abizenak', 'Nome e apelidos')"
              />
            </div>

            <div class="field">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                :disabled="loading"
                :placeholder="lt('tu@email.com', 'tu@email.com', 'zure@email.com', 'ti@email.com')"
              />
            </div>
          </div>
        </fieldset>

        <fieldset class="form-group-box">
          <legend>{{ lt('Detalles de la incidencia', 'Detalls de la incidència', 'Gorabeheraren xehetasunak', 'Detalles da incidencia') }}</legend>

          <div class="field">
            <label for="subject">{{ lt('Tipo de incidencia', 'Tipus d\'incidència', 'Gorabehera mota', 'Tipo de incidencia') }}</label>
            <select id="subject" v-model="form.subject" :disabled="loading">
              <option value="conducta">{{ lt('Conducta irregular', 'Conducta irregular', 'Jokabide irregularra', 'Conduta irregular') }}</option>
              <option value="finanzas">{{ lt('Posible irregularidad financiera', 'Possible irregularitat financera', 'Finantza-irregulartasun posiblea', 'Posible irregularidade financeira') }}</option>
              <option value="organizacion">{{ lt('Incidencia organizativa', 'Incidència organitzativa', 'Antolaketa gorabehera', 'Incidencia organizativa') }}</option>
              <option value="otros">{{ lt('Otros', 'Altres', 'Beste batzuk', 'Outros') }}</option>
            </select>
          </div>

          <div class="field">
            <label for="message">{{ lt('Descripción detallada', 'Descripció detallada', 'Deskribapen zehatza', 'Descrición detallada') }}</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="8"
              required
              minlength="10"
              maxlength="5000"
              :disabled="loading"
              :placeholder="lt('Describe los hechos con fechas, lugares y personas implicadas.', 'Descriu els fets amb dates, llocs i persones implicades.', 'Deskribatu gertakariak datak, tokiak eta inplikatutako pertsonak adierazita.', 'Describe os feitos con datas, lugares e persoas implicadas.')"
            />
          </div>
        </fieldset>

        <label class="consent">
          <input type="checkbox" v-model="form.accept" required :disabled="loading" />
          <span>
            {{ lt(
              'Confirmo que la información aportada es veraz y autorizo su tratamiento para gestionar esta denuncia.',
              'Confirmo que la informació aportada és veraç i autoritzo el seu tractament per gestionar aquesta denúncia.',
              'Emandako informazioa egiazkoa dela baieztatzen dut eta salaketa hau kudeatzeko tratamendua baimentzen dut.',
              'Confirmo que a información achegada é veraz e autorizo o seu tratamento para xestionar esta denuncia.'
            ) }}
          </span>
        </label>

        <button class="btn btn-primary submit" type="submit" :disabled="loading || !form.accept">
          {{ loading ? lt('Enviando...', 'Enviant...', 'Bidaltzen...', 'Enviando...') : lt('Enviar denuncia', 'Enviar denúncia', 'Salaketa bidali', 'Enviar denuncia') }}
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

const form = reactive({
  name: '',
  email: '',
  subject: 'conducta',
  message: '',
  accept: false
})

const loading = ref(false)
const feedback = ref('')
const feedbackType = ref('success')

const subjectLabelMap = {
  conducta: 'Conducta irregular',
  finanzas: 'Posible irregularidad financiera',
  organizacion: 'Incidencia organizativa',
  otros: 'Otros'
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.subject = 'conducta'
  form.message = ''
  form.accept = false
}

const handleSubmit = async () => {
  if (!form.accept) return

  loading.value = true
  feedback.value = ''

  const finalSubject = `Canal de Denuncias - ${subjectLabelMap[form.subject] || 'Otros'}`

  try {
    await $fetch('/api/reporting/send', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        subject: finalSubject,
        message: form.message
      }
    })

    feedbackType.value = 'success'
    feedback.value = lt(
      'Denuncia enviada correctamente. Gracias por ayudar a mejorar la organización.',
      'Denúncia enviada correctament. Gràcies per ajudar a millorar l\'organització.',
      'Salaketa ondo bidali da. Eskerrik asko erakundea hobetzen laguntzeagatik.',
      'Denuncia enviada correctamente. Grazas por axudar a mellorar a organización.'
    )

    resetForm()
  } catch (error) {
    feedbackType.value = 'error'
    feedback.value = error?.data?.message || lt(
      'No se pudo enviar la denuncia. Inténtalo de nuevo en unos minutos.',
      'No s\'ha pogut enviar la denúncia. Torna-ho a provar en uns minuts.',
      'Ezin izan da salaketa bidali. Saiatu berriro minutu batzuk barru.',
      'Non se puido enviar a denuncia. Téntao de novo nuns minutos.'
    )
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Canal de Denuncias - PCE',
  meta: [
    {
      name: 'description',
      content: 'Canal de Denuncias de Protección Civil Española para comunicar incidencias de forma responsable y confidencial.'
    }
  ]
})
</script>

<style scoped>
.reporting-page {
  padding: 56px 20px 68px;
  display: grid;
  gap: 26px;
  background:
    radial-gradient(circle at 12% 12%, rgba(169, 132, 133, 0.25) 0, transparent 34%),
    radial-gradient(circle at 88% 76%, rgba(185, 175, 176, 0.16) 0, transparent 36%);
}

.card {
  background: linear-gradient(155deg, #603030 0%, #4f2525 45%, #3f1e1e 100%);
  border: 1px solid rgba(185, 175, 176, 0.35);
  border-radius: 20px;
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
}

.hero {
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -80px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(214, 190, 192, 0.35) 0%, rgba(214, 190, 192, 0) 70%);
  pointer-events: none;
  animation: floatGlow 8s ease-in-out infinite;
}

.hero-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;

  @media (min-width: 980px) {
    grid-template-columns: 1.35fr 0.9fr;
    align-items: start;
  }
}

.eyebrow {
  margin: 0 0 10px;
  color: #d7cdd0;
  letter-spacing: 0.12em;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0 0 12px;
  color: #fff;
  font-family: 'Cinzel', serif;
  font-size: clamp(1.8rem, 4vw, 2.9rem);
  letter-spacing: 0.02em;
}

.hero p {
  margin: 0;
  color: #e9dfe1;
  line-height: 1.6;
  max-width: 75ch;
}

.hero-points {
  margin-top: 18px;
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;

  @media (min-width: 860px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.point {
  display: grid;
  gap: 6px;
  color: #efe4e6;
  font-weight: 400;
  line-height: 1.45;
  background: rgba(18, 8, 8, 0.3);
  border: 1px solid rgba(185, 175, 176, 0.26);
  border-radius: 12px;
  padding: 12px;
}

.point strong {
  color: #fff;
  font-size: 0.88rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hero-side {
  background: rgba(25, 10, 10, 0.34);
  border: 1px solid rgba(185, 175, 176, 0.28);
  border-radius: 14px;
  padding: 16px 18px;
  backdrop-filter: blur(2px);
}

.hero-side h2 {
  margin: 0 0 10px;
  color: #ffffff;
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
}

.hero-side ol {
  margin: 0;
  padding-left: 18px;
  color: #e7dddf;
  display: grid;
  gap: 8px;
}

.form-shell {
  padding: 30px;
}

.reporting-form {
  display: grid;
  gap: 18px;
}

.form-header h2 {
  margin: 0;
  font-family: 'Cinzel', serif;
  color: #ffffff;
  font-size: clamp(1.25rem, 2vw, 1.55rem);
}

.form-header p {
  margin: 6px 0 0;
  color: #dfd2d4;
}

.form-group-box {
  margin: 0;
  border: 1px solid rgba(185, 175, 176, 0.28);
  border-radius: 14px;
  padding: 14px;
  background: rgba(18, 8, 8, 0.28);
}

.form-group-box legend {
  padding: 0 8px;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d8c9cb;
}

.row {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  @media (min-width: 840px) {
    grid-template-columns: 1fr 1fr;
  }
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  color: #f6f1f2;
  font-size: 0.92rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.field input,
.field select,
.field textarea {
  border: 1px solid rgba(185, 175, 176, 0.42);
  background: rgba(26, 11, 11, 0.62);
  color: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.98rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: #cfbfc1;
  box-shadow: 0 0 0 3px rgba(185, 175, 176, 0.2);
}

.field input::placeholder,
.field textarea::placeholder {
  color: #c9bfc0;
}

.field textarea {
  resize: vertical;
}

.consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #f6ecee;
  font-size: 0.92rem;
  line-height: 1.45;
  background: rgba(26, 11, 11, 0.35);
  border: 1px solid rgba(185, 175, 176, 0.24);
  border-radius: 10px;
  padding: 11px 12px;
}

.consent input {
  margin-top: 4px;
}

.submit {
  width: fit-content;
  min-width: 210px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.feedback {
  margin: 0;
  font-weight: 700;
  padding: 10px 12px;
  border-radius: 8px;
}

.feedback.success {
  color: #c4ffd8;
  background: rgba(30, 77, 47, 0.35);
  border: 1px solid rgba(117, 214, 154, 0.35);
}

.feedback.error {
  color: #ffd4d4;
  background: rgba(102, 36, 36, 0.4);
  border: 1px solid rgba(255, 165, 165, 0.32);
}

@media (max-width: 640px) {
  .reporting-page {
    padding: 38px 14px;
    background: none;
  }

  .hero,
  .form-shell {
    padding: 20px;
  }

  .form-group-box {
    padding: 10px;
  }
}

@keyframes floatGlow {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
