import { useState } from "react";
import { Card, Tag, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props { onNavigate: (page: string) => void; }

const users = [
  { id: "SZ202604120001", name: "李某", phone: "138****1234", gender: "男 / 58", org: "深圳爱眼低视力中心", device: "SN-20260301-0042", activity: "高", avgDuration: "4.2h", doctor: "陈医生", lastTuning: "2026-04-12 10:12" },
  { id: "SZ202603180021", name: "张某", phone: "135****6620", gender: "男 / 63", org: "深圳爱眼低视力中心", device: "SN-20260218-0087", activity: "中", avgDuration: "2.8h", doctor: "王医生", lastTuning: "2026-04-10 14:30" },
  { id: "SZ202602250033", name: "赵某", phone: "139****4478", gender: "女 / 71", org: "深圳爱眼低视力中心", device: "SN-20260115-0023", activity: "高", avgDuration: "3.6h", doctor: "陈医生", lastTuning: "2026-04-11 09:45" },
  { id: "SZ202601100045", name: "刘某", phone: "136****8832", gender: "男 / 55", org: "深圳爱眼低视力中心", device: "SN-20251220-0061", activity: "低", avgDuration: "0.8h", doctor: "李医生", lastTuning: "2026-03-28 16:20" },
  { id: "SZ202603050052", name: "陈某", phone: "158****2210", gender: "女 / 66", org: "深圳爱眼低视力中心", device: "SN-20260305-0099", activity: "中", avgDuration: "2.1h", doctor: "王医生", lastTuning: "2026-04-09 11:00" },
  { id: "SZ202604010060", name: "孙某", phone: "133****7756", gender: "男 / 48", org: "深圳爱眼低视力中心", device: "SN-20260401-0110", activity: "高", avgDuration: "5.1h", doctor: "陈医生", lastTuning: "2026-04-12 08:30" },
];

export default function AdminUsersPage({ onNavigate }: Props) {
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");

  const filtered = users.filter(u => {
    const matchSearch = u.name.includes(search) || u.phone.includes(search);
    const matchDoctor = doctorFilter === "all" || u.doctor === doctorFilter;
    return matchSearch && matchDoctor;
  });

  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="用户数据查看">
          <div className="flex items-center gap-2">
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger className="w-[130px] rounded-[14px] text-sm h-[38px]">
                  <SelectValue placeholder="筛选医生" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部医生</SelectItem>
                  <SelectItem value="陈医生">陈医生</SelectItem>
                  <SelectItem value="王医生">王医生</SelectItem>
                  <SelectItem value="刘医生">刘医生</SelectItem>
                  <SelectItem value="李医生">李医生</SelectItem>
                </SelectContent>
              </Select>
              <input
                className="border border-line rounded-[14px] bg-card px-3.5 py-2 text-foreground outline-none w-[220px] text-sm focus:border-brand focus:shadow-[0_0_0_4px_hsl(197_92%_60%/0.12)]"
                placeholder="搜索姓名/手机号"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Btn>搜索</Btn>
            </div>
        </PanelTitle>

        <TableWrap>
          <table className="w-full border-collapse min-w-[980px]">
            <thead>
              <tr>
                {["姓名", "手机号", "性别/年龄", "关联机构", "关联设备", "活跃度", "近7天日均时长", "医生", "最近调参时间"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-secondary/60 transition-colors">
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.name}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.phone}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.gender}</td>
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
      </Card>
    </div>
  );
}