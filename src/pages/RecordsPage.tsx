import { toast } from "sonner";
import { Card, Tag, PanelTitle, Btn, TableWrap } from "@/components/ui-parts";

interface Props { onNavigate: (page: string) => void; }

export default function RecordsPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in">
      <Card>
        <PanelTitle title="调参记录">
          <div className="flex gap-2">
            <Btn onClick={() => toast("云端保留用户调参、关联、机构变更记录，用于追溯。")}>查看追溯规则</Btn>
            <Btn variant="primary" onClick={() => onNavigate("tuning")}>新建调参</Btn>
          </div>
        </PanelTitle>

        <div className="flex items-center gap-2.5 flex-wrap mb-4">
          <input className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none max-w-[220px] text-sm" placeholder="用户姓名 / 用户ID" />
          <input className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none max-w-[180px] text-sm" defaultValue="2026-04-01" />
          <input className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none max-w-[180px] text-sm" defaultValue="2026-04-12" />
          <select className="border border-line rounded-[14px] bg-card px-3.5 py-3 text-foreground outline-none max-w-[180px] text-sm">
            <option>全部结果</option><option>已保存</option><option>被拦截</option>
          </select>
          <Btn>筛选</Btn>
        </div>

        <TableWrap>
          <table className="w-full border-collapse min-w-[980px]">
            <thead>
              <tr>
                {["设备SN","用户","用户ID","参数模板","医生","云端同步","结果","时间"].map(h => (
                  <th key={h} className="px-4 py-3.5 border-b border-line bg-secondary text-soft text-left text-[13px] sticky top-0 z-[1]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">9A24</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">李某</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">SZ202604120001</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">PT-2026-04</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">陈医生</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag>成功</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag>已保存</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">2026-04-12 10:12</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">71F2</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">张某</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">SZ202603180021</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">PT-2026-04</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">陈医生</td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag variant="gray">未同步</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]"><Tag variant="danger">兼容拦截</Tag></td>
                <td className="px-4 py-3.5 border-b border-line text-[13px]">2026-04-12 09:43</td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
