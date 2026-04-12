import { toast } from "sonner";
import { Card, Tag, PanelTitle, KV, TimelineItem, Btn } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

export default function DeviceLinkPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <Card dark>
          <PanelTitle title="设备连接"><Tag variant="info">有线连接控制盒</Tag></PanelTitle>
          <div className="text-[13px] text-sidebar-foreground/70 leading-relaxed mt-1.5">
            统一设备定义：整套设备 = 眼镜 + 控制盒；PC端有线接入对象与日志、参数存储位置均为控制盒。
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <TimelineItem dark title="当前识别设备" desc="控制盒 RX-A102 / SN 9A24 / 固件 V0.5.1" />
            <TimelineItem dark title="连接状态" desc="USB 已连接 · 电量 82% · 网络正常" />
          </div>
          <div className="flex gap-2.5 flex-wrap mt-3">
            <Btn variant="primary" onClick={() => toast("演示：连接成功后，允许进入调参工作区。")}>重新识别设备</Btn>
            <Btn onClick={() => toast("演示：若设备连接失败，提示检查数据线 / 开机状态。")}>连接异常处理</Btn>
          </div>
        </Card>

        <Card>
          <PanelTitle title="兼容校验"><Tag variant="warn">高风险拦截</Tag></PanelTitle>
          <KV label="PC 客户端版本" value="V0.2.0" />
          <KV label="控制盒固件版本" value="V0.5.1" />
          <KV label="参数模板版本" value="PT-2026-04" />
          <KV label="兼容结果" value={<Tag>通过</Tag>} />
          <div className="flex gap-2.5 flex-wrap mt-3">
            <Btn variant="ghost" onClick={() => toast("版本不匹配时：禁止调参保存、禁止恢复历史配置，仅允许查看处理指引。")}>查看拦截规则</Btn>
            <Btn variant="primary" onClick={() => onNavigate("tuning")}>进入调参工作区</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
