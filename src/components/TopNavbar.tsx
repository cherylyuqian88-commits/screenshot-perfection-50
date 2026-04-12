import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  label: string;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "工作台",
    items: [
      { key: "patients", label: "用户列表" },
    ],
  },
  {
    title: "设备与调参",
    items: [
      { key: "tuning", label: "调参工作区" },
      { key: "records", label: "调参记录" },
    ],
  },
  {
    title: "追溯与设置",
    items: [
      { key: "institution", label: "机构变更记录" },
      { key: "account", label: "我的账号" },
    ],
  },
];

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function TopNavbar({ activePage, onNavigate, onLogout }: Props) {
  return (
    <header className="h-14 bg-card/90 backdrop-blur-md border-b border-line flex items-center px-5 sticky top-0 z-20">
      {/* Brand */}
      <div className="flex items-center gap-2.5 mr-8 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-secondary grid place-items-center font-extrabold text-primary-foreground text-xs tracking-wide">
          RX
        </div>
        <span className="text-sm font-bold whitespace-nowrap">睿芯仿生眼</span>
      </div>

      {/* Nav items */}
      <nav className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
        {navGroups.map((group, gi) => (
          <div key={group.title} className="flex items-center gap-1">
            {gi > 0 && (
              <div className="w-px h-5 bg-line mx-1.5 shrink-0" />
            )}
            {group.items.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm border-0 cursor-pointer transition-all whitespace-nowrap",
                  activePage === item.key
                    ? "bg-gradient-to-r from-brand/20 to-brand-secondary/20 text-foreground font-semibold shadow-[inset_0_0_0_1px_hsl(197_92%_60%/0.25)]"
                    : "bg-transparent text-soft hover:bg-secondary hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Right side info */}
      <div className="flex items-center gap-2.5 ml-4 shrink-0">
        <div className="px-2.5 py-1.5 rounded-full bg-card border border-line text-xs text-soft shadow-sm hidden lg:block">
          当前机构：深圳爱眼低视力中心
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 bg-card border border-line rounded-full shadow-sm">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand to-[hsl(224,76%,41%)] text-primary-foreground grid place-items-center font-bold text-xs">
            陈
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-bold leading-tight">陈医生</div>
            <div className="text-[10px] text-soft">医生/管理员</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-2.5 py-1.5 rounded-lg text-xs text-soft border border-line bg-card hover:bg-secondary cursor-pointer transition-all"
        >
          退出
        </button>
      </div>
    </header>
  );
}
