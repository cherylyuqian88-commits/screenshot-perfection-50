import { toast } from "sonner";
import { Card, Tag, PanelTitle, KV, TimelineItem, Btn } from "@/components/ui-parts";

interface Props { onLogout: () => void; }

export default function AccountPage({ onLogout }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <Card>
          <PanelTitle title="我的账号"><Tag>当前登录中</Tag></PanelTitle>
          <KV label="账号" value="dr_chen_001" />
          <KV label="姓名" value="陈医生" />
          <KV label="所属机构" value="深圳爱眼低视力中心" />
          <KV label="角色" value="执业医生" />
          <KV label="权限边界" value="可查看全院 / 云端患者；仅可编辑自己创建的患者基础信息；无医生账号管理权" />
          <div className="flex gap-2.5 flex-wrap mt-3">
            <Btn onClick={() => toast("演示：医生仅可修改自身密码。")}>修改密码</Btn>
            <Btn variant="danger" onClick={onLogout}>退出登录</Btn>
          </div>
        </Card>
        <Card>
          <PanelTitle title="权限说明"><Tag variant="gray">医生端</Tag></PanelTitle>
          <div className="flex flex-col gap-3">
            <TimelineItem title="可执行" desc="建档、查重、建立服务关系、关联设备、调参、查看调参记录、查看机构变更记录。" />
            <TimelineItem title="不可执行" desc="管理医生账号、跨机构越权编辑他人患者、绕过兼容矩阵保存参数。" />
            <TimelineItem title="脱敏查看规则" desc="未建立本机构服务关系前，仅可看到云端核心标识与脱敏字段。" />
          </div>
        </Card>
      </div>
    </div>
  );
}
