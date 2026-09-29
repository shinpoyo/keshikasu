import math, random, sys
def strand(x,y,length,ang,w,wig,seed,segs=22):
    r=random.Random(seed)
    pts=[];a=math.radians(ang);step=length/segs
    ph=r.random()*6.28; freq=r.uniform(0.25,0.5)
    for i in range(segs+1):
        pts.append((x,y))
        a+=math.radians(wig*math.sin(ph+i*freq)+r.uniform(-8,8))
        x+=step*math.cos(a); y+=step*math.sin(a)
    raw=[0.55+0.8*r.random() for _ in pts]
    mult=[(raw[max(i-1,0)]+raw[i]*2+raw[min(i+1,len(raw)-1)])/4 for i in range(len(raw))]
    L=[];R=[]
    for i,(px,py) in enumerate(pts):
        j=min(i+1,len(pts)-1);k=max(i-1,0)
        dx=pts[j][0]-pts[k][0];dy=pts[j][1]-pts[k][1];d=math.hypot(dx,dy) or 1
        nx,ny=-dy/d,dx/d
        t=i/segs
        prof=(math.sin(math.pi*t)**0.5)*mult[i]
        hw=w/2*prof+0.3
        L.append((px+nx*hw,py+ny*hw));R.append((px-nx*hw,py-ny*hw))
    poly=L+R[::-1]
    return "M"+" L".join(f"{p[0]:.1f} {p[1]:.1f}" for p in poly)+"Z", pts
def fiber(x,y,ang,l,seed):
    r=random.Random(seed);a=math.radians(ang)
    mx=x+l/2*math.cos(a)+r.uniform(-2,2);my=y+l/2*math.sin(a)+r.uniform(-2,2)
    return f"M{x:.1f} {y:.1f} Q{mx:.1f} {my:.1f} {x+l*math.cos(a):.1f} {y+l*math.sin(a):.1f}"
def fibers_for(pts,seed,n=8):
    r=random.Random(seed);out=[]
    for i in range(n):
        p=pts[r.randrange(2,len(pts)-2)]
        out.append(fiber(p[0],p[1],r.uniform(0,360),r.uniform(6,14),seed*10+i))
    return out
