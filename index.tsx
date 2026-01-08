
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// =================配置区 (直接在这里改你的信息)=================
const DATA = {
  name: "Guinea Cat",
  role: "独立开发者 / 内容创作者",
  bio: "致力于用 AI 探索人类创造力的边界。这是我的个人数字空间。",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guinea-cat",
  projects: [
    { title: "AI 交互空间", desc: "集成 Gemini 3 的深度对话式主页。", tag: "AI" },
    { title: "极简实验室", desc: "探索 Web 技术的无限可能。", tag: "Code" }
  ]
};

// =================AI 核心逻辑=================
const getAIResponse = async (msg: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemPrompt = `你是 ${DATA.name} 的 AI 助手。主人是 ${DATA.role}。请用友好且简洁的中文回答关于主人的问题。`;
  
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n用户提问：${msg}` }] }]
    });
    return res.text;
  } catch (e) {
    return "信号微弱，请稍后再试或通过邮件联系我！";
  }
};

// =================UI 组件合集=================

const Navbar = () => (
  <nav className="fixed top-0 w-full glass z-50 px-8 py-4 flex justify-between items-center border-b">
    <div className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">G.CAT</div>
    <div className="flex gap-6 text-sm font-medium text-slate-600">
      <a href="#home" className="hover:text-blue-600 transition">首页</a>
      <a href="#work" className="hover:text-blue-600 transition">作品</a>
      <a href="mailto:hello@guineacat.io" className="hover:text-blue-600 transition">联系</a>
    </div>
  </nav>
);

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ r: 'ai', t: '你好！我是 Guinea Cat 的 AI 分身，想了解点什么？' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    if (!input.trim() || loading) return;
    const txt = input; setInput('');
    setMsgs(p => [...p, { r: 'user', t: txt }]);
    setLoading(true);
    const reply = await getAIResponse(txt);
    setMsgs(p => [...p, { r: 'ai', t: reply }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter">
            HELLO, I'M <br/><span className="text-blue-600">{DATA.name.toUpperCase()}</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-xl leading-relaxed">{DATA.bio}</p>
          <div className="flex gap-4 justify-center md:justify-start">
            <button className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-600 transition-all shadow-xl">开始探索</button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-400/20 blur-3xl rounded-full"></div>
          <img src={DATA.avatar} className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl border-4 border-white shadow-2xl animate-float" />
        </div>
      </section>

      {/* Projects */}
      <section id="work" className="py-24 bg-white border-y border-slate-100 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {DATA.projects.map((p, i) => (
            <div key={i} className="group p-10 bg-slate-50 rounded-[40px] hover:bg-blue-600 transition-all duration-500 cursor-pointer">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 group-hover:text-blue-100">{p.tag}</span>
              <h3 className="text-3xl font-bold mt-2 mb-4 group-hover:text-white">{p.title}</h3>
              <p className="text-slate-500 group-hover:text-blue-50 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Chat Bot */}
      <div className="fixed bottom-10 right-10 z-[100]">
        {chatOpen && (
          <div className="mb-6 w-80 md:w-96 h-[500px] glass rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-bold">AI ASSISTANT</span>
              </div>
              <button onClick={() => setChatOpen(false)}><i className="fa-solid fa-times"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.r === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-sm max-w-[85%] ${m.r === 'user' ? 'bg-blue-600 text-white' : 'bg-white shadow-sm border'}`}>
                    {m.t}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-slate-400 animate-pulse">思考中...</div>}
            </div>
            <div className="p-4 bg-white/50 border-t flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} className="flex-1 bg-white px-5 py-2 rounded-full border focus:border-blue-500 outline-none text-sm" placeholder="问问我吧..." />
              <button onClick={onSend} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"><i className="fa-solid fa-paper-plane"></i></button>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition">
          <i className={`fa-solid ${chatOpen ? 'fa-times' : 'fa-comment-dots'}`}></i>
        </button>
      </div>

      <footer className="py-12 text-center text-slate-400 text-sm">
        © 2024 {DATA.name}. Designed with passion.
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
