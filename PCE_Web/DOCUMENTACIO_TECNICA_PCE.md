# Documentació de Disseny Tècnic: Projecte PCE

Aquest document detalla el disseny de la base de dades, les tecnologies triades i l'arquitectura del sistema de votació segur per a **Protección Civil Española (PCE)**.

## A) Disseny a Alt Nivell de la Base de Dades

### 1. Motor de Base de Dades: **MongoDB**
*   **Per què MongoDB?** Hem escollit una base de dades NoSQL per la seva flexibilitat en el maneig de documents JSON, ideal per a un sistema amb dades heterogènies com el registre d'usuaris amb imatges, propostes de votació i dades d'afiliació.
*   **Ubicació:** La base de dades estarà allotjada a **MongoDB Atlas (Cloud)**, garantint escalabilitat, seguretat en els accessos i disponibilitat 24/7 sense dependències de servidors locals.

### 2. Estructura de les Dades (Col·leccions)

*   **`Usuaris` (Ciutadans i Treballadors):**
    *   `DNI`: Identificador únic (clau primària).
    *   `Nom_Complet`: String.
    *   `Rol`: Enum ['Treballador', 'Ciutadà'].
    *   `Estatus_Verificacio`: Enum ['Pendent', 'Verificat', 'Rebutjat'].
    *   `Verificacio_ID`: Objecte amb URLs a la foto del DNI i el selfie de seguretat.
    *   `Hash_Password`: Per a l'accés segur.

*   **`Votacions` (Les Enquestes):**
    *   `ID_Votacio`: Identificador únic.
    *   `Títol` i `Descripció`.
    *   `Tipus`: Enum ['Interna', 'Pública'].
    *   `Opcions`: Array d'objectes { id, text }.
    *   `Data_Inici` i `Data_Fi`.

*   **`Vots` (Registre de participació):**
    *   `ID_Usuari`: Referència a l'usuari (per evitar duplicats).
    *   `ID_Votacio`: Referència a la votació.
    *   `Timestamp`: Data i hora del vot.
    *   *Nota: Per garantir l'anonimat, el sentit del vot s'emmagatzema de forma dissociada del DNI una vegada verificada la participació.*

### 3. Interacció amb la Base de Dades
*   **Registre i Verificació:** En el moment del registre, l'aplicació puja les imatges al magatzem de fitxers i crea el document a la col·lecció `Usuaris` amb estatus 'Pendent'.
*   **Procés de Votació:** El sistema primer consulta si el DNI ja ha votat en aquella `ID_Votacio`. Si no, registra la participació i actualitza els comptadors.
*   **Actualitat i Programa:** Lectura constant de dades per mostrar les notícies i propostes electorals en temps real.

---

## B) Llenguatges de Programació i Entorns

### 1. Frontend (Client)
*   **Tecnologies:** `HTML5`, `CSS3 (Vanilla)`, `JavaScript (ES6+)`.
*   **Justificació:** Prioritzem el rendiment i el disseny visual premium. L'ús de CSS pur ens permet crear l'estètica "Glassmorphism" i les animacions cinematogràfiques que el projecte requereix sense les limitacions de frameworks pretallats. Per a la captura del selfie i el DNI, farem servir l'API `MediaDevices` del navegador.

### 2. Backend (Servidor)
*   **Tecnologia:** `Node.js` amb el framework `Express`.
*   **Justificació:** Node.js és ideal per a aplicacions amb moltes interaccions i entrada/sortida de dades (com pujada d'imatges i votacions en temps real). Ens permet utilitzar JavaScript a tot el stack, accelerant el desenvolupament.
*   **Seguretat:** Implementarem `JWT (JSON Web Tokens)` per a les sessions i `BCrypt` per al tractament de contrasenyes.

### 3. Emmagatzematge d'Imatges
*   **Tecnologia:** **Cloudinary** o **AWS S3**.
*   **Justificació:** No s'han de guardar imatges pesades directament a MongoDB; la base de dades només guardarà la URL de la imatge verificada per optimitzar la velocitat de càrrega.

---

## C) Seguretat Anti-Frau (Votació Única)

Per assegurar que "una persona = un vot", el sistema seguirà aquest flux:
1. **Captura Biomètrica:** L'usuari ha de pujar una foto nítida del DNI per ambdues cares i un selfie en temps real.
2. **Validació d'Identitat:** Sistema creuat que comprova que el DNI no estigui registrat prèviament per a una altra votació.
3. **Bloqueig de Duplicats:** La lògica de la base de dades (Unique Index a `ID_Usuari` + `ID_Votacio`) impedeix tècnicament qualsevol intent de re-votació.
