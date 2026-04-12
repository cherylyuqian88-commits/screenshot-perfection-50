import { toast } from "sonner";
import { Card, Tag, PanelTitle, KV, TimelineItem, Btn } from "@/components/ui-parts";

interface Props { onLogout: () => void; }

export default function AccountPage({ onLogout }: Props) {
  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="我的账号"><Tag>当前登录中</Tag></PanelTitle>
        <KV label="账号" value="dr_chen_001" />
        <KV label="姓名" value="陈医生" />
        <KV label="所属机构" value="深圳爱眼低视力中心" />
        <KV label="角色" value="执业医生" />
        <KV label="权限边界" value="可查看全院 / 云端用户；仅可编辑自己创建的用户基础信息；无医生账号管理权" />
        <div className="flex gap-2.5 flex-wrap mt-3">
          <Btn onClick={() => toast("演示：医生仅可修改自身密码。")}>修改密码</Btn>
          <Btn variant="danger" onClick={onLogout}>退出登录</Btn>
        </div>
      </Card>
    </div>
  );
}
