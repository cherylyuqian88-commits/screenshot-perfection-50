import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  label: string;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "管理",
    items: [
      { key: "admin-doctors", label: "医生账号管理" },
    ],
  },
  {
    title: "数据查看",
    items: [
      { key: "admin-users", label: "用户数据" },
      { key: "admin-records", label: "调参记录" },
    ],
  },
  {
    title: "设置",
    items: [
      { key: "admin-account", label: "我的账号" },
    ],
  },
];

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function AdminTopNavbar({ activePage, onNavigate, onLogout }: Props) {
  return (
    <header className="h-14 bg-card/90 backdrop-blur-md border-b border-line flex items-center px-5 sticky top-0 z-20">
      <div className="flex items-center gap-2.5 mr-8 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(28,80%,50%)] to-[hsl(0,63%,42%)] grid place-items-center font-extrabold text-primary-foreground text-xs tracking-wide">
          AD
        </div>
        <span className="text-sm font-bold whitespace-nowrap">睿芯仿生眼 · 管理端</span>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
        {navGroups.map((group, gi) => (
          <div key={group.title} className="flex items-center gap-1">
            {gi > 0 && <div className="w-px h-5 bg-line mx-1.5 shrink-0" />}
            {group.items.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm border-0 cursor-pointer transition-all whitespace-nowrap",
                  activePage === item.key
                    ? "bg-gradient-to-r from-[hsl(28,80%,50%)]/20 to-[hsl(0,63%,42%)]/20 text-foreground font-semibold shadow-[inset_0_0_0_1px_hsl(28_80%_50%/0.25)]"
                    : "bg-transparent text-soft hover:bg-secondary hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 ml-4 shrink-0">
        <div className="px-2.5 py-1.5 rounded-full bg-card border border-line text-xs text-soft shadow-sm hidden lg:block">
          当前机构：深圳爱眼低视力中心
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 bg-card border border-line rounded-full shadow-sm">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(28,80%,50%)] to-[hsl(0,63%,42%)] text-primary-foreground grid place-items-center font-bold text-xs">
            管
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-bold leading-tight">系统管理员</div>
            <div className="text-[10px] text-soft">管理员</div>
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
