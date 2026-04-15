import { useState } from "react";
import { toast } from "sonner";
import { Card, Tag, PanelTitle, KV, TimelineItem, Btn } from "@/components/ui-parts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props { onNavigate: (page: string) => void; tuningUser?: { name: string; gender: string; note?: string } | null; }

export default function TuningPage({ onNavigate, tuningUser }: Props) {
  const [connected, setConnected] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="h-[calc(100vh-120px)] grid grid-cols-[1fr_260px] gap-4 max-xl:grid-cols-1 max-xl:h-auto">
        {/* Stage */}
        <div className="bg-gradient-to-b from-sidebar to-[hsl(216,36%,12%)] rounded-[20px] border border-sidebar-border relative overflow-hidden shadow-lg flex flex-col">
          <div className="px-4 py-3.5 border-b border-white/[0.08] flex justify-between items-center text-primary-foreground">
            <div>
              <div className="text-lg font-extrabold">{connected ? "SN-XXXXXXXXXX" : "设备编码"}</div>
              {!connected && <div className="text-xs text-sidebar-muted mt-1">请先连接设备后进入调参</div>}
            </div>
            <div className="flex gap-2 items-center">
              {connected ? (
                <>
                  <span className="text-xs text-sidebar-foreground/60 mr-1">RX-A102 / 9A24 / V0.5.1</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#0f1729] text-[#2ce2e2]">USB · 电量 82%</span>
                  <Tag variant="info">已连接</Tag>
                </>
              ) : (
                <Tag variant="warn">未连接设备</Tag>
              )}
            </div>
          </div>

          {connected ? (
            <>
              <div className="flex-1 grid place-items-center text-primary-foreground text-center p-8"
                style={{
                  background: "radial-gradient(circle at 50% 50%, hsl(197 92% 60% / 0.15), transparent 34%), linear-gradient(180deg, hsl(224 76% 48% / 0.08), transparent 40%)"
                }}
              >
                <div>
                  <div className="text-[38px] font-extrabold mb-3 tracking-wide">调参界面占位区</div>
                  <div className="text-[15px] text-sidebar-foreground/70 max-w-[640px] leading-[1.8]">
                    后续这里可放：实时取景 / 视野补偿范围示意 / 参数滑杆 / 预设模板 / 保存与回退按钮。
                  </div>
                </div>
              </div>

              <div className="px-4 py-3.5 border-t border-white/[0.08] flex gap-2.5 flex-wrap">
                {[
                  { label: "预设模板 A" },
                  { label: "预设模板 B" },
                ].map((b) => (
                  <button key={b.label} className="bg-white/[0.08] text-primary-foreground border border-white/10 px-3.5 py-2.5 rounded-xl font-bold cursor-pointer text-sm hover:bg-white/[0.12] transition-all">
                    {b.label}
                  </button>
                ))}
                <button
                  onClick={() => toast("演示：保存时会同时写入控制盒与云端记录。")}
                  className="bg-gradient-to-r from-[hsl(199,89%,49%)] to-[hsl(224,76%,48%)] text-primary-foreground border-0 px-3.5 py-2.5 rounded-xl font-bold cursor-pointer text-sm"
                >
                  保存当前参数
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 grid place-items-center text-primary-foreground text-center p-8 relative">
              <div>
                <div className="flex flex-col gap-3 items-center mb-6">
                  <TimelineItem dark title="连接状态" desc="等待 USB 连接…" />
                </div>
                <div className="flex gap-2.5 justify-center flex-wrap">
                  <Btn variant="primary" onClick={() => setConflictOpen(true)}>连接设备</Btn>
                  <Btn onClick={() => toast("演示：若设备连接失败，提示检查数据线 / 开机状态。")}>连接异常处理</Btn>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4 min-w-0 relative">

          {tuningUser ? (
            <>
              <Card>
                <PanelTitle title="关联用户">
                  <Btn 
                    className="text-accent-foreground opacity-65 bg-[#eff4fa] border border-solid border-[#39404c]/[0.59]"
                    onClick={() => onNavigate("select-user")}
                  >
                    替换用户
                  </Btn>
                </PanelTitle>
                <KV label="姓名" value={tuningUser.name} />
                <KV label="性别 / 年龄" value={tuningUser.gender} />
                <KV label="备注" value={tuningUser.note || "黄斑变性患者"} />
              </Card>

              <Card>
                <PanelTitle title="调参记录">
                  <Btn onClick={() => onNavigate("patient-records")}>更多</Btn>
                </PanelTitle>
                <div className="flex flex-col gap-2">
                  {[
                    { date: "2026-04-10 14:30", sn: "9A24" },
                    { date: "2026-04-08 10:15", sn: "9A23" },
                    { date: "2026-03-28 16:40", sn: "9A22" },
                    { date: "2026-03-15 09:20", sn: "9A21" },
                    { date: "2026-02-22 11:05", sn: "9A20" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                      <div className="text-foreground/80">
                        <span className="text-muted-foreground block mb-0.5">SN {r.sn}</span>
                        {r.date}
                      </div>
                      <Btn onClick={() => toast(`演示：调取 ${r.date} 的调参记录`)}>调取</Btn>
                    </div>
                  ))}
                </div>
              </Card>

              <Btn onClick={() => toast("演示：已删除关联用户")} className="w-full text-center justify-center text-destructive border-destructive/30 hover:bg-destructive/10">删除关联用户</Btn>
            </>
          ) : (
            <Card className="flex-1 grid place-items-center">
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="text-soft text-sm">暂无关联用户</div>
                <Btn variant="primary" onClick={() => onNavigate("select-user")}>添加关联用户</Btn>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={conflictOpen} onOpenChange={setConflictOpen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>关联用户冲突</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-foreground/80 py-2">
            当前设备关联用户为 <span className="font-bold text-foreground">戴某</span>，请选择操作：
          </div>
          <div className="flex gap-3 mt-2">
            <Btn variant="primary" className="flex-1 justify-center" onClick={() => { setConflictOpen(false); setConnected(true); toast("已延用设备用户：戴某"); }}>延用设备用户</Btn>
            <Btn className="flex-1 justify-center" onClick={() => { setConflictOpen(false); setConnected(true); toast("请在右侧关联新用户"); }}>关联新用户</Btn>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
