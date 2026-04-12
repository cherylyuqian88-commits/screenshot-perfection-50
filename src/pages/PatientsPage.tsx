import { useState } from "react";
import { toast } from "sonner";
import { Card, Tag, PanelTitle, KV, TimelineItem, Btn, TableWrap } from "@/components/ui-parts";
import { cn } from "@/lib/utils";

interface Props { onNavigate: (page: string) => void; }

type Tab = "local" | "cross";

const localUsers = [
  { name: "李某", id: "SZ202604120001", phone: "138****1234", gender: "男 / 58", org: "深圳爱眼低视力中心", device: "已关联控制盒", status: "本机构服务中", activity: "高", avgDuration: "4.2h" },
  { name: "张某", id: "SZ202603180021", phone: "135****6620", gender: "男 / 63", org: "深圳爱眼低视力中心", device: "版本风险", status: "本机构服务中", deviceWarn: true, activity: "中", avgDuration: "2.8h" },
];

const crossUsers = [
  { name: "王某", id: "HZ202603030014", phone: "137****9981", gender: "女 / 49", org: "杭州康复门诊", device: "未显示", status: "待建立关系", isCross: true, activity: "低", avgDuration: "0.5h" },
];

export default function PatientsPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>("local");
  const [selectedUser, setSelectedUser] = useState<string | null>("SZ202604120001");

  const users = tab === "local" ? localUsers : crossUsers;
  const detail = [...localUsers, ...crossUsers].find((u) => u.id === selectedUser);

  return (
    <div className="animate-fade-in h-full">
      <div className="grid grid-cols-[1fr_380px] gap-4 h-full max-xl:grid-cols-1">
        {/* Left: user list */}
        <Card className="flex flex-col min-h-0">
          <PanelTitle title="用户列表">
            <div className="flex gap-2">
              <Btn onClick={() => toast("演示说明：跨机构用户未建立本机构服务关系前，仅可查看脱敏字段。")}>跨机构查看规则</Btn>
              <Btn variant="primary" onClick={() => onNavigate("new-patient")}>新建用户</Btn>
            </div>
          </PanelTitle>

          {/* Tabs */}
          <div className="flex gap-1 mb-4">
            <button
              onClick={() => { setTab("local"); setSelectedUser(localUsers[0]?.id || null); }}
              className={cn(
                "px-3.5 py-2 rounded-lg text-sm border-0 cursor-pointer transition-all",
                tab === "local"
                  ? "bg-gradient-to-r from-brand/20 to-brand-secondary/20 text-foreground font-semibold shadow-[inset_0_0_0_1px_hsl(197_92%_60%/0.25)]"
                  : "bg-secondary text-soft hover:text-foreground"
              )}
            >
              机构内当前关联用户
            </button>
            <button
              onClick={() => { setTab("cross"); setSelectedUser(crossUsers[0]?.id || null); }}
              className={cn(
                "px-3.5 py-2 rounded-lg text-sm border-0 cursor-pointer transition-all",
                tab === "cross"
                  ? "bg-gradient-to-r from-brand/20 to-brand-secondary/20 text-foreground font-semibold shadow-[inset_0_0_0_1px_hsl(197_92%_60%/0.25)]"
                  : "bg-secondary text-soft hover:text-foreground"
              )}
            >
              跨机构查询用户
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2.5 flex-wrap mb-4">
            <input className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none max-w-[260px] text-sm focus:border-brand focus:shadow-[0_0_0_4px_hsl(197_92%_60%/0.12)]" placeholder="搜索姓名 / 手机号 / 用户ID" defaultValue="李" />
            <select className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none max-w-[180px] text-sm">
              <option>全部设备状态</option><option>已连接设备</option><option>未关联设备</option>
            </select>
            <Btn onClick={() => toast("演示搜索：若手机号重复，将优先提示复用云端用户档案。")}>查询</Btn>
          </div>

          {/* Table */}
          <TableWrap>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["用户ID","姓名","关联机构","关联设备","活跃度","近7天日均时长"].map(h => (
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
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.id}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.name}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{u.org}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">
                      <Tag variant={(u as any).deviceWarn ? "warn" : undefined}>{u.device}</Tag>
                    </td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{(u as any).activity}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">{(u as any).avgDuration}</td>
                    <td className="px-4 py-3.5 border-b border-line text-[13px]">
                      <div className="flex gap-2">
                        {tab === "local" ? (
                          <>
                            <Btn onClick={() => setSelectedUser(u.id)}>详情</Btn>
                            <Btn variant="ghost" onClick={() => onNavigate("tuning")}>调参</Btn>
                          </>
                        ) : (
                          <Btn variant="primary" onClick={() => toast("演示：建立本机构服务关系后，才可读取完整必要信息。")}>建立关系</Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>

        {/* Right: user detail */}
        <div className="flex flex-col gap-4 min-w-0">
          {detail ? (
            <>
              <Card>
                <PanelTitle title="用户详情">
                  <div className="flex gap-2">
                    <Btn onClick={() => onNavigate("records")}>调参记录</Btn>
                    <Btn variant="primary" onClick={() => onNavigate("tuning")}>编辑</Btn>
                  </div>
                </PanelTitle>
                <KV label="姓名" value={detail.name} />
                <KV label="用户ID" value={detail.id} />
                <KV label="手机号" value={detail.phone} />
                <KV label="性别 / 年龄" value={detail.gender} />
                <KV label="关联机构" value={detail.org} />
                <KV label="关联设备" value={<Tag variant={(detail as any).deviceWarn ? "warn" : undefined}>{detail.device}</Tag>} />
              </Card>

              <Card>
                <PanelTitle title="最近事件"><Tag variant="info">用户侧仅看摘要</Tag></PanelTitle>
                <div className="flex flex-col gap-3">
                  <TimelineItem title="最近一次调参完成" desc="2026-04-12 10:12 · 陈医生 · 参数模板 PT-2026-04" />
                  <TimelineItem title="当前服务机构来源" desc="按用户最后一次确认切换绑定机构结果计算，不按临时连接动态切换。" />
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
