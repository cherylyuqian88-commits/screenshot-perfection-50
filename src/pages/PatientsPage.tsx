import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, Tag, PanelTitle, KV, TimelineItem, Btn, TableWrap } from "@/components/ui-parts";
import { cn } from "@/lib/utils";

interface Props { onNavigate: (page: string, from?: string) => void; }

const localUsers = [
  { name: "李某", id: "SZ202604120001", phone: "138****1234", gender: "男 / 58", idLast4: "4821", org: "深圳爱眼低视力中心", device: "SN-20260301-0042", status: "本机构服务中", activity: "高", avgDuration: "4.2h", doctor: "陈医生", lastTuning: "2026-04-12 10:12" },
  { name: "张某", id: "SZ202603180021", phone: "135****6620", gender: "男 / 63", idLast4: "7735", org: "深圳爱眼低视力中心", device: "SN-20260218-0087", status: "本机构服务中", activity: "中", avgDuration: "2.8h", doctor: "王医生", lastTuning: "2026-04-10 14:30" },
  { name: "赵某", id: "SZ202602250033", phone: "139****4478", gender: "女 / 71", idLast4: "1190", org: "深圳爱眼低视力中心", device: "SN-20260115-0023", status: "本机构服务中", activity: "高", avgDuration: "3.6h", doctor: "陈医生", lastTuning: "2026-04-11 09:45" },
  { name: "刘某", id: "SZ202601100045", phone: "136****8832", gender: "男 / 55", idLast4: "6603", org: "深圳爱眼低视力中心", device: "SN-20251220-0061", status: "本机构服务中", activity: "低", avgDuration: "0.8h", doctor: "李医生", lastTuning: "2026-03-28 16:20" },
  { name: "陈某", id: "SZ202603050052", phone: "158****2210", gender: "女 / 66", idLast4: "5528", org: "深圳爱眼低视力中心", device: "SN-20260305-0099", status: "本机构服务中", activity: "中", avgDuration: "2.1h", doctor: "王医生", lastTuning: "2026-04-09 11:00" },
  { name: "孙某", id: "SZ202604010060", phone: "133****7756", gender: "男 / 48", idLast4: "3341", org: "深圳爱眼低视力中心", device: "SN-20260401-0110", status: "本机构服务中", activity: "高", avgDuration: "5.1h", doctor: "陈医生", lastTuning: "2026-04-12 08:30" },
];

const crossUsers = [
  { name: "王某", id: "HZ202603030014", phone: "137****9981", gender: "女 / 49", idLast4: "—", org: "杭州康复门诊", device: "未显示", status: "待建立关系", isCross: true, activity: "低", avgDuration: "0.5h", doctor: "—", lastTuning: "—" },
];

export default function PatientsPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<"local" | "cross">("local");
  const [selectedUser, setSelectedUser] = useState<string | null>("SZ202604120001");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");

  const allUsers = tab === "local" ? localUsers : crossUsers;
  const users = doctorFilter === "all" ? allUsers : allUsers.filter(u => u.doctor === doctorFilter);
  const detail = [...localUsers, ...crossUsers].find((u) => u.id === selectedUser);

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="grid grid-cols-[1fr_440px] gap-4 flex-1 min-h-0 max-xl:grid-cols-1">
        {/* Left: user list */}
        <Card className="flex flex-col min-h-0">
          <PanelTitle title="用户列表">
            <div className="flex items-center gap-2.5">
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
              <input className="border border-line rounded-[14px] bg-card px-3.5 py-2.5 text-foreground outline-none max-w-[220px] text-sm focus:border-brand focus:shadow-[0_0_0_4px_hsl(197_92%_60%/0.12)]" placeholder="搜索姓名/手机号" />
              <Btn variant="primary" onClick={() => toast("演示搜索：若手机号重复，将优先提示复用云端用户档案。")}>查询</Btn>
              <Btn variant="primary" onClick={() => onNavigate("new-patient")}>新建用户</Btn>
            </div>
          </PanelTitle>

          <TableWrap>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["姓名","关联机构","活跃度","近7天日均时长","医生","最近调参时间","操作"].map(h => (
                    <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u.id)}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedUser === u.id ? "bg-brand/[0.06]" : "hover:bg-secondary/60"
                    )}
                  >
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.name}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.org}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">
                      <Tag variant={u.activity === "高" ? "ok" : u.activity === "中" ? "info" : "danger"}>{u.activity}</Tag>
                    </td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.avgDuration}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.doctor}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.lastTuning}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">
                      <span onClick={(e) => e.stopPropagation()}><Btn variant="primary" onClick={() => toast(`演示：为 ${u.name} 发起调参配对`)}>调参配对</Btn></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>

          <div className="flex items-center justify-end gap-1.5 mt-3 text-sm">
            <button className="px-3 py-1.5 rounded-lg border border-line bg-card text-soft cursor-pointer hover:text-foreground transition-colors text-[13px]">上一页</button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={cn(
                  "w-8 h-8 rounded-lg border cursor-pointer text-[13px] transition-colors",
                  p === 1
                    ? "bg-gradient-to-r from-[hsl(199,89%,49%)] to-[hsl(224,76%,48%)] text-primary-foreground border-transparent"
                    : "border-line bg-card text-soft hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}
            <button className="px-3 py-1.5 rounded-lg border border-line bg-card text-soft cursor-pointer hover:text-foreground transition-colors text-[13px]">下一页</button>
            <span className="text-soft text-[13px] ml-2">共 6 条</span>
          </div>
        </Card>

        {/* Right: user detail */}
        <div className="flex flex-col gap-4 min-w-0">
          {detail ? (
            <>
              <Card>
                <PanelTitle title="用户详情">
                  <div className="flex gap-2">
                    <Btn onClick={() => onNavigate("patient-edit")}>修改</Btn>
                    <Btn onClick={() => onNavigate("patient-records", "patient-detail")}>调参记录</Btn>
                  </div>
                </PanelTitle>
                <KV label="姓名" value={detail.name} />
                <KV label="手机号" value={detail.phone} />
                <KV label="性别 / 年龄" value={detail.gender} />
                <KV label="身份证后4位" value={detail.idLast4} />
                <KV label="关联机构" value={<span className="flex items-center justify-between w-full whitespace-nowrap">{detail.org}<button onClick={() => onNavigate("org-change-records")} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors ml-auto">变更记录</button></span>} />
                <KV label="关联设备" value={<span className="flex items-center justify-between w-full whitespace-nowrap">{detail.device}<button onClick={() => onNavigate("device-change-records")} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors ml-auto">变更记录</button></span>} />
              </Card>

              <Card>
                <PanelTitle title="使用数据" />
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "近7天", value: "42 小时" },
                    { label: "近30天", value: "156 小时" },
                    { label: "累计使用", value: "328 小时" },
                    { label: "日均使用", value: "6.2 小时" },
                  ].map((item) => (
                    <div key={item.label} className="bg-secondary/60 rounded-xl px-3.5 py-3 text-center">
                      <div className="text-[11px] text-muted-foreground mb-1">{item.label}</div>
                      <div className="text-base font-bold text-foreground">{item.value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <PanelTitle title="最近事件" />
                <div className="flex flex-col gap-3">
                  <TimelineItem title="最近一次调参完成" desc="2026-04-12 10:12 · 陈医生 · 参数编号 PT-2026-04" />
                </div>
              </Card>
            </>
          ) : (
            <Card className="flex-1 grid place-items-center">
              <div className="text-soft text-sm">点击左侧用户查看详情</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}