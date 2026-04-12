import { Card, Tag, PanelTitle, MetricContent, TimelineItem, Btn, TableWrap } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

export default function DashboardPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2">
        <Card dark><MetricContent label="本机构患者总数" value={286} desc="已建档并留存记录的患者总量" /></Card>
        <Card><MetricContent label="今日待调参" value={8} desc="已预约且需现场连接设备处理" /></Card>
        <Card><MetricContent label="云端待确认患者" value={3} desc="存在跨机构历史，需确认是否建立本机构服务关系" /></Card>
        <Card><MetricContent label="版本风险提醒" value={2} desc="设备固件与参数模板存在兼容拦截" /></Card>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 max-xl:grid-cols-1">
        <Card>
          <PanelTitle title="快捷入口"><Btn variant="ghost" onClick={() => onNavigate("new-patient")}>新建患者</Btn></PanelTitle>
          <div className="grid grid-cols-2 gap-3">
            <Btn onClick={() => onNavigate("patients")}>查看患者列表</Btn>
            <Btn onClick={() => onNavigate("device-link")}>开始连接设备</Btn>
            <Btn onClick={() => onNavigate("tuning")}>进入调参工作区</Btn>
            <Btn onClick={() => onNavigate("records")}>查看调参记录</Btn>
          </div>
        </Card>
        <Card>
          <PanelTitle title="待处理提醒"><Tag variant="warn">3 项</Tag></PanelTitle>
          <div className="flex flex-col gap-3">
            <TimelineItem title="发现患者手机号重复" desc="建议先从云端拉取已有患者档案后再确认建立本机构服务关系" />
            <TimelineItem title="控制盒 RX-A102 固件版本偏低" desc="当前参数模板 PT-2026-04 不兼容，禁止继续保存新调参数据" />
            <TimelineItem title="患者李某待确认机构切换" desc="需患者确认后，当前服务机构才会切换为本机构" />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <PanelTitle title="最近调参记录"><Btn onClick={() => onNavigate("records")}>查看全部</Btn></PanelTitle>
        <TableWrap>
          <table className="w-full border-collapse min-w-[980px]">
            <thead>
              <tr>
                {["时间","患者","用户ID","设备SN","调参医生","兼容性","结果","操作"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">2026-04-12 10:12</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">李某</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">SZ202604120001</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">RX-A102 / 9A24</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">陈医生</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag>匹配</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag>已保存</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Btn onClick={() => onNavigate("patient-detail")}>查看患者</Btn></td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">2026-04-12 09:43</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">张某</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">SZ202603180021</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">RX-A087 / 71F2</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">陈医生</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag variant="warn">需升级</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag variant="danger">被拦截</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Btn onClick={() => onNavigate("tuning")}>查看调参页</Btn></td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
