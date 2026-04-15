import { useState } from "react";
import { toast } from "sonner";
import LoginPage from "./LoginPage";
import TopNavbar from "@/components/TopNavbar";
import AdminTopNavbar from "@/components/AdminTopNavbar";
import PatientsPage from "./PatientsPage";
import NewPatientPage from "./NewPatientPage";
import TuningPage from "./TuningPage";
import RecordsPage from "./RecordsPage";
import AccountPage from "./AccountPage";
import PatientRecordsPage from "./PatientRecordsPage";
import SelectUserPage from "./SelectUserPage";
import OrgChangeRecordsPage from "./OrgChangeRecordsPage";
import DeviceChangeRecordsPage from "./DeviceChangeRecordsPage";
import AdminDoctorsPage from "./AdminDoctorsPage";
import AdminUsersPage from "./AdminUsersPage";
import AdminRecordsPage from "./AdminRecordsPage";
import AdminAccountPage from "./AdminAccountPage";

const doctorPageMeta: Record<string, { title: string; desc: string }> = {
  patients: { title: "用户列表", desc: "搜索本机构用户或云端用户，查看关系状态并进入详情或调参流程" },
  "new-patient": { title: "新建用户", desc: "医生录入用户基础信息，执行云端查重后建档" },
  tuning: { title: "调参工作区", desc: "连接设备并进行参数调节，右侧展示关联用户信息与设备状态" },
  records: { title: "调参记录", desc: "查看历史调参记录、兼容拦截原因与追溯详情" },
  account: { title: "我的账号", desc: "查看当前登录医生账号信息与密码修改入口" },
  "patient-records": { title: "用户调参记录", desc: "查看该用户的历史调参记录" },
  "select-user": { title: "选择关联用户", desc: "从用户列表中选择或取消关联用户" },
  "org-change-records": { title: "关联机构变更记录", desc: "查看该用户的关联机构变更历史" },
  "device-change-records": { title: "关联设备变更记录", desc: "查看该用户的关联设备变更历史" },
};

const adminPageMeta: Record<string, { title: string; desc: string }> = {
  "admin-doctors": { title: "医生账号管理", desc: "新增、编辑、删除医生账号，重置密码与启停用管理" },
  "admin-users": { title: "用户数据查看", desc: "查看全机构用户列表、活跃度、关联设备与调参情况" },
  "admin-records": { title: "调参记录查看", desc: "查看全机构调参记录，支持按时间、医生、用户筛选" },
  "admin-account": { title: "我的账号", desc: "查看管理员账号信息与密码修改入口" },
};

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"doctor" | "admin">("doctor");
  const [activePage, setActivePage] = useState("patients");
  const [navFrom, setNavFrom] = useState<"patient-detail" | "tuning" | undefined>(undefined);
  const [tuningUser, setTuningUser] = useState<{ name: string; gender: string; note?: string } | null>(null);

  const navigateTo = (page: string, from?: string) => {
    setNavFrom(from as "patient-detail" | "tuning" | undefined);
    setActivePage(page);
  };

  if (!loggedIn) {
    return (
      <LoginPage
        onLogin={(role) => {
          setUserRole(role);
          setActivePage(role === "admin" ? "admin-doctors" : "patients");
          setLoggedIn(true);
        }}
      />
    );
  }

  const handleLogout = () => {
    setLoggedIn(false);
    setActivePage("patients");
    toast("已退出登录，返回登录页。");
  };

  if (userRole === "admin") {
    const meta = adminPageMeta[activePage] || adminPageMeta["admin-doctors"];

    const renderAdminPage = () => {
      const nav = setActivePage;
      switch (activePage) {
        case "admin-doctors": return <AdminDoctorsPage onNavigate={nav} />;
        case "admin-users": return <AdminUsersPage onNavigate={nav} />;
        case "admin-records": return <AdminRecordsPage onNavigate={nav} />;
        case "admin-account": return <AdminAccountPage onLogout={handleLogout} />;
        default: return <AdminDoctorsPage onNavigate={nav} />;
      }
    };

    return (
      <div className="h-screen flex flex-col">
        <AdminTopNavbar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
        <div className="bg-secondary/40 border-b border-line px-6 py-3">
          <h1 className="text-lg font-bold m-0 leading-tight">{meta.title}</h1>
          <p className="mt-0.5 text-xs text-soft">{meta.desc}</p>
        </div>
        <main className="flex-1 overflow-auto p-5">
          {renderAdminPage()}
        </main>
      </div>
    );
  }

  // Doctor flow
  const meta = doctorPageMeta[activePage] || doctorPageMeta.patients;

  const renderPage = () => {
    switch (activePage) {
      case "patients": return <PatientsPage onNavigate={(p: string, from?: string) => {
        if (p === "patient-records") navigateTo(p, from || "patient-detail");
        else navigateTo(p, from);
      }} onTuningPair={(user) => { setTuningUser(user); setActivePage("tuning"); }} />;
      case "new-patient": return <NewPatientPage onNavigate={setActivePage} />;
      case "tuning": return <TuningPage tuningUser={tuningUser} onSetTuningUser={setTuningUser} onNavigate={(p: string) => {
        if (p === "patient-records") navigateTo(p, "tuning");
        else setActivePage(p);
      }} />;
      case "records": return <RecordsPage onNavigate={setActivePage} />;
      case "account": return <AccountPage onLogout={handleLogout} />;
      case "patient-records": return <PatientRecordsPage onNavigate={setActivePage} from={navFrom || "tuning"} />;
      case "select-user": return <SelectUserPage onNavigate={setActivePage} />;
      case "org-change-records": return <OrgChangeRecordsPage onNavigate={setActivePage} />;
      case "device-change-records": return <DeviceChangeRecordsPage onNavigate={setActivePage} />;
      default: return <PatientsPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <TopNavbar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
      <div className="bg-secondary/40 border-b border-line px-6 py-3">
        <h1 className="text-lg font-bold m-0 leading-tight">{meta.title}</h1>
        <p className="mt-0.5 text-xs text-soft">{meta.desc}</p>
      </div>
      <main className="flex-1 overflow-auto p-5">
        {renderPage()}
      </main>
    </div>
  );
}