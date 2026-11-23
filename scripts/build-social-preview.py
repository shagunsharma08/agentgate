"""Build a 1200 x 630 PNG for the AgentGate case-study link preview."""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def font(name, size):
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


def build(output):
    image = Image.new("RGB", (1200, 630), "#1e1b18")
    draw = ImageDraw.Draw(image)
    cream, muted, accent = "#f7f3ee", "#d0c4b8", "#de9c72"
    draw.rectangle((55, 53, 61, 112), fill=accent)
    draw.text((82, 50), "AgentGate", font=font("georgia.ttf", 43), fill=cream)
    draw.text((83, 105), "A PRODUCT CASE STUDY BY SHAGUN SHARMA", font=font("segoeui.ttf", 17), fill=muted)
    draw.text((70, 202), "The agent that knows", font=font("georgia.ttf", 66), fill=cream)
    draw.text((70, 282), "when to stop.", font=font("georgiai.ttf", 78), fill=accent)
    draw.text((73, 407), "Human authority. Agent accountability.", font=font("segoeui.ttf", 29), fill=cream)
    draw.line((72, 489, 1128, 489), fill="#605247", width=1)
    draw.text((73, 521), "PERMISSION DESIGN  /  POST-TRADE OPERATIONS", font=font("segoeui.ttf", 19), fill=muted)
    draw.text((73, 562), "Independent concept inspired by public research. Not affiliated with DTCC.", font=font("segoeui.ttf", 16), fill=muted)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, optimize=True)
    print(f"Created {output} (1200 x 630)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    build(parser.parse_args().output)
