import { useEffect, useRef, useState, useCallback } from "react";

type Mode = "quick" | "enhance" | "center" | "periphery" | "reading";

interface BaseParams { saturation: number; contrast: number; edgeBoost: boolean; greenPrefer: boolean; }
interface CenterParams { zoomFactor: number; windowWidth: number; windowHeight: number; offsetX: number; offsetY: number; }
interface PeripheryParams { diameter: number; magnification: number; offsetXRatio: number; offsetYRatio: number; }
interface ReadingParams { scheme: "bw" | "wb" | "yellowBlack" | "blueYellow" | "custom"; customContrast: number; }

const MODE_LABELS: Record<Mode, string> = {
  quick: "视野快速检查",
  enhance: "实时画面增强偏好",
  center: "中心放大",
  periphery: "旁中心放大",
  reading: "阅读模式配色",
};

function generateTestImage(width: number, height: number): ImageData {
  const off = document.createElement("canvas");
  off.width = width; off.height = height;
  const c = off.getContext("2d")!;
  c.fillStyle = "#1a2a32";
  c.fillRect(0, 0, width, height);
  const grad = c.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#e34d4d");
  grad.addColorStop(0.25, "#f7c542");
  grad.addColorStop(0.5, "#4caf50");
  grad.addColorStop(0.75, "#2a9fd6");
  grad.addColorStop(1, "#b55eff");
  c.fillStyle = grad;
  c.fillRect(0, 0, width, height);
  c.strokeStyle = "rgba(255,255,200,0.7)";
  c.lineWidth = 1.5;
  for (let i = 0; i < width; i += 70) {
    c.beginPath(); c.moveTo(i, 0); c.lineTo(i, height); c.stroke();
    c.beginPath(); c.moveTo(0, i % height); c.lineTo(width, i % height); c.stroke();
  }
  c.font = "Bold 34px 'Courier New'";
  c.fillStyle = "#fff8e7";
  c.fillText("AR VISION", 60, 90);
  c.font = "22px monospace";
  c.fillStyle = "#f9f2cf";
  c.fillText("饱和/对比/边缘/滤光", 520, 450);
  c.fillStyle = "#ffefb0";
  c.fillText("实时视觉增强", 720, 70);
  c.fillStyle = "#dbb077";
  c.beginPath(); c.arc(800, 300, 48, 0, Math.PI * 2); c.fill();
  c.fillStyle = "#402812";
  c.beginPath(); c.arc(775, 285, 9, 0, Math.PI * 2); c.arc(825, 285, 9, 0, Math.PI * 2); c.fill();
  c.fillStyle = "#b45f2b";
  c.beginPath(); c.ellipse(800, 330, 34, 22, 0, 0, Math.PI * 2); c.fill();
  return c.getImageData(0, 0, width, height);
}

function applyBaseFilters(img: ImageData, sat: number, con: number, greenPref: boolean, edgeBoost: boolean) {
  const src = img.data;
  const out = new Uint8ClampedArray(src.length);
  for (let i = 0; i < src.length; i += 4) {
    let r = src[i], g = src[i + 1], b = src[i + 2];
    const cv = con - 1.0;
    r = r + (r - 128) * cv; g = g + (g - 128) * cv; b = b + (b - 128) * cv;
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + (r - gray) * sat; g = gray + (g - gray) * sat; b = gray + (b - gray) * sat;
    if (greenPref) { g = Math.min(255, g * 1.38); r *= 0.85; b *= 0.82; }
    out[i] = Math.min(255, Math.max(0, r));
    out[i + 1] = Math.min(255, Math.max(0, g));
    out[i + 2] = Math.min(255, Math.max(0, b));
    out[i + 3] = src[i + 3];
  }
  let result = new ImageData(out, img.width, img.height);
  if (edgeBoost) result = applyEdgeEnhance(result);
  return result;
}

function applyEdgeEnhance(img: ImageData) {
  const w = img.width, h = img.height;
  const src = img.data;
  const out = new Uint8ClampedArray(src.length);
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let rs = 0, gs = 0, bs = 0;
      for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++) {
        const idx = ((y + ky) * w + (x + kx)) * 4;
        const k = kernel[(ky + 1) * 3 + (kx + 1)];
        rs += src[idx] * k; gs += src[idx + 1] * k; bs += src[idx + 2] * k;
      }
      const o = (y * w + x) * 4;
      out[o] = Math.min(255, Math.max(0, rs));
      out[o + 1] = Math.min(255, Math.max(0, gs));
      out[o + 2] = Math.min(255, Math.max(0, bs));
      out[o + 3] = src[o + 3];
    }
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (y === 0 || y === h - 1 || x === 0 || x === w - 1) {
      const idx = (y * w + x) * 4;
      out[idx] = src[idx]; out[idx + 1] = src[idx + 1]; out[idx + 2] = src[idx + 2]; out[idx + 3] = src[idx + 3];
    }
  }
  return new ImageData(out, w, h);
}

function applyReadingScheme(img: ImageData, scheme: ReadingParams["scheme"], cc: number) {
  const src = img.data;
  const out = new Uint8ClampedArray(src.length);
  for (let i = 0; i < src.length; i += 4) {
    let r = src[i], g = src[i + 1], b = src[i + 2];
    if (scheme === "bw") { const gr = 0.299 * r + 0.587 * g + 0.114 * b; r = g = b = gr > 128 ? 245 : 20; }
    else if (scheme === "wb") { const gr = 0.299 * r + 0.587 * g + 0.114 * b; r = g = b = gr > 128 ? 20 : 245; }
    else if (scheme === "yellowBlack") { const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b; r = 255; g = 235; b = 80; if (lum < 100) { r = 30; g = 25; b = 10; } }
    else if (scheme === "blueYellow") { const lum = 0.299 * r + 0.587 * g + 0.114 * b; r = 30; g = 70; b = 180; if (lum > 140) { r = 255; g = 220; b = 50; } }
    else if (scheme === "custom") {
      r = 128 + (r - 128) * cc; g = 128 + (g - 128) * cc; b = 128 + (b - 128) * cc;
      r = Math.min(255, Math.max(0, r)); g = Math.min(255, Math.max(0, g)); b = Math.min(255, Math.max(0, b));
    }
    out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = src[i + 3];
  }
  return new ImageData(out, img.width, img.height);
}

function applyPeripheryZoom(img: ImageData, diameter: number, mag: number, offX: number, offY: number, cw: number, ch: number) {
  const sw = img.width, sh = img.height;
  const src = img.data;
  const out = new Uint8ClampedArray(cw * ch * 4);
  const cx = cw / 2 + offX * cw;
  const cy = ch / 2 + offY * ch;
  const radius = diameter / 2;
  // map output pixel -> source pixel (source same size as canvas)
  const sxScale = sw / cw, syScale = sh / ch;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.hypot(dx, dy);
      let srcX: number, srcY: number;
      if (dist < radius) { srcX = cx + dx / mag; srcY = cy + dy / mag; }
      else { const f = 1 + (dist - radius) * 0.001; srcX = cx + dx / f; srcY = cy + dy / f; }
      const isx = Math.min(sw - 1, Math.max(0, Math.floor(srcX * sxScale)));
      const isy = Math.min(sh - 1, Math.max(0, Math.floor(srcY * syScale)));
      const idx = (isy * sw + isx) * 4;
      const o = (y * cw + x) * 4;
      out[o] = src[idx]; out[o + 1] = src[idx + 1]; out[o + 2] = src[idx + 2]; out[o + 3] = 255;
    }
  }
  return new ImageData(out, cw, ch);
}

export default function TuningSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<ImageData | null>(null);
  const [mode, setMode] = useState<Mode>("quick");
  const [base, setBase] = useState<BaseParams>({ saturation: 1.0, contrast: 1.0, edgeBoost: false, greenPrefer: false });
  const [center, setCenter] = useState<CenterParams>({ zoomFactor: 1.8, windowWidth: 600, windowHeight: 338, offsetX: 0, offsetY: 0 });
  const [periphery, setPeriphery] = useState<PeripheryParams>({ diameter: 400, magnification: 1.6, offsetXRatio: 0, offsetYRatio: 0 });
  const [reading, setReading] = useState<ReadingParams>({ scheme: "bw", customContrast: 1.2 });

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const original = originalRef.current;
    if (!canvas || !original) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let working = new ImageData(new Uint8ClampedArray(original.data), original.width, original.height);
    if (mode !== "quick") {
      working = applyBaseFilters(working, base.saturation, base.contrast, base.greenPrefer, base.edgeBoost);
    }
    const cw = canvas.width, ch = canvas.height;
    if (mode === "center") {
      const winW = Math.min(center.windowWidth, working.width);
      const winH = Math.min(center.windowHeight, working.height);
      const cx = working.width / 2 + center.offsetX;
      const cy = working.height / 2 + center.offsetY;
      let sx = cx - winW / 2, sy = cy - winH / 2;
      sx = Math.min(Math.max(0, sx), working.width - winW);
      sy = Math.min(Math.max(0, sy), working.height - winH);
      const off = document.createElement("canvas");
      off.width = working.width; off.height = working.height;
      off.getContext("2d")!.putImageData(working, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(off, sx, sy, winW, winH, 0, 0, cw, ch);
      return;
    }
    if (mode === "periphery") {
      const diameter = Math.min(periphery.diameter, Math.min(cw, ch));
      const result = applyPeripheryZoom(working, diameter, periphery.magnification, periphery.offsetXRatio, periphery.offsetYRatio, cw, ch);
      ctx.putImageData(result, 0, 0);
      return;
    }
    if (mode === "reading") {
      const r = applyReadingScheme(working, reading.scheme, reading.customContrast);
      const off = document.createElement("canvas");
      off.width = r.width; off.height = r.height;
      off.getContext("2d")!.putImageData(r, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(off, 0, 0, cw, ch);
      return;
    }
    const off = document.createElement("canvas");
    off.width = working.width; off.height = working.height;
    off.getContext("2d")!.putImageData(working, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(off, 0, 0, cw, ch);
  }, [mode, base, center, periphery, reading]);

  useEffect(() => {
    originalRef.current = generateTestImage(960, 540);
    render();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { render(); }, [render]);

  const tabs: Mode[] = ["quick", "enhance", "center", "periphery", "reading"];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0b1018] text-[#9bc6cf]" style={{ fontFamily: "'Fira Code', 'Courier New', Consolas, monospace" }}>
      {/* Tab bar */}
      <div className="bg-[#11151e] border-b border-[#2a3a44] flex flex-wrap gap-1.5 px-3 pt-1.5">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setMode(t)}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg border border-b-0 transition-colors ${
              mode === t
                ? "bg-[#0c121b] text-[#b7e4fa] border-[#6ab0c6] shadow-[inset_0_2px_0_#4f9eb3] -mb-px"
                : "bg-[#0a0e14] text-[#9bc6cf] border-[#2c404c] hover:bg-[#1c2a33] hover:text-[#d4f1f9] hover:border-[#5f9db2]"
            }`}
          >
            {t === "quick" ? "视野快速检查" : t === "enhance" ? "实时画面增强偏好" : t === "center" ? "中心放大" : t === "periphery" ? "旁中心放大" : "阅读模式配色"}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-wrap gap-4 p-4 min-h-0 overflow-auto">
        {/* Preview */}
        <div className="flex-[3] min-w-[280px] bg-[#03060c] border-2 border-[#2e4b5a] p-3 shadow-inner">
          <div className="flex justify-between border-b border-dashed border-[#2e5b6e] pb-1.5 mb-3 text-xs text-[#7caebf]">
            <span>【 AR 实时预览区 】</span>
            <span>1920×1080 动态效果实时生效</span>
          </div>
          <div className="bg-black border border-[#3a6e82] flex items-center justify-center">
            <canvas ref={canvasRef} width={960} height={540} className="w-full h-auto bg-black block cursor-crosshair" style={{ aspectRatio: "16/9" }} />
          </div>
          <div className="mt-2.5 flex justify-between text-[11px] text-[#5e909e] border-t border-dashed border-[#2a4d5a] pt-2">
            <span>当前模式: {MODE_LABELS[mode]}</span>
            <span>⚡ 实时图像处理</span>
          </div>
        </div>

        {/* Param panel */}
        <div className="flex-[1.2] min-w-[280px] bg-[#0a0f17] border-2 border-[#2e4b5a] p-4 shadow-inner overflow-auto">
          <ParamPanel
            mode={mode}
            base={base} setBase={setBase}
            center={center} setCenter={setCenter}
            periphery={periphery} setPeriphery={setPeriphery}
            reading={reading} setReading={setReading}
          />
        </div>
      </div>
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <div className="text-base font-bold text-[#b8dee9] border-l-[12px] border-[#4797af] pl-3 mb-4 tracking-wider">{children}</div>;
}
function Divider() { return <div className="h-px bg-[#2a4d5a] my-4" />; }
function ValDisplay({ children }: { children: React.ReactNode }) {
  return <span className="bg-[#03070c] px-1.5 py-0.5 border-l-[3px] border-[#3f9cae] text-[11px] text-[#88c9dc]">{children}</span>;
}
function SliderRow({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; }) {
  return (
    <div className="mb-5">
      <label className="flex justify-between text-[#9cc7d4] text-xs uppercase mb-2">
        <span>{label}</span>
        <ValDisplay>{Number.isInteger(step) ? value : value.toFixed(2)}</ValDisplay>
      </label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-[3px] bg-[#1e2f38] rounded appearance-none cursor-pointer accent-[#7bcbd9]" />
    </div>
  );
}
function AsciiBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="bg-[#0f1820] border border-[#3f6e7e] text-[#bfe4ef] font-mono font-bold px-3 py-2 text-xs hover:bg-[#1c3b46] hover:border-[#78b9cb] hover:text-white hover:shadow-[0_0_4px_#3ea3bb] transition-colors">
      {children}
    </button>
  );
}

function ParamPanel(props: {
  mode: Mode;
  base: BaseParams; setBase: (b: BaseParams) => void;
  center: CenterParams; setCenter: (c: CenterParams) => void;
  periphery: PeripheryParams; setPeriphery: (p: PeripheryParams) => void;
  reading: ReadingParams; setReading: (r: ReadingParams) => void;
}) {
  const { mode, base, setBase, center, setCenter, periphery, setPeriphery, reading, setReading } = props;

  if (mode === "quick") {
    return (
      <>
        <Title>▶ 视野快速检查</Title>
        <div className="text-[11px] text-[#3b7477] text-center my-3">原始画面直出，无任何滤镜增强。<br />用于基准视野评估。</div>
        <Divider />
        <div className="flex gap-3.5 mt-6 justify-between"><AsciiBtn>重置视图</AsciiBtn></div>
      </>
    );
  }
  if (mode === "enhance") {
    return (
      <>
        <Title>▶ 实时画面增强调节</Title>
        <SliderRow label="饱和度" value={base.saturation} min={0} max={2} step={0.01} onChange={v => setBase({ ...base, saturation: v })} />
        <SliderRow label="对比度" value={base.contrast} min={0} max={2} step={0.01} onChange={v => setBase({ ...base, contrast: v })} />
        <div className="flex items-center gap-3 my-3 text-[#bbdbe5] text-xs">
          <input type="checkbox" checked={base.edgeBoost} onChange={e => setBase({ ...base, edgeBoost: e.target.checked })} className="w-[18px] h-[18px] accent-[#34899e]" />
          <label>开启边缘增强</label>
        </div>
        <div className="flex items-center gap-3 my-3 text-[#bbdbe5] text-xs">
          <input type="checkbox" checked={base.greenPrefer} onChange={e => setBase({ ...base, greenPrefer: e.target.checked })} className="w-[18px] h-[18px] accent-[#34899e]" />
          <label>绿色偏好滤光</label>
        </div>
        <div className="flex gap-3.5 mt-6 justify-between">
          <AsciiBtn onClick={() => setBase({ saturation: 1, contrast: 1, edgeBoost: false, greenPrefer: false })}>重置默认</AsciiBtn>
          <AsciiBtn>保存参数</AsciiBtn>
        </div>
      </>
    );
  }
  if (mode === "center") {
    return (
      <>
        <Title>▶ 中心放大调节</Title>
        <SliderRow label="放大倍率" value={center.zoomFactor} min={1} max={3.5} step={0.02} onChange={v => setCenter({ ...center, zoomFactor: v })} />
        <SliderRow label="窗口宽度(px)" value={center.windowWidth} min={200} max={800} step={5} onChange={v => setCenter({ ...center, windowWidth: v })} />
        <SliderRow label="窗口高度(px)" value={center.windowHeight} min={120} max={500} step={5} onChange={v => setCenter({ ...center, windowHeight: v })} />
        <SliderRow label="水平偏移" value={center.offsetX} min={-150} max={150} step={5} onChange={v => setCenter({ ...center, offsetX: v })} />
        <SliderRow label="垂直偏移" value={center.offsetY} min={-100} max={100} step={5} onChange={v => setCenter({ ...center, offsetY: v })} />
        <div className="text-[11px] text-[#3b7477] text-center my-3">继承画面增强基础参数(饱和度/对比度/边缘/滤光)</div>
        <div className="flex gap-3.5 mt-6 justify-between">
          <AsciiBtn onClick={() => setCenter({ zoomFactor: 1.8, windowWidth: 600, windowHeight: 338, offsetX: 0, offsetY: 0 })}>重置窗口</AsciiBtn>
          <AsciiBtn>保存配置</AsciiBtn>
        </div>
      </>
    );
  }
  if (mode === "periphery") {
    return (
      <>
        <Title>▶ 旁中心放大调节</Title>
        <SliderRow label="窗口直径(px)" value={periphery.diameter} min={200} max={700} step={10} onChange={v => setPeriphery({ ...periphery, diameter: v })} />
        <SliderRow label="放大倍率" value={periphery.magnification} min={1} max={2.8} step={0.02} onChange={v => setPeriphery({ ...periphery, magnification: v })} />
        <SliderRow label="水平偏移比" value={periphery.offsetXRatio} min={-0.5} max={0.5} step={0.02} onChange={v => setPeriphery({ ...periphery, offsetXRatio: v })} />
        <SliderRow label="垂直偏移比" value={periphery.offsetYRatio} min={-0.5} max={0.5} step={0.02} onChange={v => setPeriphery({ ...periphery, offsetYRatio: v })} />
        <div className="flex gap-3.5 mt-6 justify-between">
          <AsciiBtn onClick={() => setPeriphery({ diameter: 400, magnification: 1.6, offsetXRatio: 0, offsetYRatio: 0 })}>重置位置</AsciiBtn>
          <AsciiBtn>保存配置</AsciiBtn>
        </div>
      </>
    );
  }
  // reading
  const schemes: { v: ReadingParams["scheme"]; label: string }[] = [
    { v: "bw", label: "黑白(高对比)" },
    { v: "wb", label: "白黑" },
    { v: "yellowBlack", label: "黄底黑字" },
    { v: "blueYellow", label: "蓝底黄字" },
    { v: "custom", label: "自定义增强" },
  ];
  return (
    <>
      <Title>▶ 阅读模式颜色偏好</Title>
      <div className="flex flex-wrap gap-3 my-2.5">
        {schemes.map(s => (
          <label key={s.v} className="text-[#b0d4e0] text-[11px] inline-flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="readingScheme" value={s.v} checked={reading.scheme === s.v} onChange={() => setReading({ ...reading, scheme: s.v })} className="accent-[#34899e]" />
            {s.label}
          </label>
        ))}
      </div>
      <SliderRow label="配色对比度" value={reading.customContrast} min={0.6} max={2.2} step={0.02} onChange={v => setReading({ ...reading, customContrast: v })} />
      <div className="flex gap-3.5 mt-6 justify-between">
        <AsciiBtn onClick={() => setReading({ scheme: "bw", customContrast: 1.2 })}>重置配色</AsciiBtn>
        <AsciiBtn>保存方案</AsciiBtn>
      </div>
    </>
  );
}