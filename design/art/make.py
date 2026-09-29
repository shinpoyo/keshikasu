import sys, random, math
from strand import strand, fibers_for
def defs(p):
    return f'''<defs><linearGradient id="{p}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5F5E5B"></stop><stop offset="0.5" stop-color="#3D3C3A"></stop><stop offset="1" stop-color="#222120"></stop></linearGradient><radialGradient id="{p}bg" cx="0.38" cy="0.34" r="0.75"><stop offset="0" stop-color="#6A6864"></stop><stop offset="0.55" stop-color="#403F3C"></stop><stop offset="1" stop-color="#1F1E1D"></stop></radialGradient><filter id="{p}fz" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap></filter><filter id="{p}gr" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="7" result="t"></feTurbulence><feColorMatrix in="t" type="matrix" values="0 0 0 0 0.62 0 0 0 0 0.61 0 0 0 0 0.59 0 0 0 0.55 -0.22" result="w"></feColorMatrix><feComposite in="w" in2="SourceGraphic" operator="in" result="wi"></feComposite><feMerge><feMergeNode in="SourceGraphic"></feMergeNode><feMergeNode in="wi"></feMergeNode></feMerge></filter><filter id="{p}sh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"></feGaussianBlur></filter></defs>'''
def strands_svg(p,specs,fibers=6,hl=True):
    sh=[];body=[];hi=[];fb=[]
    for (x,y,l,a,w,wig,s) in specs:
        d,pts=strand(x,y,l,a,w,wig,s)
        sh.append(f'<path d="{d}" transform="translate(3 6)"></path>')
        body.append(f'<path d="{d}"></path>')
        if hl and w>8:
            cl="M"+" L".join(f"{q[0]:.1f} {q[1]-w*0.12:.1f}" for q in pts[3:-3])
            hi.append(f'<path d="{cl}" stroke-width="{max(1.2,w*0.16):.1f}"></path>')
        for f in fibers_for(pts,s,fibers): fb.append(f'<path d="{f}"></path>')
    return (f'<g fill="#000000" opacity="0.28" filter="url(#{p}sh)">{"".join(sh)}</g>'
            f'<g fill="url(#{p}g)" filter="url(#{p}fz)"><g filter="url(#{p}gr)">{"".join(body)}</g></g>'
            f'<g fill="none" stroke="#9A9893" stroke-linecap="round" opacity="0.45" filter="url(#{p}fz)">{"".join(hi)}</g>'
            f'<g fill="none" stroke="#3A3937" stroke-width="1.1" stroke-linecap="round" opacity="0.85">{"".join(fb)}</g>')
def flecks(p,pts,seed):
    r=random.Random(seed);o=[]
    for (x,y) in pts:
        rx=r.uniform(2,5);ry=rx*r.uniform(.4,.8)
        o.append(f'<ellipse cx="{x}" cy="{y}" rx="{rx:.1f}" ry="{ry:.1f}" transform="rotate({r.randint(0,180)} {x} {y})"></ellipse>')
    return f'<g fill="#3E3D3B" filter="url(#{p}fz)">{"".join(o)}</g>'
def stage(p,n):
    if n==1:
        return strands_svg(p,[(92,268,250,-30,20,16,11),(214,108,90,35,11,34,5),(262,290,46,200,7,30,6)],8)+flecks(p,[(150,150),(288,270),(120,310),(310,120)],2)
    if n==2:
        sp=[(80,250,170,-20,20,16,21),(210,120,120,50,15,24,22),(230,250,140,-60,17,20,23),(120,150,90,10,11,30,24),(250,300,80,170,10,20,25),(90,320,70,-5,9,18,26)]
        return strands_svg(p,sp,6)+flecks(p,[(170,210),(300,180),(150,300),(330,260),(200,330),(60,200)],3)
    if n==3:
        r=random.Random(9);sp=[]
        for i in range(70):
            ang=r.uniform(0,360);rad=abs(r.gauss(0,34))
            cx=200+rad*math.cos(math.radians(ang));cy=222+rad*0.6*math.sin(math.radians(ang))
            ln=r.uniform(24,70)*(1.3 if rad>50 else 1)
            sp.append((cx-ln/2*math.cos(math.radians(ang)),cy-ln/2*math.sin(math.radians(ang)),ln,r.uniform(0,360),r.uniform(5,11),r.uniform(10,34),100+i))
        light=[]
        for i in range(40):
            a=r.uniform(0,360);rad=abs(r.gauss(0,40));x=200+rad*math.cos(math.radians(a));y=218+rad*0.6*math.sin(math.radians(a));l=r.uniform(8,20);b=math.radians(r.uniform(0,360))
            light.append(f'<path d="M{x:.1f} {y:.1f} q{l/2*math.cos(b)+r.uniform(-3,3):.1f} {l/2*math.sin(b)+r.uniform(-3,3):.1f} {l*math.cos(b):.1f} {l*math.sin(b):.1f}"></path>')
        core=f'<ellipse cx="204" cy="236" rx="96" ry="30" fill="#000000" opacity="0.26" filter="url(#{p}sh)"></ellipse>'
        return '<g transform="translate(-60 -66) scale(1.3)">'+core+strands_svg(p,sp,2,hl=False)+f'<g fill="none" stroke="#B9B6AF" stroke-width="1" stroke-linecap="round" opacity="0.55">{"".join(light)}</g>'+flecks(p,[(90,260),(320,200),(300,300),(110,170),(260,130),(150,320)],4)+'</g>'
    if n in (4,5):
        r=random.Random(40+n);hair=[]
        for i in range(60):
            a=r.uniform(0,6.283);rr=r.uniform(86,96)
            x=200+rr*math.cos(a);y=200+rr*0.92*math.sin(a);l=r.uniform(4,11)
            b=a+r.uniform(-0.8,0.8)
            hair.append(f'<path d="M{x:.1f} {y:.1f} L{x+l*math.cos(b):.1f} {y+l*math.sin(b):.1f}"></path>')
        ball=(f'<ellipse cx="208" cy="292" rx="96" ry="22" fill="#000000" opacity="0.32" filter="url(#{p}sh)"></ellipse>'
              f'<g filter="url(#{p}fz)"><path d="M192 108 C236 98 288 128 292 186 C296 238 266 284 206 290 C150 296 112 262 106 212 C100 160 132 118 192 108 Z" fill="url(#{p}bg)" filter="url(#{p}gr)"></path></g>'
              f'<path d="M150 150 C164 132 184 124 206 124" fill="none" stroke="#A3A19C" stroke-width="7" stroke-linecap="round" opacity="0.28" filter="url(#{p}sh)"></path>'
              f'<g fill="none" stroke="#403F3D" stroke-width="1" stroke-linecap="round" opacity="0.8">{"".join(hair)}</g>'
              f'<g fill="none" stroke="#2A2928" stroke-width="1.4" opacity="0.35"><path d="M130 220 C160 240 200 250 250 236"></path><path d="M170 140 C200 150 230 170 250 200"></path></g>')
        if n==5:
            ball+=(f'<g filter="url(#{p}fz)" opacity="0.9">'
                   f'<ellipse cx="172" cy="182" rx="11" ry="7" fill="#1A1918" opacity="0.75"></ellipse>'
                   f'<ellipse cx="228" cy="180" rx="11" ry="7" fill="#1A1918" opacity="0.75"></ellipse>'
                   f'<path d="M162 188 C168 194 178 194 184 188" fill="none" stroke="#86847E" stroke-width="2" opacity="0.7"></path>'
                   f'<path d="M218 186 C224 192 234 192 240 186" fill="none" stroke="#86847E" stroke-width="2" opacity="0.7"></path>'
                   f'<path d="M198 198 L196 218" fill="none" stroke="#1A1918" stroke-width="3" opacity="0.5" stroke-linecap="round"></path>'
                   f'<path d="M180 240 C194 246 210 246 222 240" fill="none" stroke="#1A1918" stroke-width="5" opacity="0.6" stroke-linecap="round"></path>'
                   f'<path d="M181 245 C195 251 209 251 221 245" fill="none" stroke="#86847E" stroke-width="1.6" opacity="0.6"></path></g>')
        return ball
def gold(p):
    d,pts=strand(24,64,90,-22,14,20,77,16)
    return (f'<defs><linearGradient id="{p}gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6D77A"></stop><stop offset="0.5" stop-color="#D9A625"></stop><stop offset="1" stop-color="#8A6410"></stop></linearGradient><filter id="{p}gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"></feGaussianBlur></filter></defs>'
            f'<path d="{d}" fill="#F3C84B" opacity="0.8" filter="url(#{p}gl)"></path><path d="{d}" fill="url(#{p}gg)" stroke="#6E4F0C" stroke-width="0.8"></path>')
if __name__=="__main__":
    kind=sys.argv[1];p=sys.argv[2]
    if kind=="gold": print(gold(p))
    else: print(defs(p)+stage(p,int(kind)))
