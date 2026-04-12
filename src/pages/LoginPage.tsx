import { useState } from "react";
import { toast } from "sonner";

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [user, setUser] = useState("dr_chen_001");
  const [pwd, setPwd] = useState("12345678");

  return (
    <div className="min-h-screen grid grid-cols-[1.15fr_0.85fr] bg-gradient-to-br from-[hsl(214,100%,92%)] via-[hsl(217,100%,96%)] to-background">
      {/* Left side */}
      <div className="px-14 py-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,hsl(197_92%_60%/0.18),transparent_60%)] -right-[100px] -top-[80px]" />
        
        <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(213,94%,87%)] bg-card/65 px-3 py-2 text-[13px] text-[hsl(224,76%,48%)] w-fit">
          PC客户端原型 · 机构医生使用
        </div>

        <h1 className="text-[42px] leading-[1.18] mt-[18px] mb-3 font-extrabold max-w-[720px]">
          仿生眼适配软件
        </h1>

        <p className="text-base leading-[1.9] max-w-[720px] text-soft">
          用于医疗机构医生进行患者建档、云端查重、用户-设备关联、设备连接调参与记录追溯。当前原型重点补齐完整页面跳转结构，并把调参界面做成全屏主工作区。
        </p>

        <div className="grid grid-cols-3 gap-3 mt-7 max-w-[780px]">
          {[
            { title: "患者建档", desc: "支持录入基础信息、云端查重、手机号验证码确认与本机构关联。" },
            { title: "设备调参", desc: "调参界面占据全屏主区域，右上角 / 右侧边栏固定展示关联患者信息与历史记录。" },
            { title: "记录追溯", desc: "保留调参记录、机构变更记录和操作日志，便于后续审查与追溯。" },
          ].map((f) => (
            <div key={f.title} className="rounded-lg bg-card/70 backdrop-blur-sm border border-white/90 p-4 shadow-[0_18px_40px_hsl(222_47%_11%/0.06)]">
              <strong className="text-sm">{f.title}</strong>
              <div className="text-soft text-xs mt-2 leading-[1.8]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="grid place-items-center p-8">
        <div className="w-full max-w-[460px] bg-card/80 backdrop-blur-lg border border-white/95 rounded-[28px] shadow-[0_28px_60px_hsl(222_47%_11%/0.14)] p-7">
          <h2 className="text-[28px] font-bold mb-1.5">医生登录</h2>
          <p className="text-soft mb-5">Windows 医疗机构工作站使用</p>

          <div className="flex flex-col gap-2 mb-3.5">
            <label className="text-[13px] text-soft font-semibold">机构账号</label>
            <input
              className="w-full border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none transition-all focus:border-brand focus:shadow-[0_0_0_4px_hsl(197_92%_60%/0.12)]"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <label className="text-[13px] text-soft font-semibold">密码</label>
            <input
              type="password"
              className="w-full border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none transition-all focus:border-brand focus:shadow-[0_0_0_4px_hsl(197_92%_60%/0.12)]"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center mt-3">
            <label className="text-xs text-soft flex items-center gap-1.5">
              <input type="checkbox" defaultChecked /> 记住账号
            </label>
            <span className="text-xs text-soft">初始密码登录后需修改</span>
          </div>

          <button
            onClick={onLogin}
            className="w-full mt-5 h-12 rounded-[14px] bg-gradient-to-r from-[hsl(199,89%,49%)] to-[hsl(224,76%,48%)] text-primary-foreground font-bold cursor-pointer border-0 shadow-[0_12px_28px_hsl(224_76%_48%/0.24)] hover:-translate-y-px transition-all"
          >
            登录进入医生端
          </button>

          <div className="flex gap-2.5 mt-3">
            <button
              onClick={() => toast("演示说明：机构管理员创建医生账号后，医生使用账号密码登录。")}
              className="flex-1 rounded-[14px] bg-card border border-line px-4 py-2.5 text-sm font-bold cursor-pointer hover:-translate-y-px transition-all"
            >
              查看说明
            </button>
            <button
              onClick={() => toast("演示说明：密码错误累计 5 次将触发禁用逻辑。")}
              className="flex-1 rounded-[14px] bg-card border border-line px-4 py-2.5 text-sm font-bold cursor-pointer hover:-translate-y-px transition-all"
            >
              登录异常处理
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
