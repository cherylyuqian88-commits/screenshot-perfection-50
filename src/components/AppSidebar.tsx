import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  label: string;
  num: string;
}

const menuGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "工作台",
    items: [
      { key: "dashboard", label: "首页看板", num: "01" },
      { key: "patients", label: "患者列表", num: "02" },
      { key: "new-patient", label: "新建患者", num: "03" },
      { key: "patient-detail", label: "患者详情", num: "04" },
    ],
  },
  {
    title: "设备与调参",
    items: [
      { key: "device-link", label: "设备连接", num: "05" },
      { key: "tuning", label: "调参工作区", num: "06" },
      { key: "records", label: "调参记录", num: "07" },
    ],
  },
  {
    title: "追溯与设置",
    items: [
      { key: "institution", label: "机构变更记录", num: "08" },
      { key: "account", label: "我的账号", num: "09" },
    ],
  },
];

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function AppSidebar({ activePage, onNavigate }: Props) {
  return (
    <aside className="bg-gradient-to-b from-sidebar to-[hsl(220,20%,9%)] text-sidebar-foreground border-r border-sidebar-border flex flex-col p-[18px] gap-4 min-h-screen">
      {/* Brand */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04]">
        <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-brand to-brand-secondary grid place-items-center font-extrabold text-primary-foreground text-sm tracking-wide">
          RX
        </div>
        <div>
          <div className="text-base font-bold">睿芯仿生眼</div>
          <div className="text-xs text-sidebar-muted mt-0.5">医生端</div>
        </div>
      </div>

      {/* Menu groups */}
      {menuGroups.map((group) => (
        <div key={group.title}>
          <div className="mx-2.5 mb-1 mt-2 text-[11px] uppercase tracking-[0.16em] text-sidebar-muted">
            {group.title}
          </div>
          {group.items.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={cn(
                "w-full border-0 bg-transparent text-sidebar-foreground/80 flex items-center justify-between px-3.5 py-3 rounded-[14px] cursor-pointer transition-all duration-200 text-left text-sm",
                activePage === item.key
                  ? "bg-gradient-to-r from-brand/[0.18] to-brand-secondary/[0.18] text-primary-foreground shadow-[inset_0_0_0_1px_hsl(197_92%_60%/0.25)]"
                  : "hover:bg-white/[0.06]"
              )}
            >
              <span>{item.label}</span>
              <small className="opacity-70 text-[11px]">{item.num}</small>
            </button>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div className="mt-auto bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3.5 text-xs text-sidebar-foreground/70 leading-relaxed">
        当前原型仅展示医生端主流程。
        <br />
        机构管理员账号管理未展开做完整页，但已在逻辑中预留入口。
      </div>
    </aside>
  );
}
