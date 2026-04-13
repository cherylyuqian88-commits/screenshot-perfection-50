import { Card, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface Props { onNavigate: (page: string) => void; }

const records = [
  { time: "2026-04-01 09:20", from: "—", to: "深圳爱眼低视力中心", operator: "陈医生", reason: "首次建档" },
  { time: "2026-03-15 14:10", from: "深圳爱眼低视力中心", to: "广州视觉康复中心", operator: "王医生", reason: "患者转诊" },
  { time: "2026-02-20 10:30", from: "广州视觉康复中心", to: "深圳爱眼低视力中心", operator: "陈医生", reason: "患者回迁" },
];

export default function OrgChangeRecordsPage({ onNavigate }: Props) {
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
              <BreadcrumbPage>关联机构变更记录</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <PanelTitle title="李某 — 关联机构变更记录">
          <Btn onClick={() => onNavigate("patients")}>返回用户列表</Btn>
        </PanelTitle>

        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["变更时间", "原机构", "新机构", "操作人", "变更原因"].map(h => (
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