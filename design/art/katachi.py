# へんな かたちの カス（かたちカス）の絵を つくる
# つかいかた: python3 katachi.py [出力先]  → ../../art/katachi-<id>.svg を書き出す
# ぜんぶ けしカスで できている。make.py と同じ もさもさの 質感の「ひも（tube）」と「かたまり（lump）」を くみあわせる
import os, sys, math, random
from make import defs
from strand import fibers_for
import sculpt

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'art')
INK = '#2B2A28'


def svg(p, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">\n'
            + defs(p) + body + '</svg>\n')


# --- なめらかな 線 ---
def catmull(pts, step=5, closed=False):
    P = list(pts)
    if closed:
        P = [P[-1]] + P + [P[0], P[1]]
    else:
        P = [P[0]] + P + [P[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        n = max(2, int(math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step))
        for k in range(n):
            t = k / n
            t2, t3 = t * t, t * t * t
            x = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            out.append((x, y))
    if not closed:
        out.append(P[-2])
    return out


def smooth_noise(r, n, amt, k=2):
    raw = [1 + r.uniform(-amt, amt) for _ in range(n)]
    for _ in range(k):
        raw = [(raw[max(i - 1, 0)] + raw[i] * 2 + raw[min(i + 1, n - 1)]) / 4 for i in range(n)]
    return raw


def fmt(poly):
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in poly) + 'Z'


# STAGE 4 から でる かたちは 毛の ない かためた 質感（data/species.js の stage と そろえる）
SCULPT = {'rabbit', 'crab', 'penguin', 'hedgehog', 'softcream', 'letter-a', 'octopus', 'whale', 'seahorse', 'robot',
          'bicycle', 'plane', 'dragon', 'trex', 'human', 'eraser', 'ufo', 'king', 'god'}
# キングと 神は royal.py で べつに かく（つるつるの 彫刻ふう）
SMOOTH = {'king', 'god'}


class Art:
    """ひも と かたまりを ためて、かげ → からだ → ひかり → けば の じゅんで かく"""
    sculpt = False  # True なら 毛・けば なしの かためた 質感
    smooth = False  # True なら カスの もようも なしの つるつる

    def __init__(self, p, seed=1):
        self.p = p
        self.r = random.Random(seed)
        self.layers = []  # (kind, d, extra)

    # ひも。pts を とおる。w=ふとさ、taper=はしの ほそさ、lump=でこぼこ
    def tube(self, pts, w, taper=0.5, lump=0.3, closed=False, fibers=5, jit=2.0, hl=True, tone=None):
        r = self.r
        pts = [(x + r.uniform(-jit, jit), y + r.uniform(-jit, jit)) for x, y in pts]
        c = catmull(pts, 4, closed)
        n = len(c)
        mult = smooth_noise(r, n, lump)
        L, R = [], []
        for i, (px, py) in enumerate(c):
            j = (i + 1) % n if closed else min(i + 1, n - 1)
            k = (i - 1) % n if closed else max(i - 1, 0)
            dx, dy = c[j][0] - c[k][0], c[j][1] - c[k][1]
            d = math.hypot(dx, dy) or 1
            nx, ny = -dy / d, dx / d
            t = i / max(n - 1, 1)
            if closed or taper <= 0:
                prof = 1
            else:
                e = min(t, 1 - t) / 0.5
                prof = (1 - taper) + taper * (min(e * 2.2, 1) ** 0.6)
            hw = w / 2 * prof * mult[i] + 0.4
            L.append((px + nx * hw, py + ny * hw))
            R.append((px - nx * hw, py - ny * hw))
        if closed:
            d = fmt(L) + ' ' + fmt(R[::-1])
        else:
            d = fmt(L + R[::-1])
        hi = ''
        if hl and w > 7 and n > 6:
            seg = c[2:-2] if not closed else c
            hi = 'M' + ' L'.join(f'{x:.1f} {y - w * 0.14:.1f}' for x, y in seg)
        fb = fibers_for(c, r.randint(1, 9999), fibers) if n > 5 else []
        self.layers.append(('tube', d, {'hi': hi, 'w': w, 'fb': fb, 'tone': tone}))
        return c

    # かたまり。pts（まわり）を なめらかに とじる。ellipse でも OK
    def lump(self, pts, wob=0.06, hair=40, hl=True, tone=None):
        r = self.r
        cx = sum(x for x, _ in pts) / len(pts)
        cy = sum(y for _, y in pts) / len(pts)
        pts = [(cx + (x - cx) * (1 + r.uniform(-wob, wob)), cy + (y - cy) * (1 + r.uniform(-wob, wob))) for x, y in pts]
        c = catmull(pts, 4, True)
        hairs = []
        for _ in range(hair):
            i = r.randrange(len(c))
            x, y = c[i]
            a = math.atan2(y - cy, x - cx) + r.uniform(-0.8, 0.8)
            l = r.uniform(3, 9)
            hairs.append(f'M{x:.1f} {y:.1f} L{x + l * math.cos(a):.1f} {y + l * math.sin(a):.1f}')
        self.layers.append(('lump', fmt(c), {'hair': hairs, 'hl': hl, 'box': (cx, cy), 'tone': tone}))
        return c

    def oval(self, cx, cy, rx, ry, rot=0, n=14, **kw):
        a0 = math.radians(rot)
        pts = []
        for i in range(n):
            t = 2 * math.pi * i / n
            x, y = rx * math.cos(t), ry * math.sin(t)
            pts.append((cx + x * math.cos(a0) - y * math.sin(a0), cy + x * math.sin(a0) + y * math.cos(a0)))
        return self.lump(pts, **kw)

    def raw(self, s):
        self.layers.append(('raw', s, {}))

    def eye(self, x, y, s=1.0):
        p = self.p
        self.layers.append(('raw', f'<g filter="url(#{p}fz)"><ellipse cx="{x}" cy="{y}" rx="{5 * s:.1f}" ry="{3.6 * s:.1f}" fill="#141312" opacity="0.8"></ellipse></g>', {}))

    def specks(self, pts, seed=5):
        r = random.Random(seed)
        o = []
        for x, y in pts:
            rx = r.uniform(2, 5); ry = rx * r.uniform(.4, .8)
            o.append(f'<ellipse cx="{x}" cy="{y}" rx="{rx:.1f}" ry="{ry:.1f}" transform="rotate({r.randint(0, 180)} {x} {y})"></ellipse>')
        self.layers.append(('raw', f'<g fill="#3E3D3B" filter="url(#{self.p}fz)">{"".join(o)}</g>', {}))

    def render(self, ground=None):
        p = self.p
        out = [sculpt.defs(p, smooth=self.smooth)] if self.sculpt else []
        if ground:
            gx, gy, grx = ground
            out.append(f'<ellipse cx="{gx}" cy="{gy}" rx="{grx}" ry="{grx * 0.18:.1f}" fill="#000000" opacity="0.22" filter="url(#{p}sh)"></ellipse>')
        for kind, d, ex in self.layers:
            if kind == 'raw':
                out.append(d); continue
            fill = f'url(#{p}g)' if kind == 'tube' else f'url(#{p}bg)'
            tone = ex.get('tone')
            wrap_a, wrap_b = '', ''
            if tone:
                wrap_a, wrap_b = f'<g style="filter:{tone}">', '</g>'
            out.append(wrap_a)
            out.append(f'<path d="{d}" transform="translate(3 6)" fill="#000000" opacity="0.26" fill-rule="evenodd" filter="url(#{p}sh)"></path>')
            if self.sculpt:
                out.append(sculpt.solid(p, d, 'shadeT' if kind == 'tube' else 'shade', 'evenodd', self.smooth))
                if kind == 'tube' and ex['hi'] and not self.smooth:
                    out.append(f'<path d="{ex["hi"]}" fill="none" stroke="#C9C6BF" stroke-width="{max(1.2, ex["w"] * 0.18):.1f}" stroke-linecap="round" opacity="0.28"></path>')
                out.append(wrap_b)
                continue
            out.append(f'<g filter="url(#{p}fz)"><path d="{d}" fill="{fill}" fill-rule="evenodd" filter="url(#{p}gr)"></path></g>')
            if kind == 'tube':
                if ex['hi']:
                    out.append(f'<path d="{ex["hi"]}" fill="none" stroke="#9A9893" stroke-width="{max(1.2, ex["w"] * 0.16):.1f}" stroke-linecap="round" opacity="0.4" filter="url(#{p}fz)"></path>')
                if ex['fb']:
                    out.append(f'<g fill="none" stroke="#3A3937" stroke-width="1.1" stroke-linecap="round" opacity="0.85">{paths(ex["fb"])}</g>')
            else:
                out.append(f'<g fill="none" stroke="#403F3D" stroke-width="1" stroke-linecap="round" opacity="0.8">{paths(ex["hair"])}</g>')
            out.append(wrap_b)
        return svg(p, ''.join(out))


def paths(ds):
    return ''.join('<path d="' + d + '"></path>' for d in ds)


def sparkle(x, y, s, color='#F6D77A', op=1):
    return (f'<path d="M{x} {y - s} Q{x + s * 0.18} {y - s * 0.18} {x + s} {y} Q{x + s * 0.18} {y + s * 0.18} {x} {y + s} '
            f'Q{x - s * 0.18} {y + s * 0.18} {x - s} {y} Q{x - s * 0.18} {y - s * 0.18} {x} {y - s}Z" fill="{color}" opacity="{op}"></path>')


def arc_pts(cx, cy, rx, ry, a0, a1, n=12):
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


# ===================== いきもの =====================
def dragon():
    a = Art('kd', 11)
    # うしろの つばさ（うすい まく も カス）
    a.lump([(206, 172), (196, 120), (214, 70), (246, 40), (252, 76), (240, 96), (246, 118), (228, 132), (230, 156)], wob=0.03, hair=18, tone='brightness(1.25)')
    # しっぽから くびまで ひょろひょろ
    a.tube([(40, 300), (60, 318), (100, 314), (140, 300), (170, 276), (188, 244), (200, 206), (214, 170), (234, 140), (262, 124), (282, 122)], 16, taper=0.85, lump=0.35, fibers=9)
    a.lump([(34, 300), (44, 284), (52, 304)], wob=0.02, hair=4, hl=False)  # しっぽの さき
    # あし（ほそい）
    for x, y in ((150, 296), (174, 272)):
        a.tube([(x, y), (x - 4, y + 22), (x + 6, y + 32), (x + 14, y + 32)], 6, taper=0.3, fibers=1)
    for x, y in ((194, 222), (206, 190)):
        a.tube([(x, y), (x + 20, y + 12), (x + 26, y + 26)], 5, taper=0.3, fibers=1)
    # まえの つばさ（ほねと まく）
    a.lump([(220, 164), (196, 104), (158, 58), (130, 46), (140, 72), (128, 92), (146, 104), (140, 124), (168, 130), (176, 150)], wob=0.03, hair=24)
    a.tube([(220, 164), (190, 100), (130, 46)], 6, taper=0.3, fibers=1)
    # せなかの とげ
    for x, y in ((176, 262), (190, 232), (200, 200), (214, 168)):
        a.lump([(x - 8, y), (x - 16, y - 12), (x + 2, y - 6)], wob=0.02, hair=3, hl=False)
    # あたま
    a.lump([(264, 116), (286, 102), (314, 104), (344, 118), (340, 132), (306, 138), (272, 138)], hair=24)
    a.tube([(282, 106), (276, 86), (284, 72)], 6, taper=0.6, fibers=1)
    a.tube([(296, 104), (300, 84), (312, 74)], 6, taper=0.6, fibers=1)
    a.eye(304, 116, 0.8)
    # けむり（これも カス。ほのおは でない）
    a.oval(360, 118, 7, 5, hair=6, hl=False)
    a.oval(374, 104, 5, 4, hair=4, hl=False)
    a.specks([(382, 92), (90, 334), (262, 330)], 11)
    return a.render(ground=(170, 340, 120))


def snake():
    a = Art('ks', 12)
    pts = arc_pts(190, 290, 110, 32, 180, 540, 18)
    a.tube(pts[:17], 22, taper=0.8, lump=0.25, fibers=8)
    a.tube(arc_pts(200, 282, 70, 20, 200, 520, 12), 20, taper=0.3, lump=0.25)
    a.tube([(250, 280), (262, 240), (246, 200), (222, 176), (228, 150), (254, 138)], 20, taper=0.25, lump=0.2)
    a.oval(266, 134, 24, 16, rot=-10, hair=18)
    a.eye(270, 128, 0.7)
    a.raw(f'<path d="M288 142 L304 146 M304 146 L312 140 M304 146 L312 152" stroke="#E86A6A" stroke-width="3.5" stroke-linecap="round" fill="none"></path>')
    return a.render(ground=(196, 318, 130))


def cat():
    a = Art('kc', 13)
    # しっぽ（からだに まきつく）
    a.tube([(290, 250), (318, 280), (300, 310), (240, 318), (170, 314), (126, 300)], 16, taper=0.7)
    a.oval(214, 256, 96, 56, rot=-4, hair=46)
    # あたま
    a.lump([(98, 250), (104, 214), (136, 198), (170, 210), (180, 244), (162, 276), (122, 282)], hair=26)
    a.lump([(108, 212), (104, 176), (128, 202)], wob=0.03, hair=8, hl=False)
    a.lump([(150, 202), (170, 172), (172, 212)], wob=0.03, hair=8, hl=False)
    # ねている め
    a.raw('<g filter="url(#kcfz)" fill="none" stroke="#141312" stroke-width="3" stroke-linecap="round" opacity="0.75">'
          '<path d="M118 240 q7 6 14 0"></path><path d="M146 238 q7 6 14 0"></path></g>')
    a.raw('<text x="176" y="176" font-family="Nunito, sans-serif" font-weight="900" font-size="26" fill="#8FA7C8">z</text>'
          '<text x="196" y="152" font-family="Nunito, sans-serif" font-weight="900" font-size="18" fill="#8FA7C8">z</text>')
    return a.render(ground=(210, 318, 140))


def dog():
    a = Art('kg', 14)
    a.tube([(262, 226), (284, 196), (300, 176)], 12, taper=0.6)  # しっぽ（まだ ついている ほう）
    a.oval(222, 238, 58, 40, hair=34)
    for x in (190, 208, 240, 258):
        a.tube([(x, 262), (x - 1, 292), (x + 4, 304)], 12, taper=0.2)
    a.lump([(138, 176), (150, 148), (186, 142), (204, 164), (198, 196), (170, 208), (146, 202)], hair=26)
    a.lump([(116, 190), (134, 178), (150, 184), (146, 198), (124, 202)], hair=12)  # はな
    a.tube([(186, 150), (206, 166), (210, 196)], 16, taper=0.5)  # みみ
    a.eye(168, 172, 0.8)
    a.raw('<ellipse cx="120" cy="190" rx="6" ry="4.5" fill="#141312" opacity="0.8"></ellipse>')
    # とれた しっぽ
    a.tube([(300, 312), (318, 300), (338, 306), (352, 296)], 11, taper=0.6)
    a.raw('<g fill="none" stroke="#6B6A66" stroke-width="2.4" stroke-linecap="round" opacity="0.6"><path d="M336 280 l4 -8"></path><path d="M348 282 l7 -6"></path><path d="M322 282 l-2 -8"></path></g>')
    return a.render(ground=(230, 310, 110))


def snail():
    a = Art('kn', 15)
    a.tube([(88, 302), (130, 306), (200, 304), (270, 300), (306, 292), (322, 272)], 22, taper=0.6)
    a.tube([(308, 280), (304, 238), (296, 216)], 6, taper=0.3)
    a.tube([(318, 280), (326, 236), (336, 214)], 6, taper=0.3)
    a.oval(295, 212, 7, 7, hair=6, hl=False)
    a.oval(338, 210, 7, 7, hair=6, hl=False)
    a.oval(196, 226, 74, 70, hair=40)
    # から の うずまき（カスの ひも）
    sp = []
    for i in range(40):
        t = i / 39
        ang = math.radians(-90 + 720 * t)
        rr = 58 * (1 - t) + 6
        sp.append((196 + rr * math.cos(ang), 226 + rr * math.sin(ang)))
    a.raw(f'<path d="M{sp[0][0]:.1f} {sp[0][1]:.1f} ' + ' '.join(f'L{x:.1f} {y:.1f}' for x, y in sp[1:]) + '" fill="none" stroke="#1C1B1A" stroke-width="4" stroke-linecap="round" opacity="0.55" filter="url(#knfz)"></path>')
    return a.render(ground=(210, 318, 130))


def octopus():
    a = Art('ko', 16)
    legs = [(-80, 70), (-54, 90), (-26, 100), (4, 104), (32, 98), (60, 88), (84, 66)]
    for i, (dx, dy) in enumerate(legs):
        x0 = 200 + dx * 0.35
        a.tube([(x0, 214), (200 + dx * 0.7, 250), (200 + dx + (8 if i % 2 else -8), 214 + dy), (200 + dx * 1.15, 214 + dy + (8 if i % 2 else -10))], 13, taper=0.8)
    a.lump([(140, 196), (136, 140), (164, 98), (206, 90), (246, 104), (266, 146), (262, 200), (236, 230), (170, 230)], hair=40)
    a.eye(180, 176); a.eye(224, 176)
    a.raw('<text x="298" y="110" font-family="Nunito, sans-serif" font-weight="900" font-size="30" fill="#E86A6A">7?</text>')
    return a.render(ground=(200, 326, 140))


def caterpillar():
    a = Art('ki', 17)
    xs = [(90, 280, 24), (130, 286, 27), (172, 286, 28), (214, 280, 28), (252, 262, 27), (282, 232, 27), (298, 196, 29)]
    for x, y, rr in xs[:-1]:
        a.tube([(x - 6, y + rr - 4), (x - 8, y + rr + 10)], 5, taper=0.3)
        a.tube([(x + 6, y + rr - 4), (x + 8, y + rr + 10)], 5, taper=0.3)
    for x, y, rr in xs:
        a.oval(x, y, rr, rr * 0.95, hair=18)
    x, y, _ = xs[-1]
    a.tube([(x - 10, y - 26), (x - 18, y - 50), (x - 12, y - 60)], 4, taper=0.4)
    a.tube([(x + 10, y - 26), (x + 16, y - 50), (x + 26, y - 56)], 4, taper=0.4)
    a.eye(x - 10, y - 4, 0.8); a.eye(x + 12, y - 4, 0.8)
    return a.render(ground=(200, 316, 140))


def chick():
    a = Art('kh', 18)
    a.oval(200, 238, 72, 66, hair=48)
    a.tube([(142, 232), (124, 250), (132, 268)], 14, taper=0.4)
    a.tube([(258, 232), (276, 250), (268, 268)], 14, taper=0.4)
    a.lump([(194, 214), (216, 222), (194, 232)], wob=0.02, hair=4, hl=False)
    a.eye(176, 200, 0.8); a.eye(222, 200, 0.8)
    for x in (180, 222):
        a.tube([(x, 300), (x, 320), (x - 10, 326)], 5, taper=0.2)
        a.tube([(x, 320), (x + 10, 326)], 5, taper=0.2)
    a.tube([(196, 172), (190, 156), (200, 146)], 5, taper=0.5)
    return a.render(ground=(200, 322, 100))


def whale():
    a = Art('kw', 19)
    a.tube([(272, 236), (310, 222), (332, 196)], 26, taper=0.55)
    a.tube([(330, 198), (356, 172), (362, 150)], 14, taper=0.6)
    a.tube([(330, 198), (362, 198), (378, 184)], 14, taper=0.6)
    a.lump([(56, 236), (70, 190), (130, 162), (210, 164), (270, 196), (290, 232), (250, 268), (150, 276), (82, 268)], hair=50)
    a.tube([(150, 262), (170, 290), (188, 296)], 14, taper=0.6)
    a.eye(96, 220, 0.8)
    a.raw('<path d="M76 246 C100 256 130 256 150 248" fill="none" stroke="#1C1B1A" stroke-width="3" opacity="0.4" stroke-linecap="round"></path>')
    a.raw('<g fill="none" stroke="#8FA7C8" stroke-width="5" stroke-linecap="round" opacity="0.7"><path d="M40 322 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"></path></g>')
    return a.render()


def trex():
    a = Art('kt', 20)
    a.tube([(210, 236), (262, 250), (320, 270), (372, 296)], 34, taper=0.9)
    for x, y in ((176, 256), (214, 254)):
        a.tube([(x, y), (x + 8, y + 36), (x - 2, y + 62), (x + 16, y + 68)], 22, taper=0.25)
    a.oval(194, 222, 60, 48, rot=-35, hair=34)
    a.tube([(170, 190), (156, 160), (150, 130)], 34, taper=0.1)
    a.lump([(112, 126), (118, 94), (152, 80), (200, 86), (214, 110), (206, 126), (166, 132), (164, 146), (132, 150), (116, 142)], hair=30)
    a.tube([(160, 184), (138, 196), (132, 210)], 6, taper=0.3, fibers=1)
    a.tube([(170, 196), (152, 212)], 6, taper=0.3, fibers=1)
    a.eye(168, 102, 0.8)
    a.raw('<path d="M120 128 L200 122" stroke="#1C1B1A" stroke-width="3" opacity="0.45" stroke-linecap="round"></path>')
    return a.render(ground=(230, 330, 140))


def rabbit():
    a = Art('kr', 21)
    a.oval(210, 262, 62, 50, hair=40)
    a.oval(268, 290, 14, 12, hair=12)
    a.oval(168, 196, 40, 36, hair=30)
    a.tube([(154, 170), (146, 120), (150, 74)], 20, taper=0.7)
    a.eye(154, 194, 0.8)
    # ちぎれた みみ
    a.tube([(250, 176), (286, 160), (320, 164)], 18, taper=0.7)
    a.raw('<g fill="none" stroke="#E86A6A" stroke-width="3" stroke-linecap="round" opacity="0.6"><path d="M186 150 l10 -12"></path><path d="M192 162 l14 -6"></path></g>')
    return a.render(ground=(210, 312, 110))


def crab():
    a = Art('kk', 22)
    for s in (-1, 1):
        for i, dy in enumerate((0, 14, 28)):
            a.tube([(200 + s * 60, 250 + dy * 0.5), (200 + s * 104, 240 + dy), (200 + s * 124, 290 + dy * 0.6)], 9, taper=0.5)
        a.tube([(200 + s * 50, 220), (200 + s * 92, 186), (200 + s * 104, 150)], 11, taper=0.3)
        a.lump([(200 + s * 88, 150), (200 + s * 96, 110), (200 + s * 124, 104), (200 + s * 130, 130), (200 + s * 114, 156)], hair=16)
        a.lump([(200 + s * 118, 110), (200 + s * 142, 92), (200 + s * 132, 122)], wob=0.03, hair=6, hl=False)
        a.tube([(200 + s * 18, 214), (200 + s * 22, 184)], 5, taper=0.2)
        a.oval(200 + s * 22, 180, 7, 7, hair=6, hl=False)
    a.oval(200, 246, 74, 40, hair=40)
    return a.render(ground=(200, 312, 140))


def penguin():
    a = Art('kp', 23)
    a.lump([(160, 300), (150, 230), (160, 160), (184, 118), (216, 118), (240, 160), (250, 230), (240, 300)], hair=44)
    a.tube([(160, 186), (138, 230), (132, 262)], 16, taper=0.6)
    a.tube([(240, 186), (262, 230), (268, 262)], 16, taper=0.6)
    a.lump([(196, 150), (222, 158), (198, 166)], wob=0.02, hair=4, hl=False)
    a.eye(186, 144, 0.8); a.eye(212, 144, 0.8)
    a.oval(180, 308, 18, 7, hair=6); a.oval(222, 308, 18, 7, hair=6)
    a.raw('<path d="M178 178 C170 230 176 280 200 292 C224 280 230 230 222 178" fill="none" stroke="#9A9893" stroke-width="2.4" opacity="0.35"></path>')
    return a.render(ground=(200, 314, 90))


def hedgehog():
    a = Art('kj', 24)
    r = random.Random(9)
    for i in range(34):
        t = math.radians(-190 + 200 * i / 33 + r.uniform(-3, 3))
        x0, y0 = 214 + 84 * math.cos(t), 250 + 60 * math.sin(t)
        l = r.uniform(30, 48)
        a.tube([(x0, y0), (x0 + l * 0.6 * math.cos(t) + r.uniform(-6, 6), y0 + l * 0.6 * math.sin(t)), (x0 + l * math.cos(t + 0.2), y0 + l * math.sin(t + 0.2))], 8, taper=0.9, fibers=1, hl=False)
    a.oval(214, 256, 90, 56, hair=40)
    a.lump([(130, 262), (100, 270), (92, 278), (106, 286), (140, 288)], hair=10)
    a.oval(92, 278, 6, 5, hair=0, hl=False)
    a.eye(128, 262, 0.7)
    for x in (150, 196, 240, 276):
        a.tube([(x, 300), (x, 316)], 10, taper=0.1)
    return a.render(ground=(200, 320, 140))


def seahorse():
    a = Art('kx', 25)
    a.tube([(212, 100), (246, 120), (256, 170), (232, 214), (212, 250), (220, 292), (252, 306), (270, 290), (262, 270), (244, 276)], 26, taper=0.75, lump=0.25, fibers=9)
    a.lump([(186, 82), (212, 70), (236, 82), (240, 104), (218, 118), (196, 112)], hair=22)
    a.tube([(194, 100), (160, 110), (140, 112)], 12, taper=0.1)
    a.tube([(212, 72), (216, 54)], 6, taper=0.4); a.tube([(224, 76), (236, 60)], 6, taper=0.4)
    a.tube([(254, 150), (280, 150), (284, 176)], 9, taper=0.4)
    a.eye(214, 92, 0.8)
    return a.render(ground=(240, 326, 70))


def human():
    a = Art('km', 26)
    a.tube([(200, 150), (198, 196), (200, 240)], 30, taper=0.2)
    a.tube([(186, 168), (156, 196), (136, 232)], 12, taper=0.4)
    a.tube([(214, 168), (246, 180), (270, 150), (280, 130)], 12, taper=0.4)
    a.tube([(190, 236), (180, 280), (170, 316), (156, 320)], 15, taper=0.2)
    a.tube([(210, 236), (220, 280), (228, 316), (244, 320)], 15, taper=0.2)
    a.oval(200, 122, 30, 32, hair=26)
    return a.render(ground=(200, 324, 80))


# ===================== もの =====================
def robot():
    a = Art('kb', 27)
    a.tube([(200, 94), (200, 64)], 5, taper=0.1)
    a.oval(200, 58, 9, 9, hair=8)
    a.tube([(150, 170), (126, 200), (120, 236)], 14, taper=0.2)
    a.tube([(250, 170), (274, 200), (280, 236)], 14, taper=0.2)
    a.tube([(180, 250), (178, 312)], 18, taper=0.1); a.tube([(220, 250), (222, 312)], 18, taper=0.1)
    a.lump([(146, 150), (150, 146), (250, 144), (254, 150), (256, 256), (250, 262), (150, 262), (144, 256)], wob=0.05, hair=40)
    a.lump([(160, 94), (164, 90), (236, 90), (240, 94), (240, 144), (236, 148), (164, 148), (160, 144)], wob=0.05, hair=28)
    a.eye(182, 118); a.eye(218, 118)
    a.raw('<g fill="none" stroke="#1C1B1A" stroke-width="3" opacity="0.4" stroke-linecap="round"><path d="M180 136 H220"></path><path d="M176 184 h14 M176 200 h24 M210 184 h14"></path></g>')
    return a.render(ground=(200, 320, 100))


def plane():
    # うえから みた ひこうき（はなは みぎうえ）
    a = Art('kl', 28)
    fx, fy = 0.74, -0.67   # まえ
    nx, ny = 0.67, 0.74    # よこ

    def at(f, n):
        return (206 + fx * f + nx * n, 196 + fy * f + ny * n)
    for s_ in (-1, 1):
        a.lump([at(30, 0), at(-20, s_ * 130), at(-50, s_ * 140), at(-40, s_ * 110), at(-30, 0)], wob=0.03, hair=24)
        a.lump([at(-110, 0), at(-140, s_ * 50), at(-156, s_ * 54), at(-150, s_ * 30), at(-140, 0)], wob=0.03, hair=10)
    a.tube([at(-160, 0), at(-60, 0), at(60, 0), at(130, 0)], 30, taper=0.55, fibers=8)
    a.raw('<g fill="none" stroke="#A9A49B" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 12" opacity="0.7"><path d="M74 330 C56 350 40 350 24 370"></path></g>')
    a.raw('<text x="290" y="330" font-family="Nunito, sans-serif" font-weight="900" font-size="24" fill="#8FA7C8">ふーっ</text>')
    return a.render()


def softcream():
    a = Art('kf', 29)
    # コーン（ほんものの コーン。カスは のっているだけ）。まるい つつの ように かげと こうしを つける
    cx, top, tip, R, ry = 200, 216, 338, 56, 13

    def on(f, th):  # f: 0=うえ 1=さき、th: 0〜180 が てまえ
        return (cx + R * (1 - f) * math.cos(math.radians(th)), top + ry * (1 - f) * math.sin(math.radians(th)) + (tip - top) * f)
    body = f'M{cx - R} {top} A{R} {ry} 0 0 0 {cx + R} {top} L{cx} {tip} Z'
    lines = []
    for th0 in range(-60, 240, 22):
        for d in (1, -1):
            pts = [on(f / 10, th0 + d * f * 9) for f in range(11)]
            lines.append('M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts))
    a.raw(f'<defs><linearGradient id="kfcone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C98E45"></stop><stop offset="0.28" stop-color="#F1CD8E"></stop>'
          f'<stop offset="0.5" stop-color="#E3B873"></stop><stop offset="1" stop-color="#A8702E"></stop></linearGradient>'
          f'<clipPath id="kfclip"><path d="{body}"></path></clipPath></defs>'
          f'<ellipse cx="206" cy="342" rx="30" ry="6" fill="#000000" opacity="0.18" filter="url(#kfsh)"></ellipse>'
          f'<path d="{body}" fill="url(#kfcone)"></path>'
          f'<g clip-path="url(#kfclip)" fill="none" stroke="#9C6627" stroke-width="2.6" opacity="0.75">{paths(lines)}</g>'
          f'<path d="M{cx - 30} {top + 10} L{cx - 4} {tip - 20}" stroke="#FFF1D2" stroke-width="5" stroke-linecap="round" opacity="0.55" clip-path="url(#kfclip)"></path>'
          f'<path d="{body}" fill="none" stroke="{INK}" stroke-width="4" stroke-linejoin="round"></path>'
          f'<ellipse cx="{cx}" cy="{top}" rx="{R}" ry="{ry}" fill="#8A5A22" stroke="{INK}" stroke-width="4"></ellipse>'
          f'<path d="M{cx - R + 4} {top + 2} A{R - 4} {ry - 3} 0 0 0 {cx + R - 4} {top + 2}" fill="none" stroke="#F1CD8E" stroke-width="5" opacity="0.8"></path>')
    # うしろから まわって てまえに くる うずまき
    a.tube(arc_pts(200, 206, 60, 14, 200, 340, 8), 28, taper=0.2)
    a.tube(arc_pts(200, 208, 62, 14, -20, 200, 12), 30, taper=0.2)
    a.tube(arc_pts(200, 178, 46, 12, 200, 340, 8), 26, taper=0.2)
    a.tube(arc_pts(200, 180, 48, 12, -20, 200, 12), 27, taper=0.2)
    a.tube(arc_pts(200, 152, 30, 10, 180, 520, 14), 22, taper=0.35)
    a.tube([(206, 136), (200, 118), (212, 104)], 16, taper=0.7)
    return a.render()


def letter_a():
    a = Art('ka', 30)
    a.tube([(120, 128), (200, 122), (272, 116)], 22, taper=0.35)
    a.tube([(186, 76), (190, 170), (196, 250), (212, 300)], 22, taper=0.35)
    a.tube([(236, 158), (212, 230), (170, 290), (132, 292), (118, 256), (150, 214), (220, 196), (284, 208), (306, 256), (280, 300), (240, 316)], 22, taper=0.45, fibers=9)
    a.raw('<g transform="translate(300 78) rotate(12)"><rect x="-22" y="-14" width="44" height="28" rx="3" fill="#FBF8F1" stroke="#2B2A28" stroke-width="2.4"></rect><path d="M-22 -4 h44" stroke="#E86A6A" stroke-width="2"></path><text x="-14" y="10" font-family="Nunito, sans-serif" font-weight="900" font-size="13" fill="#E86A6A">100</text></g>')
    return a.render()


def heart():
    a = Art('ht', 31)
    pts = []
    for i in range(24):
        t = 2 * math.pi * i / 24
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        pts.append((200 + x * 7.2, 196 + y * 7.2))
    a.lump(pts, wob=0.04, hair=60)
    return a.render(ground=(200, 322, 90))


def star():
    a = Art('kz', 32)
    pts = []
    for i in range(10):
        ang = math.radians(-90 + 36 * i)
        rr = 120 if i % 2 == 0 else 52
        pts.append((200 + rr * math.cos(ang), 206 + rr * math.sin(ang)))
    a.lump(pts, wob=0.06, hair=50)
    return a.render(ground=(200, 322, 100))


def glasses():
    a = Art('ky', 33)
    a.tube([(80, 196), (56, 176), (40, 190), (30, 214)], 9, taper=0.3)
    a.tube([(320, 196), (344, 176), (360, 190), (370, 214)], 9, taper=0.3)
    a.tube(arc_pts(140, 214, 56, 46, 0, 360, 14)[:-1], 12, closed=True)
    a.tube(arc_pts(260, 214, 56, 46, 0, 360, 14)[:-1], 12, closed=True)
    a.tube([(190, 206), (200, 196), (210, 206)], 10, taper=0.1)
    return a.render(ground=(200, 290, 140))


def ribbon():
    a = Art('kv', 34)
    a.tube([(196, 214), (170, 262), (150, 306)], 18, taper=0.4)
    a.tube([(204, 214), (230, 262), (254, 306)], 18, taper=0.4)
    a.lump([(196, 200), (150, 150), (104, 146), (92, 196), (110, 248), (156, 244)], hair=36)
    a.lump([(204, 200), (250, 150), (296, 146), (308, 196), (290, 248), (244, 244)], hair=36)
    a.oval(200, 204, 22, 26, hair=14)
    return a.render(ground=(200, 320, 110))


def bicycle():
    a = Art('ke', 35)
    for cx in (120, 284):
        a.tube(arc_pts(cx, 250, 58, 58, 0, 360, 16)[:-1], 11, closed=True)
    a.tube([(120, 250), (176, 250), (240, 176), (160, 176), (176, 250)], 9, taper=0.1)
    a.tube([(240, 176), (284, 250)], 9, taper=0.1)
    a.tube([(160, 176), (152, 152)], 9, taper=0.1)
    a.lump([(132, 146), (170, 144), (174, 154), (136, 156)], hair=10)
    a.tube([(240, 176), (232, 134), (256, 124), (268, 132)], 9, taper=0.2)
    return a.render(ground=(200, 316, 160))


def onigiri():
    a = Art('ko2', 36)
    a.lump([(200, 90), (230, 110), (300, 240), (296, 290), (260, 306), (140, 306), (104, 290), (100, 240), (170, 110)], wob=0.04, hair=50)
    # のりも えんぴつの カス（くろ）
    a.lump([(160, 234), (240, 234), (244, 312), (156, 312)], wob=0.04, hair=20, tone='brightness(0.78) contrast(1.15)')
    a.specks([(310, 318), (90, 320), (120, 150)], 36)
    return a.render(ground=(200, 322, 110))


def donut():
    a = Art('kq', 37)
    a.tube(arc_pts(200, 220, 88, 64, 0, 360, 18)[:-1], 56, closed=True, fibers=10)
    a.specks([(90, 320), (320, 300)], 37)
    return a.render(ground=(200, 312, 120))


def tiny():
    a = Art('ku', 38)
    a.tube([(186, 232), (196, 228), (206, 236)], 4, taper=0.5, fibers=0, hl=False)
    # むしめがね（ほんもの）
    a.raw(f'<g transform="translate(0 0)"><circle cx="196" cy="226" r="76" fill="#DCE3EC" fill-opacity="0.35" stroke="{INK}" stroke-width="7"></circle>'
          f'<path d="M150 180 a60 60 0 0 1 40 -22" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" opacity="0.8"></path>'
          f'<path d="M250 282 L318 350" stroke="{INK}" stroke-width="22" stroke-linecap="round"></path>'
          f'<path d="M250 282 L318 350" stroke="#3E6FB0" stroke-width="14" stroke-linecap="round"></path></g>')
    return a.render()


def eraser():
    a = Art('kr2', 39)
    a.lump([(90, 170), (94, 164), (310, 150), (316, 156), (320, 256), (314, 262), (98, 276), (92, 270)], wob=0.03, hair=50)
    a.raw('<g fill="none" stroke="#1C1B1A" stroke-width="3" opacity="0.35" stroke-linecap="round"><path d="M200 162 L204 268"></path></g>')
    a.tube([(330, 290), (344, 280), (360, 292)], 6, taper=0.6)
    a.tube([(310, 310), (326, 306)], 5, taper=0.6)
    a.specks([(346, 262), (356, 316)], 39)
    return a.render(ground=(200, 290, 130))


def king():
    # ほんものの カスキング。いすも マントも かんむりも ぜんぶ カス（かんむりと つえは キラキラの カス）
    a = Art('kkg', 43)
    # いす（せもたれ）
    a.lump([(118, 318), (112, 170), (130, 92), (170, 70), (230, 70), (270, 92), (288, 170), (282, 318)], wob=0.02, hair=40, tone='brightness(1.45)')
    a.lump([(104, 318), (104, 240), (138, 236), (140, 318)], wob=0.02, hair=10, tone='brightness(1.3)')
    a.lump([(260, 318), (262, 236), (296, 240), (296, 318)], wob=0.02, hair=10, tone='brightness(1.3)')
    # マント（あかい カス）
    a.lump([(140, 316), (136, 230), (150, 170), (200, 150), (250, 170), (264, 230), (260, 316)], wob=0.03, hair=30, tone='sepia(1) saturate(3.5) hue-rotate(-40deg) brightness(0.95)')
    # からだ と うで
    a.lump([(168, 250), (164, 196), (182, 170), (218, 170), (236, 196), (232, 250)], hair=20)
    a.tube([(174, 196), (150, 232), (178, 250)], 16, taper=0.2)
    a.tube([(226, 196), (254, 226), (262, 240)], 16, taper=0.2)
    # あし と だい
    a.tube([(184, 250), (180, 300), (170, 318)], 18, taper=0.1)
    a.tube([(216, 250), (220, 300), (230, 318)], 18, taper=0.1)
    a.lump([(96, 318), (304, 318), (316, 344), (84, 344)], wob=0.02, hair=30)
    # つえ（キラキラ）
    a.tube([(262, 330), (268, 230), (272, 150)], 9, taper=0.1, tone='sepia(1) saturate(4) hue-rotate(5deg) brightness(1.35)')
    a.oval(273, 142, 13, 13, hair=8, tone='sepia(1) saturate(4) hue-rotate(5deg) brightness(1.35)')
    # あたま と かんむり
    a.oval(200, 146, 30, 30, hair=20)
    a.lump([(168, 124), (164, 92), (182, 108), (200, 84), (218, 108), (236, 92), (232, 124)], wob=0.02, hair=10, tone='sepia(1) saturate(4) hue-rotate(5deg) brightness(1.35)')
    a.eye(190, 148, 0.7); a.eye(212, 148, 0.7)
    a.raw(sparkle(300, 110, 10) + sparkle(120, 80, 7) + sparkle(250, 70, 6))
    return a.render(ground=(200, 346, 130))


def god():
    # カスの かみさま。てが いっぱい（ほんものの けしカスアートの ように）
    a = Art('kgd', 44)
    # うしろの わっか
    a.tube(arc_pts(200, 170, 128, 128, 0, 360, 24)[:-1], 7, closed=True, tone='sepia(1) saturate(4) hue-rotate(5deg) brightness(1.35)')
    # うしろに ひろがる たくさんの て
    r = random.Random(4)
    for layer, (n, lo, hi_, w) in enumerate(((22, 92, 108, 8), (16, 62, 76, 9))):
        for i in range(n):
            ang = math.radians(-205 + 230 * i / (n - 1) + r.uniform(-2, 2) + layer * 5)
            l = r.uniform(lo, hi_)
            x0, y0 = 200 + 16 * math.cos(ang), 200 + 10 * math.sin(ang)
            x2, y2 = 200 + l * math.cos(ang), 196 + l * 0.92 * math.sin(ang)
            bend = 10 if i % 2 else -10
            x1 = (x0 + x2) / 2 - bend * math.sin(ang); y1 = (y0 + y2) / 2 + bend * math.cos(ang)
            a.tube([(x0, y0), (x1, y1), (x2, y2)], w, taper=0.25)
            a.oval(x2 + 4 * math.cos(ang), y2 + 4 * math.sin(ang), 8, 6, rot=math.degrees(ang), hair=0)
    # はすの だい
    for dx in (-60, -30, 0, 30, 60):
        a.lump([(200 + dx - 18, 332), (200 + dx - 14, 306), (200 + dx, 292), (200 + dx + 14, 306), (200 + dx + 18, 332)], wob=0.02, hair=6)
    a.lump([(130, 332), (270, 332), (262, 350), (138, 350)], wob=0.02, hair=10)
    # からだ（すそが ながい）
    a.lump([(170, 300), (176, 228), (178, 180), (200, 166), (222, 180), (224, 228), (230, 300)], wob=0.02, hair=20)
    # がっしょう
    a.tube([(182, 190), (190, 214), (198, 200)], 10, taper=0.2)
    a.tube([(218, 190), (210, 214), (202, 200)], 10, taper=0.2)
    a.lump([(194, 206), (200, 176), (206, 206)], wob=0.02, hair=4)
    # あたま と かみの まげ
    a.oval(200, 146, 25, 27, hair=12)
    a.oval(200, 114, 15, 12, hair=8)
    a.lump([(186, 122), (190, 100), (200, 92), (210, 100), (214, 122)], wob=0.02, hair=6, tone='sepia(1) saturate(4) hue-rotate(5deg) brightness(1.35)')
    a.raw('<g fill="none" stroke="#1C1B1A" stroke-width="2.4" stroke-linecap="round" opacity="0.7"><path d="M190 148 q5 3 9 0"></path><path d="M202 148 q5 3 9 0"></path></g>')
    a.raw(sparkle(76, 80, 9) + sparkle(330, 90, 7) + sparkle(340, 250, 6))
    return a.render()


def ufo():
    a = Art('kf2', 40)
    a.raw('<path d="M160 240 L110 340 L290 340 L240 240 Z" fill="#F6D77A" opacity="0.35"></path>')
    a.oval(200, 170, 48, 36, hair=24)
    a.oval(200, 212, 118, 30, hair=50)
    for x in (140, 200, 260):
        a.oval(x, 214, 8, 6, hair=0, hl=False, tone='brightness(1.9)')
    a.oval(200, 330, 14, 6, hair=0, hl=False)
    return a.render()


def bone():
    a = Art('kbn', 41)
    a.tube([(120, 230), (200, 214), (280, 198)], 36, taper=0.0)
    for x, y in ((104, 214), (114, 256), (286, 176), (298, 216)):
        a.oval(x, y, 26, 24, hair=16)
    return a.render(ground=(200, 290, 130))


def longest():
    a = Art('klg', 42)
    pts = [(24, 330), (70, 300), (60, 250), (110, 230), (170, 262), (220, 230), (200, 180), (140, 160), (130, 110), (190, 80), (260, 100), (290, 150), (340, 170), (370, 130), (350, 70), (390, 40)]
    a.tube(pts, 14, taper=0.7, lump=0.35, fibers=12)
    a.raw('<g font-family="Nunito, sans-serif" font-weight="900" fill="#E86A6A"><text x="260" y="320" font-size="22">1m?</text></g>')
    return a.render()


# id, かんすう
FILES = [
    ('dragon', dragon), ('snake', snake), ('cat', cat), ('dog', dog), ('snail', snail), ('octopus', octopus),
    ('caterpillar', caterpillar), ('chick', chick), ('whale', whale), ('trex', trex), ('rabbit', rabbit), ('crab', crab),
    ('penguin', penguin), ('hedgehog', hedgehog), ('seahorse', seahorse), ('human', human),
    ('robot', robot), ('plane', plane), ('softcream', softcream), ('letter-a', letter_a), ('heart', heart), ('star', star),
    ('glasses', glasses), ('ribbon', ribbon), ('bicycle', bicycle), ('onigiri', onigiri), ('donut', donut), ('tiny', tiny),
    ('eraser', eraser), ('ufo', ufo), ('bone', bone), ('longest', longest),
]

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else OUT
    os.makedirs(out, exist_ok=True)
    for name, fn in FILES:
        Art.sculpt = name in SCULPT
        Art.smooth = name in SMOOTH
        with open(os.path.join(out, 'katachi-' + name + '.svg'), 'w') as f:
            f.write(fn())
    print('wrote', len(FILES))
