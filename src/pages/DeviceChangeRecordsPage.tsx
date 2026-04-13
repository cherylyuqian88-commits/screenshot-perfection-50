import { Card, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface Props { onNavigate: (page: string) => void; }

const records = [
  { time: "2026-04-01 09:35", from: "—", to: "控制盒 RX-A102 / SN 9A24", operator: "陈医生", reason: "首次关联" },
  { time: "2026-03-10 11:20", from: "控制盒 RX-A102 / SN 9A24", to: "控制盒 RX-A087 / SN 71F2", operator: "王医生", reason: "设备更换" },
  { time: "2026-02-15 16:00", from: "控制盒 RX-A087 / SN 71F2", to: "控制盒 RX-A102 / SN 9A24", operator: "陈医生", reason: "设备回换" },
];

export default function DeviceChangeRecordsPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer" onClick={() => onNavigate("patients")}>用户列表</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer" onClick={() => onNavigate("patients")}>用户详情</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>关联设备变更记录</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <PanelTitle title="李某 — 关联设备变更记录">
          <Btn onClick={() => onNavigate("patients")}>返回用户列表</Btn>
        </PanelTitle>

        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["变更时间", "原设备", "新设备", "操作人", "变更原因"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-secondary/60 transition-colors">
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.time}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px] text-muted-foreground">{r.from}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.to}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.operator}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}