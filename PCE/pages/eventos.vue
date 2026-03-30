<template>
  <main class="events-page container">
    <section class="events-hero card">
      <p class="eyebrow">{{ lt('Agenda pública', 'Agenda pública', 'Agenda publikoa', 'Axenda pública') }}</p>
      <h1 class="page-title">{{ t('nav.events') }}</h1>
      <p class="intro">
        {{ lt('Aquí publicamos meetings, actos y encuentros ciudadanos. Los próximos eventos aparecen destacados y los ya realizados se muestran en un estilo más tenue.', 'Aquí publiquem meetings, actes i trobades ciutadanes. Els propers esdeveniments apareixen destacats i els ja realitzats es mostren en un estil més tènue.', 'Hemen argitaratzen ditugu meetingak, ekitaldiak eta herritarren topaketak. Hurrengo ekitaldiak nabarmenduta agertzen dira eta egindakoak tonu leunagoan.', 'Aquí publicamos meetings, actos e encontros cidadáns. Os próximos eventos aparecen destacados e os xa realizados móstranse cun estilo máis tenue.') }}
      </p>
    </section>

    <section class="card">
      <div class="section-head">
        <h2>{{ lt('Próximos meetings', 'Pròxims meetings', 'Hurrengo meetingak', 'Próximos meetings') }}</h2>
      </div>
      <div class="events-grid">
        <article v-for="item in upcomingEvents" :key="item.id" class="event-card upcoming">
          <div class="event-date">{{ item.date }}</div>
          <h3>{{ item.title }}</h3>
          <p class="meta">{{ item.city }} · {{ item.time }}</p>
          <p class="location">{{ lt('Ubicación', 'Ubicació', 'Kokapena', 'Localización') }}: {{ item.location }}</p>
          <p>{{ item.description }}</p>
          <span class="tag">{{ lt('Abierto', 'Obert', 'Irekita', 'Aberto') }}</span>
        </article>
      </div>
    </section>

    <section class="card">
      <div class="section-head">
        <h2>{{ lt('Eventos realizados', 'Esdeveniments realitzats', 'Egindako ekitaldiak', 'Eventos realizados') }}</h2>
      </div>
      <div class="events-grid">
        <article v-for="item in pastEvents" :key="item.id" class="event-card past">
          <div class="event-date">{{ item.date }}</div>
          <h3>{{ item.title }}</h3>
          <p class="meta">{{ item.city }} · {{ item.time }}</p>
          <p class="location">{{ lt('Ubicación', 'Ubicació', 'Kokapena', 'Localización') }}: {{ item.location }}</p>
          <p>{{ item.description }}</p>
          <span class="tag done">{{ lt('Realizado', 'Realitzat', 'Eginda', 'Realizado') }}</span>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
const { t, locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

const upcomingEvents = computed(() => [
  {
    id: 'ev-01',
    date: '12 Abr 2026',
    title: lt('Meeting de seguridad ciudadana', 'Meeting de seguretat ciutadana', 'Herritarren segurtasun meetinga', 'Meeting de seguridade cidadá'),
    city: lt('Madrid', 'Madrid', 'Madril', 'Madrid'),
    location: lt('Centro Cultural Lavapiés, C. de Valencia 28', 'Centre Cultural Lavapiés, C. de València 28', 'Lavapiés Kultur Gunea, Valentzia kalea 28', 'Centro Cultural Lavapiés, Rúa de Valencia 28'),
    time: '18:30',
    description: lt('Encuentro abierto para presentar propuestas de prevención y respuesta en barrios.', 'Trobada oberta per presentar propostes de prevenció i resposta als barris.', 'Auzoetan prebentzio eta erantzun proposamenak aurkezteko topaketa irekia.', 'Encontro aberto para presentar propostas de prevención e resposta nos barrios.')
  },
  {
    id: 'ev-02',
    date: '20 Abr 2026',
    title: lt('Asamblea territorial', 'Assemblea territorial', 'Lurralde asanblada', 'Asemblea territorial'),
    city: lt('Valencia', 'València', 'Valentzia', 'Valencia'),
    location: lt('Ateneo Marítimo, Pl. del Tribunal de las Aguas 2', 'Ateneu Marítim, Pl. del Tribunal de les Aigües 2', 'Itsas Ateneoa, Aguas Auzitegiaren plaza 2', 'Ateneo Marítimo, Praza do Tribunal das Augas 2'),
    time: '19:00',
    description: lt('Reunión de coordinación con voluntariado y equipos locales.', 'Reunió de coordinació amb voluntariat i equips locals.', 'Boluntarioekin eta tokiko taldeekin koordinazio-bilera.', 'Reunión de coordinación con voluntariado e equipos locais.')
  },
  {
    id: 'ev-03',
    date: '04 May 2026',
    title: lt('Foro de propuestas ciudadanas', 'Fòrum de propostes ciutadanes', 'Herritarren proposamen foroa', 'Foro de propostas cidadás'),
    city: lt('Barcelona', 'Barcelona', 'Bartzelona', 'Barcelona'),
    location: lt('Casal Cívico Sant Martí, C. de Selva de Mar 215', 'Casal Cívic Sant Martí, C. de Selva de Mar 215', 'Sant Martí Gizarte Etxea, Selva de Mar kalea 215', 'Casal Cívico Sant Martí, Rúa de Selva de Mar 215'),
    time: '17:45',
    description: lt('Espacio participativo para recoger propuestas del programa local.', 'Espai participatiu per recollir propostes del programa local.', 'Tokiko programarako proposamenak jasotzeko parte-hartze gunea.', 'Espazo participativo para recoller propostas do programa local.')
  }
])

const pastEvents = computed(() => [
  {
    id: 'ev-p1',
    date: '03 Mar 2026',
    title: lt('Encuentro de coordinación municipal', 'Trobada de coordinació municipal', 'Udal koordinazio topaketa', 'Encontro de coordinación municipal'),
    city: lt('Sevilla', 'Sevilla', 'Sevilla', 'Sevilla'),
    location: lt('Casa de las Sirenas, Alameda de Hércules 30', 'Casa de las Sirenas, Alameda de Hèrcules 30', 'Sirenen Etxea, Hércules pasealekua 30', 'Casa de las Sirenas, Alameda de Hércules 30'),
    time: '18:00',
    description: lt('Sesión cerrada con responsables territoriales para planificación trimestral.', 'Sessió tancada amb responsables territorials per a planificació trimestral.', 'Lurralde arduradunekin saio itxia hiruhilekoko plangintzarako.', 'Sesión pechada con responsables territoriais para planificación trimestral.')
  },
  {
    id: 'ev-p2',
    date: '17 Feb 2026',
    title: lt('Mesa abierta de participación juvenil', 'Taula oberta de participació juvenil', 'Gazteen parte-hartze mahai irekia', 'Mesa aberta de participación xuvenil'),
    city: lt('Bilbao', 'Bilbao', 'Bilbo', 'Bilbao'),
    location: lt('Centro Cívico La Bolsa, C. de Pelota 10', 'Centre Cívic La Bolsa, C. de Pilota 10', 'La Bolsa Gizarte Zentroa, Pelota kalea 10', 'Centro Cívico La Bolsa, Rúa da Pelota 10'),
    time: '19:15',
    description: lt('Debate y recogida de ideas para acciones de voluntariado juvenil.', 'Debat i recollida d\'idees per accions de voluntariat juvenil.', 'Gazte boluntariotzarako ekintzetarako eztabaida eta ideien bilketa.', 'Debate e recollida de ideas para accións de voluntariado xuvenil.')
  }
])

useHead(() => ({
  title: `${t('nav.events')} - PCE`,
  meta: [
    {
      name: 'description',
      content: 'Agenda de eventos, meetings y encuentros de PCE.'
    }
  ]
}))
</script>

<style scoped>
.events-page {
  padding: 48px 20px 70px;
  display: grid;
  gap: 24px;
}

.card {
  background: rgba(94, 44, 44, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 24px;
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

.intro {
  color: #eadfe0;
  max-width: 920px;
  line-height: 1.7;
  margin: 12px 0 0;
}

.section-head h2 {
  margin: 0 0 16px;
  color: #fff;
  font-family: 'Cinzel', serif;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.event-card {
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.event-card.upcoming {
  background: rgba(0, 0, 0, 0.18);
}

.event-card.past {
  background: rgba(0, 0, 0, 0.12);
  opacity: 0.58;
  filter: saturate(0.6);
}

.event-date {
  color: #f5d8b6;
  font-weight: 700;
  font-size: 0.86rem;
}

.event-card h3 {
  margin: 6px 0;
  color: #fff;
  font-size: 1.08rem;
}

.meta {
  margin: 0 0 8px;
  color: #d9c7c8;
  font-size: 0.9rem;
}

.location {
  margin: 0 0 10px;
  color: #f2d8c2;
  font-size: 0.88rem;
  line-height: 1.35;
}

.event-card p {
  color: #e8d6d7;
  line-height: 1.5;
}

.tag {
  display: inline-flex;
  margin-top: 10px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.74rem;
  background: rgba(190, 255, 211, 0.2);
  color: #d8ffd8;
}

.tag.done {
  background: rgba(255, 255, 255, 0.12);
  color: #efe0e0;
}
</style>
