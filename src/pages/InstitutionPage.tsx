import { Card, Tag, PanelTitle, TimelineItem } from "@/components/ui-parts";

export default function InstitutionPage() {
  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="机构变更记录"><Tag variant="info">可追溯</Tag></PanelTitle>
        <div className="flex flex-col gap-3">
          <TimelineItem title="2026-04-08 15:20" desc={'用户李某确认切换当前服务机构为"深圳爱眼低视力中心"，原机构记录保留。'} />
          <TimelineItem title="2026-03-10 09:12" desc="用户王某仍在杭州康复门诊服务中，本机构仅可查看脱敏字段。" />
        </div>
      </Card>
    </div>
  );
}
