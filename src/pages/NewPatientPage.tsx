import { toast } from "sonner";
import { Card, Tag, PanelTitle, TimelineItem, Btn, TableWrap } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

export default function NewPatientPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <Card>
          <PanelTitle title="新建患者"><Tag variant="info">医生端建档</Tag></PanelTitle>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "姓名", val: "李某" },
              { label: "性别", val: "男", type: "select" },
              { label: "年龄", val: "58" },
              { label: "手机号", val: "13800001234" },
              { label: "身份证后 4 位", val: "4821" },
              { label: "备注", val: "首次到院验配" },
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
            <Btn onClick={() => toast("先执行云端查重，避免重复新建患者。")}>云端查重</Btn>
            <Btn variant="primary" onClick={() => toast("演示：系统自动生成用户ID = 机构 + 时间戳 + 流水号。")}>确认建档并生成用户ID</Btn>
          </div>
        </Card>

        <Card>
          <PanelTitle title="建档规则提示"><Tag variant="warn">关键约束</Tag></PanelTitle>
          <div className="flex flex-col gap-3">
            <TimelineItem title="用户ID生成规则" desc="由系统根据机构编码 + 时间戳 + 流水号自动生成，不允许医生手动输入。" />
            <TimelineItem title="手机号重复处理" desc="若手机号已存在，需验证码确认，并优先拉取云端已有患者档案，不重复建新账号。" />
            <TimelineItem title="手机号变更" desc="后续若患者需变更手机号，由医生在 PC 端发起处理，更新当前登录方式。" />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <PanelTitle title="查重结果示例">
          <Btn onClick={() => toast("演示：已存在患者时，医生应选择"拉取并建立服务关系"，而不是重复创建。")}>查看处理建议</Btn>
        </PanelTitle>
        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["姓名","手机号","用户ID","当前服务机构","可见范围","建议动作"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">李某</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">138****1234</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">SZ202604120001</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">深圳爱眼低视力中心</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">完整信息可见</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Btn variant="ok" onClick={() => onNavigate("patient-detail")}>直接进入详情</Btn></td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">王某</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">137****9981</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">HZ202603030014</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">杭州康复门诊</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">仅脱敏字段</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Btn variant="primary" onClick={() => toast("演示：验证码确认后，可建立本机构服务关系并留痕。")}>建立本机构关系</Btn></td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
