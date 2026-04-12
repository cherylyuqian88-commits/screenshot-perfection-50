import { useState } from "react";
import { toast } from "sonner";
import LoginPage from "./LoginPage";
import AppSidebar from "@/components/AppSidebar";
import Topbar from "@/components/Topbar";
import DashboardPage from "./DashboardPage";
import PatientsPage from "./PatientsPage";
import NewPatientPage from "./NewPatientPage";
import PatientDetailPage from "./PatientDetailPage";
import DeviceLinkPage from "./DeviceLinkPage";
import TuningPage from "./TuningPage";
import RecordsPage from "./RecordsPage";
import InstitutionPage from "./InstitutionPage";
import AccountPage from "./AccountPage";

const pageMeta: Record<string, { title: string; desc: string }> = {
  dashboard: { title: "首页看板", desc: "查看本机构患者、设备连接状态、待处理事项与最近调参记录" },
  patients: { title: "患者列表", desc: "搜索本机构患者或云端患者，查看关系状态并进入详情或调参流程" },
  "new-patient": { title: "新建患者", desc: "医生录入患者基础信息，执行云端查重后生成用户ID并建档" },
  "patient-detail": { title: "患者详情", desc: "查看患者档案、当前服务机构、设备关系、历史记录和操作规则" },
  "device-link": { title: "设备连接", desc: "通过有线方式连接控制盒，检查当前设备状态与版本兼容情况" },
  tuning: { title: "调参工作区", desc: "全屏主工作区用于后续放置实时画面、参数控件和保存逻辑；右侧固定展示关联患者信息" },
  records: { title: "调参记录", desc: "查看历史调参记录、同步结果、兼容拦截原因与追溯详情" },
  institution: { title: "机构变更记录", desc: "查看患者服务机构切换记录，并明确当前服务机构的计算口径" },
  account: { title: "我的账号", desc: "查看当前登录医生账号信息、权限边界与密码修改入口" },
};

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  const handleLogout = () => {
    setLoggedIn(false);
    setActivePage("dashboard");
    toast("已退出登录，返回登录页。");
  };

  const meta = pageMeta[activePage] || pageMeta.dashboard;

  const renderPage = () => {
    const nav = setActivePage;
    switch (activePage) {
      case "dashboard": return <DashboardPage onNavigate={nav} />;
      case "patients": return <PatientsPage onNavigate={nav} />;
      case "new-patient": return <NewPatientPage onNavigate={nav} />;
      case "patient-detail": return <PatientDetailPage onNavigate={nav} />;
      case "device-link": return <DeviceLinkPage onNavigate={nav} />;
      case "tuning": return <TuningPage onNavigate={nav} />;
      case "records": return <RecordsPage onNavigate={nav} />;
      case "institution": return <InstitutionPage />;
      case "account": return <AccountPage onLogout={handleLogout} />;
      default: return <DashboardPage onNavigate={nav} />;
    }
  };

  return (
    <div className="h-screen grid grid-cols-[260px_1fr] max-lg:grid-cols-[88px_1fr]">
      <AppSidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex flex-col min-w-0">
        <Topbar title={meta.title} desc={meta.desc} />
        <div className="flex-1 overflow-auto p-[22px]">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
