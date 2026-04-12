import { Card, PanelTitle, Btn, Tag, TableWrap } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

const records = [
  { device: "SN-20260301-0042", template: "PT-2026-04", doctor: "陈医生", result: "成功", sync: "已同步", time: "2026-04-12 10:12" },
  { device: "SN-20260301-0042", template: "PT-2026-03", doctor: "陈医生", result: "成功", sync: "已同步", time: "2026-04-05 14:30" },
  { device: "SN-20260301-0042", template: "PT-2026-02", doctor: "王医生", result: "成功", sync: "已同步", time: "2026-03-20 09:15" },
  { device: "SN-20260301-0042", template: "PT-2026-01", doctor: "陈医生", result: "拦截", sync: "未同步", time: "2026-03-10 16:40" },
  { device: "SN-20260301-0042", template: "PT-2025-12", doctor: "陈医生", result: "成功", sync: "已同步", time: "2026-02-28 11:00" },
];

export default function PatientRecordsPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="李某 — 调参记录">
          <Btn onClick={() => onNavigate("patients")}>返回用户列表</Btn>
        </PanelTitle>

        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["设备SN", "参数模板", "执行医生", "结果", "同步状态", "时间"].map((h) => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-secondary/60 transition-colors">
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.device}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.template}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.doctor}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">
                    <Tag variant={r.result === "成功" ? "ok" : "danger"}>{r.result}</Tag>
                  </td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">
                    <Tag variant={r.sync === "已同步" ? "ok" : "warn"}>{r.sync}</Tag>
                  </td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
