import { useState } from "react";
import { toast } from "sonner";
import { Card, PanelTitle, KV, Btn } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

export default function PatientEditPage({ onNavigate }: Props) {
  const [form, setForm] = useState({
    name: "李某",
    phone: "138****1234",
    gender: "男",
    age: "58",
    idLast4: "4821",
    org: "深圳爱眼低视力中心",
    device: "SN-20260301-0042",
  });

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="animate-fade-in max-w-2xl">
      <Card>
        <PanelTitle title="编辑用户信息">
          <div className="flex gap-2">
            <Btn onClick={() => onNavigate("patients")}>返回</Btn>
            <Btn variant="primary" onClick={() => { toast("演示：用户信息已保存"); onNavigate("patients"); }}>保存</Btn>
          </div>
        </PanelTitle>

        <div className="flex flex-col gap-3">
          {[
            { label: "姓名", key: "name" },
            { label: "手机号", key: "phone" },
            { label: "性别", key: "gender" },
            { label: "年龄", key: "age" },
            { label: "身份证后4位", key: "idLast4" },
            { label: "关联机构", key: "org" },
            { label: "关联设备", key: "device" },
          ].map((field) => (
            <div key={field.key} className="grid grid-cols-[120px_1fr] gap-2 py-2.5 border-b border-dashed border-line last:border-b-0 text-sm items-center">
              <div className="text-soft">{field.label}</div>
              <input
                className="border border-line rounded-lg bg-card px-3 py-2 text-foreground outline-none text-sm focus:border-brand focus:shadow-[0_0_0_4px_hsl(197_92%_60%/0.12)]"
                value={form[field.key as keyof typeof form]}
                onChange={(e) => update(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
