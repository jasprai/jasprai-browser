<h1 align="center">
    <img src="assets/logo-top.png" height="150" width="500" alt="banner" /><br>
</h1>


<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jasprai)
[![Twitter](https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/jaspraibrowser)

</div>

## ðŸŒ JasprAi

JasprAi es una herramienta de automatizaciÃ³n web con IA que se ejecuta en tu navegador. Es una alternativa gratuita a OpenAI Operator, con opciones flexibles de modelos de lenguaje (LLM) y un sistema multiagente.



â¤ï¸ Â¿Te encanta JasprAi? Â¡Danos una estrella ðŸŒŸ y ayÃºdanos a correr la voz!

<div align="center">
<img src="https://github.com/user-attachments/assets/112c4385-7b03-4b81-a352-4f348093351b" width="600" alt="JasprAi Demo GIF" />
<p><em>El sistema multiagente de JasprAi analizando HuggingFace en tiempo real, con el Planner autocorrigiÃ©ndose de forma inteligente al enfrentar obstÃ¡culos e instruyendo dinÃ¡micamente al Navigator para ajustar su enfoque, todo ejecutÃ¡ndose localmente en tu navegador.</em></p>
</div>

## ðŸ”¥ Â¿Por quÃ© usar JasprAi?

Â¿Buscas un potente agente de navegador con IA sin el precio de $200/mes de OpenAI Operator? **JasprAi**, como extensiÃ³n de Chrome, ofrece capacidades avanzadas de automatizaciÃ³n web mientras tÃº tienes el control total.

- **100% Gratis** - Sin suscripciones ni costos ocultos. Solo instala y usa tus propias claves de API, pagando Ãºnicamente por lo que tÃº consumas.
- **Enfoque En Privacidad** - Todo se ejecuta en tu navegador local. Tus credenciales permanecen contigo y nunca se comparten con ningÃºn servicio en la nube.
- **Opciones Flexibles de LLM** - ConÃ©ctate con tu proveedor de LLM preferido con la libertad de elegir diferentes modelos para diferentes agentes.
- **Totalmente Open Source** - Transparencia total en cÃ³mo se automatiza tu navegador. Sin procesos ocultos ni cajas negras.

> **Nota:** Actualmente ofrecemos soporte para OpenAI, Anthropic, Gemini, Ollama y proveedores personalizados compatibles con OpenAI, prÃ³ximamente se ofrecerÃ¡ soporte a mÃ¡s proveedores.


## ðŸ“Š Funciones Clave

- **Sistema Multiagente**: Agentes de IA especializados colaboran para realizar flujos de trabajo de navegador complejos
- **Panel Lateral Interactivo**: Interfaz de chat intuitiva con actualizaciones de estado en tiempo real
- **AutomatizaciÃ³n de Tareas**: Automatiza sin esfuerzo tareas repetitivas en distintos sitios web
- **Preguntas de Seguimiento**: Haz preguntas de seguimiento sobre tareas completadas
- **Historial de Conversaciones**: Accede y gestiona fÃ¡cilmente el historial de interacciones con tu agente de IA
- **Soporte de MÃºltiples LLM**: ConÃ©ctate a tus proveedores de LLM preferidos y asigna distintos modelos a diferentes agentes


## ðŸš€ Inicio RÃ¡pido

1. **Instala desde Chrome Web Store** (VersiÃ³n Estable):
   * Haz clic en el botÃ³n "AÃ±adir a Chrome"
   * Confirma la instalaciÃ³n cuando se te solicite

> **Nota Importante**: Para acceder a las funciones mÃ¡s recientes, instala desde ["Instalar Ãšltima VersiÃ³n Manualmente"](#-instalar-Ãºltima-versiÃ³n-manualmente) abajo, ya que la versiÃ³n de Chrome Web Store puede tardar en actualizarse debido al proceso de revisiÃ³n.

2. **Configurar Modelos de Agente**:
   * Haz clic en el icono de JasprAi ubicado en la barra de herramientas para abrir el panel lateral
   * Haz clic en el icono de `Settings` (arriba a la derecha)
   * Agrega tus claves de API del LLM
   * Elige quÃ© modelo usar para cada agente (Navigator, Planner)

## ðŸ”§ Instalar Ãšltima VersiÃ³n Manualmente

Para obtener la versiÃ³n mÃ¡s reciente con todas las funciones nuevas:

1. **Descargar**
    * Descarga el archivo `jasprai.zip` mÃ¡s reciente desde la [pÃ¡gina de lanzamientos](https://github.com/jasprai/jasprai-browser/releases) oficial en GitHub.

2. **Instalar**:
    * Extrae el archivo `jasprai.zip`.
    * Abre `chrome://extensions/` en Chrome
    * Habilita el `Modo de desarrollador` (arriba a la derecha)
    * Haz clic en `Cargar extensiÃ³n sin empaquetar` (arriba a la izquierda)
    * Selecciona la carpeta descomprimida de `jasprai`.

3. **Configurar Modelos de Agente**
    * Haz clic en el icono de JasprAi en la barra de herramientas para abrir el panel lateral
    * Haz clic en el icono de `Settings` (arriba a la derecha).
    * Agrega tus claves de API del LLM
    * Elige quÃ© modelo usar para cada agente (Navigator, Planner)

4. **Actualizar**:
    * Descarga el archivo `jasprai.zip` mÃ¡s reciente desde la pÃ¡gina de lanzamientos.
    * Extrae y reemplaza los archivos existentes de JasprAi con los nuevos.
    * Ve a `chrome://extensions/` en Chrome y haz clic en el icono de actualizar en la tarjeta de JasprAi.

## ðŸ› ï¸ Compilar desde el CÃ³digo Fuente

Si prefieres compilar JasprAi por ti mismo, sigue estos pasos:

1. **Requisitos Previos**:
   * [Node.js](https://nodejs.org/) (v22.12.0 o superior)
   * [pnpm](https://pnpm.io/installation) (v9.15.1 o superior)

2. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/jasprai/jasprai-browser.git
   cd jasprai-browser
   ```

3. **Instalar Dependencias**:
   ```bash
   pnpm install
   ```

4. **Compilar la ExtensiÃ³n**:
   ```bash
   pnpm build
   ```

5. **Cargar la ExtensiÃ³n**:
   * La extensiÃ³n compilada estarÃ¡ en la carpeta `dist`
   * Sigue los pasos de instalaciÃ³n de la secciÃ³n Instalar Ãšltima VersiÃ³n Manualmente para cargar la extensiÃ³n a tu navegador

6. **Modo Desarrollador** (opcional):
   ```bash
   pnpm dev
   ```

## ðŸ¤– Eligiendo tus Modelos

JasprAi te permite configurar distintos modelos LLM para cada agente para equilibrar costo y rendimiento. AquÃ­ estÃ¡n las configuraciones recomendadas:

### Mejor Rendimiento
- **Planner**: Claude Sonnet 4
  - Mejores capacidades de razonamiento y planificaciÃ³n
- **Navigator**: Claude Haiku 3.5
  - Eficiente para tareas de navegaciÃ³n web
  - Buen equilibrio entre rendimiento y costo

### ConfiguraciÃ³n EconÃ³mica
- **Planner**: Claude Haiku or GPT-4o
  - Rendimiento razonable a menor costo
  - Puede requerir mÃ¡s iteraciones para tareas complejas
- **Navigator**: Gemini 2.5 Flash or GPT-4o-mini
  - Ligero y econÃ³mico
  - Adecuado para tareas bÃ¡sicas de navegaciÃ³n

### Modelos Locales
- **Opciones de ConfiguraciÃ³n**:
  - Usa Ollama u otros proveedores compatibles con OpenAI para ejecutar modelos localmente
  - Sin costos de API y con privacidad total, sin datos que salgan de tu mÃ¡quina

- **Modelos Recomendados**:
  - **Qwen3-30B-A3B-Instruct-2507**
  - **Falcon3 10B**
  - **Qwen 2.5 Coder 14B**
  - **Mistral Small 24B**
  - [Ãšltimos resultados de pruebas de la comunidad](https://gist.github.com/maximus2600/75d60bf3df62986e2254d5166e2524cb)

- **IngenierÃ­a de Prompts**:
  - Los modelos locales requieren prompts mÃ¡s especÃ­ficos y claros
  - Evita comandos ambiguos o de alto nivel
  - Divide las tareas complejas en pasos claros y detallados
  - Proporciona contexto y restricciones especÃ­ficas

> **Nota**: La configuraciÃ³n econÃ³mica puede producir resultados menos estables y requerir mÃ¡s iteraciones para tareas complejas.


## ðŸ’¡ Velo en AcciÃ³n

AquÃ­ tienes algunas tareas poderosas que puedes realizar con solo una frase:

1. **Resumen de Noticias**:
   > "Ve a TechCrunch y extrae los 10 principales titulares de las Ãºltimas 24 horas"

2. **InvestigaciÃ³n en GitHub**:
   > "Busca los repositorios de Python en tendencia con mÃ¡s estrellas"

3. **InvestigaciÃ³n de Compras**:
   > "Encuentra una bocina Bluetooth portÃ¡til en Amazon con diseÃ±o resistente al agua, a menos de $50. Debe tener una duraciÃ³n mÃ­nima de baterÃ­a de 10 horas"

## ðŸ› ï¸ Hoja de Ruta

Estamos desarrollando activamente JasprAi con caracterÃ­sticas emocionantes en el horizonte. Â¡Te invitamos a unirte!

Consulta nuestra hoja de ruta detallada y las caracterÃ­sticas prÃ³ximas en nuestras [Discusiones de GitHub](https://github.com/jasprai/jasprai-browser/discussions/85). 

## ðŸ¤ Contribuciones

**Necesitamos tu ayuda para hacer que JasprAi sea aÃºn mejor!**  Se aceptan contribuciones de todo tipo:

*  **Comparte Prompts y Casos de Uso** 
   * Comparte cÃ³mo estÃ¡s usando JasprAi. AyÃºdanos a construir una biblioteca de prompts Ãºtiles y casos de uso reales.
*  **Proporciona RetroalimentaciÃ³n** 
* **Contribuye con CÃ³digo**
   * Consulta nuestro [CONTRIBUTING.md](CONTRIBUTING.md) para conocer las pautas sobre cÃ³mo contribuir con cÃ³digo al proyecto.
   * EnvÃ­a pull requests para correcciÃ³n de errores, funciones, o mejoras en la documentaciÃ³n.


Creemos en el poder del cÃ³digo abierto y la colaboraciÃ³n comunitaria. Â¡Ãšnete a nosotros para construir el futuro de la automatizaciÃ³n web!


## ðŸ”’ Seguridad

Si descubres una vulnerabilidad de seguridad, por favor **NO** la divulgues pÃºblicamente a travÃ©s de issues, pull requests, o discusiones.

En su lugar, por favor crea un [GitHub Security Advisory](https://github.com/jasprai/jasprai-browser/security/advisories/new) para reportar la vulnerabilidad de forma responsable. Esto nos permite abordar el problema antes de que se divulgue pÃºblicamente.

Â¡Agradecemos tu ayuda para mantener JasprAi y sus usuarios seguros!

## ðŸ’¬ Comunidad

Ãšnete a nuestra creciente comunidad de desarrolladores y usuarios:

- [Twitter](https://x.com/jaspraibrowser) - SÃ­guenos para actualizaciones y anuncios
- [GitHub Discussions](https://github.com/jasprai/jasprai-browser/discussions) - Comparte ideas y realiza preguntas

## ðŸ‘ Agradecimientos

JasprAi se construye sobre otros increÃ­bles proyectos de cÃ³digo abierto:

- [Browser Use](https://github.com/browser-use/browser-use)
- [Puppeteer](https://github.com/EmergenceAI/Agent-E)
- [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
- [LangChain](https://github.com/langchain-ai/langchainjs)

Â¡Un enorme agradecimiento a sus creadores y colaboradores!


## ðŸ“„ Licencia

Este proyecto estÃ¡ bajo la Licencia Apache 2.0 - consulta el archivo [LICENSE](LICENSE) para mÃ¡s detalles.

Hecho con â¤ï¸ por el equipo de JasprAi.

