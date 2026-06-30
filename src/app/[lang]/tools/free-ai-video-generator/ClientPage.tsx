"use client";

import { useEffect, useRef, useState } from "react";
import SiteFooter from "../../../../components/SiteFooter";
import SiteHeader from "../../../../components/SiteHeader";
import ToolPageContent from "../../../../components/ToolPageContent";
import { getToolPageContent } from "../../../../lib/toolPageContent";

type Format = "landscape" | "portrait" | "square";
type Status = "idle" | "submitting" | "polling" | "success" | "error";
type DurationChoice = "auto" | "3" | "5" | "10" | "18";
const durationOptions = ["3", "5", "10", "18"] as const;

export default function AiVideoClient({ lang }: { lang: "en" | "zh" }) {
  const zh = lang === "zh";
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState<Format>("landscape");
  const [duration, setDuration] = useState<DurationChoice>("auto");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [details, setDetails] = useState<{ seconds?: string; size?: string }>({});
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const polls = useRef(0);
  const content = getToolPageContent(lang, "free-ai-video-generator");
  const examples = zh
    ? ["一只红狐走过积雪森林，雪花轻落，低机位跟拍，写实电影风格。", "黑色岩石上的香水瓶，薄雾缓慢流动，产品慢镜头，戏剧化灯光。"]
    : ["A red fox walking through a snowy forest, soft snowfall, low tracking shot, realistic cinematic style.", "A perfume bottle on black stone, mist drifting around it, slow product shot, dramatic lighting."];

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function poll(videoId: string) {
    polls.current += 1;
    if (polls.current > 90) {
      setStatus("error");
      setError(zh ? "等待时间过长，请稍后重试。" : "This task is taking too long. Please try again later.");
      return;
    }
    try {
      const response = await fetch(`/api/tools/ai-video/status?video_id=${encodeURIComponent(videoId)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || data.status === "failed") throw new Error(data.error || "Video generation failed.");
      setProgress(data.progress || 0);
      setDetails({ seconds: data.seconds, size: data.size });
      if (data.status === "completed" && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setStatus("success");
        return;
      }
      timer.current = setTimeout(() => poll(videoId), 8000);
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Unable to check video status.");
    }
  }

  async function generate() {
    if (prompt.trim().length < 10) return;
    setStatus("submitting");
    setProgress(0);
    setError("");
    setVideoUrl("");
    polls.current = 0;
    try {
      const response = await fetch("/api/tools/ai-video/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, format, duration }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start video generation.");
      setDetails({ seconds: data.seconds, size: data.size });
      setStatus("polling");
      await poll(data.videoId);
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Unable to start video generation.");
    }
  }

  function reset() {
    setStatus("idle");
    setProgress(0);
    setVideoUrl("");
    setError("");
  }

  return (
    <div className="site-shell">
      <SiteHeader lang={lang} />
      <main>
        <header className="tool-hero tool-container">
          <span className="tool-badge">{zh ? "AI 文生视频" : "Text to video"}</span>
          <h1>{zh ? "免费 AI 视频生成器" : "Free AI Video Generator"}</h1>
          <p>{zh ? "用一个清晰的文本提示词，生成横版、竖版或方形 AI 短视频。" : "Turn one clear text prompt into a landscape, portrait, or square AI video."}</p>
        </header>

        <section className="tool-workspace tool-container">
          <div className="workspace-panel">
            <div className="workspace-panel__header">
              <div><span>01</span><strong>{zh ? "描述视频画面" : "Describe the shot"}</strong></div>
              <small>{prompt.length}/1200</small>
            </div>
            <div className="video-input-panel">
              <textarea className="navo-input" maxLength={1200} value={prompt} onChange={event => setPrompt(event.target.value)} placeholder={zh ? "主体 + 动作 + 场景 + 镜头运动 + 光线 + 风格" : "Subject + action + setting + camera movement + lighting + style"} />
              <div className="example-prompts">
                <span>{zh ? "示例提示词" : "Example prompts"}</span>
                {examples.map(example => <button key={example} onClick={() => setPrompt(example)}>{example}</button>)}
              </div>
              <div className="video-settings">
                <fieldset>
                  <legend>{zh ? "画面比例" : "Aspect ratio"}</legend>
                  <div>
                    {(["landscape", "portrait", "square"] as Format[]).map(item => (
                      <button key={item} className={format === item ? "is-active" : ""} onClick={() => setFormat(item)}>
                        {item === "landscape" ? "16:9" : item === "portrait" ? "9:16" : "1:1"}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="duration-fieldset">
                  <legend>{zh ? "视频长度" : "Video length"}</legend>
                  <div className="duration-auto">
                    <button className={duration === "auto" ? "is-active" : ""} onClick={() => setDuration("auto")}>
                      <span>{zh ? "自动推荐" : "Auto"}</span>
                      <small>{zh ? "优先选择更稳定的短片长度" : "Prioritizes a stable short clip"}</small>
                    </button>
                  </div>
                  <details className="advanced-duration" open={duration !== "auto"}>
                    <summary>{zh ? "高级：固定时长" : "Advanced: fixed length"}</summary>
                    <div>
                      {durationOptions.map(item => (
                        <button key={item} className={duration === item ? "is-active" : ""} onClick={() => setDuration(item)}>≈ {item}s</button>
                      ))}
                    </div>
                  </details>
                  <small className="duration-hint">{zh ? "自动模式会先保证生成成功率；明确多镜头或更长叙事时才会升到更长档位。" : "Auto starts with the shortest reliable length, then uses longer presets only when the prompt clearly needs them."}</small>
                </fieldset>
              </div>
              {error && <p className="inline-error">{error}</p>}
              <button className="button button--blue" disabled={prompt.trim().length < 10 || status === "submitting" || status === "polling"} onClick={generate}>
                {status === "submitting" || status === "polling" ? (zh ? "正在生成…" : "Generating…") : (zh ? "生成视频" : "Generate video")}
              </button>
              <small className="processing-note">{zh ? "提示词会由 AI 视频服务处理。请勿输入敏感或机密信息。" : "Your prompt is processed by an AI video service. Do not enter sensitive or confidential information."}</small>
            </div>
          </div>

          <div className="workspace-panel workspace-panel--preview">
            <div className="workspace-panel__header">
              <div><span>02</span><strong>{zh ? "视频结果" : "Video result"}</strong></div>
              {status === "success" && <button className="button button--secondary button--small" onClick={reset}>{zh ? "重新生成" : "Start over"}</button>}
            </div>
            <div className="video-result">
              {status === "success" && videoUrl ? (
                <div className="video-success">
                  <video src={videoUrl} controls playsInline />
                  <div>
                    <span>{[details.seconds && `${details.seconds}s`, details.size].filter(Boolean).join(" · ")}</span>
                    <a className="button button--ink button--small" href={videoUrl} target="_blank" rel="noreferrer">{zh ? "打开视频" : "Open video"}</a>
                  </div>
                </div>
              ) : status === "submitting" || status === "polling" ? (
                <div className="generation-state">
                  <div className="progress-ring"><span>{progress}%</span></div>
                  <strong>
                    {status === "submitting"
                      ? (zh ? "正在创建视频任务" : "Starting your video task")
                      : (zh ? "正在生成视频" : "Generating your video")}
                  </strong>
                  <p>
                    {status === "submitting"
                      ? (zh ? "服务繁忙时，创建任务可能需要一两分钟。请保持页面打开。" : "When the service is busy, starting the task can take a minute or two. Keep this page open.")
                      : (zh ? "视频任务异步处理，可能需要等待数分钟。请保持页面打开。" : "Video tasks run asynchronously and may take several minutes. Keep this page open.")}
                  </p>
                </div>
              ) : (
                <div className="empty-state video-empty">
                  <span>▶</span>
                  <strong>{zh ? "你的视频会显示在这里" : "Your video will appear here"}</strong>
                  <p>{zh ? "输入一个具体镜头，选择画面比例，然后开始生成。系统会自动推荐视频长度。" : "Describe one specific shot, choose a format, then generate. Auto length picks a stable clip duration for you."}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <ToolPageContent lang={lang} {...content} />
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
