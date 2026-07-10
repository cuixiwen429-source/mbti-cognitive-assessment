import { useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';

export default function HomePage() {
  const navigate = useNavigate();
  const reset = useTestStore((s) => s.reset);

  const handleStart = () => {
    reset();
    navigate('/test');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text dark:text-slate-100 mb-4">
          认知功能人格测评
        </h1>
        <p className="text-lg sm:text-xl text-text-muted dark:text-slate-400 mb-2">
          基于荣格 8 种认知功能的科学化人格评估
        </p>
        <p className="text-sm sm:text-base text-text-muted dark:text-slate-500 mb-10">
          不是简单的"你是 E 还是 I"，而是深入了解你的认知模式如何运作
        </p>

        {/* Comparison table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 text-left">
          <div className="bg-surface dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-text-muted dark:text-slate-400 uppercase mb-3">
              传统 MBTI 测试
            </h3>
            <ul className="space-y-2 text-sm text-text-muted dark:text-slate-400">
              <li className="flex gap-2">
                <span className="text-red-400 shrink-0">✕</span>
                二元迫选（E 还是 I？）
              </li>
              <li className="flex gap-2">
                <span className="text-red-400 shrink-0">✕</span>
                忽略荣格认知功能理论
              </li>
              <li className="flex gap-2">
                <span className="text-red-400 shrink-0">✕</span>
                无作答质量检测
              </li>
              <li className="flex gap-2">
                <span className="text-red-400 shrink-0">✕</span>
                结果非黑即白
              </li>
            </ul>
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-5 border border-primary/20 dark:border-primary/30">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase">
              认知功能测评
            </h3>
            <ul className="space-y-2 text-sm text-text dark:text-slate-200">
              <li className="flex gap-2">
                <span className="text-green-500 shrink-0">✓</span>
                8 维度连续谱系
              </li>
              <li className="flex gap-2">
                <span className="text-green-500 shrink-0">✓</span>
                基于荣格认知功能模型
              </li>
              <li className="flex gap-2">
                <span className="text-green-500 shrink-0">✓</span>
                注意力检测 + 一致性检验
              </li>
              <li className="flex gap-2">
                <span className="text-green-500 shrink-0">✓</span>
                功能栈排序 + 类型匹配
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="px-8 sm:px-10 py-4 bg-primary text-white text-lg font-semibold rounded-2xl
                     hover:bg-primary-dark active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/25"
        >
          开始测评
        </button>
        <p className="text-sm text-text-muted dark:text-slate-500 mt-4">
          约 120 题 · 预计 15-25 分钟 · 免费
        </p>
      </div>
    </div>
  );
}
