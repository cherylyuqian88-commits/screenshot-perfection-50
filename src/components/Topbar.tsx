import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  title: string;
  desc: string;
}

const messages = [
  { user: "李某", time: "2026-04-12 09:30", org: "杭州康复门诊", doctor: "张医生" },
  { user: "王某", time: "2026-04-10 14:15", org: "北京视觉康复中心", doctor: "刘医生" },
];

export default function Topbar({ title, desc }: Props) {
  const [msgOpen, setMsgOpen] = useState(false);

  return (
    <>
      <div className="h-[76px] bg-card/[0.78] backdrop-blur-sm border-b border-line flex items-center justify-between px-6 sticky top-0 z-10">
        <div>
          <h1 className="text-[22px] font-bold m-0 leading-tight">{title}</h1>
          <p className="mt-1 text-[13px] text-soft">{desc}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2.5 rounded-full bg-card border border-line text-[13px] text-soft shadow-sm">
            当前机构：深圳爱眼低视力中心
          </div>
          <button
            onClick={() => setMsgOpen(true)}
            className="relative w-[38px] h-[38px] rounded-full bg-card border border-line grid place-items-center shadow-sm hover:bg-accent transition-colors"
            title="查看消息"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="absolute top-1 right-1.5 w-[8px] h-[8px] rounded-full bg-[hsl(0,72%,51%)]" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-card border border-line text-[13px] text-soft shadow-sm">
            <span>医生账号：dr_chen_001</span>
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

      <Dialog open={msgOpen} onOpenChange={setMsgOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>最近消息</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            {messages.map((m, i) => (
              <div key={i} className="bg-secondary/60 rounded-xl px-4 py-3 text-sm">
                <span className="text-foreground">{m.time}</span>
                <span className="text-muted-foreground">，用户 </span>
                <span className="font-medium text-foreground">{m.user}</span>
                <span className="text-muted-foreground"> 被 </span>
                <span className="font-medium text-foreground">{m.org}</span>
                <span className="text-muted-foreground"> 的 </span>
                <span className="font-medium text-foreground">{m.doctor}</span>
                <span className="text-muted-foreground"> 关联调走了</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
