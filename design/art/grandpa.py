INK="#2B2A28"
def grandpa(sw=2.4, detail=True, pose="normal"):
    s=[]
    a=s.append
    # body: cardigan
    a(f'<path d="M8 88c0-16 9-26 28-26s28 10 28 26z" fill="#A9BF95" stroke="{INK}" stroke-width="{sw}" stroke-linejoin="round"/>')
    # shirt V
    a(f'<path d="M28 63.5 36 76l8-12.5c-2.4-.9-5-1.3-8-1.3s-5.6.4-8 1.3z" fill="#FFFFFF" stroke="{INK}" stroke-width="{sw*0.7}" stroke-linejoin="round"/>')
    if detail:
        a(f'<path d="M36 76v12" stroke="{INK}" stroke-width="{sw*0.6}"/>')
        a('<circle cx="39.5" cy="80" r="1.3" fill="#7A6A4E"/><circle cx="39.5" cy="85.5" r="1.3" fill="#7A6A4E"/>')
        a(f'<path d="M17 88v-8M55 88v-8" stroke="#8CA27A" stroke-width="{sw*0.8}" stroke-linecap="round"/>')
    # neck
    a(f'<path d="M30.5 56v6.5c3.5 2 7.5 2 11 0V56" fill="#F2D2B6" stroke="{INK}" stroke-width="{sw*0.7}"/>')
    # side hair tufts (white fluffy)
    for side in (1,-1):
        x0=36+side*20
        d=(f'M{36+side*18.5} 42c{side*3} -1 {side*5.5} -4 {side*4.5} -8'
           f'c{side*2.5} -2 {side*2} -6.5 {-side*0.5} -8c{side*1} -3 {-side*1} -6 {-side*4} -6'
           f'c{-side*0.5} 3 {-side*1} 8 {-side*0.5} 13c0 3 0 6 {side*0.5} 9z')
        a(f'<path d="{d}" fill="#FFFFFF" stroke="#8C8A84" stroke-width="{sw*0.7}" stroke-linejoin="round"/>')
    # ears
    for cx in (15.5,56.5):
        a(f'<ellipse cx="{cx}" cy="37" rx="4.2" ry="5.6" fill="#F2CFB2" stroke="{INK}" stroke-width="{sw*0.8}"/>')
    # face
    a(f'<path d="M36 13c11.5 0 20 8.5 20 21 0 14-8.6 24-20 24S16 48 16 34c0-12.5 8.5-21 20-21z" fill="#F7DDC6" stroke="{INK}" stroke-width="{sw}"/>')
    if detail:
        a('<path d="M33 13.4c-.6-2.6.4-4.6 2.4-5.4M37.5 13.2c.2-2.2 1.6-3.6 3.6-3.8" stroke="#8C8A84" stroke-width="1.3" fill="none" stroke-linecap="round"/>')
        # forehead shine and wrinkles
        a('<ellipse cx="29" cy="19.5" rx="5" ry="2.4" fill="#FFFFFF" opacity="0.55" transform="rotate(-18 29 19.5)"/>')
        a(f'<path d="M30 24.5c4-1.3 8-1.3 12 0M31.5 28c3-.9 6-.9 9 0" stroke="#D9AE8F" stroke-width="1.2" fill="none" stroke-linecap="round"/>')
    # eyebrows: white droopy
    a(f'<path d="M22.5 29.5c2.5-3.2 7-3.8 10-1.4-2.2 .9-5.8 1-10 1.4z" fill="#FFFFFF" stroke="#8C8A84" stroke-width="{sw*0.6}" stroke-linejoin="round"/>')
    a(f'<path d="M49.5 29.5c-2.5-3.2-7-3.8-10-1.4 2.2 .9 5.8 1 10 1.4z" fill="#FFFFFF" stroke="#8C8A84" stroke-width="{sw*0.6}" stroke-linejoin="round"/>')
    # eyes: gentle smiling arcs
    a(f'<path d="M24.8 36.3c1.6-2 4.4-2 6 0M41.2 36.3c1.6-2 4.4-2 6 0" stroke="{INK}" stroke-width="{sw*0.95}" stroke-linecap="round" fill="none"/>')
    if detail:
        a(f'<path d="M22.2 37.4l-1.6 .9M49.8 37.4l1.6 .9" stroke="#C99A7C" stroke-width="1.1" stroke-linecap="round"/>')
    # glasses
    a(f'<circle cx="27.8" cy="36.4" r="5.6" fill="#FFFFFF" fill-opacity="0.18" stroke="#8A6A3E" stroke-width="{sw*0.6}"/>')
    a(f'<circle cx="44.2" cy="36.4" r="5.6" fill="#FFFFFF" fill-opacity="0.18" stroke="#8A6A3E" stroke-width="{sw*0.6}"/>')
    a(f'<path d="M33.4 36c1.6-1.2 3.6-1.2 5.2 0M22.2 35.4 17 34.4M49.8 35.4l5.2-1" stroke="#8A6A3E" stroke-width="{sw*0.55}" fill="none" stroke-linecap="round"/>')
    # cheeks
    a('<ellipse cx="23.5" cy="44.5" rx="4" ry="2.6" fill="#F29CA3" opacity="0.55"/><ellipse cx="48.5" cy="44.5" rx="4" ry="2.6" fill="#F29CA3" opacity="0.55"/>')
    # nose
    a(f'<path d="M36 38.5c3.2 0 4.6 2.6 4.3 4.6-.3 2-2.3 2.8-4.3 2.8s-4-.8-4.3-2.8c-.3-2 1.1-4.6 4.3-4.6z" fill="#EFBFA0" stroke="{INK}" stroke-width="{sw*0.6}"/>')
    # mustache
    a(f'<path d="M36 45.8c-2.5-1.6-6.5-1.8-9 .4-1.4 1.3-1 3.3.8 3.6 3 .5 6-.4 8.2-2.2 2.2 1.8 5.2 2.7 8.2 2.2 1.8-.3 2.2-2.3.8-3.6-2.5-2.2-6.5-2-9-.4z" fill="#FFFFFF" stroke="#8C8A84" stroke-width="{sw*0.6}" stroke-linejoin="round"/>')
    # smile
    a(f'<path d="M32.2 51.2c2.4 1.8 5.2 1.8 7.6 0" stroke="{INK}" stroke-width="{sw*0.75}" stroke-linecap="round" fill="none"/>')
    if detail:
        a(f'<g transform="rotate(-8 36 74)"><rect x="27" y="68" width="18" height="11" rx="2.5" fill="#F29CA3" stroke="{INK}" stroke-width="{sw*0.7}"/><rect x="33" y="68" width="12" height="11" rx="1.5" fill="#3E6FB0" stroke="{INK}" stroke-width="{sw*0.7}"/><path d="M36 71.5h6" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round"/></g>')
        for hx,hy,rot in ((27.5,76.5,-30),(45.5,73.5,20)):
            a(f'<ellipse cx="{hx}" cy="{hy}" rx="4.6" ry="3.8" transform="rotate({rot} {hx} {hy})" fill="#F2D2B6" stroke="{INK}" stroke-width="{sw*0.7}"/>')
    return "".join(s)

def svg(w,h,vb="0 0 72 88",**k):
    return f'<svg width="{w}" height="{h}" viewBox="{vb}" aria-hidden="true">{grandpa(**k)}</svg>'
if __name__=="__main__":
    big=svg(288,352,sw=2.4,detail=True)
    mid=svg(36,44,vb="8 7 56 68.4",sw=3.2,detail=False)
    sm=svg(28,34,vb="8 7 56 68.4",sw=3.6,detail=False)
    old=open('old.svg').read()
    open('prev.html','w').write(f'<body style="margin:0;background:#F6F1E7;display:flex;gap:30px;align-items:end;padding:20px">{big}{svg(144,176)}{mid}{sm}{old}<div style="background:#FFF;padding:8px">{mid}{mid}{mid}</div></body>')
    open('icon36.svg','w').write(mid); open('icon28.svg','w').write(sm); open('big.svg','w').write(svg(288,352))
