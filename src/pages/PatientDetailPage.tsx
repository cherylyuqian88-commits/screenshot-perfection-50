import { toast } from "sonner";
import { Card, Tag, PanelTitle, KV, TimelineItem, Btn, TableWrap } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

export default function PatientDetailPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 max-xl:grid-cols-1">
        <Card>
          <PanelTitle title="患者详情">
            <div className="flex gap-2">
              <Btn onClick={() => onNavigate("records")}>查看调参记录</Btn>
              <Btn variant="primary" onClick={() => onNavigate("tuning")}>进入调参</Btn>
            </div>
          </PanelTitle>
          <KV label="姓名" value="李某" />
          <KV label="用户ID" value="SZ202604120001" />
          <KV label="手机号" value="138****1234" />
          <KV label="身份证后4位" value="4821" />
          <KV label="性别 / 年龄" value="男 / 58" />
          <KV label="当前服务机构" value="深圳爱眼低视力中心" />
          <KV label="当前绑定设备" value="控制盒 RX-A102 / SN 9A24" />
          <KV label="账号状态" value={<Tag>可登录</Tag>} />
          <div className="flex gap-2.5 flex-wrap mt-3">
            <Btn onClick={() => toast("演示：手机号变更仅允许医生 PC 端处理。")}>变更手机号</Btn>
            <Btn onClick={() => toast("演示：注销后仅删除患者信息，不删除用户ID和日志追溯记录。")}>注销账号规则</Btn>
            <Btn variant="danger" onClick={() => toast("演示：解绑仅解除展示关系，不自动清除控制盒内医生调试参数。")}>解除设备关联</Btn>
          </div>
        </Card>

        <Card>
          <PanelTitle title="最近事件"><Tag variant="info">患者侧仅看摘要</Tag></PanelTitle>
          <div className="flex flex-col gap-3">
            <TimelineItem title="最近一次调参完成" desc="2026-04-12 10:12 · 陈医生 · 参数模板 PT-2026-04" />
            <TimelineItem title="控制盒曾提示温度异常" desc="患者侧仅显示"已恢复"，原始工程日志不上患者端屏幕。" />
            <TimelineItem title="当前服务机构来源" desc="按患者最后一次确认切换绑定机构结果计算，不按临时连接动态切换。" />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <PanelTitle title="历史记录"><Btn onClick={() => onNavigate("institution")}>查看机构变更</Btn></PanelTitle>
        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["记录类型","时间","内容","执行人","结果"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { type: "建档", time: "2026-04-01 09:20", content: "生成用户ID并建立本机构服务关系", who: "陈医生" },
                { type: "设备关联", time: "2026-04-01 09:35", content: "关联控制盒 RX-A102 / 9A24", who: "陈医生" },
                { type: "调参", time: "2026-04-12 10:12", content: "完成一次参数保存与云端同步", who: "陈医生" },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.type}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.time}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.content}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]">{r.who}</td>
                  <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag>成功</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
