import { Card, Tag, PanelTitle, TimelineItem } from "@/components/ui-parts";

export default function InstitutionPage() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <Card>
          <PanelTitle title="机构变更记录"><Tag variant="info">可追溯</Tag></PanelTitle>
          <div className="flex flex-col gap-3">
            <TimelineItem title="2026-04-08 15:20" desc={'用户李某确认切换当前服务机构为"深圳爱眼低视力中心"，原机构记录保留。'} />
            <TimelineItem title="2026-03-10 09:12" desc="用户王某仍在杭州康复门诊服务中，本机构仅可查看脱敏字段。" />
          </div>
        </Card>
        <Card>
          <PanelTitle title="切换规则"><Tag variant="warn">统一口径</Tag></PanelTitle>
          <div className="flex flex-col gap-3">
            <TimelineItem title="当前服务机构来源" desc="按用户最后一次确认让机构医生切换绑定机构的结果计算。" />
            <TimelineItem title="未确认前" desc="不得直接覆盖当前服务机构，仅显示待确认状态。" />
            <TimelineItem title="切换后" desc="新机构成为当前服务机构，历史机构保留在追溯记录中。" />
          </div>
        </Card>
      </div>
    </div>
  );
}
