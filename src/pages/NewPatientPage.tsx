import { useState } from "react";
import { toast } from "sonner";
import { Card, Tag, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props { onNavigate: (page: string) => void; }

const dupUsers = [
  { name: "李某", phone: "138****5678", gender: "男", age: 58, idLast4: "4821", uid: "SZ202604120001", org: "深圳爱眼低视力中心" },
  { name: "李某", phone: "138****1234", gender: "男", age: 60, idLast4: "7733", uid: "HZ202603030014", org: "杭州康复门诊" },
];

export default function NewPatientPage({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        <Card>
          <PanelTitle title="新建用户"><Tag variant="info">医生端建档</Tag></PanelTitle>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "姓名", val: "李某" },
              { label: "性别", val: "男", type: "select" },
              { label: "年龄", val: "58" },
              { label: "手机号", val: "13800001234" },
              { label: "身份证后 4 位", val: "4821" },
              { label: "备注", val: "黄斑变性" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-2">
                <label className="text-[13px] text-soft font-semibold">{f.label}</label>
                {f.type === "select" ? (
                  <select className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none text-sm" defaultValue={f.val}>
                    <option>男</option><option>女</option>
                  </select>
                ) : (
                  <input className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none text-sm focus:border-brand focus:shadow-[0_0_0_4px_hsl(197_92%_60%/0.12)]" defaultValue={f.val} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2.5 flex-wrap mt-3">
            <Btn variant="primary" onClick={() => setOpen(true)}>确认建档并生成用户ID</Btn>
          </div>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>查重用户</DialogTitle>
          </DialogHeader>
          <TableWrap>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["姓名","手机号","性别","年龄","身份证后4位","用户ID","当前关联机构","操作"].map(h => (
                    <th key={h} className="px-4 py-3 border-b border-line bg-secondary text-soft text-left text-[13px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dupUsers.map((u, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 border-b border-line text-[13px]">{u.name}</td>
                    <td className="px-4 py-3 border-b border-line text-[13px]">{u.phone}</td>
                    <td className="px-4 py-3 border-b border-line text-[13px]">{u.gender}</td>
                    <td className="px-4 py-3 border-b border-line text-[13px]">{u.age}</td>
                    <td className="px-4 py-3 border-b border-line text-[13px]">{u.idLast4}</td>
                    <td className="px-4 py-3 border-b border-line text-[13px]">{u.uid}</td>
                    <td className="px-4 py-3 border-b border-line text-[13px]">{u.org}</td>
                    <td className="px-4 py-3 border-b border-line text-[13px]">
                      <Btn variant="primary" onClick={() => { toast("已建立关联"); setOpen(false); }}>建立关联</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </DialogContent>
      </Dialog>
    </div>
  );
}
