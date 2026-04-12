import { useState } from "react";
import { Card, PanelTitle, KV, Btn } from "@/components/ui-parts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props { onLogout: () => void; }

export default function AccountPage({ onLogout }: Props) {
  const [pwdOpen, setPwdOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="我的账号" />
        <KV label="账号" value="dr_chen_001" />
        <KV label="姓名" value="陈医生" />
        <KV label="所属机构" value="深圳爱眼低视力中心" />
        <KV label="角色" value="医生" />
        
        <div className="flex gap-2.5 flex-wrap mt-3">
          <Btn onClick={() => setPwdOpen(true)}>修改密码</Btn>
        </div>
      </Card>

      <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>当前密码</Label>
              <Input type="password" placeholder="请输入当前密码" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>新密码</Label>
              <Input type="password" placeholder="请输入新密码" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>确认新密码</Label>
              <Input type="password" placeholder="请再次输入新密码" />
            </div>
          </div>
          <DialogFooter>
            <Btn onClick={() => setPwdOpen(false)}>取消</Btn>
            <Btn variant="primary" onClick={() => { toast("密码修改成功"); setPwdOpen(false); }}>确认修改</Btn>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
