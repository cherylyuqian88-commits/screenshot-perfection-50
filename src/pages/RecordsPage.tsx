import { useState } from "react";
import { Card, Tag, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

const records = [
  { time: "2026-04-12 10:12", sn: "9A24", user: "李某", userId: "SZ202604120001", template: "PT-2026-04", doctor: "陈医生", result: "已保存" },
  { time: "2026-04-12 09:43", sn: "71F2", user: "张某", userId: "SZ202603180021", template: "PT-2026-04", doctor: "陈医生", result: "兼容拦截" },
  { time: "2026-04-11 16:30", sn: "5B01", user: "王某", userId: "SZ202602050008", template: "PT-2026-03", doctor: "王医生", result: "已保存" },
  { time: "2026-04-10 14:20", sn: "9A23", user: "", userId: "SZ202601220015", template: "PT-2026-03", doctor: "陈医生", result: "未保存" },
  { time: "2026-04-09 11:05", sn: "3C17", user: "赵某", userId: "SZ202603010042", template: "PT-2026-04", doctor: "刘医生", result: "已保存" },
  { time: "2026-04-08 09:30", sn: "8D44", user: "", userId: "SZ202604080003", template: "PT-2026-02", doctor: "陈医生", result: "兼容拦截" },
  { time: "2026-04-05 15:50", sn: "2E09", user: "孙某", userId: "SZ202601100027", template: "PT-2026-04", doctor: "王医生", result: "已保存" },
  { time: "2026-04-03 10:40", sn: "6F33", user: "周某", userId: "SZ202602280019", template: "PT-2026-03", doctor: "刘医生", result: "未保存" },
];

const resultTag = (r: string) => {
  if (r === "已保存") return <Tag>{r}</Tag>;
  if (r === "未保存") return <Tag variant="warn">{r}</Tag>;
  return <Tag variant="danger">{r}</Tag>;
};

const PAGE_SIZE = 5;

export default function RecordsPage({ onNavigate }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const paged = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="调参记录">
          <div className="flex items-center gap-2">
            <input className="border border-line rounded-[14px] bg-card px-3.5 py-2 text-foreground outline-none w-[200px] text-sm" placeholder="用户姓名 / 用户ID" />
            <Btn>搜索</Btn>
          </div>
        </PanelTitle>

        <TableWrap>
          <table className="w-full border-collapse min-w-[980px]">
            <thead>
              <tr>
                {["调试时间","设备SN","关联用户","用户ID","参数模板","操作医生","结果"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((r, i) => (
                <tr key={i} className="hover:bg-secondary/60 transition-colors">
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.time}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.sn}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px] text-muted-foreground">{r.user || "—"}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.userId}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.template}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.doctor}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{resultTag(r.result)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>共 {records.length} 条记录</span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-line bg-card text-foreground text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${page === i + 1 ? "bg-primary text-primary-foreground" : "border border-line bg-card text-foreground hover:bg-secondary"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-line bg-card text-foreground text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
