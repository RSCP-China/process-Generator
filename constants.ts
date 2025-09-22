import { type ChartData, type IconName } from './types';
import React from 'react';

// FIX: Replaced JSX with React.createElement to be compatible with .ts files.
// This resolves all syntax errors related to JSX elements in a non-TSX file.
// Also explicitly typed ICONS with Record<IconName, ...> to help with type inference.
export const ICONS: Record<IconName, (props: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
    TASK: (props: React.SVGProps<SVGSVGElement>) =>
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
            React.createElement('path', { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
            React.createElement('polyline', { points: "14 2 14 8 20 8" }),
            React.createElement('line', { x1: "16", y1: "13", x2: "8", y2: "13" }),
            React.createElement('line', { x1: "16", y1: "17", x2: "8", y2: "17" }),
            React.createElement('polyline', { points: "10 9 9 9 8 9" })
        ),
    COMMUNICATION: (props: React.SVGProps<SVGSVGElement>) =>
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
            React.createElement('path', { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
        ),
    DECISION: (props: React.SVGProps<SVGSVGElement>) =>
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
            React.createElement('path', { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" }),
            React.createElement('path', { d: "m9 12 2 2 4-4" })
        ),
    APPROVAL: (props: React.SVGProps<SVGSVGElement>) =>
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
            React.createElement('path', { d: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" })
        ),
    DATA: (props: React.SVGProps<SVGSVGElement>) =>
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
            React.createElement('ellipse', { cx: "12", cy: "5", rx: "9", ry: "3" }),
            React.createElement('path', { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }),
            React.createElement('path', { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" })
        ),
};


export const INITIAL_CHART_DATA: ChartData = {
  title: '示例：新客户引导流程',
  roles: [
    { title: '销售团队', description: '管理客户关系并发起引导流程。' },
    { title: '项目经理', description: '协调项目和资源。' },
    { title: '技术团队', description: '负责技术设置和实施。' },
    { title: '客户', description: '正在被引导的新客户。' },
  ],
  steps: [
    { title: '1. 项目启动', description: '旨在统一目标的初步会议。' },
    { title: '2. 数据收集', description: '收集必要信息。' },
    { title: '3. 系统设置', description: '技术配置。' },
    { title: '4. 正式上线', description: '启动服务。' },
  ],
  tasks: [
    // Row 1: 销售团队
    [
      { description: '发起联系并安排项目启动会议。', icon: 'COMMUNICATION' },
      { description: '将客户详情移交给项目经理。', icon: 'DATA' },
      null,
      { description: '与客户确认成功上线。', icon: 'APPROVAL' },
    ],
    // Row 2: 项目经理
    [
      { description: '主持启动会议并定义项目范围。', icon: 'TASK' },
      { description: '协调从客户处收集数据。', icon: 'COMMUNICATION' },
      { description: '监督技术设置和测试。', icon: 'DECISION' },
      { description: '管理正式上线公告。', icon: 'TASK' },
    ],
    // Row 3: 技术团队
    [
      null,
      { description: '审查客户数据中的技术要求。', icon: 'DATA' },
      { description: '执行系统配置和集成。', icon: 'TASK' },
      { description: '在上线期间提供技术支持。', icon: 'COMMUNICATION' },
    ],
    // Row 4: 客户
    [
      { description: '参加启动会议并提供项目目标。', icon: 'COMMUNICATION' },
      { description: '提供所有必要的数据和文件。', icon: 'DATA' },
      { description: '参与用户验收测试 (UAT)。', icon: 'APPROVAL' },
      { description: '确认系统已上线并可操作。', icon: 'DECISION' },
    ],
  ],
};