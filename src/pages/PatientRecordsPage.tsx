import { useState } from "react";
import { Card, PanelTitle, Btn, Tag, TableWrap } from "@/components/ui-parts";
import { Checkbox } from "@/components/ui/checkbox";

interface Props { onNavigate: (page: string) => void; }

const records = [
  { id: "pr1", device: "SN-20260301-0042", template: "PT-2026-04", doctor: "陈医生", result: "成功", sync: "已同步", time: "2026-04-12 10:12" },
  { id: "pr2", device: "SN-20260301-0042", template: "PT-2026-03", doctor: "陈医生", result: "成功", sync: "已同步", time: "2026-04-05 14:30" },
  { id: "pr3", device: "SN-20260301-0042", template: "PT-2026-02", doctor: "王医生", result: "成功", sync: "已同步", time: "2026-03-20 09:15" },
  { id: "pr4", device: "SN-20260301-0042", template: "PT-2026-01", doctor: "陈医生", result: "拦截", sync: "未同步", time: "2026-03-10 16:40" },
  { id: "pr5", device: "SN-20260301-0042", template: "PT-2025-12", doctor: "陈医生", result: "成功", sync: "已同步", time: "2026-02-28 11:00" },
];

export default function PatientRecordsPage({ onNavigate }: Props) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const allChecked = records.length > 0 && checkedIds.length === records.length;
  const someChecked = checkedIds.length > 0 && !allChecked;

  const toggleAll = () => {
    setCheckedIds(allChecked ? [] : records.map(r => r.id));
  };
  const toggleOne = (id: string) => {
    setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="李某 — 调参记录">
          <Btn onClick={() => onNavigate("tuning")}>返回调参页面</Btn>
        </PanelTitle>

        {checkedIds.length > 0 && (
          <div className="px-4 py-2 text-[13px] text-soft flex items-center gap-2">
            已选 {checkedIds.length} 项
          </div>
        )}

        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1] w-10">
                  <Checkbox checked={allChecked} onCheckedChange={toggleAll} aria-label="全选" className={someChecked ? "data-[state=unchecked]:bg-brand/20" : ""} />
                </th>
                {["记录时间", "设备SN", "参数名称", "执行医生", "结果", "同步状态"].map((h) => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/60 transition-colors">
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">
                    <Checkbox checked={checkedIds.includes(r.id)} onCheckedChange={() => toggleOne(r.id)} />
                  </td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.time}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.device}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.template}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.doctor}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">
                    <Tag variant={r.result === "成功" ? "ok" : "danger"}>{r.result}</Tag>
                  </td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">
                    <Tag variant={r.sync === "已同步" ? "ok" : "warn"}>{r.sync}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
