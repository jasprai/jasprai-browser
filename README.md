<h1 align="center">
    <img src="assets/logo-top.png" height="150" width="500" alt="banner" /><br>
</h1>


<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jasprai)
[![Twitter](https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/jaspraibrowser)

</div>

## ðŸŒ JasprAi

JasprAi is an open-source AI web automation tool that runs in your browser. A free alternative to OpenAI Operator with flexible LLM options and multi-agent system.





<div align="center">
<img src="https://github.com/user-attachments/assets/112c4385-7b03-4b81-a352-4f348093351b" width="600" alt="JasprAi Demo GIF" />
<p><em>JasprAi's multi-agent system analyzing HuggingFace in real-time, with the Planner intelligently self-correcting when encountering obstacles and dynamically instructing the Navigator to adjust its approachâ€”all running locally in your browser.</em></p>
</div>

## ðŸ”¥Why JasprAi?

Looking for a powerful AI browser agent without the $200/month price tag of OpenAI Operator? **JasprAi** , as a chrome extension, delivers premium web automation capabilities while keeping you in complete control:

- **100% Free** - No subscription fees or hidden costs. Just install and use your own API keys, and you only pay what you use with your own API keys.
- **Privacy-Focused** - Everything runs in your local browser. Your credentials stay with you, never shared with any cloud service.
- **Flexible LLM Options** - Connect to your preferred LLM providers with the freedom to choose different models for different agents.
- **Fully Open Source** - Complete transparency in how your browser is automated. No black boxes or hidden processes.

> **Note:** We currently support OpenAI, Anthropic, Gemini, Ollama, Groq, Cerebras, Llama and custom OpenAI-Compatible providers, more providers will be supported.


## ðŸ“Š Key Features

- **Multi-agent System**: Specialized AI agents collaborate to accomplish complex web workflows
- **Interactive Side Panel**: Intuitive chat interface with real-time status updates
- **Task Automation**: Seamlessly automate repetitive web automation tasks across websites
- **Follow-up Questions**: Ask contextual follow-up questions about completed tasks
- **Conversation History**: Easily access and manage your AI agent interaction history
- **Multiple LLM Support**: Connect your preferred LLM providers and assign different models to different agents


## ðŸŒ Browser Support

**Officially Supported:**
- **Chrome** - Full support with all features
- **Edge** - Full support with all features

**Not Supported:**
- Firefox, Safari, and other Chromium variants (Opera, Arc, etc.)

> **Note**: While JasprAi may function on other Chromium-based browsers, we recommend using Chrome or Edge for the best experience and guaranteed compatibility.


## ðŸš€ Quick Start

1. **Install from Chrome Web Store** (Stable Version):
   * Click "Add to Chrome" button
   * Confirm the installation when prompted

> **Important Note**: For latest features, install from ["Manually Install Latest Version"](#-manually-install-latest-version) below, as Chrome Web Store version may be delayed due to review process.

2. **Configure Agent Models**:
   * Click the JasprAi icon in your toolbar to open the sidebar
   * Click the `Settings` icon (top right)
   * Add your LLM API keys
   * Choose which model to use for different agents (Navigator, Planner)

## ðŸ”§ Manually Install Latest Version

To get the most recent version with all the latest features:

1. **Download**
    * Download the latest `jasprai.zip` file from the official Github [release page](https://github.com/jasprai/jasprai-browser/releases).

2. **Install**:
    * Unzip `jasprai.zip`.
    * Open `chrome://extensions/` in Chrome
    * Enable `Developer mode` (top right)
    * Click `Load unpacked` (top left)
    * Select the unzipped `jasprai` folder.

3. **Configure Agent Models**
    * Click the JasprAi icon in your toolbar to open the sidebar
    * Click the `Settings` icon (top right).
    * Add your LLM API keys.
    * Choose which model to use for different agents (Navigator, Planner)

4. **Upgrading**:
    * Download the latest `jasprai.zip` file from the release page.
    * Unzip and replace your existing JasprAi files with the new ones.
    * Go to `chrome://extensions/` in Chrome and click the refresh icon on the JasprAi card.

## ðŸ› ï¸ Build from Source

If you prefer to build JasprAi yourself, follow these steps:

1. **Prerequisites**:
   * [Node.js](https://nodejs.org/) (v22.12.0 or higher)
   * [pnpm](https://pnpm.io/installation) (v9.15.1 or higher)

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/jasprai/jasprai-browser.git
   cd jasprai-browser
   ```

3. **Install Dependencies**:
   ```bash
   pnpm install
   ```

4. **Build the Extension**:
   ```bash
   pnpm build
   ```

5. **Load the Extension**:
   * The built extension will be in the `dist` directory
   * Follow the installation steps from the Manually Install section to load the extension into your browser

6. **Development Mode** (optional):
   ```bash
   pnpm dev
   ```

## ðŸ¤– Choosing Your Models

JasprAi allows you to configure different LLM models for each agent to balance performance and cost. Here are recommended configurations:

### Better Performance
- **Planner**: Claude Sonnet 4
  - Better reasoning and planning capabilities
- **Navigator**: Claude Haiku 3.5
  - Efficient for web navigation tasks
  - Good balance of performance and cost

### Cost-Effective Configuration
- **Planner**: Claude Haiku or GPT-4o
  - Reasonable performance at lower cost
  - May require more iterations for complex tasks
- **Navigator**: Gemini 2.5 Flash or GPT-4o-mini
  - Lightweight and cost-efficient
  - Suitable for basic navigation tasks

### Local Models
- **Setup Options**:
  - Use Ollama or other custom OpenAI-compatible providers to run models locally
  - Zero API costs and complete privacy with no data leaving your machine

- **Recommended Models**:
  - **Qwen3-30B-A3B-Instruct-2507**
  - **Falcon3 10B**
  - **Qwen 2.5 Coder 14B**
  - **Mistral Small 24B**
  - [Latest test results from community](https://gist.github.com/maximus2600/75d60bf3df62986e2254d5166e2524cb) 

- **Prompt Engineering**:
  - Local models require more specific and cleaner prompts
  - Avoid high-level, ambiguous commands
  - Break complex tasks into clear, detailed steps
  - Provide explicit context and constraints

> **Note**: The cost-effective configuration may produce less stable outputs and require more iterations for complex tasks.


## ðŸ’¡ See It In Action

Here are some powerful tasks you can accomplish with just a sentence:

1. **News Summary**:
   > "Go to TechCrunch and extract top 10 headlines from the last 24 hours"

2. **GitHub Research**:
   > "Look for the trending Python repositories on GitHub with most stars"

3. **Shopping Research**:
   > "Find a portable Bluetooth speaker on Amazon with a water-resistant design, under $50. It should have a minimum battery life of 10 hours"

## ðŸ› ï¸ Roadmap

We're actively developing JasprAi with exciting features on the horizon, welcome to join us! 

Check out our detailed roadmap and upcoming features in our [GitHub Discussions](https://github.com/jasprai/jasprai-browser/discussions/85). 

## ðŸ¤ Contributing

**We need your help to make JasprAi even better!**  Contributions of all kinds are welcome:

*  **Share Prompts & Use Cases** 
   * share how you're using JasprAi.  Help us build a library of useful prompts and real-world use cases.
*  **Provide Feedback** 
* **Contribute Code**
   * Check out our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute code to the project.
   * Submit pull requests for bug fixes, features, or documentation improvements.


We believe in the power of open source and community collaboration.  Join us in building the future of web automation!


## ðŸ”’ Security

If you discover a security vulnerability, please **DO NOT** disclose it publicly through issues, pull requests, or discussions.

Instead, please create a [GitHub Security Advisory](https://github.com/jasprai/jasprai-browser/security/advisories/new) to report the vulnerability responsibly. This allows us to address the issue before it's publicly disclosed.

We appreciate your help in keeping JasprAi and its users safe!

## ðŸ’¬ Community

Join our growing community of developers and users:

- [Twitter](https://x.com/jaspraibrowser) - Follow for updates and announcements
- [GitHub Discussions](https://github.com/jasprai/jasprai-browser/discussions) - Share ideas and ask questions

## ðŸ‘ Acknowledgments

JasprAi builds on top of other awesome open-source projects:

- [Browser Use](https://github.com/browser-use/browser-use)
- [Puppeteer](https://github.com/EmergenceAI/Agent-E)
- [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
- [LangChain](https://github.com/langchain-ai/langchainjs)

Huge thanks to their creators and contributors!

## ðŸ“„ License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

Made with â¤ï¸ by the JasprAi Team. 


## âš ï¸ DISCLAIMER ON DERIVATIVE PROJECTS

**We explicitly *DO NOT* endorse, support, or participate in any** projects involving cryptocurrencies, tokens, NFTs, or other blockchain-related applications **based on this codebase.**

**Any such derivative projects areÂ NOTÂ Affiliated with, or maintained by, or in any way connected to the official JasprAi project or its core team.**

**We assume NO LIABILITY for any losses, damages, or issues arising from the use of third-party derivative projects. Users interact with these projects at their own risk.**

**We reserve the right to publicly distance ourselves from any misuse or misleading use of our name, codebase, or brand.**

We encourage open-source innovation but urge our community to be discerning and cautious. Please ensure you understand the risks before using any software or service built upon our codebase by independent developers.


