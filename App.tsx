
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- 配置数据 (你可以直接在这里改名字和简介) ---
const USER = {
  name: "Guinea Cat",
  role: "数字游民 / Web 开发者",
  bio: "专注于构建简洁、高效且具有美感的数字体验。",
  email: "hello@guineacat.io",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guinea-cat"
};

const PROJECTS = [
  { title: "AI 个人主页", desc: "基于 Gemini 3 构建的交互式个人门户。", tags: ["React", "AI"] },
  { title: "极简博客", desc: "追求极致阅读体验的写作空间。", tags: ["Next.js", "Design"] }
];

// --- AI 逻辑 ---
const askAI = async (msg: string, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `你是 ${USER.name} 的助手。主人信息：${USER.role}, ${USER.bio}。请友好地回答：${msg}`;
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    return res.text;
  } catch {
    return "抱歉，我刚才走神了，请再问一次？";
  }
};

// --- 组件合集 ---

const Navbar = () => (
  <nav className="fixed top-0 w-full glass border-b z-50 px-6 py-4 flex justify-between items-center">
    <span className="font-bold text-xl text-blue-600">PORTFOLIO.</span>
    <div className="space-x-6 text-sm font-medium">
      <a href="#home">首页</a>
      <a href="#projects">项目</a>
      <a href="#contact">联系</a>
    </div>
  </nav>
);

const Hero = () => (
  <section id="home" className="pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
    <div className="flex-1 space-y-6 text-center md:text-left">
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
        你好，我是 <span className="text-blue-600">{USER.name}</span>
      </h1>
      <p className="text-xl text-slate-600">{USER.role}。{USER.bio}</p>
      <div className="flex gap-4 justify-center md:justify-start">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition">查看作品</button>
        <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition">联系我</button>
      </div>
    </div>
    <img src={USER.avatar} className="w-64 h-64 rounded-full border-8 border-white shadow-2xl" />
  </section>
);

const Projects = () => (
  <section id="projects" className="py-20 bg-white px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 text-center">精选作品</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {PROJECTS.map((p, i) => (
          <div key={i} className="p-8 border rounded-2xl hover:shadow-xl transition group">
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">{p.title}</h3>
            <p className="text-slate-600 mb-4">{p.desc}</p>
            <div className="flex gap-2">
              {p.tags.map(t => <span key={t} className="text-xs bg-slate-100 px-3 py-1 rounded-full">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ r: 'ai', t: '你好！我是主人的 AI 助手，有什么可以帮你的？' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userT = input;
    setInput('');
    setMsgs(prev => [...prev, { r: 'user', t: userT }]);
    setLoading(true);
    const reply = await askAI(userT, []);
    setMsgs(prev => [...prev, { r: 'ai', t: reply }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {open && (
        <div className="mb-4 w-80 h-[450px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-blue-600 text-white font-bold flex justify-between">
            <span>AI 助手</span>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.r === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg text-sm ${m.r === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{m.t}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="flex-1 bg-slate-50 px-3 py-1 text-sm border rounded-full outline-none" placeholder="输入..." />
            <button onClick={send} className="text-blue-600 px-2">发送</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 transition">
        <i className={`fa-solid ${open ? 'fa-times' : 'fa-comment-dots'}`}></i>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Projects />
      <footer id="contact" className="py-12 bg-slate-900 text-white text-center">
         <p>© 2024 {USER.name}. Built with AI.</p>
      </footer>
      <Chat />
    </div>
  );
}
