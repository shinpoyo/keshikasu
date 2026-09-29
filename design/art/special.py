# STAGE 6・7 と とくべつな進化（7しゅ）の絵を つくる
# つかいかた: python3 special.py  → ../../art/ に SVG を書き出す
# カスは make.py と同じ リアル寄りの質感。そえる小物（王冠・ナイトキャップなど）は UI と同じ フラットな絵
import os, math, random
from make import defs, stage, strands_svg, flecks

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'art')
INK = '#2B2A28'


def svg(p, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">\n'
            + defs(p) + body + '</svg>\n')


def sparkle(x, y, s, color='#F6D77A', op=1):
    return (f'<path d="M{x} {y-s} Q{x+s*0.18} {y-s*0.18} {x+s} {y} Q{x+s*0.18} {y+s*0.18} {x} {y+s} '
            f'Q{x-s*0.18} {y+s*0.18} {x-s} {y} Q{x-s*0.18} {y-s*0.18} {x} {y-s}Z" fill="{color}" opacity="{op}"></path>')


def glow_defs(p, color):
    return (f'<defs><radialGradient id="{p}halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="{color}" stop-opacity="0.55"></stop>'
            f'<stop offset="1" stop-color="{color}" stop-opacity="0"></stop></radialGradient>'
            f'<filter id="{p}bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter></defs>')


# --- STAGE 6: でんせつの カス（みためは ほぼ おなじ。ただし 後光が さしている） ---
def stage6():
    p = 's6'
    r = random.Random(606)
    rays = ''.join(
        f'<path d="M200 200 L{200+260*math.cos(math.radians(a-3)):.1f} {200+260*math.sin(math.radians(a-3)):.1f} '
        f'L{200+260*math.cos(math.radians(a+3)):.1f} {200+260*math.sin(math.radians(a+3)):.1f}Z"></path>'
        for a in range(0, 360, 20))
    body = (glow_defs(p, '#F3C84B')
            + f'<g fill="#F3C84B" opacity="0.16">{rays}</g>'
            + f'<circle cx="200" cy="198" r="150" fill="url(#{p}halo)"></circle>'
            # てんしの わっか（フラット）
            + f'<ellipse cx="200" cy="86" rx="62" ry="15" fill="none" stroke="#F3C84B" stroke-width="9" opacity="0.5" filter="url(#{p}bl)"></ellipse>'
            + f'<ellipse cx="200" cy="86" rx="62" ry="15" fill="none" stroke="#E7B533" stroke-width="6"></ellipse>'
            + stage(p, 5)
            + ''.join(sparkle(r.randint(70, 330), r.randint(70, 330), r.randint(6, 12), '#FFF1B8', 0.9) for _ in range(7)))
    return svg(p, body)


# --- STAGE 7: うちゅうの カス（ほしが ついている。わっかが ある） ---
def stage7():
    p = 's7'
    r = random.Random(707)
    stars = ''.join(f'<circle cx="{r.uniform(130,270):.1f}" cy="{r.uniform(125,275):.1f}" r="{r.uniform(0.8,2.2):.1f}" fill="{r.choice(["#FFF6D6","#FFFFFF","#F29CA3","#8FA7C8"])}" opacity="{r.uniform(0.6,1):.2f}"></circle>' for _ in range(34))
    back = (f'<g transform="rotate(-16 200 205)"><path d="M58 205 A142 36 0 0 1 342 205" fill="none" stroke="#8FA7C8" stroke-width="14" opacity="0.55"></path>'
            f'<path d="M58 205 A142 36 0 0 1 342 205" fill="none" stroke="#DCE3EC" stroke-width="4" opacity="0.7"></path></g>')
    front = (f'<g transform="rotate(-16 200 205)"><path d="M58 205 A142 36 0 0 0 342 205" fill="none" stroke="#8FA7C8" stroke-width="14" opacity="0.8"></path>'
             f'<path d="M58 205 A142 36 0 0 0 342 205" fill="none" stroke="#DCE3EC" stroke-width="4"></path></g>')
    moon = f'<circle cx="332" cy="92" r="13" fill="#6B6A66"></circle><circle cx="328" cy="88" r="3" fill="#4A4946"></circle>'
    body = (glow_defs(p, '#8FA7C8')
            + f'<circle cx="200" cy="200" r="160" fill="url(#{p}halo)"></circle>'
            + back + stage(p, 5) + f'<g>{stars}</g>' + front + moon
            + sparkle(80, 110, 10, '#FFF6D6') + sparkle(320, 320, 8, '#FFF6D6') + sparkle(96, 312, 6, '#F29CA3'))
    return svg(p, body)


# --- とくべつ ---
def lucky():
    p = 'sl'
    r = random.Random(71)
    specks = ''.join(f'<circle cx="{r.uniform(115,285):.1f}" cy="{r.uniform(150,275):.1f}" r="{r.uniform(1.5,3.5):.1f}" fill="{r.choice(["#F6D77A","#E7B533","#FFF1B8"])}"></circle>' for _ in range(40))
    clover = ('<g transform="translate(300 96) rotate(18)">'
              + ''.join(f'<circle cx="{11*math.cos(math.radians(a)):.1f}" cy="{11*math.sin(math.radians(a)):.1f}" r="11" fill="#8DBF7A" stroke="{INK}" stroke-width="2.5"></circle>' for a in (0, 90, 180, 270))
              + f'<circle r="5" fill="#A9CF95"></circle><path d="M8 8 Q16 22 12 34" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"></path></g>')
    body = glow_defs(p, '#F3C84B') + f'<circle cx="200" cy="215" r="150" fill="url(#{p}halo)"></circle>' + stage(p, 3) + specks + clover \
        + sparkle(104, 130, 12) + sparkle(292, 256, 9) + sparkle(150, 300, 7)
    return svg(p, body)


def toasty():
    p = 'st'
    steam = ''.join(f'<path d="M{x} 118 C{x-14} 100 {x+14} 88 {x} 70 C{x-14} 52 {x+10} 42 {x} 28" fill="none" stroke="#C9C3B8" stroke-width="6" stroke-linecap="round" opacity="0.65"></path>' for x in (160, 200, 240))
    heat = (f'<radialGradient id="{p}heat" cx="0.5" cy="0.55" r="0.5"><stop offset="0" stop-color="#FF7A3D" stop-opacity="0.55"></stop><stop offset="1" stop-color="#FF7A3D" stop-opacity="0"></stop></radialGradient>')
    body = (f'<defs>{heat}</defs><circle cx="204" cy="205" r="130" fill="url(#{p}heat)"></circle>'
            + f'<g style="filter: sepia(0.9) saturate(3.2) hue-rotate(-18deg) brightness(0.95)">{stage(p, 4)}</g>'
            + f'<g fill="none" stroke="#FFB27A" stroke-width="2" opacity="0.7"><path d="M150 170 C170 160 180 175 196 166"></path><path d="M200 230 C220 222 232 236 250 226"></path></g>'
            + steam)
    return svg(p, body)


def night():
    p = 'sn'
    r = random.Random(33)
    # かおは stage 5 と同じ場所に、ねむっている目
    ball = stage(p, 4)
    face = (f'<g filter="url(#{p}fz)" opacity="0.85"><path d="M160 184 C168 192 180 192 188 184" fill="none" stroke="#1A1918" stroke-width="4" stroke-linecap="round"></path>'
            f'<path d="M214 182 C222 190 234 190 242 182" fill="none" stroke="#1A1918" stroke-width="4" stroke-linecap="round"></path>'
            f'<ellipse cx="202" cy="238" rx="7" ry="5" fill="#1A1918" opacity="0.55"></ellipse></g>')
    cap = (f'<g transform="rotate(-14 200 110)"><path d="M130 128 C150 70 220 40 292 62 C262 70 236 90 226 118 Z" fill="#3E6FB0" stroke="{INK}" stroke-width="4" stroke-linejoin="round"></path>'
           f'<path d="M122 132 C170 112 220 110 262 126" fill="none" stroke="#FBF8F1" stroke-width="14" stroke-linecap="round"></path>'
           f'<circle cx="296" cy="62" r="13" fill="#FBF8F1" stroke="{INK}" stroke-width="3.5"></circle></g>')
    z = ''.join(f'<text x="{x}" y="{y}" font-family="Nunito, sans-serif" font-weight="900" font-size="{s}" fill="#3E6FB0" opacity="0.85">z</text>' for x, y, s in ((300, 150, 34), (328, 116, 26), (350, 90, 20)))
    stars = ''.join(sparkle(r.randint(60, 140), r.randint(70, 330), r.randint(4, 8), '#8FA7C8', 0.8) for _ in range(4))
    return svg(p, ball + face + cap + z + stars)


def king():
    p = 'sk'
    crown = (f'<g transform="translate(200 104) rotate(-6)"><path d="M-62 30 L-70 -26 L-34 2 L0 -40 L34 2 L70 -26 L62 30 Z" fill="#E7B533" stroke="{INK}" stroke-width="5" stroke-linejoin="round"></path>'
             f'<rect x="-64" y="24" width="128" height="16" rx="4" fill="#D9A625" stroke="{INK}" stroke-width="5"></rect>'
             f'<circle cx="0" cy="8" r="8" fill="#F29CA3" stroke="{INK}" stroke-width="3"></circle>'
             f'<circle cx="-40" cy="14" r="5" fill="#3E6FB0" stroke="{INK}" stroke-width="2.5"></circle><circle cx="40" cy="14" r="5" fill="#3E6FB0" stroke="{INK}" stroke-width="2.5"></circle></g>')
    # おうさまの クッション（フラット）。カスは その上に のっている
    cape = (f'<path d="M84 286 C84 262 130 252 200 252 C270 252 316 262 316 286 C316 312 270 324 200 324 C130 324 84 312 84 286 Z" fill="#B0413E" stroke="{INK}" stroke-width="5"></path>'
            f'<path d="M104 280 C140 266 260 266 296 280" fill="none" stroke="#D6605C" stroke-width="6" stroke-linecap="round"></path>'
            + ''.join(f'<g transform="translate({x} {y})"><path d="M0 0 L0 16" stroke="#E7B533" stroke-width="4"></path><circle cx="0" cy="20" r="6" fill="#E7B533" stroke="{INK}" stroke-width="2.5"></circle></g>' for x, y in ((90, 292), (310, 292))))
    return svg(p, cape + stage(p, 5) + crown + sparkle(300, 70, 10) + sparkle(96, 96, 7))


def wander():
    p = 'sw'
    sp = [(60, 230, 120, -15, 16, 18, 51), (200, 200, 90, 30, 12, 26, 52), (250, 290, 70, -40, 10, 22, 53)]
    trail = f'<path d="M40 330 C100 320 120 290 170 300 C230 312 250 260 320 250" fill="none" stroke="#A9A49B" stroke-width="4" stroke-dasharray="3 14" stroke-linecap="round"></path>'
    bag = (f'<g transform="translate(262 92) rotate(24)"><path d="M0 0 L0 150" stroke="#8A6A3E" stroke-width="8" stroke-linecap="round"></path>'
           f'<path d="M-30 -6 C-44 -40 36 -48 30 -8 C22 14 -20 16 -30 -6 Z" fill="#F29CA3" stroke="{INK}" stroke-width="4"></path>'
           f'<circle cx="-12" cy="-22" r="3" fill="#FBF8F1"></circle><circle cx="8" cy="-26" r="3" fill="#FBF8F1"></circle><circle cx="-2" cy="-10" r="3" fill="#FBF8F1"></circle></g>')
    return svg(p, trail + strands_svg(p, sp, 7) + flecks(p, [(130, 300), (300, 200), (90, 180)], 5) + bag)


def zen():
    p = 'sz'
    # ひと筆の まる（えんそう）に ならんだ カス
    pts = []
    for i in range(34):
        a = math.radians(-70 + i * 9.6)
        pts.append((200 + 112 * math.cos(a), 205 + 112 * math.sin(a)))
    sp = []
    r = random.Random(88)
    for i in range(len(pts) - 1):
        (x1, y1), (x2, y2) = pts[i], pts[i + 1]
        ang = math.degrees(math.atan2(y2 - y1, x2 - x1))
        w = 16 - i * 0.25
        sp.append((x1, y1, math.hypot(x2 - x1, y2 - y1) * 1.5, ang, max(w, 7), 4, 200 + i))
    dot = f'<g filter="url(#{p}fz)"><ellipse cx="200" cy="208" rx="9" ry="6" fill="#3A3937"></ellipse></g>'
    return svg(p, strands_svg(p, sp, 1, hl=False) + dot)


def reborn():
    p = 'sr'
    arrows = (f'<g fill="none" stroke="#F29CA3" stroke-width="7" stroke-linecap="round" opacity="0.8">'
              f'<path d="M78 170 A128 128 0 0 1 250 82"></path><path d="M322 236 A128 128 0 0 1 150 322"></path></g>'
              f'<path d="M244 64 L266 86 L238 96 Z" fill="#F29CA3"></path><path d="M156 340 L134 318 L162 308 Z" fill="#F29CA3"></path>')
    chips = (f'<g transform="translate(258 262) rotate(-22)"><rect x="0" y="0" width="34" height="20" rx="4" fill="#F29CA3" stroke="{INK}" stroke-width="3"></rect><rect x="16" y="0" width="18" height="20" fill="#3E6FB0" stroke="{INK}" stroke-width="3"></rect></g>'
             f'<g transform="translate(120 128) rotate(30)"><rect x="0" y="0" width="16" height="11" rx="3" fill="#F29CA3" stroke="{INK}" stroke-width="2.5"></rect></g>')
    return svg(p, arrows + stage(p, 5) + chips + sparkle(330, 120, 9, '#F29CA3') + sparkle(76, 290, 7, '#8FA7C8'))


FILES = {
    'kasu-stage6.svg': stage6, 'kasu-stage7.svg': stage7,
    'special-lucky.svg': lucky, 'special-toasty.svg': toasty, 'special-night.svg': night,
    'special-king.svg': king, 'special-wander.svg': wander, 'special-zen.svg': zen, 'special-reborn.svg': reborn,
}

if __name__ == '__main__':
    for name, fn in FILES.items():
        with open(os.path.join(OUT, name), 'w') as f:
            f.write(fn())
        print('wrote', name)
