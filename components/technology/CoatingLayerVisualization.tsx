'use client';

import { useEffect, useRef, useState } from 'react';

interface TechParam {
  label: string;
  value: string;
  unit?: string;
}

interface GunLayer {
  id: string;
  title: string;
  subtitle: string;
  shortLabel: string;
  description: string;
  highlight: string;
  techParams: TechParam[];
}

const GUN_LAYERS: GunLayer[] = [
  {
    id: 'layer-1',
    title: '基材流体底座 / 枪体',
    subtitle: 'Substrate Fluid Base',
    shortLabel: '基材流体底座',
    description:
      '采用 UHMW 耐磨材料构建流体通道，保持涂料输送过程中的化学稳定性与长期耐磨性能，实现低阻力、零堵塞的基础输送条件。',
    highlight: '定义喷枪整体流体稳定性的基准层，决定涂料输送的持续性与枪体结构的可靠性。',
    techParams: [
      { label: '枪体材料', value: 'UHMW-PE' },
      { label: '流体通道直径', value: '2.5', unit: 'mm' },
      { label: '耐压等级', value: '1.0', unit: 'MPa' },
    ],
  },
  {
    id: 'layer-2',
    title: '内置高压级联模块',
    subtitle: 'Cascade Voltage Block',
    shortLabel: '高压级联模块',
    description:
      '核心级联整流模块将低压输入转换为最高 100kV 静电高压，为颗粒带来稳定且均匀的荷电状态，提升复杂工件区域的包覆效率。',
    highlight: '是静电包覆能力的关键来源，直接影响边角、内凹与法拉第笼区域的上粉一致性。',
    techParams: [
      { label: '最高输出电压', value: '100', unit: 'kV' },
      { label: '级联级数', value: '12', unit: '级' },
      { label: '输出稳定性', value: '±1%' },
    ],
  },
  {
    id: 'layer-3',
    title: '气动控制通道',
    subtitle: 'Pneumatic Control Channels',
    shortLabel: '气动控制通道',
    description:
      '雾化气、流化气与输送气三路独立解耦，配合数字步进阀精确调节气量，使喷幅、上粉量与雾化细度具备可重复控制能力。',
    highlight: '减少调机时间与工艺漂移，把经验型喷涂调试转为参数化控制。',
    techParams: [
      { label: '雾化气调节精度', value: '0.01', unit: 'MPa' },
      { label: '流化气压力范围', value: '0.05-0.15', unit: 'MPa' },
      { label: '控制通道数', value: '3', unit: '路' },
    ],
  },
  {
    id: 'layer-4',
    title: '文丘里喷射器核心',
    subtitle: 'Venturi Injector Core',
    shortLabel: '文丘里喷射器',
    description:
      '高精度文丘里粉末泵利用高速气流形成稳定负压，实现均匀吸粉与连续输送，保障供粉效率与喷涂连续性。',
    highlight: '决定粉气混合质量与供粉效率，是喷涂一致性和换色节拍的重要控制点。',
    techParams: [
      { label: '喉部直径', value: '3.2', unit: 'mm' },
      { label: '喷射效率', value: '≥92', unit: '%' },
      { label: '粒径兼容', value: '10-100', unit: 'μm' },
    ],
  },
  {
    id: 'layer-5',
    title: '雾化喷嘴组件',
    subtitle: 'Atomizing Nozzle Assembly',
    shortLabel: '雾化喷嘴组件',
    description:
      '可更换的平面喷嘴与圆形喷嘴优化法拉第笼效应覆盖，帮助复杂工件边角、深槽与局部区域实现更均匀的最终涂覆。',
    highlight: '直接决定喷幅形态与最终表面效果，是工艺适配不同工件的最后一道精度出口。',
    techParams: [
      { label: '喷嘴形式', value: '平面 / 圆形可换' },
      { label: '喷涂幅宽', value: '150-250', unit: 'mm' },
      { label: '覆盖策略', value: '优化法拉第笼' },
    ],
  },
];

const AUTOPLAY_INTERVAL = 4500;
const MANUAL_OVERRIDE_MS = 10000;

export function CoatingLayerVisualization() {
  const sectionRef = useRef<HTMLElement>(null);
  const resumeAtRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.35),
      { threshold: [0.2, 0.35, 0.6] }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const timer = window.setInterval(() => {
      if (Date.now() < resumeAtRef.current) return;
      setActiveIndex((current) => (current + 1) % GUN_LAYERS.length);
    }, AUTOPLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [isInView]);

  const setLayer = (nextIndex: number) => {
    resumeAtRef.current = Date.now() + MANUAL_OVERRIDE_MS;
    setActiveIndex(nextIndex);
  };

  const activeLayer = GUN_LAYERS[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="section section-alt overflow-hidden border-y border-line"
      aria-label="静电喷枪五层核心架构"
    >
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Innovation</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black leading-[1.06] text-ink md:text-5xl">
              静电喷枪五层核心架构
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-steel">
              将喷枪内部结构从黑盒变为可理解的工程模块。点击层级即可查看每一层的关键作用与核心参数，自动轮播仅作为辅助预览。
            </p>

            <div className="mt-12 rounded-[32px] border border-line bg-white p-6 shadow-card">
              <div className="relative mx-auto flex min-h-[360px] max-w-[360px] items-center justify-center">
                <div className="absolute left-1/2 top-10 h-[76%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                <div className="absolute inset-6 rounded-[30px] border border-line" />

                {GUN_LAYERS.map((layer, index) => {
                  const offset = index - activeIndex;
                  const isActive = index === activeIndex;
                  const distance = Math.abs(offset);

                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setLayer(index)}
                      className="absolute left-1/2 w-[300px] -translate-x-1/2 rounded-[24px] border px-5 py-4 text-left transition-all duration-500 ease-out"
                      style={{
                        top: `calc(50% + ${offset * 62}px)`,
                        transform: `translateX(-50%) scale(${isActive ? 1 : 1 - distance * 0.03})`,
                        opacity: isActive ? 1 : Math.max(0.34, 0.82 - distance * 0.2),
                        zIndex: GUN_LAYERS.length - distance,
                        borderColor: isActive ? '#0052CC' : '#E2E8F0',
                        background: isActive ? 'linear-gradient(180deg, #FFFFFF, #F4F8FF)' : '#FFFFFF',
                        boxShadow: isActive ? '0 18px 40px rgba(0, 82, 204, 0.12)' : '0 8px 20px rgba(15,23,42,0.04)',
                      }}
                      aria-pressed={isActive}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                          style={{
                            background: isActive ? '#0052CC' : '#EAF2FF',
                            color: isActive ? '#FFFFFF' : '#0052CC',
                          }}
                        >
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold md:text-base ${isActive ? 'text-ink' : 'text-slate-500'}`}>
                            {layer.shortLabel}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-primary/85">
                            {layer.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
                <div className="flex gap-2">
                  {GUN_LAYERS.map((layer, index) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setLayer(index)}
                      className="h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: index === activeIndex ? '2rem' : '0.65rem',
                        backgroundColor: index === activeIndex ? '#0052CC' : '#CBD5E1',
                      }}
                      aria-label={`查看第 ${index + 1} 层：${layer.shortLabel}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLayer((activeIndex + GUN_LAYERS.length - 1) % GUN_LAYERS.length)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-steel transition-colors hover:border-primary/30 hover:text-ink"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayer((activeIndex + 1) % GUN_LAYERS.length)}
                    className="rounded-full border border-primary/20 bg-primary-light px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-primary/35"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:pt-10">
            <div className="rounded-[32px] border border-line bg-white p-8 shadow-[0_28px_60px_rgba(15,23,42,0.05)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                    {activeIndex + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                      Layer {activeIndex + 1}
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-ink">{activeLayer.title}</h3>
                    <p className="mt-2 text-sm uppercase tracking-[0.2em] text-primary">{activeLayer.subtitle}</p>
                  </div>
                </div>

                <div className="rounded-full border border-line bg-bg-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-steel">
                  自动轮播 {isInView ? '开启' : '暂停'}
                </div>
              </div>

              <p className="mt-8 max-w-3xl text-base leading-8 text-steel">{activeLayer.description}</p>

              <div className="mt-6 rounded-[24px] border border-line bg-bg-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">关键作用</p>
                <p className="mt-3 text-sm leading-7 text-steel">{activeLayer.highlight}</p>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {activeLayer.techParams.map((param) => (
                  <div key={param.label} className="rounded-[22px] border border-line bg-white p-5">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-steel">{param.label}</p>
                    <p className="mt-3 font-technical text-xl">
                      <code>{param.value}</code>
                      {param.unit ? <span className="ml-1 text-xs text-primary/80">{param.unit}</span> : null}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {GUN_LAYERS.map((layer, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setLayer(index)}
                    className={`rounded-[22px] border px-4 py-4 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-primary bg-primary-light text-ink shadow-[0_12px_30px_rgba(0,82,204,0.08)]'
                        : 'border-line bg-white text-steel hover:border-primary/20 hover:text-ink'
                    }`}
                    aria-pressed={isActive}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">0{index + 1}</p>
                    <p className="mt-2 text-sm font-bold leading-6">{layer.shortLabel}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
