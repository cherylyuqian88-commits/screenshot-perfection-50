interface Props {
  title: string;
  desc: string;
}

export default function Topbar({ title, desc }: Props) {
  return (
    <div className="h-[76px] bg-card/[0.78] backdrop-blur-sm border-b border-line flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h1 className="text-[22px] font-bold m-0 leading-tight">{title}</h1>
        <p className="mt-1 text-[13px] text-soft">{desc}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="px-3 py-2.5 rounded-full bg-card border border-line text-[13px] text-soft shadow-sm">
          当前机构：深圳爱眼低视力中心
        </div>
        <div className="px-3 py-2.5 rounded-full bg-card border border-line text-[13px] text-soft shadow-sm">
          医生账号：dr_chen_001
        </div>
        <div className="flex items-center gap-2.5 px-2.5 py-2 bg-card border border-line rounded-full shadow-sm">
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-brand to-[hsl(224,76%,41%)] text-primary-foreground grid place-items-center font-bold text-[13px]">
            陈
          </div>
          <div>
            <div className="text-[13px] font-bold">陈医生</div>
            <div className="text-xs text-soft">医生/管理员</div>
          </div>
        </div>
      </div>
    </div>
  );
}
