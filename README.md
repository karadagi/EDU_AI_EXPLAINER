<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# EDU-AI: Two-Stage Pix2Pix Workflow for Classroom Layout Synthesis

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/karadagi/EDU_AI_EXPLAINER)

Implementing a generative framework for automated classroom layout synthesis through a two-stage Pix2Pix (cGAN) architecture, facilitating transitions from footprint boundaries to internal furnishings.

**Live Model Interface:** [karadagi.github.io/EDU_AI_EXPLAINER](https://karadagi.github.io/EDU_AI_EXPLAINER/)

## Technical Setup (Local)

**Requirement:** Node.js

1. **Install:** `npm install`
2. **Environment:** Configure `GEMINI_API_KEY` in [.env.local](.env.local)
3. **Execution:** `npm run dev`

## Academic Reference

The model logic and dataset configuration are documented in the following research publication:

**Citation:**
> Karadag, I. (2023). EDU-AI: a twofold machine learning model to support classroom layout generation. *International Journal of Building Pathology and Adaptation*. [https://doi.org/10.1108/IJBPA-09-2023-0130](https://doi.org/10.1108/IJBPA-09-2023-0130)

### Abstract
This study introduces **EDU-AI**, a machine learning model designed to automate classroom layout generation using a **Pix2Pix** (conditional GAN) architecture. The framework addresses early-phase educational design by processing two coupled datasets extracted from the Ministry of National Education of Turkey's project database. 

The two-step synthesis enables continuous zoning generation followed by furniture placement within the generated zones. Model performance is validated using the **Structural Similarity Index (SSIM)**, demonstrating high fidelity in producing architectural layouts from arbitrary classroom boundaries.
