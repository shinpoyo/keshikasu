# かためた けしカス の 質感（STAGE 4 から）
# 毛は はやさない。ほぼ つるっとした かたまりに、おしかためた カスの あとが ところどころ のこる もようを タイル（pattern）で しき、
# 上から まるみの かげを かさねる。タイルに するのは ファイルを かるく するため
import math, random

TILE = 90


def _crumbs(seed, dens=0.009):
    r = random.Random(seed)
    n = int(TILE * TILE * dens)
    sh, bd, hi = [], [], []
    for _ in range(n):
        x = r.uniform(0, TILE); y = r.uniform(0, TILE)
        a = r.uniform(0, 6.28); l = r.uniform(4, 8); w = r.uniform(2.2, 3.2)
        bend = r.uniform(-3, 3)
        g = r.randint(0x50, 0x5A)
        col = f'#{g:02X}{g - 2:02X}{g - 5:02X}'
        # はしを こえる ものは はんたいがわにも かく（つなぎめが みえないように）
        for ox in (-TILE, 0, TILE):
            for oy in (-TILE, 0, TILE):
                sx, sy = x + ox, y + oy
                ex, ey = sx + l * math.cos(a), sy + l * math.sin(a)
                if max(sx, ex) < -6 or min(sx, ex) > TILE + 6 or max(sy, ey) < -6 or min(sy, ey) > TILE + 6:
                    continue
                mx = sx + l / 2 * math.cos(a) - bend * math.sin(a)
                my = sy + l / 2 * math.sin(a) + bend * math.cos(a)
                d = f'M{sx:.0f} {sy:.0f}Q{mx:.0f} {my:.0f} {ex:.0f} {ey:.0f}'
                sh.append(f'<path d="{d}" stroke-width="{w + 1:.1f}"></path>')
                bd.append(f'<path d="{d}" stroke="{col}" stroke-width="{w:.1f}"></path>')
                hi.append(f'<path d="{d}"></path>')
    return sh, bd, hi


def defs(p, seed=1, smooth=False):
    sh, bd, hi = _crumbs(seed) if not smooth else ([], [], [])
    pat = '' if smooth else (f'<pattern id="{p}pk" width="{TILE}" height="{TILE}" patternUnits="userSpaceOnUse">'
            f'<rect width="{TILE}" height="{TILE}" fill="#4E4C49"></rect>'
            f'<g fill="none" stroke-linecap="round" stroke="#2A2927" opacity="0.55" transform="translate(0.6 1)">{"".join(sh)}</g>'
            f'<g fill="none" stroke-linecap="round">{"".join(bd)}</g>'
            f'<g fill="none" stroke-linecap="round" stroke="#B5B2AB" stroke-width="0.8" opacity="0.3" transform="translate(-0.5 -0.8)">{"".join(hi)}</g>'
            f'</pattern>')
    return (f'<defs>{pat}<radialGradient id="{p}shade" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.26"></stop>'
            f'<stop offset="0.4" stop-color="#FFFFFF" stop-opacity="0"></stop><stop offset="1" stop-color="#000000" stop-opacity="0.6"></stop></radialGradient>'
            f'<linearGradient id="{p}shadeT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.16"></stop>'
            f'<stop offset="0.5" stop-color="#000000" stop-opacity="0"></stop><stop offset="1" stop-color="#000000" stop-opacity="0.5"></stop></linearGradient>'
            f'<filter id="{p}edge" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="2" seed="5" result="n"></feTurbulence>'
            f'<feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap></filter></defs>')


def solid(p, d, shade='shade', rule='nonzero', smooth=False):
    """d の かたちを かためた カスで ぬる（かげは べつに かく）。smooth なら もようなしの つるつる"""
    base = '#524F4B' if smooth else f'url(#{p}pk)'
    return (f'<g filter="url(#{p}edge)"><path d="{d}" fill="{base}" fill-rule="{rule}"></path>'
            f'<path d="{d}" fill="url(#{p}{shade})" fill-rule="{rule}"></path></g>')
