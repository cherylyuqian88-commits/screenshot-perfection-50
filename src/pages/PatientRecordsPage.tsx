import { toast } from "sonner";
import { Card, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface Props {
  onNavigate: (page: string) => void;
  from?: "patient-detail" | "tuning";
}

const records = [
  { id: "pr1", device: "SN-20260301-0042", template: "PT-2026-04", doctor: "陈医生", time: "2026-04-12 10:12", org: "深圳爱眼低视力中心" },
  { id: "pr2", device: "SN-20260301-0042", template: "PT-2026-03", doctor: "陈医生", time: "2026-04-05 14:30", org: "深圳爱眼低视力中心" },
  { id: "pr3", device: "SN-20260301-0042", template: "PT-2026-02", doctor: "王医生", time: "2026-03-20 09:15", org: "广州视觉康复中心" },
  { id: "pr4", device: "SN-20260301-0042", template: "PT-2026-01", doctor: "陈医生", time: "2026-03-10 16:40", org: "深圳爱眼低视力中心" },
  { id: "pr5", device: "SN-20260301-0042", template: "PT-2025-12", doctor: "陈医生", time: "2026-02-28 11:00", org: "广州视觉康复中心" },
];

export default function PatientRecordsPage({ onNavigate, from = "tuning" }: Props) {
  const fromTuning = from === "tuning";
  const backPage = fromTuning ? "tuning" : "patients";
  const backLabel = fromTuning ? "调参工作区" : "用户列表";

  const headers = ["记录时间", "关联机构", "设备SN", "参数编号", "执行医生"];
  if (fromTuning) headers.push("操作");

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer" onClick={() => onNavigate(backPage)}>
                {backLabel}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {!fromTuning && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="cursor-pointer" onClick={() => onNavigate("patient-detail")}>
                    用户详情
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {fromTuning && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="cursor-pointer" onClick={() => onNavigate("tuning")}>
                    调参工作区
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>调参记录</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <PanelTitle title="李某 — 调参记录">
          <Btn onClick={() => onNavigate(backPage)}>返回{backLabel}</Btn>
        </PanelTitle>

        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/60 transition-colors">
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.time}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.org}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.device}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.template}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.doctor}</td>
                  {fromTuning && (
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">
                      <Btn onClick={() => toast(`演示：调用 ${r.time} 的调参记录`)}>调用</Btn>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}