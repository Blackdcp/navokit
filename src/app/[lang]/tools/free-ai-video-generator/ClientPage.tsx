"use client";

import { useEffect, useRef, useState } from "react";
import SiteFooter from "../../../../components/SiteFooter";
import SiteHeader from "../../../../components/SiteHeader";
import ToolPageContent from "../../../../components/ToolPageContent";
import { trackToolError, trackToolEvent } from "../../../../lib/clientAnalytics";
import type { ToolPageContentData } from "../../../../types/toolPageContent";

type Format = "landscape" | "portrait" | "square";
type Status = "idle" | "submitting" | "polling" | "success" | "error";
type DurationChoice = "auto" | "3" | "5" | "10" | "18";
const durationOptions = ["3", "5", "10", "18"] as const;
const videoErrorsZh: Record<string, string> = {
  "Video generation is temporarily unavailable.": "视频生成服务暂时不可用，请稍后再试。",
  "The video queue is full right now. Your prompt is valid — please try again in a few minutes.": "当前视频队列已满。提示词已保留，请过几分钟再试。",
  "The video request was rejected. Try revising your prompt.": "视频请求被拒绝，请修改提示词后重试。",
  "The video service could not start this request.": "视频服务未能创建任务，请稍后重试。",
  "Prompt must be between 10 and 1,200 characters.": "提示词需要包含 10–1,200 个字符。",
  "Invalid video settings.": "视频设置无效，请重新选择画面比例和时长。",
  "The video queue is taking too long to start. Your prompt is still here — please try again in a few minutes.": "视频任务等待启动的时间过长。提示词已保留，请过几分钟再试。",
  "Unable to start video generation.": "未能启动视频生成，请稍后重试。",
  "Invalid video ID.": "视频任务编号无效，请重新创建任务。",
  "Video task not found.": "没有找到这个视频任务，请重新生成。",
  "Unable to check video status.": "暂时无法查询视频进度，请检查网络后重试。",
  "Video generation failed. Try a different prompt.": "视频生成失败，请换一个提示词重试。",
  "Video generation failed.": "视频生成失败，请稍后重试。",
  "Status check timed out.": "查询视频进度超时，请稍后重试。",
};

function videoErrorMessage(error: unknown, zh: boolean, fallback: string) {
  if (!(error instanceof Error)) return zh ? "视频任务遇到问题，请稍后再试。" : fallback;
  if (!zh) return error.message;
  if (videoErrorsZh[error.message]) return videoErrorsZh[error.message];
  if (error instanceof TypeError) return "网络连接中断，请检查网络后重试。";
  return error.message;
}

export default function AiVideoClient({ lang, content }: { lang: "en" | "zh"; content: ToolPageContentData }) {
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
  const examples = zh
    ? ["一只红狐走过积雪森林，雪花轻落，低机位跟拍，写实电影风格。", "黑色岩石上的香水瓶，薄雾缓慢流动，产品慢镜头，戏剧化灯光。"]
    : ["A red fox walking through a snowy forest, soft snowfall, low tracking shot, realistic cinematic style.", "A perfume bottle on black stone, mist drifting around it, slow product shot, dramatic lighting."];
  const isWorking = status === "submitting" || status === "polling";
  const canGenerate = prompt.trim().length >= 10 && !isWorking;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function poll(videoId: string) {
    polls.current += 1;
    if (polls.current > 90) {
      setStatus("error");
      setError(zh ? "等待时间过长，请稍后重试。" : "This task is taking too long. Please try again later.");
      trackToolEvent("tool_ai_video_generation_failed", {
        tool: "ai_video",
        lang,
        format,
        duration,
        reason: "poll_timeout",
      });
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
        trackToolEvent("tool_ai_video_generation_succeeded", {
          tool: "ai_video",
          lang,
          format,
          duration,
          polls: polls.current,
          progress: Number(data.progress) || 100,
        });
        return;
      }
      timer.current = setTimeout(() => poll(videoId), 8000);
    } catch (caught) {
      setStatus("error");
      setError(videoErrorMessage(caught, zh, "Unable to check video status."));
      trackToolError("tool_ai_video_generation_failed", caught, {
        tool: "ai_video",
        lang,
        format,
        duration,
        reason: "status_check",
      });
    }
  }

  async function generate() {
    if (prompt.trim().length < 10 || isWorking) return;
    setStatus("submitting");
    setProgress(0);
    setError("");
    setVideoUrl("");
    polls.current = 0;
    trackToolEvent("tool_ai_video_submit_started", {
      tool: "ai_video",
      lang,
      format,
      duration,
      characters: prompt.trim().length,
    });
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
      trackToolEvent("tool_ai_video_submit_succeeded", {
        tool: "ai_video",
        lang,
        format,
        duration,
        progress: Number(data.progress) || 0,
      });
      await poll(data.videoId);
    } catch (caught) {
      setStatus("error");
      setError(videoErrorMessage(caught, zh, "Unable to start video generation."));
      trackToolError("tool_ai_video_submit_failed", caught, {
        tool: "ai_video",
        lang,
        format,
        duration,
      });
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
              <div><span>01</span><strong id="video-input-label">{zh ? "描述视频画面" : "Describe the shot"}</strong></div>
              <small>{prompt.length}/1200</small>
            </div>
            <div className="video-input-panel">
              <textarea className="navo-input" aria-labelledby="video-input-label" maxLength={1200} value={prompt} onChange={event => setPrompt(event.target.value)} placeholder={zh ? "主体 + 动作 + 场景 + 镜头运动 + 光线 + 风格" : "Subject + action + setting + camera movement + lighting + style"} />
              <div className="example-prompts">
                <span>{zh ? "示例提示词" : "Example prompts"}</span>
                {examples.map(example => <button key={example} onClick={() => setPrompt(example)}>{example}</button>)}
              </div>
              <div className="video-settings">
                <fieldset>
                  <legend>{zh ? "画面比例" : "Aspect ratio"}</legend>
                  <div>
                    {(["landscape", "portrait", "square"] as Format[]).map(item => (
                      <button key={item} className={format === item ? "is-active" : ""} aria-pressed={format === item} onClick={() => setFormat(item)}>
                        {item === "landscape" ? "3:2" : item === "portrait" ? "2:3" : "1:1"}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="duration-fieldset">
                  <legend>{zh ? "视频长度" : "Video length"}</legend>
                  <div className="duration-auto">
                    <button className={duration === "auto" ? "is-active" : ""} aria-pressed={duration === "auto"} onClick={() => setDuration("auto")}>
                      <span>{zh ? "自动推荐" : "Auto"}</span>
                      <small>{zh ? "根据提示词选择预设时长" : "Chooses a preset based on your prompt"}</small>
                    </button>
                  </div>
                  <details className="advanced-duration" open={duration !== "auto"}>
                    <summary>{zh ? "高级：固定时长" : "Advanced: fixed length"}</summary>
                    <div>
                      {durationOptions.map(item => (
                        <button key={item} className={duration === item ? "is-active" : ""} aria-pressed={duration === item} onClick={() => setDuration(item)}>≈ {item}s</button>
                      ))}
                    </div>
                  </details>
                  <small className="duration-hint">{zh ? "自动模式根据提示词中的时长、长度和场景关键词选择档位。你也可以在高级选项中指定时长。" : "Auto uses requested duration, prompt length, and scene keywords to choose a preset. You can also select a fixed length under Advanced."}</small>
                </fieldset>
              </div>
              {error && (
                <div className="inline-error video-error" role="alert">
                  <strong>{zh ? "视频任务遇到问题" : "There is a problem with this video task"}</strong>
                  <p>{error}</p>
                  <button className="button button--secondary button--small" disabled={!canGenerate} onClick={generate}>
                    {zh ? "用同一提示词重试" : "Try again with same prompt"}
                  </button>
                </div>
              )}
              <button className="button button--blue" disabled={!canGenerate} onClick={generate}>
                {isWorking
                  ? (zh ? "正在生成…" : "Generating…")
                  : status === "error"
                    ? (zh ? "用同一提示词重试" : "Try again with same prompt")
                    : (zh ? "生成视频" : "Generate video")}
              </button>
              <small className="processing-note">
                {zh
                  ? "免费生成使用共享容量，繁忙时创建任务可能需要一两分钟。如果队列满了，你的提示词会保留在这里，可直接重试。请勿输入敏感或机密信息。"
                  : "Free video generation uses limited shared capacity. If the queue is busy, your prompt stays here so you can try again. Do not enter sensitive or confidential information."}
              </small>
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
                      ? (zh ? "正在等待可用视频容量。队列繁忙时可能需要一两分钟；如果未开始，提示词会保留供你重试。" : "Waiting for available video capacity. If the queue cannot start soon, your prompt will stay here so you can retry.")
                      : (zh ? "视频任务异步处理，可能需要等待数分钟。请保持页面打开。" : "Video tasks run asynchronously and may take several minutes. Keep this page open.")}
                  </p>
                </div>
              ) : (
                <div className="empty-state video-empty">
                  <span>▶</span>
                  <strong>{zh ? "你的视频会显示在这里" : "Your video will appear here"}</strong>
                  <p>{zh ? "输入至少 10 个字符描述一个具体镜头，选择画面比例，然后开始生成。系统会自动推荐视频长度。" : "Use at least 10 characters to describe a specific shot, choose a format, then generate. Auto chooses a duration preset for your prompt."}</p>
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
