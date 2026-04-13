import { useState } from "react";
import { toast } from "sonner";
import { Card, PanelTitle, Tag, Btn, TableWrap } from "@/components/ui-parts";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props { onNavigate: (page: string) => void; }

const mockDoctors = [
  { id: "D001", account: "dr_chen_001", name: "陈医生", phone: "138****1234", org: "深圳爱眼低视力中心", role: "医生", status: "启用", createTime: "2025-08-15" },
  { id: "D002", account: "dr_wang_002", name: "王医生", phone: "135****6620", org: "深圳爱眼低视力中心", role: "医生", status: "启用", createTime: "2025-09-20" },
  { id: "D003", account: "dr_liu_003", name: "刘医生", phone: "139****4478", org: "深圳爱眼低视力中心", role: "医生", status: "启用", createTime: "2025-10-05" },
  { id: "D004", account: "dr_li_004", name: "李医生", phone: "136****8832", org: "深圳爱眼低视力中心", role: "医生", status: "停用", createTime: "2025-11-12" },
];

export default function AdminDoctorsPage({ onNavigate }: Props) {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof mockDoctors[0] | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const [newName, setNewName] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const filtered = doctors.filter(d =>
    d.name.includes(search) || d.account.includes(search) || d.phone.includes(search)
  );

  const allChecked = filtered.length > 0 && filtered.every(d => checkedIds.includes(d.id));
  const someChecked = filtered.some(d => checkedIds.includes(d.id)) && !allChecked;

  const toggleAll = () => {
    const ids = filtered.map(d => d.id);
    if (allChecked) {
      setCheckedIds(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setCheckedIds(prev => [...new Set([...prev, ...ids])]);
    }
  };
  const toggleOne = (id: string) => {
    setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAdd = () => {
    if (!newName || !newAccount) { toast.error("请填写必填项"); return; }
    toast.success(`已添加医生账号：${newAccount}`);
    setDoctors(prev => [...prev, {
      id: `D${String(prev.length + 1).padStart(3, "0")}`,
      account: newAccount, name: newName, phone: newPhone,
      org: "深圳爱眼低视力中心", role: "医生", status: "启用",
      createTime: "2026-04-13"
    }]);
    setAddOpen(false);
    setNewName(""); setNewAccount(""); setNewPhone("");
  };

  const handleEdit = () => {
    if (!selectedDoctor) return;
    setDoctors(prev => prev.map(d =>
      d.id === selectedDoctor.id ? { ...d, name: editName, phone: editPhone } : d
    ));
    toast.success(`已更新医生信息：${editName}`);
    setEditOpen(false);
  };

  const handleResetPwd = () => {
    if (!selectedDoctor) return;
    toast.success(`已重置 ${selectedDoctor.name} 的密码为默认密码`);
    setResetOpen(false);
  };

  const handleDelete = () => {
    if (!selectedDoctor) return;
    setDoctors(prev => prev.filter(d => d.id !== selectedDoctor.id));
    toast.success(`已删除医生账号：${selectedDoctor.account}`);
    setDeleteOpen(false);
  };

  const handleToggleStatus = (doctor: typeof mockDoctors[0]) => {
    const newStatus = doctor.status === "启用" ? "停用" : "启用";
    setDoctors(prev => prev.map(d =>
      d.id === doctor.id ? { ...d, status: newStatus } : d
    ));
    toast.success(`${doctor.name} 已${newStatus}`);
  };

  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="医生账号管理">
          <div className="flex items-center gap-2">
            <input
              className="border border-line rounded-[14px] bg-card px-3.5 py-2 text-foreground outline-none w-[220px] text-sm focus:border-brand focus:shadow-[0_0_0_4px_hsl(197_92%_60%/0.12)]"
              placeholder="搜索姓名/账号/手机号"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Btn variant="primary" onClick={() => setAddOpen(true)}>新增医生</Btn>
          </div>
        </PanelTitle>

        {checkedIds.length > 0 && (
          <div className="px-4 py-2 text-[13px] text-soft flex items-center gap-2">
            已选 {checkedIds.length} 项
          </div>
        )}

        <TableWrap>
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1] w-10">
                  <Checkbox checked={allChecked} onCheckedChange={toggleAll} aria-label="全选" className={someChecked ? "data-[state=unchecked]:bg-brand/20" : ""} />
                </th>
                {["登录账号", "姓名", "手机号", "所属机构", "角色", "状态", "创建时间", "操作"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-secondary/60 transition-colors">
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">
                    <Checkbox checked={checkedIds.includes(d.id)} onCheckedChange={() => toggleOne(d.id)} />
                  </td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{d.account}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{d.name}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{d.phone}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{d.org}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{d.role}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">
                    <Tag variant={d.status === "启用" ? "ok" : "danger"}>{d.status}</Tag>
                  </td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{d.createTime}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setSelectedDoctor(d); setEditName(d.name); setEditPhone(d.phone); setEditOpen(true); }}
                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-0"
                      >编辑</button>
                      <button
                        onClick={() => { setSelectedDoctor(d); setResetOpen(true); }}
                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-0"
                      >重置密码</button>
                      <button
                        onClick={() => handleToggleStatus(d)}
                        className={cn(
                          "text-xs underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-0",
                          d.status === "启用" ? "text-[hsl(28,80%,36%)] hover:text-[hsl(28,80%,26%)]" : "text-[hsl(162,73%,27%)] hover:text-[hsl(162,73%,20%)]"
                        )}
                      >{d.status === "启用" ? "停用" : "启用"}</button>
                      <button
                        onClick={() => { setSelectedDoctor(d); setDeleteOpen(true); }}
                        className="text-xs text-destructive hover:text-destructive/80 underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-0"
                      >删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>新增医生账号</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5"><Label>姓名 *</Label><Input placeholder="请输入医生姓名" value={newName} onChange={e => setNewName(e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>登录账号 *</Label><Input placeholder="请输入登录账号" value={newAccount} onChange={e => setNewAccount(e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>手机号</Label><Input placeholder="请输入手机号" value={newPhone} onChange={e => setNewPhone(e.target.value)} /></div>
            <p className="text-xs text-soft">初始密码将设为默认密码 12345678，医生首次登录后需修改。</p>
          </div>
          <DialogFooter><Btn onClick={() => setAddOpen(false)}>取消</Btn><Btn variant="primary" onClick={handleAdd}>确认添加</Btn></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>编辑医生信息</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5"><Label>登录账号</Label><Input disabled value={selectedDoctor?.account || ""} /></div>
            <div className="flex flex-col gap-1.5"><Label>姓名</Label><Input value={editName} onChange={e => setEditName(e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>手机号</Label><Input value={editPhone} onChange={e => setEditPhone(e.target.value)} /></div>
          </div>
          <DialogFooter><Btn onClick={() => setEditOpen(false)}>取消</Btn><Btn variant="primary" onClick={handleEdit}>保存修改</Btn></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>重置密码</DialogTitle></DialogHeader>
          <p className="text-sm py-2">确定将 <strong>{selectedDoctor?.name}</strong>（{selectedDoctor?.account}）的密码重置为默认密码？</p>
          <p className="text-xs text-soft">重置后密码为 12345678，医生下次登录需修改密码。</p>
          <DialogFooter><Btn onClick={() => setResetOpen(false)}>取消</Btn><Btn variant="danger" onClick={handleResetPwd}>确认重置</Btn></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>删除医生账号</DialogTitle></DialogHeader>
          <p className="text-sm py-2">确定删除 <strong>{selectedDoctor?.name}</strong>（{selectedDoctor?.account}）的账号？此操作不可撤销。</p>
          <DialogFooter><Btn onClick={() => setDeleteOpen(false)}>取消</Btn><Btn variant="danger" onClick={handleDelete}>确认删除</Btn></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
