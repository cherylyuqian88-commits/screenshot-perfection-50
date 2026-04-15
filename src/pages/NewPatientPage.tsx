import { useState } from "react";
import { toast } from "sonner";
import { Card, Tag, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface Props { onNavigate: (page: string) => void; }

const dupUsers = [
  { name: "李某", phone: "138****5678", gender: "男", age: 58, idLast4: "4821", org: "深圳爱眼低视力中心" },
  { name: "李某", phone: "138****1234", gender: "男", age: 60, idLast4: "7733", org: "杭州康复门诊" },
];

export default function NewPatientPage({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof dupUsers[0] | null>(null);

  const handleLinkClick = (u: typeof dupUsers[0]) => {
    setSelectedUser(u);
    setOtpOpen(true);
  };

  const handleOtpConfirm = () => {
    if (otpValue.length < 6) {
      toast.error("请输入完整的6位验证码");
      return;
    }
    toast.success("验证码校验成功，已建立关联");
    setOtpOpen(false);
    setOpen(false);
    setOtpValue("");
    onNavigate("tuning");
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        <Card>
          <PanelTitle title="新建用户"><Tag variant="info">医生端建档</Tag></PanelTitle>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "姓名", val: "李某", required: true },
              { label: "性别", val: "男", type: "select", required: true },
              { label: "年龄", val: "58", required: true },
              { label: "手机号", val: "13800001234", required: true },
              { label: "身份证后 4 位", val: "4821", required: true },
              { label: "备注", val: "黄斑变性" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-2">
                <label className="text-[13px] text-soft font-semibold">
                  {f.label}
                  {f.required && <span className="text-destructive ml-0.5">*</span>}
                </label>
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
          <div className="flex gap-2.5 justify-end mt-3">
            <Btn onClick={() => onNavigate("patients")}>取消</Btn>
            <Btn variant="primary" onClick={() => setOpen(true)}>确认建档</Btn>
          </div>
        </Card>
      </div>

      {/* 查重弹窗 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>查重用户</DialogTitle>
          </DialogHeader>
          <TableWrap>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["姓名","手机号","性别","年龄","身份证后4位","当前关联机构","操作"].map(h => (
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
                    <td className="px-4 py-3 border-b border-line text-[13px]">{u.org}</td>
                    <td className="px-4 py-3 border-b border-line text-[13px]">
                      <Btn variant="primary" onClick={() => handleLinkClick(u)}>建立关联</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </DialogContent>
      </Dialog>

      {/* 验证码弹窗 */}
      <Dialog open={otpOpen} onOpenChange={(v) => { setOtpOpen(v); if (!v) setOtpValue(""); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>验证码校验</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-soft">已向用户 {selectedUser?.name} 的手机号 {selectedUser?.phone} 发送验证码，请输入6位验证码完成关联。</p>
          <div className="flex justify-center py-4">
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex justify-end gap-2">
            <Btn onClick={() => { setOtpOpen(false); setOtpValue(""); }}>取消</Btn>
            <Btn variant="primary" onClick={handleOtpConfirm}>确认</Btn>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
