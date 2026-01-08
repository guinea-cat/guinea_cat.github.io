
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// ================= 个人数据配置 =================
const USER = {
  name: "Guinea Cat",
  title: "Creative Developer & AI Explorer",
  bio: "我是一名热衷于探索 AI 潜力的开发者。这里是我的数字实验室，你可以通过右下角的 AI 助手直接与我的“数字分身”对话。",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guinea-cat",
  email: "hello@guineacat.io"
};

const PROJECTS = [
  { 
    title: "AI Portfolio", 
    desc: "使用 Gemini API 构建的智能主页，具备自我介绍和项目咨询能力。", 
    tag: "React + AI",
    icon: "fa-robot"
  },
  { 
    title: "Minimalist Blog", 
    desc: "追求极致加载速度与阅读体验的个人技术博客。", 
    tag: "Next.js",
    icon: "fa-feather"
  }
];

// ================= AI 交互逻辑 =================
const callGemini = async (msg: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    你现在是 ${USER.name} 的个人数字分身。
    主人的背景：${USER.title}，简介：${USER.bio}。
    你的任务：以主人的语气，友好、幽默、简洁地回答访问者的问题。
    回答规范：
    1. 始终使用中文。
    2. 如果被问到技术栈，提到 React, Tailwind 和 AI 集成。
    3. 如果用户问你是谁，告诉他你是 Guinea Cat 的 AI 助手。
  `;
  
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${prompt}\n用户提问：${msg}` }] }]
    });
    return res.text;
  } catch (e) {
    console.error(e);
    return "我的电路可能短路了，要不你直接发邮件联系我主人？";
  }
};

// ================= UI 组件 =================

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ r: 'ai', t: '嘿！我是 Guinea Cat 的 AI 助理，有什么想了解的？' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input; setInput('');
    setMsgs(p => [...p, { r: 'user', t: userMsg }]);
    setLoading(true);
    const reply = await callGemini(userMsg);
    setMsgs(p => [...p, { r: 'ai', t: reply }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold tracking-tight">AI ASSISTANT</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.r === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm ${m.r === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                  {m.t}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400 italic">正在思考中...</div>}
          </div>
          <div className="p-4 bg-white border-t flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="flex-1 bg-slate-100 px-5 py-3 rounded-full outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all" placeholder="跟我聊聊项目..." />
            <button onClick={send} className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-105 transition"><i className="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all">
        <i className={`fa-solid ${isOpen ? 'fa-chevron-down' : 'fa-comment-dots'}`}></i>
      </button>
    </div>
  );
};

const App = () => (
  <div className="min-h-screen flex flex-col">
    <nav className="fixed top-0 w-full glass z-50 px-8 py-5 flex justify-between items-center border-b border-slate-200">
      <div className="text-xl font-black tracking-tighter hover:opacity-70 transition cursor-pointer">GUINEA CAT.</div>
      <div className="flex gap-8 text-sm font-semibold text-slate-500 uppercase tracking-widest">
        <a href="#work" className="hover:text-blue-600 transition">Works</a>
        <a href={`mailto:${USER.email}`} className="hover:text-blue-600 transition">Contact</a>
      </div>
    </nav>

    <main className="flex-1">
      {/* Hero */}
      <section className="pt-48 pb-32 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Available for work</div>
          <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85]">
            BUILD <br/><span className="gradient-text">SMART</span> <br/>APPS.
          </h1>
          <p className="text-xl text-slate-500 max-w-md leading-relaxed">{USER.bio}</p>
        </div>
        <div className="relative group">
          <div className="absolute -inset-10 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition duration-700"></div>
          <img src={USER.avatar} className="relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-[4rem] border-4 border-white shadow-2xl animate-float object-cover" />
        </div>
      </section>

      {/* Projects Grid */}
      <section id="work" className="py-32 bg-slate-900 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl font-bold text-white tracking-tighter">Selected <br/>Projects.</h2>
            <div className="text-slate-500 text-sm hidden md:block">Scroll to explore →</div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {PROJECTS.map((p, i) => (
              <div key={i} className="group p-12 bg-white/5 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer">
                <i className={`fa-solid ${p.icon} text-3xl text-blue-400 mb-6`}></i>
                <h3 className="text-3xl font-bold text-white mb-4">{p.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-8">{p.desc}</p>
                <span className="px-5 py-2 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest group-hover:bg-blue-600 transition">{p.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>

    <footer className="py-20 border-t border-slate-200 text-center space-y-6 bg-white">
      <div className="text-slate-400 text-sm uppercase tracking-[0.2em]">Designed with passion</div>
      <div className="text-2xl font-black">GUINEA CAT © 2024</div>
    </footer>

    <ChatBot />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
