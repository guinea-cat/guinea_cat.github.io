
import { Project, Skill } from './types';

export const USER_INFO = {
  name: "Guinea Cat",
  role: "数字游民 / Web 开发者",
  bio: "专注于构建简洁、高效且具有美感的数字体验。目前正在探索 AI 与 Web 技术的深度融合。",
  email: "hello@guineacat.io",
  github: "https://github.com/guinea-cat",
  linkedin: "#",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guinea-cat"
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "AI 驱动的个人简历",
    description: "通过集成 Gemini 3 系列模型，让主页具备了“会说话”的能力。访问者可以直接询问关于我的任何信息。",
    tags: ["React", "Gemini API", "Tailwind"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/guinea-cat/guinea_cat.github.io"
  },
  {
    id: 2,
    title: "Minimalist Blog",
    description: "一个追求极致阅读体验的极简博客模板，支持 Markdown 写作与深色模式切换。",
    tags: ["Next.js", "TypeScript", "Vercel"],
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
    link: "#"
  }
];

export const SKILLS: Skill[] = [
  { name: "React / Next.js", level: 85, category: "Frontend" },
  { name: "Tailwind CSS", level: 90, category: "Frontend" },
  { name: "Node.js", level: 70, category: "Backend" },
  { name: "Python / AI Engineering", level: 75, category: "Others" },
  { name: "GitHub Actions", level: 80, category: "Tools" }
];
