import { useState, useRef } from "react";
import { toast } from "sonner";
import { Card, PanelTitle, Tag, Btn, TableWrap } from "@/components/ui-parts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Props { onNavigate: (page: string) => void; }

type Doctor = {
  id: string; account: string; name: string; phone: string;
  org: string; role: string; status: string; createTime: string;
};

const mockDoctors: Doctor[] = [
  { id: "D001", account: "dr_chen_001", name: "陈医生", phone: "138****1234", org: "深圳爱眼低视力中心", role: "医生", status: "启用", createTime: "2025-08-15" },
  { id: "D002", account: "dr_wang_002", name: "王医生", phone: "135****6620", org: "深圳爱眼低视力中心", role: "医生", status: "启用", createTime: "2025-09-20" },
  { id: "D003", account: "dr_liu_003", name: "刘医生", phone: "139****4478", org: "深圳爱眼低视力中心", role: "医生", status: "启用", createTime: "2025-10-05" },
  { id: "D004", account: "dr_li_004", name: "李医生", phone: "136****8832", org: "深圳爱眼低视力中心", role: "医生", status: "停用", createTime: "2025-11-12" },
];

export default function AdminDoctorsPage({ onNavigate }: Props) {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [recycleBin, setRecycleBin] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [recycleOpen, setRecycleOpen] = useState(false);
  const [emptyRecycleOpen, setEmptyRecycleOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [recycleSelected, setRecycleSelected] = useState<string[]>([]);

  const [newName, setNewName] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = doctors.filter(d =>
    d.name.includes(search) || d.account.includes(search) || d.phone.includes(search)
  );

  const handleAdd = () => {
    if (!newName || !newAccount) { toast.error("请填写必填项"); return; }
    toast.success(`已添加医生账号：${newAccount}`);
    setDoctors(prev => [...prev, {
      id: `D${String(prev.length + 1).padStart(3, "0")}`,
      account: newAccount, name: newName, phone: newPhone,
      org: "深圳爱眼低视力中心", role: "医生", status: "启用",
      createTime: "2026-04-15"
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
    setDoctors(prev => prev.map(d =>
      d.id === selectedDoctor.id ? { ...d, status: "启用" } : d
    ));
    toast.success(`已重置 ${selectedDoctor.name} 的密码为 123456，账号已自动启用，请及时通知该医生修改密码`);
    setResetOpen(false);
  };

  const handleDelete = () => {
    if (!selectedDoctor) return;
    setRecycleBin(prev => [...prev, selectedDoctor]);
    setDoctors(prev => prev.filter(d => d.id !== selectedDoctor.id));
    toast.success(`已将 ${selectedDoctor.name} 的账号移至回收站`);
    setDeleteOpen(false);
  };


  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mockImported: Doctor[] = [
      { id: `D${doctors.length + 1}`, account: "dr_zhao_imp1", name: "赵医生", phone: "137****5501", org: "深圳爱眼低视力中心", role: "医生", status: "启用", createTime: "2026-04-15" },
      { id: `D${doctors.length + 2}`, account: "dr_sun_imp2", name: "孙医生", phone: "133****7702", org: "深圳爱眼低视力中心", role: "医生", status: "启用", createTime: "2026-04-15" },
    ];
    setDoctors(prev => [...prev, ...mockImported]);
    toast.success(`成功导入 ${mockImported.length} 个医生账号`);
    setImportOpen(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRestoreSelected = () => {
    if (recycleSelected.length === 0) { toast.error("请选择要恢复的账号"); return; }
    const toRestore = recycleBin.filter(d => recycleSelected.includes(d.id));
    setDoctors(prev => [...prev, ...toRestore]);
    setRecycleBin(prev => prev.filter(d => !recycleSelected.includes(d.id)));
    setRecycleSelected([]);
    toast.success(`已恢复 ${toRestore.length} 个医生账号`);
  };

  const handleEmptyRecycleBin = () => {
    setRecycleBin([]);
    setRecycleSelected([]);
    setEmptyRecycleOpen(false);
    setRecycleOpen(false);
    toast.success("回收站已清空，账号已彻底删除。关联用户中的医生姓名将标注（账号已注销）");
  };

  const recycleAllSelected = recycleBin.length > 0 && recycleSelected.length === recycleBin.length;

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
            <Btn onClick={() => {}}>搜索</Btn>
            <Btn onClick={() => setImportOpen(true)}>批量导入</Btn>
            <Btn variant="primary" onClick={() => setAddOpen(true)}>新增医生</Btn>
            <Btn className="!bg-[hsl(28,80%,52%)] !text-white hover:!bg-[hsl(28,80%,42%)]" onClick={() => setRecycleOpen(true)}>
              回收站{recycleBin.length > 0 ? `(${recycleBin.length})` : ""}
            </Btn>
          </div>
        </PanelTitle>

        <TableWrap>
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr>
                {["登录账号", "姓名", "手机号", "所属机构", "角色", "状态", "创建时间", "操作"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-secondary/60 transition-colors">
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
                      <button onClick={() => { setSelectedDoctor(d); setEditName(d.name); setEditPhone(d.phone); setEditOpen(true); }} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-0">编辑</button>
                      <button onClick={() => { setSelectedDoctor(d); setResetOpen(true); }} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-0">重置密码</button>
                      
                      <button onClick={() => { setSelectedDoctor(d); setDeleteOpen(true); }} className="text-xs text-destructive hover:text-destructive/80 underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-0">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>

      {/* 新增医生 */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>新增医生账号</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5"><Label>姓名 <span className="text-destructive">*</span></Label><Input placeholder="请输入医生姓名" value={newName} onChange={e => setNewName(e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>登录账号 <span className="text-destructive">*</span></Label><Input placeholder="请输入登录账号" value={newAccount} onChange={e => setNewAccount(e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>手机号</Label><Input placeholder="请输入手机号" value={newPhone} onChange={e => setNewPhone(e.target.value)} /></div>
            <p className="text-xs text-soft">初始密码将设为默认密码 123456，医生首次登录后需修改。</p>
          </div>
          <DialogFooter><Btn onClick={() => setAddOpen(false)}>取消</Btn><Btn variant="primary" onClick={handleAdd}>确认添加</Btn></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量导入 */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>批量导入医生账号</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-foreground">请上传 Excel 文件（.xlsx），包含以下列：姓名、登录账号、手机号。</p>
            <div className="border-2 border-dashed border-line rounded-xl p-6 text-center">
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImportFile} />
              <p className="text-sm text-muted-foreground mb-3">点击下方按钮选择文件</p>
              <div className="flex items-center gap-2 justify-center">
                <Btn variant="primary" onClick={() => fileRef.current?.click()}>选择文件</Btn>
                <Btn onClick={() => { const a = document.createElement("a"); a.href = "/doctor_import_template.xlsx"; a.download = "医生账号导入模板.xlsx"; a.click(); }}>下载表格模版</Btn>
              </div>
            </div>
            <p className="text-xs text-soft">导入的医生账号初始密码统一为 123456，首次登录需修改密码。</p>
          </div>
          <DialogFooter><Btn onClick={() => setImportOpen(false)}>取消</Btn></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑 */}
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

      {/* 重置密码 */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>重置密码</DialogTitle></DialogHeader>
          <p className="text-sm py-2">确定将 <strong>{selectedDoctor?.name}</strong>（{selectedDoctor?.account}）的密码重置为默认密码 <strong>123456</strong>？</p>
          <div className="bg-secondary/80 rounded-xl px-4 py-3 text-xs text-foreground">
            <p className="font-medium mb-1">⚠️ 重置后请通知医生</p>
            <p className="text-muted-foreground">密码重置后，请及时通知 <strong>{selectedDoctor?.name}</strong> 使用新密码 123456 登录，并提醒其尽快修改密码。</p>
          </div>
          <DialogFooter><Btn onClick={() => setResetOpen(false)}>取消</Btn><Btn variant="danger" onClick={handleResetPwd}>确认重置</Btn></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>删除医生账号</DialogTitle></DialogHeader>
          <p className="text-sm py-2">确定删除 <strong>{selectedDoctor?.name}</strong>（{selectedDoctor?.account}）的账号？删除后可在回收站中找回。</p>
          <DialogFooter><Btn onClick={() => setDeleteOpen(false)}>取消</Btn><Btn variant="danger" onClick={handleDelete}>确认删除</Btn></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 回收站 */}
      <Dialog open={recycleOpen} onOpenChange={v => { setRecycleOpen(v); if (!v) setRecycleSelected([]); }}>
        <DialogContent className="max-w-[620px]">
          <DialogHeader><DialogTitle>回收站</DialogTitle></DialogHeader>
          {recycleBin.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">回收站为空</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={recycleAllSelected}
                    onCheckedChange={checked => {
                      setRecycleSelected(checked ? recycleBin.map(d => d.id) : []);
                    }}
                  />
                  全选
                </label>
                <div className="flex items-center gap-2">
                  <Btn variant="primary" onClick={handleRestoreSelected}>恢复选中 ({recycleSelected.length})</Btn>
                  <Btn variant="danger" onClick={() => setEmptyRecycleOpen(true)}>清空回收站</Btn>
                </div>
              </div>
              <TableWrap>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {["", "登录账号", "姓名", "手机号"].map(h => (
                        <th key={h} className="px-3 py-2.5 border-b border-line bg-secondary text-soft text-left text-[13px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recycleBin.map(d => (
                      <tr key={d.id} className="hover:bg-secondary/60 transition-colors">
                        <td className="px-3 py-2.5 border-b border-line">
                          <Checkbox
                            checked={recycleSelected.includes(d.id)}
                            onCheckedChange={checked => {
                              setRecycleSelected(prev =>
                                checked ? [...prev, d.id] : prev.filter(id => id !== d.id)
                              );
                            }}
                          />
                        </td>
                        <td className="px-3 py-2.5 border-b border-line text-[13px]">{d.account}</td>
                        <td className="px-3 py-2.5 border-b border-line text-[13px]">{d.name}</td>
                        <td className="px-3 py-2.5 border-b border-line text-[13px]">{d.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            </>
          )}
          <DialogFooter><Btn onClick={() => setRecycleOpen(false)}>关闭</Btn></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 清空回收站确认 */}
      <Dialog open={emptyRecycleOpen} onOpenChange={setEmptyRecycleOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>清空回收站</DialogTitle></DialogHeader>
          <p className="text-sm py-2">确定清空回收站？此操作不可撤销，所有已删除的医生账号将被彻底删除。</p>
          <p className="text-xs text-soft">彻底删除后，关联用户中的医生姓名不会被移除，仅在姓名后标注"（账号已注销）"。</p>
          <DialogFooter><Btn onClick={() => setEmptyRecycleOpen(false)}>取消</Btn><Btn variant="danger" onClick={handleEmptyRecycleBin}>确认清空</Btn></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
