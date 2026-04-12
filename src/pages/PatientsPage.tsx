import { toast } from "sonner";
import { Card, Tag, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

export default function PatientsPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="患者列表">
          <div className="flex gap-2">
            <Btn onClick={() => toast("演示说明：跨机构患者未建立本机构服务关系前，仅可查看脱敏字段。")}>跨机构查看规则</Btn>
            <Btn variant="primary" onClick={() => onNavigate("new-patient")}>新建患者</Btn>
          </div>
        </PanelTitle>

        <div className="flex items-center gap-2.5 flex-wrap mb-4">
          <input className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none max-w-[260px] text-sm focus:border-brand focus:shadow-[0_0_0_4px_hsl(197_92%_60%/0.12)]" placeholder="搜索姓名 / 手机号 / 用户ID" defaultValue="李" />
          <select className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none max-w-[180px] text-sm">
            <option>全部状态</option><option>本机构已关联</option><option>待建立关系</option>
          </select>
          <select className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none max-w-[180px] text-sm">
            <option>全部设备状态</option><option>已连接设备</option><option>未关联设备</option>
          </select>
          <Btn onClick={() => toast("演示搜索：若手机号重复，将优先提示复用云端患者档案。")}>查询</Btn>
        </div>

        <TableWrap>
          <table className="w-full border-collapse min-w-[980px]">
            <thead>
              <tr>
                {["姓名","用户ID","手机号","性别/年龄","当前服务机构","设备状态","关系状态","操作"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">李某</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">SZ202604120001</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">138****1234</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">男 / 58</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">深圳爱眼低视力中心</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag>已关联控制盒</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag>本机构服务中</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">
                  <div className="flex gap-2">
                    <Btn onClick={() => onNavigate("patient-detail")}>详情</Btn>
                    <Btn variant="ghost" onClick={() => onNavigate("tuning")}>调参</Btn>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">王某</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">HZ202603030014</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">137****9981</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">女 / 49</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">杭州康复门诊</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag variant="gray">未显示</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag variant="warn">待建立关系</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">
                  <div className="flex gap-2">
                    <Btn onClick={() => toast("未建立本机构服务关系前，仅展示脱敏字段。")}>查看脱敏信息</Btn>
                    <Btn variant="primary" onClick={() => toast("演示：建立本机构服务关系后，才可读取完整必要信息。")}>建立关系</Btn>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">张某</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">SZ202603180021</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">135****6620</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">男 / 63</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">深圳爱眼低视力中心</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag variant="warn">版本风险</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag>本机构服务中</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">
                  <div className="flex gap-2">
                    <Btn onClick={() => onNavigate("patient-detail")}>详情</Btn>
                    <Btn variant="ghost" onClick={() => onNavigate("device-link")}>连接设备</Btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
