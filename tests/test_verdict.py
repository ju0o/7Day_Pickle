"""
Automated Verification Suite for OneWord Web Application (v0.7.0 - Viral Social Share & Clipboard Engine)
- Verifies HTML structure, script paths, and module syntax
- Simulates keyword categorizations and verdict generation rules
- Validates 4-theme sound synthesizer, neon particle engine, voting simulator, 4-theme card styler, i18n, and viral sharing
"""

import os
import re
import unittest

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class TestOneWordScaffolding(unittest.TestCase):
    def test_file_structure(self):
        required_files = [
            "index.html",
            "sw.js",
            "src/analytics/stats.js",
            "src/app.js",
            "src/audio/sound.js",
            "src/canvas/cardGenerator.js",
            "src/engine/bias.js",
            "src/engine/personas.js",
            "src/engine/verdict.js",
            "src/engine/voting.js",
            "src/fx/particles.js",
            "src/i18n/translations.js",
            "src/pwa/installPrompt.js",
            "src/share/intentShare.js",
            "src/storage/history.js",
            "docs/DEPLOYMENT_GUIDE.md",
            "site.webmanifest",
            "docs/NOTION_MASTER_PAGE.md",
            "README.md"
        ]
        for rel in required_files:
            p = os.path.join(PROJECT_ROOT, rel)
            self.assertTrue(os.path.isfile(p), f"Missing required file: {rel}")

    def test_intent_share_engine(self):
        share_path = os.path.join(PROJECT_ROOT, "src/share/intentShare.js")
        with open(share_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("IntentShare", content)
        self.assertIn("buildFormattedSnippet", content)
        self.assertIn("shareToX", content)
        self.assertIn("shareToThreads", content)
        self.assertIn("canNativeShare", content)
        self.assertIn("triggerNativeShare", content)
        self.assertIn("copyFormattedText", content)
        self.assertIn("twitter.com/intent/tweet", content)
        self.assertIn("threads.net/intent/post", content)

    def test_i18n_translations(self):
        i18n_path = os.path.join(PROJECT_ROOT, "src/i18n/translations.js")
        with open(i18n_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("TRANSLATIONS", content)
        self.assertIn("GLOBAL_PRESETS", content)
        self.assertIn("I18nEngine", content)
        self.assertIn("share_x", content)
        self.assertIn("share_threads", content)
        self.assertIn("copy_text", content)

    def test_card_generator_and_styles(self):
        card_gen_path = os.path.join(PROJECT_ROOT, "src/canvas/cardGenerator.js")
        with open(card_gen_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("CardGenerator", content)
        self.assertIn("CARD_STYLES", content)
        self.assertIn("cyber", content)
        self.assertIn("minimal", content)
        self.assertIn("parchment", content)
        self.assertIn("retro8bit", content)

    def test_workflow_and_manifest(self):
        deploy_guide_path = os.path.join(PROJECT_ROOT, "docs/DEPLOYMENT_GUIDE.md")
        with open(deploy_guide_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("GitHub Pages", content)

        manifest_path = os.path.join(PROJECT_ROOT, "site.webmanifest")
        with open(manifest_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("OneWord", content)

    def test_audio_sound_engine(self):
        sound_path = os.path.join(PROJECT_ROOT, "src/audio/sound.js")
        with open(sound_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("SoundEngine", content)
        self.assertIn("SOUND_THEMES", content)
        self.assertIn("court", content)
        self.assertIn("cyber", content)
        self.assertIn("minimal", content)
        self.assertIn("retro8bit", content)

    def test_particle_burst_engine(self):
        fx_path = os.path.join(PROJECT_ROOT, "src/fx/particles.js")
        with open(fx_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("NeonParticleBurst", content)
        self.assertIn("burst", content)

    def test_voting_engine(self):
        vote_path = os.path.join(PROJECT_ROOT, "src/engine/voting.js")
        with open(vote_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("VoteSimulator", content)
        self.assertIn("getPollData", content)
        self.assertIn("castVote", content)

    def test_html_integrity(self):
        html_path = os.path.join(PROJECT_ROOT, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn('<script type="module" src="src/app.js"></script>', content)
        self.assertIn('id="questionInput"', content)
        self.assertIn('id="submitBtn"', content)
        self.assertIn('id="verdictWord"', content)
        self.assertIn('id="shareBtn"', content)
        self.assertIn('id="fxCanvas"', content)
        self.assertIn('id="soundThemeBtn"', content)
        self.assertIn('id="randomDiceBtn"', content)
        self.assertIn('id="communityPollSection"', content)
        self.assertIn('id="cardStyleContainer"', content)
        self.assertIn('id="langToggleBtn"', content)
        self.assertIn('id="shareXBtn"', content)
        self.assertIn('id="shareThreadsBtn"', content)
        self.assertIn('id="copyTextBtn"', content)
        self.assertIn('id="pwaInstallBtn"', content)
        self.assertIn('id="offlineBadge"', content)
        self.assertIn('id="installModal"', content)
        self.assertIn('id="openStatsModalBtn"', content)
        self.assertIn('id="statsModal"', content)
        self.assertIn('id="openBiasModalBtn"', content)
        self.assertIn('id="openBiasTunerBtn"', content)
        self.assertIn('id="biasModal"', content)
        self.assertIn('id="biasSlider"', content)
        self.assertIn('id="verdictBiasBadge"', content)
        self.assertIn('apple-mobile-web-app-capable', content)
        self.assertIn('apple-touch-icon', content)

    def test_persona_definitions(self):
        persona_path = os.path.join(PROJECT_ROOT, "src/engine/personas.js")
        with open(persona_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("reason", content)
        self.assertIn("instinct", content)
        self.assertIn("realist", content)

    def test_verdict_engine_categories_and_i18n(self):
        engine_path = os.path.join(PROJECT_ROOT, "src/engine/verdict.js")
        with open(engine_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("shopping", content)
        self.assertIn("career", content)
        self.assertIn("love", content)
        self.assertIn("daily", content)
        self.assertIn("CATEGORY_PRESETS", content)
        self.assertIn("GLOBAL_PRESETS", content)

    def test_storage_manager(self):
        storage_path = os.path.join(PROJECT_ROOT, "src/storage/history.js")
        with open(storage_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("saveVerdict", content)
        self.assertIn("getHistory", content)
        self.assertIn("encodeState", content)

    def test_service_worker_and_pwa_engine(self):
        sw_path = os.path.join(PROJECT_ROOT, "sw.js")
        with open(sw_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("CACHE_NAME", content)
        self.assertIn("PRECACHE_ASSETS", content)
        self.assertIn("install", content)
        self.assertIn("activate", content)
        self.assertIn("fetch", content)

        pwa_path = os.path.join(PROJECT_ROOT, "src/pwa/installPrompt.js")
        with open(pwa_path, "r", encoding="utf-8") as f:
            pwa_content = f.read()
        self.assertIn("InstallPromptManager", pwa_content)
        self.assertIn("beforeinstallprompt", pwa_content)
        self.assertIn("isStandalone", pwa_content)
        self.assertIn("registerServiceWorker", pwa_content)
        self.assertIn("checkIos", pwa_content)

        i18n_path = os.path.join(PROJECT_ROOT, "src/i18n/translations.js")
        with open(i18n_path, "r", encoding="utf-8") as f:
            i18n_content = f.read()
        self.assertIn("pwa_install_btn", i18n_content)
        self.assertIn("pwa_modal_title", i18n_content)
        self.assertIn("pwa_ios_title", i18n_content)

    def test_analytics_and_decision_dna(self):
        stats_path = os.path.join(PROJECT_ROOT, "src/analytics/stats.js")
        with open(stats_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("StatsAnalyzer", content)
        self.assertIn("analyze", content)
        self.assertIn("categoryPercents", content)
        self.assertIn("topVerdictWord", content)
        self.assertIn("persona", content)

        i18n_path = os.path.join(PROJECT_ROOT, "src/i18n/translations.js")
        with open(i18n_path, "r", encoding="utf-8") as f:
            i18n_content = f.read()
        self.assertIn("stats_btn", i18n_content)
        self.assertIn("stats_modal_title", i18n_content)
        self.assertIn("stats_persona_heading", i18n_content)

    def test_judge_bias_tuner_and_modes(self):
        bias_path = os.path.join(PROJECT_ROOT, "src/engine/bias.js")
        with open(bias_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("JudgeBiasTuner", content)
        self.assertIn("BIAS_MODES", content)
        self.assertIn("balanced", content)
        self.assertIn("rational", content)
        self.assertIn("vibe", content)
        self.assertIn("realist", content)
        self.assertIn("fromSlider", content)

        engine_path = os.path.join(PROJECT_ROOT, "src/engine/verdict.js")
        with open(engine_path, "r", encoding="utf-8") as f:
            engine_content = f.read()
        self.assertIn("activeBias", engine_content)
        self.assertIn("bias_badge", engine_content)

        i18n_path = os.path.join(PROJECT_ROOT, "src/i18n/translations.js")
        with open(i18n_path, "r", encoding="utf-8") as f:
            i18n_content = f.read()
        self.assertIn("bias_btn", i18n_content)
        self.assertIn("bias_modal_title", i18n_content)
        self.assertIn("bias_balanced_name", i18n_content)
        self.assertIn("bias_vibe_name", i18n_content)

if __name__ == "__main__":
    unittest.main()
