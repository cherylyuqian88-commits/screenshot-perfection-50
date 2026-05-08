import { useEffect, useRef, useState, useCallback } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Eye, Wand2, ZoomIn, Focus, BookOpen, RotateCcw, Save } from "lucide-react";
import previewImg from "@/assets/tuning-preview.png";
import { cn } from "@/lib/utils";

type Mode = "quick" | "enhance" | "center" | "periphery" | "reading";

interface BaseParams { saturation: number; contrast: number; edgeBoost: boolean; greenPrefer: boolean; }
interface CenterParams { zoomFactor: number; windowWidth: number; windowHeight: number; offsetX: number; offsetY: number; }
interface PeripheryParams { diameter: number; magnification: number; offsetXRatio: number; offsetYRatio: number; }
interface ReadingParams { scheme: "bw" | "wb" | "yellowBlack" | "blueYellow" | "custom"; customContrast: number; }

const MODE_META: Record<Mode, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  quick: { label: "视野快速检查", icon: Eye },
  enhance: { label: "实时画面增强", icon: Wand2 },
  center: { label: "中心放大", icon: ZoomIn },
  periphery: { label: "旁中心放大", icon: Focus },
  reading: { label: "阅读模式配色", icon: BookOpen },
};

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

/* ─── Dark Slider (track matches dark blue theme) ─── */
function DarkSlider({ className, ...props }: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[hsl(220,20%,22%)]">
        <SliderPrimitive.Range className="absolute h-full bg-[hsl(197,92%,60%)]" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[hsl(197,92%,60%)] bg-[hsl(222,47%,11%)] ring-offset-[hsl(222,47%,11%)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(197,92%,60%)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
}

export default function TuningSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<ImageData | null>(null);
  const [ready, setReady] = useState(false);
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
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = previewImg;
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = 960; off.height = 540;
      const c = off.getContext("2d")!;
      c.drawImage(img, 0, 0, 960, 540);
      originalRef.current = c.getImageData(0, 0, 960, 540);
      setReady(true);
    };
  }, []);

  useEffect(() => { if (ready) render(); }, [render, ready]);

  const tabs: Mode[] = ["quick", "enhance", "center", "periphery", "reading"];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Tab bar */}
      <div className="border-b border-white/[0.08] bg-[hsl(222,47%,11%)]/60 backdrop-blur-sm flex flex-wrap gap-2 px-4 pt-3 pb-0">
        {tabs.map(t => {
          const Icon = MODE_META[t].icon;
          const active = mode === t;
          return (
            <button
              key={t}
              onClick={() => setMode(t)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl border-t border-x transition-all -mb-px ${
                active
                  ? "bg-[hsl(220,20%,14%)] text-white border-white/[0.12] border-b-[hsl(220,20%,14%)]"
                  : "text-[hsl(216,20%,60%)] border-transparent hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {MODE_META[t].label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-wrap gap-5 p-5 min-h-0 overflow-auto">
        {/* Preview */}
        <div className="flex-[3] min-w-[320px] flex flex-col">
          <div className="bg-gradient-to-b from-[hsl(222,47%,11%)] to-[hsl(220,20%,9%)] rounded-2xl border border-white/[0.08] shadow-lg p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[hsl(160,84%,39%)] animate-pulse" />
                <span className="text-sm font-semibold text-primary-foreground">AR 实时预览</span>
              </div>
              <span className="text-xs text-[hsl(216,20%,60%)]">1920 × 1080 · 实时生效</span>
            </div>
            <div className="rounded-xl overflow-hidden bg-black border border-white/[0.08]">
              <canvas ref={canvasRef} width={960} height={540} className="w-full h-auto block" style={{ aspectRatio: "16/9" }} />
            </div>
            <div className="mt-3 flex justify-between items-center text-xs text-[hsl(216,20%,60%)]">
              <span>当前模式：<span className="text-primary-foreground font-medium">{MODE_META[mode].label}</span></span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(197,92%,60%)]" />实时图像处理
              </span>
            </div>
          </div>
        </div>

        {/* Param panel */}
        <div className="flex-[1.2] min-w-[300px]">
          <div className="bg-gradient-to-b from-[hsl(222,47%,11%)] to-[hsl(220,20%,9%)] rounded-2xl border border-white/[0.08] shadow-lg p-5 h-full overflow-auto">
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
    </div>
  );
}

function PanelTitle({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.08]">
      <div className="w-8 h-8 rounded-lg bg-[hsl(197,92%,60%)]/15 text-[hsl(197,92%,60%)] flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-base font-bold text-primary-foreground">{children}</h3>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, onChange, unit }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; unit?: string }) {
  const display = Number.isInteger(step) ? value.toString() : value.toFixed(2);
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-xs font-medium text-[hsl(216,20%,60%)]">{label}</Label>
        <span className="text-xs font-mono font-semibold text-[hsl(197,92%,60%)] bg-[hsl(197,92%,60%)]/15 px-2 py-0.5 rounded-md min-w-[44px] text-center">
          {display}{unit || ""}
        </span>
      </div>
      <DarkSlider min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

function SwitchRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/[0.06] mb-2.5">
      <Label className="text-sm text-primary-foreground cursor-pointer">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ActionRow({ onReset, saveLabel = "保存参数" }: { onReset?: () => void; saveLabel?: string }) {
  return (
    <div className="flex gap-3 mt-6 pt-4 border-t border-white/[0.08]">
      <Button variant="outline" size="sm" className="flex-1 border-white/[0.12] text-primary-foreground hover:bg-white/[0.08] hover:text-white" onClick={onReset}>
        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />重置
      </Button>
      <Button size="sm" className="flex-1 bg-gradient-to-r from-[hsl(199,89%,49%)] to-[hsl(224,76%,48%)] text-white shadow-[0_12px_28px_hsl(224_76%_48%/0.24)]">
        <Save className="w-3.5 h-3.5 mr-1.5" />{saveLabel}
      </Button>
    </div>
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
        <PanelTitle icon={Eye}>视野快速检查</PanelTitle>
        <div className="text-sm text-[hsl(216,20%,60%)] leading-relaxed bg-white/[0.06] rounded-lg p-4">
          原始画面直出，无任何滤镜增强。<br />用于基准视野评估。
        </div>
        <div className="mt-6 pt-4 border-t border-white/[0.08]">
          <Button variant="outline" size="sm" className="w-full border-white/[0.12] text-primary-foreground hover:bg-white/[0.08] hover:text-white">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />重置视图
          </Button>
        </div>
      </>
    );
  }
  if (mode === "enhance") {
    return (
      <>
        <PanelTitle icon={Wand2}>实时画面增强调节</PanelTitle>
        <SliderRow label="饱和度" value={base.saturation} min={0} max={2} step={0.01} onChange={v => setBase({ ...base, saturation: v })} />
        <SliderRow label="对比度" value={base.contrast} min={0} max={2} step={0.01} onChange={v => setBase({ ...base, contrast: v })} />
        <SwitchRow label="开启边缘增强" checked={base.edgeBoost} onChange={v => setBase({ ...base, edgeBoost: v })} />
        <SwitchRow label="绿色偏好滤光" checked={base.greenPrefer} onChange={v => setBase({ ...base, greenPrefer: v })} />
        <ActionRow onReset={() => setBase({ saturation: 1, contrast: 1, edgeBoost: false, greenPrefer: false })} />
      </>
    );
  }
  if (mode === "center") {
    return (
      <>
        <PanelTitle icon={ZoomIn}>中心放大调节</PanelTitle>
        <SliderRow label="放大倍率" value={center.zoomFactor} min={1} max={3.5} step={0.02} onChange={v => setCenter({ ...center, zoomFactor: v })} unit="×" />
        <SliderRow label="窗口宽度" value={center.windowWidth} min={200} max={800} step={5} onChange={v => setCenter({ ...center, windowWidth: v })} unit="px" />
        <SliderRow label="窗口高度" value={center.windowHeight} min={120} max={500} step={5} onChange={v => setCenter({ ...center, windowHeight: v })} unit="px" />
        <SliderRow label="水平偏移" value={center.offsetX} min={-150} max={150} step={5} onChange={v => setCenter({ ...center, offsetX: v })} />
        <SliderRow label="垂直偏移" value={center.offsetY} min={-100} max={100} step={5} onChange={v => setCenter({ ...center, offsetY: v })} />
        <div className="text-xs text-[hsl(216,20%,60%)] bg-white/[0.06] rounded-lg p-3 leading-relaxed">
          继承画面增强基础参数（饱和度 / 对比度 / 边缘 / 滤光）
        </div>
        <ActionRow saveLabel="保存配置" onReset={() => setCenter({ zoomFactor: 1.8, windowWidth: 600, windowHeight: 338, offsetX: 0, offsetY: 0 })} />
      </>
    );
  }
  if (mode === "periphery") {
    return (
      <>
        <PanelTitle icon={Focus}>旁中心放大调节</PanelTitle>
        <SliderRow label="窗口直径" value={periphery.diameter} min={200} max={700} step={10} onChange={v => setPeriphery({ ...periphery, diameter: v })} unit="px" />
        <SliderRow label="放大倍率" value={periphery.magnification} min={1} max={2.8} step={0.02} onChange={v => setPeriphery({ ...periphery, magnification: v })} unit="×" />
        <SliderRow label="水平偏移比" value={periphery.offsetXRatio} min={-0.5} max={0.5} step={0.02} onChange={v => setPeriphery({ ...periphery, offsetXRatio: v })} />
        <SliderRow label="垂直偏移比" value={periphery.offsetYRatio} min={-0.5} max={0.5} step={0.02} onChange={v => setPeriphery({ ...periphery, offsetYRatio: v })} />
        <ActionRow saveLabel="保存配置" onReset={() => setPeriphery({ diameter: 400, magnification: 1.6, offsetXRatio: 0, offsetYRatio: 0 })} />
      </>
    );
  }
  const schemes: { v: ReadingParams["scheme"]; label: string }[] = [
    { v: "bw", label: "黑白(高对比)" },
    { v: "wb", label: "白黑" },
    { v: "yellowBlack", label: "黄底黑字" },
    { v: "blueYellow", label: "蓝底黄字" },
    { v: "custom", label: "自定义增强" },
  ];
  return (
    <>
      <PanelTitle icon={BookOpen}>阅读模式颜色偏好</PanelTitle>
      <RadioGroup value={reading.scheme} onValueChange={(v) => setReading({ ...reading, scheme: v as ReadingParams["scheme"] })} className="grid grid-cols-2 gap-2 mb-5">
        {schemes.map(s => (
          <label key={s.v} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
            reading.scheme === s.v ? "border-[hsl(197,92%,60%)] bg-[hsl(197,92%,60%)]/15 text-[hsl(197,92%,60%)]" : "border-white/[0.08] bg-white/[0.04] text-primary-foreground/80 hover:border-[hsl(197,92%,60%)]/40"
          }`}>
            <RadioGroupItem value={s.v} className="shrink-0" />
            <span className="text-xs font-medium">{s.label}</span>
          </label>
        ))}
      </RadioGroup>
      <SliderRow label="配色对比度" value={reading.customContrast} min={0.6} max={2.2} step={0.02} onChange={v => setReading({ ...reading, customContrast: v })} />
      <ActionRow saveLabel="保存方案" onReset={() => setReading({ scheme: "bw", customContrast: 1.2 })} />
    </>
  );
}
