import { useState } from "react";
import { toast } from "sonner";
import { Card, Tag, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";
import { cn } from "@/lib/utils";

interface Props { onNavigate: (page: string) => void; }

const users = [
  { name: "李某", id: "SZ202604120001", org: "深圳爱眼低视力中心", device: "SN-20260301-0042", activity: "高", avgDuration: "4.2h", doctor: "陈医生", lastTuning: "2026-04-12 10:12" },
  { name: "张某", id: "SZ202603180021", org: "深圳爱眼低视力中心", device: "SN-20260218-0087", activity: "中", avgDuration: "2.8h", doctor: "王医生", lastTuning: "2026-04-10 14:30" },
  { name: "赵某", id: "SZ202602250033", org: "深圳爱眼低视力中心", device: "SN-20260115-0023", activity: "高", avgDuration: "3.6h", doctor: "陈医生", lastTuning: "2026-04-11 09:45" },
  { name: "刘某", id: "SZ202601100045", org: "深圳爱眼低视力中心", device: "SN-20251220-0061", activity: "低", avgDuration: "0.8h", doctor: "李医生", lastTuning: "2026-03-28 16:20" },
  { name: "陈某", id: "SZ202603050052", org: "深圳爱眼低视力中心", device: "SN-20260305-0099", activity: "中", avgDuration: "2.1h", doctor: "王医生", lastTuning: "2026-04-09 11:00" },
  { name: "孙某", id: "SZ202604010060", org: "深圳爱眼低视力中心", device: "SN-20260401-0110", activity: "高", avgDuration: "5.1h", doctor: "陈医生", lastTuning: "2026-04-12 08:30" },
];

export default function SelectUserPage({ onNavigate }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="选择关联用户">
          <Btn onClick={() => onNavigate("tuning")}>返回调参</Btn>
        </PanelTitle>

        <TableWrap>
          <table className="w-full border-collapse min-w-[980px]">
            <thead>
              <tr>
                {["用户ID", "姓名", "关联机构", "设备SN", "活跃度", "近7天日均时长", "医生", "最近调参时间"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setSelected(u.id)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selected === u.id ? "bg-brand/[0.06]" : "hover:bg-secondary/60"
                  )}
                >
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.id}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.name}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.org}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.device}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">
                    <Tag variant={u.activity === "高" ? "ok" : u.activity === "中" ? "info" : "danger"}>{u.activity}</Tag>
                  </td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.avgDuration}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.doctor}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.lastTuning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

        <div className="flex items-center justify-end gap-2.5 mt-4">
          <Btn onClick={() => { toast("演示：已取消关联用户"); onNavigate("tuning"); }}>取消关联用户</Btn>
          <Btn variant="primary" onClick={() => {
            if (!selected) { toast("请先选择一个用户"); return; }
            const user = users.find(u => u.id === selected);
            toast(`已选择关联用户：${user?.name}`);
            onNavigate("tuning");
          }}>确定选择</Btn>
        </div>
      </Card>
    </div>
  );
}
