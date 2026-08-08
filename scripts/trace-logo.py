from PIL import Image
import math, sys
sys.setrecursionlimit(100000)

SRC="public/oberizon/optimized/oberizon-logo.png"
im=Image.open(SRC).convert("RGBA")
W0,H0=im.size
A=im.split()[3]
UP=8
big=A.resize((W0*UP,H0*UP), Image.LANCZOS); BW,BH=big.size; p=big.load()
YMIN=35*UP                      # wordmarks only; the mark is rebuilt geometrically

def inside(x,y):
    if x<0 or y<YMIN or x>=BW or y>=BH: return False
    return p[x,y]>=128

edges={}
def add(a,b): edges.setdefault(a,[]).append(b)
for y in range(YMIN,BH):
    for x in range(BW):
        if not inside(x,y): continue
        if not inside(x,y-1): add((x,y),(x+1,y))
        if not inside(x+1,y): add((x+1,y),(x+1,y+1))
        if not inside(x,y+1): add((x+1,y+1),(x,y+1))
        if not inside(x-1,y): add((x,y+1),(x,y))

loops=[]; used=set()
for start in list(edges):
    for first in edges[start]:
        if (start,first) in used: continue
        loop=[start]; cur,nxt=start,first
        while True:
            used.add((cur,nxt)); loop.append(nxt)
            if nxt==start: break
            outs=[q for q in edges.get(nxt,[]) if (nxt,q) not in used]
            if not outs: break
            dx,dy=nxt[0]-cur[0], nxt[1]-cur[1]
            st=[q for q in outs if (q[0]-nxt[0],q[1]-nxt[1])==(dx,dy)]
            cur,nxt = nxt,(st[0] if st else outs[0])
        if len(loop)>8: loops.append(loop)

def area(pts):
    return sum(pts[i][0]*pts[i+1][1]-pts[i+1][0]*pts[i][1] for i in range(len(pts)-1))/2.0

def rdp(pts, eps):
    if len(pts)<3: return pts
    x1,y1=pts[0]; x2,y2=pts[-1]; dd=math.hypot(x2-x1,y2-y1); dmax=0; idx=0
    for i in range(1,len(pts)-1):
        x0,y0=pts[i]
        d=abs((x2-x1)*(y1-y0)-(x1-x0)*(y2-y1))/dd if dd>1e-9 else math.hypot(x0-x1,y0-y1)
        if d>dmax: dmax,idx=d,i
    return rdp(pts[:idx+1],eps)[:-1]+rdp(pts[idx:],eps) if dmax>eps else [pts[0],pts[-1]]

def path(pts, eps):
    """Corners get straight lines, curves get beziers.

    Emitting a Catmull-Rom cubic for every segment made the stems and serifs
    of E/I/N/Z visibly wavy — smoothing was being applied across corners that
    are genuinely sharp in the artwork — and tripled the file. Classifying each
    vertex by turn angle keeps the bowls of O/B/C/S/U smooth while the straight
    strokes stay straight."""
    s=rdp(pts,eps)
    q=[(x/UP,y/UP) for x,y in s]
    if q[0]==q[-1]: q=q[:-1]
    n=len(q)
    if n<3: return None
    def turn(i):
        a,b,c=q[(i-1)%n],q[i],q[(i+1)%n]
        v1=(b[0]-a[0],b[1]-a[1]); v2=(c[0]-b[0],c[1]-b[1])
        n1=math.hypot(*v1); n2=math.hypot(*v2)
        if n1<1e-9 or n2<1e-9: return 180.0
        cs=(v1[0]*v2[0]+v1[1]*v2[1])/(n1*n2)
        return math.degrees(math.acos(max(-1.0,min(1.0,cs))))
    corner=[turn(i)>38 for i in range(n)]
    f=lambda v: f"{v:.1f}".rstrip("0").rstrip(".")
    d=[f"M{f(q[0][0])} {f(q[0][1])}"]
    for i in range(n):
        p1,p2=q[i],q[(i+1)%n]
        if corner[i] or corner[(i+1)%n]:
            d.append(f"L{f(p2[0])} {f(p2[1])}")
        else:
            p0,p3=q[(i-1)%n],q[(i+2)%n]
            c1=(p1[0]+(p2[0]-p0[0])/6.0, p1[1]+(p2[1]-p0[1])/6.0)
            c2=(p2[0]-(p3[0]-p1[0])/6.0, p2[1]-(p3[1]-p1[1])/6.0)
            d.append(f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}")
    return "".join(d)+"Z"

EPS=float(sys.argv[1]) if len(sys.argv)>1 else 0.9
paths=[path(l,EPS) for l in loops if abs(area(l))>=(UP*UP)*1.0]
paths=[p_ for p_ in paths if p_]
print(f"loops={len(loops)} paths={len(paths)} eps={EPS}", file=sys.stderr)

C="#F97121"
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 88" fill="none" role="img" aria-label="Oberizon Construction">
<defs><linearGradient id="ob-rule" x1="69" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="{C}" stop-opacity="0"/><stop offset=".27" stop-color="{C}"/>
<stop offset=".73" stop-color="{C}"/><stop offset="1" stop-color="{C}" stop-opacity="0"/>
</linearGradient></defs>
<rect x="69" y="16.9" width="51" height="2" fill="url(#ob-rule)"/>
<circle cx="94.7" cy="17.9" r="11.3" stroke="{C}" stroke-width="1.8"/>
<path fill="{C}" fill-rule="evenodd" d="{"".join(paths)}"/>
</svg>
'''
open("/tmp/oberizon-logo.svg","w").write(svg)
print("bytes:", len(svg), file=sys.stderr)
