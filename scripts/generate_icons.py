from PIL import Image, ImageDraw, ImageFont
import os

ICON_SIZE = 48
COLORS = {
    'inactive': '#999999',
    'active': '#5B6CFF',
}

# 用简单几何图形表示 tab 图标
ICONS = {
    'home': [
        ('polygon', [(24, 8), (8, 22), (12, 22), (12, 38), (20, 38), (20, 28), (28, 28), (28, 38), (36, 38), (36, 22), (40, 22)]),
    ],
    'batch': [
        ('rect', (10, 10, 22, 18)),
        ('rect', (26, 10, 38, 18)),
        ('rect', (10, 22, 22, 30)),
        ('rect', (26, 22, 38, 30)),
        ('rect', (10, 34, 22, 42)),
        ('rect', (26, 34, 38, 42)),
    ],
    'inventory': [
        ('rect', (8, 8, 40, 40)),
        ('line', (15, 16, 33, 16)),
        ('line', (15, 24, 33, 24)),
        ('line', (15, 32, 33, 32)),
    ],
    'settings': [
        ('circle', (24, 24), 14),
        ('circle', (24, 24), 6),
    ],
}


def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def draw_icon(draw, commands, color):
    rgb = hex_to_rgb(color)
    for cmd, *args in commands:
        if cmd == 'polygon':
            draw.polygon(args[0], fill=rgb)
        elif cmd == 'rect':
            draw.rectangle(args[0], fill=rgb)
        elif cmd == 'line':
            draw.line(args[0], fill=rgb, width=3)
        elif cmd == 'circle':
            center, radius = args
            bbox = [center[0]-radius, center[1]-radius, center[0]+radius, center[1]+radius]
            if radius > 10:
                draw.ellipse(bbox, outline=rgb, width=3)
            else:
                draw.ellipse(bbox, fill=rgb)


def main():
    out_dir = os.path.join(os.path.dirname(__file__), '..', 'assets', 'icons')
    os.makedirs(out_dir, exist_ok=True)

    for name, commands in ICONS.items():
        for state, color in COLORS.items():
            img = Image.new('RGBA', (ICON_SIZE, ICON_SIZE), (255, 255, 255, 0))
            draw = ImageDraw.Draw(img)
            draw_icon(draw, commands, color)
            path = os.path.join(out_dir, f'{name}{"-active" if state == "active" else ""}.png')
            img.save(path)
            print(f'Generated {path}')


if __name__ == '__main__':
    main()
