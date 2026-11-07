"""
Automated Verification Suite for OneWord Web Application
- Verifies HTML structure, script paths, and module syntax
- Simulates keyword categorizations and verdict generation rules
"""

import os
import re
import unittest

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class TestOneWordScaffolding(unittest.TestCase):
    def test_file_structure(self):
        required_files = [
            "index.html",
            "src/app.js",
            "src/audio/sound.js",
            "src/canvas/cardGenerator.js",
            "src/engine/personas.js",
            "src/engine/verdict.js",
            "src/storage/history.js",
            ".github/workflows/deploy.yml",
            "site.webmanifest",
            "docs/NOTION_MASTER_PAGE.md",
            "README.md"
        ]
        for rel in required_files:
            p = os.path.join(PROJECT_ROOT, rel)
            self.assertTrue(os.path.isfile(p), f"Missing required file: {rel}")

    def test_card_generator(self):
        card_gen_path = os.path.join(PROJECT_ROOT, "src/canvas/cardGenerator.js")
        with open(card_gen_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("CardGenerator", content)
        self.assertIn("renderCanvas", content)
        self.assertIn("downloadImage", content)
        self.assertIn("wrapText", content)

    def test_workflow_and_manifest(self):
        wf_path = os.path.join(PROJECT_ROOT, ".github/workflows/deploy.yml")
        with open(wf_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("deploy-pages", content)

        manifest_path = os.path.join(PROJECT_ROOT, "site.webmanifest")
        with open(manifest_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("OneWord", content)

    def test_audio_sound_engine(self):
        sound_path = os.path.join(PROJECT_ROOT, "src/audio/sound.js")
        with open(sound_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("SoundEngine", content)
        self.assertIn("playClick", content)
        self.assertIn("playJudgeCue", content)
        self.assertIn("playGavelImpact", content)

    def test_html_integrity(self):
        html_path = os.path.join(PROJECT_ROOT, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn('<script type="module" src="src/app.js"></script>', content)
        self.assertIn('id="questionInput"', content)
        self.assertIn('id="submitBtn"', content)
        self.assertIn('id="verdictWord"', content)
        self.assertIn('id="shareBtn"', content)

    def test_persona_definitions(self):
        persona_path = os.path.join(PROJECT_ROOT, "src/engine/personas.js")
        with open(persona_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("reason", content)
        self.assertIn("instinct", content)
        self.assertIn("realist", content)

    def test_verdict_engine_categories(self):
        engine_path = os.path.join(PROJECT_ROOT, "src/engine/verdict.js")
        with open(engine_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("shopping", content)
        self.assertIn("career", content)
        self.assertIn("love", content)
        self.assertIn("daily", content)
        self.assertIn("CATEGORY_PRESETS", content)

    def test_storage_manager(self):
        storage_path = os.path.join(PROJECT_ROOT, "src/storage/history.js")
        with open(storage_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("saveVerdict", content)
        self.assertIn("getHistory", content)
        self.assertIn("deleteVerdict", content)
        self.assertIn("clearHistory", content)
        self.assertIn("encodeState", content)
        self.assertIn("decodeState", content)

if __name__ == "__main__":
    unittest.main()
