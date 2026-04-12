import { toast } from "sonner";
import { Card, Tag, PanelTitle, KV, TimelineItem, Btn } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

export default function TuningPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="h-[calc(100vh-120px)] grid grid-cols-[1fr_360px] gap-4 max-xl:grid-cols-1 max-xl:h-auto">
        {/* Stage */}
        <div className="bg-gradient-to-b from-sidebar to-[hsl(216,36%,12%)] rounded-[20px] border border-sidebar-border relative overflow-hidden shadow-lg flex flex-col">
          <div className="px-4 py-3.5 border-b border-white/[0.08] flex justify-between items-center text-primary-foreground">
            <div>
              <div className="text-lg font-extrabold">调参工作区</div>
              <div className="text-xs text-sidebar-muted mt-1">此区域后续可替换为实时画面、参数调节控件、视野补偿示意图和保存面板</div>
            </div>
            <div className="flex gap-2">
              <Tag>兼容通过</Tag>
              <Tag variant="info">控制盒 RX-A102</Tag>
            </div>
          </div>

          <div className="flex-1 grid place-items-center text-primary-foreground text-center p-8"
            style={{
              background: "radial-gradient(circle at 50% 50%, hsl(197 92% 60% / 0.15), transparent 34%), linear-gradient(180deg, hsl(224 76% 48% / 0.08), transparent 40%)"
            }}
          >
            <div>
              <div className="text-[38px] font-extrabold mb-3 tracking-wide">调参界面占位区</div>
              <div className="text-[15px] text-sidebar-foreground/70 max-w-[640px] leading-[1.8]">
                后续这里可放：实时取景 / 视野补偿范围示意 / 参数滑杆 / 预设模板 / 保存与回退按钮。当前先确保页面结构完整，且调参区域占据画面主工作区。
              </div>
            </div>
          </div>

          <div className="px-4 py-3.5 border-t border-white/[0.08] flex gap-2.5 flex-wrap">
            {[
              { label: "读取历史可恢复配置", action: () => toast("演示：患者侧只提示存在可恢复配置，真正恢复需医生端下发且校验通过。") },
              { label: "预设模板 A" },
              { label: "预设模板 B" },
              { label: "对比查看" },
            ].map((b) => (
              <button key={b.label} onClick={b.action} className="bg-white/[0.08] text-primary-foreground border border-white/10 px-3.5 py-2.5 rounded-xl font-bold cursor-pointer text-sm hover:bg-white/[0.12] transition-all">
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
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4 min-w-0">
          <Card>
            <PanelTitle title="关联患者信息"><Btn onClick={() => onNavigate("patient-detail")}>详情</Btn></PanelTitle>
            <KV label="姓名" value="李某" />
            <KV label="用户ID" value="SZ202604120001" />
            <KV label="手机号" value="138****1234" />
            <KV label="当前机构" value="深圳爱眼低视力中心" />
            <KV label="设备SN" value="RX-A102 / 9A24" />
          </Card>

          <Card>
            <PanelTitle title="历史调参摘要"><Btn onClick={() => onNavigate("records")}>全部记录</Btn></PanelTitle>
            <div className="flex flex-col gap-2.5">
              <div className="border border-line rounded-[14px] p-3 bg-card">
                <strong className="text-sm">2026-04-12 10:12</strong>
                <div className="text-xs text-soft mt-1.5">参数模板 PT-2026-04 · 陈医生 · 已同步云端</div>
              </div>
              <div className="border border-line rounded-[14px] p-3 bg-card">
                <strong className="text-sm">2026-04-03 14:21</strong>
                <div className="text-xs text-soft mt-1.5">完成一次补偿区域微调 · 已同步云端</div>
              </div>
            </div>
          </Card>

          <Card>
            <PanelTitle title="操作提醒"><Tag variant="warn">重要</Tag></PanelTitle>
            <div className="flex flex-col gap-3">
              <TimelineItem title="患者不可在 App 端直接恢复参数" desc="患者侧仅可看到存在可恢复配置的提示。" />
              <TimelineItem title="保存前需检查版本兼容" desc="PC 客户端、固件、参数模板任一不匹配，均应拦截。" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
