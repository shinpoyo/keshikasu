# カスキングと カス神（STAGE 7 の かたちカス）
# けしカスを おしかためて つくった 彫刻の ように、つるっと なめらかに。金の ところは 金の けしゴムの カス
# つかいかた: python3 royal.py [出力先] → katachi-king.svg / katachi-god.svg
import os, sys, math

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'art')

# ざいりょうの いろ（上の ひかり → まんなか → かげ）
MAT = {
    'crumb': ('#9A968F', '#5E5B56', '#2F2D2A'),   # ふつうの けしカス
    'stone': ('#C9C4BB', '#8F8A82', '#55524D'),   # いす・だい（うすい いろの カス）
    'dark':  ('#7A7670', '#46433F', '#232120'),   # おくの うで
    'red':   ('#D8685C', '#9A3129', '#561714'),   # あかい けしゴムの カス（マント）
    'navy':  ('#5B6FA6', '#2E3B6B', '#161D38'),   # あおい けしゴムの カス（いすの ぬの）
    'cream': ('#FFFBF1', '#E6DDCB', '#A99F8C'),   # しろい けしゴムの カス（えり）
    'gold':  ('#FFF4C2', '#EDC24A', '#8A5E08'),   # 金の カス
    'face':  ('#AEAAA3', '#716E68', '#3C3A37'),   # かお（すこし あかるく）
    'lotus': ('#FBD9DC', '#E3949C', '#9C4B55'),   # ピンクの けしゴムの カス（はす）
    'mist':  ('#B6B2AB', '#85817B', '#57544F'),   # いちばん おくの うで（すこし かすむ）
}
EDGE = {'gold': '#6B4A06', 'red': '#3E0F0C', 'navy': '#0E1428', 'lotus': '#6E2A33'}


def defs(p):
    o = ['<defs>']
    for k, (a, b, c) in MAT.items():
        # たて（上が あかるい）と、左上から あたる まるみ
        o.append(f'<linearGradient id="{p}{k}" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="{a}"></stop>'
                 f'<stop offset="0.5" stop-color="{b}"></stop><stop offset="1" stop-color="{c}"></stop></linearGradient>')
    o.append(f'<radialGradient id="{p}vol" cx="0.32" cy="0.26" r="0.9"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.34"></stop>'
             f'<stop offset="0.35" stop-color="#FFFFFF" stop-opacity="0"></stop><stop offset="0.8" stop-color="#000000" stop-opacity="0.12"></stop>'
             f'<stop offset="1" stop-color="#000000" stop-opacity="0.38"></stop></radialGradient>')
    o.append(f'<linearGradient id="{p}shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"></stop>'
             f'<stop offset="0.45" stop-color="#FFFFFF" stop-opacity="0.7"></stop><stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.7"></stop>'
             f'<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"></stop></linearGradient>')
    o.append(f'<radialGradient id="{p}glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFE9A8" stop-opacity="0.75"></stop>'
             f'<stop offset="0.55" stop-color="#F6D77A" stop-opacity="0.22"></stop><stop offset="1" stop-color="#F6D77A" stop-opacity="0"></stop></radialGradient>')
    o.append(f'<radialGradient id="{p}gem" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#FFD6D2"></stop>'
             f'<stop offset="0.4" stop-color="#E0453C"></stop><stop offset="1" stop-color="#6E0D0A"></stop></radialGradient>')
    o.append(f'<radialGradient id="{p}gemb" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#D6ECFF"></stop>'
             f'<stop offset="0.4" stop-color="#3E8AD8"></stop><stop offset="1" stop-color="#0D2E63"></stop></radialGradient>')
    o.append(f'<filter id="{p}blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"></feGaussianBlur></filter>')
    o.append(f'<filter id="{p}soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6"></feGaussianBlur></filter>')
    o.append('</defs>')
    return ''.join(o)


def shape(p, d, mat='crumb', vol=True, edge=0.45):
    """d を ざいりょうで ぬる。まるみの かげと ふちの 線つき"""
    col = EDGE.get(mat, '#1E1D1B')
    s = f'<path d="{d}" fill="url(#{p}{mat})"></path>'
    if vol:
        s += f'<path d="{d}" fill="url(#{p}vol)"></path>'
    s += f'<path d="{d}" fill="none" stroke="{col}" stroke-opacity="{edge}" stroke-width="1.3" stroke-linejoin="round"></path>'
    return s


def circ(p, x, y, r, mat='crumb', edge=0.45):
    return shape(p, f'M{x - r:.1f} {y:.1f}a{r:.1f} {r:.1f} 0 1 0 {2 * r:.1f} 0a{r:.1f} {r:.1f} 0 1 0 {-2 * r:.1f} 0Z', mat, edge=edge)


def ell(p, x, y, rx, ry, mat='crumb', rot=0, edge=0.45):
    d = f'M{x - rx:.1f} {y:.1f}a{rx:.1f} {ry:.1f} 0 1 0 {2 * rx:.1f} 0a{rx:.1f} {ry:.1f} 0 1 0 {-2 * rx:.1f} 0Z'
    s = shape(p, d, mat, edge=edge)
    return f'<g transform="rotate({rot:.1f} {x:.1f} {y:.1f})">{s}</g>' if rot else s


def smooth_path(pts, closed=True):
    """とおる 点から なめらかな 曲線（Catmull-Rom → ベジェ）"""
    n = len(pts)
    P = pts
    d = f'M{P[0][0]:.1f} {P[0][1]:.1f}'
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = P[(i - 1) % n] if closed or i > 0 else P[0]
        p1 = P[i]
        p2 = P[(i + 1) % n]
        p3 = P[(i + 2) % n] if closed or i + 2 < n else P[-1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f'C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    return d + ('Z' if closed else '')


def limb(pts, w0, w1):
    """ほそく なっていく うで（はしは まるい）"""
    n = len(pts)
    L, R = [], []
    for i, (x, y) in enumerate(pts):
        a = pts[max(i - 1, 0)]; b = pts[min(i + 1, n - 1)]
        tx, ty = b[0] - a[0], b[1] - a[1]
        l = math.hypot(tx, ty) or 1
        nx, ny = -ty / l, tx / l
        w = (w0 + (w1 - w0) * i / (n - 1)) / 2
        L.append((x + nx * w, y + ny * w)); R.append((x - nx * w, y - ny * w))
    # さきの まるい はし
    ex, ey = pts[-1]; px, py = pts[-2]
    tx, ty = ex - px, ey - py; l = math.hypot(tx, ty) or 1
    cap = (ex + tx / l * w1 / 2, ey + ty / l * w1 / 2)
    sx, sy = pts[0]; qx, qy = pts[1]
    tx, ty = sx - qx, sy - qy; l = math.hypot(tx, ty) or 1
    cap0 = (sx + tx / l * w0 / 2, sy + ty / l * w0 / 2)
    return smooth_path(L + [cap] + R[::-1] + [cap0])


def rrect(x, y, w, h, r):
    return (f'M{x + r} {y} H{x + w - r} Q{x + w} {y} {x + w} {y + r} V{y + h - r} Q{x + w} {y + h} {x + w - r} {y + h} '
            f'H{x + r} Q{x} {y + h} {x} {y + h - r} V{y + r} Q{x} {y} {x + r} {y}Z')


def sparkle(x, y, s, color='#FFE9A8', op=1.0):
    return (f'<path d="M{x} {y - s} Q{x + s * 0.16} {y - s * 0.16} {x + s} {y} Q{x + s * 0.16} {y + s * 0.16} {x} {y + s} '
            f'Q{x - s * 0.16} {y + s * 0.16} {x - s} {y} Q{x - s * 0.16} {y - s * 0.16} {x} {y - s}Z" fill="{color}" opacity="{op}"></path>')


def wrap(p, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">\n'
            + defs(p) + body + '</svg>\n')


def mirror(pts, cx=200):
    return [(2 * cx - x, y) for x, y in pts]


# ====================== カスキング ======================
def king():
    p = 'rk'
    o = []
    o.append(f'<ellipse cx="200" cy="170" rx="190" ry="170" fill="url(#{p}glow)"></ellipse>')
    o.append(f'<ellipse cx="200" cy="356" rx="150" ry="14" fill="#000000" opacity="0.28" filter="url(#{p}blur)"></ellipse>')

    # だん（2だん）
    o.append(shape(p, rrect(58, 336, 284, 22, 6), 'stone'))
    o.append(f'<path d="M62 344 H338" stroke="url(#{p}gold)" stroke-width="2.6"></path>')
    o.append(shape(p, rrect(82, 316, 236, 24, 6), 'stone'))
    o.append(f'<path d="M86 324 H314" stroke="url(#{p}gold)" stroke-width="2.4"></path>')

    # いすの せもたれ（とがった アーチ）
    back = [(106, 318), (104, 170), (112, 128), (138, 96), (170, 70), (200, 38), (230, 70), (262, 96), (288, 128), (296, 170), (294, 318)]
    o.append(shape(p, smooth_path(back), 'stone'))
    # 金の ふち
    rim = [(118, 316), (116, 172), (124, 134), (148, 106), (176, 84), (200, 58), (224, 84), (252, 106), (276, 134), (284, 172), (282, 316)]
    o.append(f'<path d="{smooth_path(rim, closed=False)}" fill="none" stroke="url(#{p}gold)" stroke-width="4" stroke-linecap="round"></path>')
    # あおい ぬのの パネル
    panel = [(130, 312), (128, 176), (136, 142), (156, 118), (182, 98), (200, 80), (218, 98), (244, 118), (264, 142), (272, 176), (270, 312)]
    o.append(shape(p, smooth_path(panel), 'navy'))
    # ぬのの ボタン（ふかふか）
    for y in (150, 196, 242):
        for x in ((200,) if y == 150 else (170, 230) if y == 196 else (200,)):
            o.append(f'<circle cx="{x}" cy="{y}" r="3.2" fill="url(#{p}gold)" stroke="#6B4A06" stroke-opacity="0.5" stroke-width="0.8"></circle>')
    for (x1, y1, x2, y2) in ((200, 150, 170, 196), (200, 150, 230, 196), (170, 196, 200, 242), (230, 196, 200, 242)):
        o.append(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="#0E1428" stroke-opacity="0.35" stroke-width="1.4"></path>')
    # かざりの 玉と いちばん上の ほうせき
    for x in (106, 294):
        o.append(shape(p, smooth_path([(x - 7, 150), (x + 7, 150), (x + 5, 138), (x - 5, 138)]), 'gold'))
        o.append(circ(p, x, 128, 11, 'gold', edge=0.55))
        o.append(f'<ellipse cx="{x - 4}" cy="{124}" rx="3.5" ry="2.4" fill="#FFFFFF" opacity="0.8"></ellipse>')
    o.append(circ(p, 200, 34, 10, 'gold', edge=0.55))
    o.append(f'<path d="M200 22 L207 34 L200 46 L193 34 Z" fill="url(#{p}gem)" stroke="#3E0F0C" stroke-opacity="0.5" stroke-width="0.8"></path>')
    o.append(sparkle(203, 28, 4, '#FFFFFF', 0.9))

    # マント（うしろに ひろがる）
    cape = [(158, 150), (242, 150), (262, 176), (276, 250), (290, 320), (240, 326), (200, 320), (160, 326), (110, 320), (124, 250), (138, 176)]
    o.append(shape(p, smooth_path(cape), 'red'))
    o.append(f'<path d="{smooth_path(cape)}" fill="none" stroke="url(#{p}gold)" stroke-width="2.6" opacity="0.85"></path>')
    # マントの ひだ（やわらかい かげ）
    for pts in ([(150, 190), (140, 250), (132, 318)], [(250, 190), (260, 250), (268, 318)], [(176, 250), (170, 320)], [(224, 250), (230, 320)]):
        o.append(f'<path d="{smooth_path(pts, closed=False)}" fill="none" stroke="#3E0F0C" stroke-opacity="0.35" stroke-width="5" stroke-linecap="round" filter="url(#{p}soft)"></path>')
    o.append(f'<path d="M132 300 Q200 316 268 300" fill="none" stroke="url(#{p}gold)" stroke-width="3" opacity="0.9"></path>')

    # ひじかけ（金の おびつき）
    for x in (90, 250):
        o.append(shape(p, rrect(x, 250, 60, 66, 8), 'stone'))
        o.append(f'<path d="M{x + 4} 296 H{x + 56}" stroke="url(#{p}gold)" stroke-width="2.4"></path>')
        o.append(shape(p, rrect(x - 4, 238, 68, 16, 8), 'stone'))
        o.append(f'<path d="M{x} 246 H{x + 60}" stroke="url(#{p}gold)" stroke-width="1.6" opacity="0.8"></path>')
        o.append(circ(p, x + (-2 if x < 200 else 62), 246, 7, 'gold', edge=0.5))

    # ながい ローブ（すそから くつの さきが でる）
    o.append(ell(p, 182, 318, 14, 6.5, 'crumb'))
    o.append(ell(p, 218, 318, 14, 6.5, 'crumb'))
    robe = [(166, 228), (234, 228), (244, 262), (252, 300), (250, 314), (200, 318), (150, 314), (148, 300), (156, 262)]
    o.append(shape(p, smooth_path(robe), 'crumb'))
    for pts in ([(186, 250), (182, 312)], [(214, 250), (218, 312)], [(200, 256), (200, 316)]):
        o.append(f'<path d="{smooth_path(pts, closed=False)}" fill="none" stroke="#1E1D1B" stroke-opacity="0.3" stroke-width="4" stroke-linecap="round" filter="url(#{p}soft)"></path>')
    o.append(f'<path d="{smooth_path([(152, 308), (200, 314), (248, 308)], closed=False)}" fill="none" stroke="url(#{p}gold)" stroke-width="3"></path>')

    # からだ
    body = [(172, 164), (228, 164), (238, 196), (232, 240), (200, 246), (168, 240), (162, 196)]
    o.append(shape(p, smooth_path(body), 'crumb'))
    # ベルトと バックル
    o.append(f'<path d="{smooth_path([(166, 222), (200, 228), (234, 222)], closed=False)}" fill="none" stroke="url(#{p}gold)" stroke-width="6"></path>')
    o.append(f'<rect x="192" y="219" width="16" height="13" rx="3" fill="url(#{p}gold)" stroke="#6B4A06" stroke-opacity="0.6" stroke-width="1"></rect>')
    o.append(f'<circle cx="200" cy="225.5" r="3" fill="url(#{p}gem)"></circle>')

    # ひだりうで（ひじかけに のせる）
    o.append(shape(p, limb([(170, 172), (150, 196), (138, 222), (130, 238)], 22, 16), 'crumb'))
    o.append(ell(p, 128, 240, 11, 9, 'crumb', rot=-20))
    # みぎうで（つえを もつ）
    o.append(shape(p, limb([(230, 172), (250, 192), (262, 212), (268, 222)], 22, 16), 'crumb'))

    # つえ
    o.append(f'<rect x="265" y="104" width="7" height="206" rx="3.5" fill="url(#{p}gold)" stroke="#6B4A06" stroke-opacity="0.5" stroke-width="1"></rect>')
    for y in (150, 196, 262):
        o.append(f'<rect x="262" y="{y}" width="13" height="5" rx="2.5" fill="url(#{p}gold)" stroke="#6B4A06" stroke-opacity="0.5" stroke-width="0.8"></rect>')
    o.append(circ(p, 268.5, 96, 13, 'gold', edge=0.55))
    o.append(f'<ellipse cx="263" cy="90" rx="5" ry="3.4" fill="#FFFFFF" opacity="0.85"></ellipse>')
    o.append(f'<path d="M268.5 58 L274 76 L268.5 84 L263 76 Z" fill="url(#{p}gemb)" stroke="#0D2E63" stroke-opacity="0.5" stroke-width="0.8"></path>')
    o.append(ell(p, 268, 224, 10, 11, 'crumb'))  # つえを にぎる て

    # えり（しろい カスの ファー）
    collar = [(152, 164), (176, 152), (200, 158), (224, 152), (248, 164), (240, 178), (216, 174), (200, 186), (184, 174), (160, 178)]
    o.append(shape(p, smooth_path(collar), 'cream', edge=0.35))
    o.append(f'<path d="M200 162 L200 184" stroke="url(#{p}gold)" stroke-width="3"></path>')
    o.append(f'<circle cx="200" cy="168" r="4.5" fill="url(#{p}gold)" stroke="#6B4A06" stroke-opacity="0.6" stroke-width="0.8"></circle>')

    # 金の くさりと 消しゴムの メダル
    o.append(f'<path d="{smooth_path([(176, 176), (188, 194), (200, 200), (212, 194), (224, 176)], closed=False)}" fill="none" stroke="url(#{p}gold)" stroke-width="2.2" stroke-dasharray="3 1.6"></path>')
    o.append(circ(p, 200, 204, 10, 'gold', edge=0.6))
    o.append('<g transform="rotate(-20 200 204)"><rect x="193" y="200" width="14" height="8" rx="1.5" fill="#FBF8F1" stroke="#2B2A28" stroke-opacity="0.6" stroke-width="0.7"></rect>'
             '<rect x="198" y="200" width="9" height="8" fill="#3E6FB0"></rect></g>')

    # あたま
    o.append(ell(p, 200, 128, 29, 28, 'face'))
    o.append(f'<g fill="#161514" opacity="0.85"><ellipse cx="189" cy="132" rx="4" ry="3"></ellipse><ellipse cx="211" cy="132" rx="4" ry="3"></ellipse></g>')
    o.append(f'<path d="M185 125 q4 -3 8 -1 M207 124 q4 -2 8 1" fill="none" stroke="#161514" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round"></path>')

    # かんむり
    crown = [(170, 114), (168, 82), (180, 96), (188, 74), (200, 90), (212, 74), (220, 96), (232, 82), (230, 114), (200, 110)]
    d = 'M' + ' L'.join(f'{x} {y}' for x, y in crown) + 'Z'
    o.append(shape(p, d, 'gold', edge=0.6))
    o.append(f'<path d="M170 112 Q200 104 230 112 L230 118 Q200 110 170 118 Z" fill="url(#{p}gold)" stroke="#6B4A06" stroke-opacity="0.6" stroke-width="1"></path>')
    for (x, y) in ((168, 80), (188, 72), (212, 72), (232, 80)):
        o.append(f'<circle cx="{x}" cy="{y}" r="3.6" fill="url(#{p}gold)" stroke="#6B4A06" stroke-opacity="0.6" stroke-width="0.8"></circle>')
    o.append(f'<path d="M200 80 L205 90 L200 100 L195 90 Z" fill="url(#{p}gem)" stroke="#3E0F0C" stroke-opacity="0.5" stroke-width="0.8"></path>')
    o.append(f'<circle cx="182" cy="106" r="3.2" fill="url(#{p}gemb)"></circle><circle cx="218" cy="106" r="3.2" fill="url(#{p}gemb)"></circle>')
    o.append(f'<path d="M176 100 L178 88" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="2" stroke-linecap="round"></path>')

    o.append(sparkle(326, 92, 11) + sparkle(76, 118, 8) + sparkle(318, 196, 6, '#FFFFFF', 0.8) + sparkle(88, 58, 5, '#FFFFFF', 0.8))
    return wrap(p, ''.join(o))


# ====================== カス神（せんじゅ） ======================
def god():
    p = 'rg'
    o = []
    cx, cy = 200, 180
    o.append(f'<ellipse cx="200" cy="175" rx="195" ry="180" fill="url(#{p}glow)"></ellipse>')
    o.append(f'<ellipse cx="200" cy="360" rx="120" ry="12" fill="#000000" opacity="0.28" filter="url(#{p}blur)"></ellipse>')

    # うしろの 大きな 光の わ（ほそい ひかりの すじつき）
    rays = []
    for i in range(72):
        a = math.radians(i * 5)
        r0, r1 = 150, 162 if i % 2 else 170
        rays.append(f'M{cx + r0 * math.cos(a):.1f} {cy + r0 * math.sin(a):.1f} L{cx + r1 * math.cos(a):.1f} {cy + r1 * math.sin(a):.1f}')
    o.append(f'<path d="{" ".join(rays)}" stroke="#E7B533" stroke-opacity="0.55" stroke-width="1.6" stroke-linecap="round"></path>')
    o.append(f'<circle cx="{cx}" cy="{cy}" r="150" fill="none" stroke="url(#{p}gold)" stroke-width="5"></circle>')
    o.append(f'<circle cx="{cx}" cy="{cy}" r="143" fill="none" stroke="#E7B533" stroke-opacity="0.45" stroke-width="1.2"></circle>')

    # たくさんの て（3だん。おくほど うすく かすむ）。まうえは あたまの 光を よける
    items = {2: 'pencil', 7: 'eraser', 12: 'ruler', 17: 'pencil', 22: 'eraser', 27: 'ruler'}
    layers = [(30, 140, 7, 5, 'mist', -214, 34, 9), (22, 112, 8.5, 6, 'crumb', -208, 28, 16), (12, 82, 10, 7, 'crumb', -198, 18, 22)]
    for li, (n, L, w0, w1, mat, a0, a1, gap) in enumerate(layers):
        for i in range(n):
            deg = a0 + (a1 - a0) * i / (n - 1)
            if abs(deg + 90) < gap:
                continue
            ang = math.radians(deg)
            side = 1 if math.cos(ang) >= 0 else -1
            sx, sy = cx + 16 * math.cos(ang), cy - 8 + 10 * math.sin(ang)
            ex, ey = cx + L * math.cos(ang), cy - 8 + L * 0.96 * math.sin(ang)
            # ひじで すこし まがる（そとがわへ）
            k = 0.1 * side
            mx = (sx + ex) / 2 + (ey - sy) * k
            my = (sy + ey) / 2 - (ex - sx) * k
            o.append(shape(p, limb([(sx, sy), (mx, my), (ex, ey)], w0, w1), mat, edge=0.45))
            tx, ty = ex - mx, ey - my
            l = math.hypot(tx, ty); ux, uy = tx / l, ty / l
            o.append(hand(p, ex + ux * 3, ey + uy * 3, ux, uy, mat, 1.0 if li else 0.85))
            it = items.get(i) if li == 0 else None
            if it:
                d2 = math.degrees(math.atan2(uy, ux))
                o.append(f'<g transform="translate({ex + ux * 10:.1f} {ey + uy * 10:.1f}) rotate({d2 + 90:.1f}) scale(1.35)">{stationery(p, it)}</g>')

    # はすの だい（ピンクの けしゴムの カス）
    for x in (122, 152, 182, 218, 248, 278):
        o.append(shape(p, petal(x, 334, 36, 42), 'lotus', edge=0.4))
    o.append(shape(p, smooth_path([(106, 334), (294, 334), (286, 352), (200, 358), (114, 352)]), 'stone'))
    o.append(f'<path d="M112 342 Q200 352 288 342" fill="none" stroke="url(#{p}gold)" stroke-width="3"></path>')
    for x in (134, 167, 200, 233, 266):
        o.append(shape(p, petal(x, 344, 38, 40), 'lotus', edge=0.45))
        o.append(f'<path d="M{x - 4} {344 - 32} Q{x - 9} {344 - 16} {x - 6} 340" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"></path>')

    # からだ（ながい ころも）
    robe = [(178, 146), (222, 146), (234, 190), (236, 250), (244, 300), (220, 312), (200, 308), (180, 312), (156, 300), (164, 250), (166, 190)]
    o.append(shape(p, smooth_path(robe), 'crumb'))
    for pts in ([(186, 232), (180, 270), (176, 306)], [(214, 232), (220, 270), (224, 306)], [(200, 240), (200, 306)]):
        o.append(f'<path d="{smooth_path(pts, closed=False)}" fill="none" stroke="#1E1D1B" stroke-opacity="0.32" stroke-width="4" stroke-linecap="round" filter="url(#{p}soft)"></path>')
    # かたから ななめの 金の おび
    o.append(f'<path d="{smooth_path([(176, 156), (200, 196), (232, 236)], closed=False)}" fill="none" stroke="url(#{p}gold)" stroke-width="5" stroke-linecap="round"></path>')
    o.append(f'<path d="{smooth_path([(166, 226), (200, 234), (234, 226)], closed=False)}" fill="none" stroke="url(#{p}gold)" stroke-width="3.4"></path>')

    # がっしょう（むねの まえで てを あわせる）
    o.append(shape(p, limb([(176, 170), (182, 196), (196, 204)], 13, 10), 'crumb'))
    o.append(shape(p, limb([(224, 170), (218, 196), (204, 204)], 13, 10), 'crumb'))
    o.append(shape(p, smooth_path([(194, 210), (193, 190), (200, 172), (207, 190), (206, 210), (200, 213)]), 'crumb'))
    o.append(f'<path d="M200 176 L200 210" stroke="#1E1D1B" stroke-opacity="0.45" stroke-width="1.2"></path>')

    # あたまの うしろの 光
    o.append(f'<circle cx="200" cy="110" r="44" fill="#FFF1C4" opacity="0.35"></circle>')
    o.append(f'<circle cx="200" cy="110" r="44" fill="none" stroke="url(#{p}gold)" stroke-width="3.4"></circle>')
    # くび・あたま・みみ
    o.append(shape(p, smooth_path([(190, 136), (210, 136), (212, 152), (188, 152)]), 'crumb'))
    for x in (176, 224):
        o.append(ell(p, x, 124, 5, 12, 'crumb', edge=0.5))
    o.append(ell(p, 200, 116, 23, 26, 'face'))
    # まげ と かんむり
    o.append(ell(p, 200, 82, 13, 11, 'crumb'))
    o.append(ell(p, 200, 70, 8, 7, 'crumb'))
    o.append(shape(p, smooth_path([(178, 100), (186, 88), (200, 84), (214, 88), (222, 100), (200, 96)]), 'gold', edge=0.55))
    o.append(f'<path d="M200 76 L204 84 L200 92 L196 84 Z" fill="url(#{p}gem)"></path>')
    # かお（とじた め と ひたいの 金の てん）
    o.append('<path d="M187 118 q6 4 11 0 M202 118 q6 4 11 0" fill="none" stroke="#161514" stroke-opacity="0.75" stroke-width="2.2" stroke-linecap="round"></path>')
    o.append('<path d="M195 132 q5 3 10 0" fill="none" stroke="#161514" stroke-opacity="0.35" stroke-width="1.8" stroke-linecap="round"></path>')
    o.append(f'<circle cx="200" cy="106" r="2.6" fill="url(#{p}gold)"></circle>')

    o.append(sparkle(40, 60, 10) + sparkle(362, 70, 8) + sparkle(372, 280, 6, '#FFFFFF', 0.8) + sparkle(30, 300, 6, '#FFFFFF', 0.8))
    return wrap(p, ''.join(o))


def petal(x, base, w, h):
    """はすの はなびら（さきが とがる）"""
    t = base - h
    return (f'M{x - w / 2:.1f} {base:.1f} C{x - w / 2 - 2:.1f} {base - h * 0.5:.1f} {x - w * 0.2:.1f} {t + h * 0.18:.1f} {x:.1f} {t:.1f} '
            f'C{x + w * 0.2:.1f} {t + h * 0.18:.1f} {x + w / 2 + 2:.1f} {base - h * 0.5:.1f} {x + w / 2:.1f} {base:.1f} Q{x:.1f} {base + 5:.1f} {x - w / 2:.1f} {base:.1f}Z')


def hand(p, x, y, ux, uy, mat, s=1.0):
    """ひらいた て（てのひら と 4本の ゆび と おやゆび）。(ux,uy) が ゆびの むき"""
    vx, vy = -uy, ux
    col = MAT[mat][1]
    o = [ell(p, x + ux * 3 * s, y + uy * 3 * s, 5 * s, 4.6 * s, mat, edge=0.45)]
    for off, ln in ((-3.6, 7), (-1.2, 8.5), (1.2, 8.5), (3.6, 7)):
        bx, by = x + ux * 4 * s + vx * off * s, y + uy * 4 * s + vy * off * s
        fx, fy = bx + ux * ln * s, by + uy * ln * s
        o.append(f'<path d="M{bx:.1f} {by:.1f} L{fx:.1f} {fy:.1f}" stroke="#1E1D1B" stroke-opacity="0.5" stroke-width="{3.8 * s:.1f}" stroke-linecap="round"></path>'
                 f'<path d="M{bx:.1f} {by:.1f} L{fx:.1f} {fy:.1f}" stroke="{col}" stroke-width="{2.7 * s:.1f}" stroke-linecap="round"></path>')
    tx, ty = x + vx * 5.5 * s + ux * 2 * s, y + vy * 5.5 * s + uy * 2 * s
    o.append(f'<path d="M{x + vx * 3 * s:.1f} {y + vy * 3 * s:.1f} L{tx + ux * 3 * s:.1f} {ty + uy * 3 * s:.1f}" stroke="#1E1D1B" stroke-opacity="0.5" stroke-width="{3.8 * s:.1f}" stroke-linecap="round"></path>'
             f'<path d="M{x + vx * 3 * s:.1f} {y + vy * 3 * s:.1f} L{tx + ux * 3 * s:.1f} {ty + uy * 3 * s:.1f}" stroke="{col}" stroke-width="{2.7 * s:.1f}" stroke-linecap="round"></path>')
    return ''.join(o)


def stationery(p, kind):
    """て に もつ 文房具（ちいさく）。原点が もつ ところ、上に のびる"""
    if kind == 'pencil':
        return ('<path d="M-3.5 4 V-16 L0 -23 L3.5 -16 V4 Z" fill="#E7B533" stroke="#6B4A06" stroke-opacity="0.6" stroke-width="0.8"></path>'
                '<path d="M-3.5 -16 L0 -23 L3.5 -16 Z" fill="#E9D3AE"></path><path d="M-1 -20 L0 -23 L1 -20 Z" fill="#2B2A28"></path>'
                '<rect x="-3.5" y="4" width="7" height="4" fill="#F29CA3"></rect>')
    if kind == 'eraser':
        return ('<rect x="-5" y="-14" width="10" height="16" rx="2" fill="#FBF8F1" stroke="#2B2A28" stroke-opacity="0.5" stroke-width="0.8"></rect>'
                '<rect x="-5" y="-8" width="10" height="10" fill="#3E6FB0"></rect>')
    return ('<rect x="-3" y="-24" width="6" height="28" rx="1" fill="#9FC7E8" stroke="#2B2A28" stroke-opacity="0.45" stroke-width="0.8"></rect>'
            '<path d="M-3 -20 h3 M-3 -15 h2 M-3 -10 h3 M-3 -5 h2" stroke="#2B2A28" stroke-opacity="0.6" stroke-width="0.7"></path>')


FILES = [('king', king), ('god', god)]

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else OUT
    os.makedirs(out, exist_ok=True)
    for name, fn in FILES:
        with open(os.path.join(out, 'katachi-' + name + '.svg'), 'w') as f:
            f.write(fn())
    print('wrote', len(FILES))
