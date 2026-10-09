"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Copy, Mail, Send } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/site";
import {
  SUBMISSION_CATEGORIES,
  submissionEmailBody,
  submissionCategoryLabels,
  validateSubmission,
  type ProductSubmission,
  type SubmissionErrors,
  type SubmissionField,
} from "@/lib/submissions";

const initialValues = { name: "", url: "", tagline: "", topic: "", email: "", notes: "", company: "" };

export default function SubmissionForm({ lang, emailConfigured }: { lang: "en" | "zh"; emailConfigured: boolean }) {
  const zh = lang === "zh";
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<SubmissionErrors>({});
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [prepared, setPrepared] = useState<ProductSubmission | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const feedback = useRef<HTMLDivElement>(null);
  const fieldMessages: Record<SubmissionField, string> = zh ? {
    name: "请填写产品名称，最多 80 个字符。",
    url: "请填写完整的 http:// 或 https:// 公开网址，不要包含登录信息。",
    tagline: "请用 1–200 个字符介绍产品。",
    topic: "请选择最适合的产品分类。",
    email: "请填写有效的联系邮箱。",
    notes: "补充说明最多 1,000 个字符。",
  } : {
    name: "Enter a product name, up to 80 characters.",
    url: "Enter a full public http:// or https:// URL without login credentials.",
    tagline: "Describe the product in 1–200 characters.",
    topic: "Choose the product category that fits best.",
    email: "Enter a valid contact email.",
    notes: "Additional context must be 1,000 characters or fewer.",
  };

  function change(field: keyof typeof initialValues, value: string) {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setPrepared(null);
    setMessage("");
    setCopyMessage("");
  }

  function focusFeedback() {
    requestAnimationFrame(() => feedback.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || sent) return;
    setMessage("");
    setCopyMessage("");
    const validation = validateSubmission({ ...values, language: lang });
    if (!validation.ok) {
      setErrors(validation.errors);
      setPrepared(null);
      const firstField = Object.keys(validation.errors)[0];
      const element = firstField ? event.currentTarget.elements.namedItem(firstField) : null;
      if (element instanceof HTMLElement) element.focus();
      else setMessage(zh ? "请检查填写的信息。" : "Please check the submission details.");
      return;
    }
    setErrors({});
    if (!emailConfigured) {
      setPrepared(validation.data);
      focusFeedback();
      return;
    }

    setPending(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, company: values.company }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (response.ok && result.status === "sent_for_review") {
        setSent(true);
        setPrepared(null);
      } else if (response.status === 400 && result.fields && Object.keys(result.fields).length) {
        setErrors(result.fields);
        setMessage(zh ? "请检查标出的信息后重新提交。" : "Please check the highlighted fields and try again.");
      } else {
        setPrepared(validation.data);
        setMessage(response.status === 429
          ? (zh ? "提交次数较多，请稍后再试，或改用邮件提交。" : "Too many submissions. Try again later, or send an email instead.")
          : (zh ? "暂时无法确认提交成功。你的信息仍在下方，可以通过邮件提交。" : "We could not confirm your submission. Your details are below so you can send them by email."));
      }
    } catch {
      setPrepared(validation.data);
      setMessage(zh ? "未能确认发送结果。请保留这些信息；你也可以通过邮件联系我们。" : "We could not confirm delivery. Keep these details; you can also contact us by email.");
    } finally {
      clearTimeout(timer);
      setPending(false);
      focusFeedback();
    }
  }

  const body = prepared ? submissionEmailBody(prepared) : "";
  const mailto = prepared ? `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`[NavoKit] Product submission: ${prepared.name}`)}&body=${encodeURIComponent(body)}` : "";
  const fieldError = (field: SubmissionField) => errors[field]
    ? <span className="submission-field-error" id={`${field}-error`}>{fieldMessages[field]}</span>
    : null;

  return (
    <section className="submission-card" aria-labelledby="submission-form-title">
      <div className="submission-card-heading">
        <h2 id="submission-form-title">{zh ? "推荐一个产品" : "Recommend a product"}</h2>
        <span>{zh ? "免费提交" : "Free submission"}</span>
      </div>
      <p className="submission-form-lead">{zh ? "带 * 的项目为必填项。" : "Fields marked * are required."}</p>
      {!emailConfigured && <p className="submission-email-note"><Mail size={17} /><span>{zh ? "填写后生成提交邮件，由你在邮件应用中发送。" : "Fill in the details to prepare an email, then send it from your email app."}</span></p>}
      <form onSubmit={submit} noValidate>
        <fieldset disabled={pending || sent} className="submission-fields">
          <div className="submission-field">
            <label htmlFor="product-name">{zh ? "产品名称" : "Product name"} <span>*</span></label>
            <input id="product-name" name="name" value={values.name} onChange={event => change("name", event.target.value)} required maxLength={80} placeholder={zh ? "产品或项目的名字" : "The product or project name"} autoComplete="off" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
            {fieldError("name")}
          </div>
          <div className="submission-field">
            <label htmlFor="product-url">{zh ? "官网或项目地址" : "Website or repository"} <span>*</span></label>
            <input id="product-url" name="url" type="url" value={values.url} onChange={event => change("url", event.target.value)} required maxLength={2048} placeholder="https://" autoComplete="url" aria-invalid={Boolean(errors.url)} aria-describedby={errors.url ? "url-error" : undefined} />
            {fieldError("url")}
          </div>
          <div className="submission-field">
            <label htmlFor="product-tagline">{zh ? "一句话介绍" : "One-line description"} <span>*</span></label>
            <textarea id="product-tagline" name="tagline" value={values.tagline} onChange={event => change("tagline", event.target.value)} required maxLength={200} rows={2} placeholder={zh ? "它帮助谁，完成什么事情？" : "Who does it help, and what does it do?"} aria-invalid={Boolean(errors.tagline)} aria-describedby={errors.tagline ? "tagline-error" : undefined} />
            {fieldError("tagline")}
          </div>
          <div className="submission-field">
            <label htmlFor="product-topic">{zh ? "产品分类" : "Product category"} <span>*</span></label>
            <select id="product-topic" name="topic" value={values.topic} onChange={event => change("topic", event.target.value)} required aria-invalid={Boolean(errors.topic)} aria-describedby={errors.topic ? "topic-error" : undefined}>
              <option value="">{zh ? "选择一个分类" : "Choose a category"}</option>
              {SUBMISSION_CATEGORIES.map(category => <option key={category} value={category}>{submissionCategoryLabels[lang][category]}</option>)}
            </select>
            {fieldError("topic")}
          </div>
          <div className="submission-field">
            <label htmlFor="contact-email">{zh ? "联系邮箱" : "Contact email"} <span>*</span></label>
            <input id="contact-email" name="email" type="email" value={values.email} onChange={event => change("email", event.target.value)} required maxLength={254} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={`email-hint${errors.email ? " email-error" : ""}`} />
            <span className="submission-hint" id="email-hint">{zh ? "仅用于联系你核对本次提交，不会在产品页展示。" : "Used to follow up on this submission. It will not appear on the product page."}</span>
            {fieldError("email")}
          </div>
          <div className="submission-field">
            <label htmlFor="product-notes">{zh ? "补充说明" : "Additional context"} <small>{zh ? "选填" : "Optional"}</small></label>
            <textarea id="product-notes" name="notes" value={values.notes} onChange={event => change("notes", event.target.value)} maxLength={1000} rows={3} placeholder={zh ? "它有什么新意，适合什么任务？也可以补充发布来源、演示、价格或当前可用状态。" : "What makes it different, and when is it useful? Add a launch source, demo, pricing, or current availability."} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "notes-error" : undefined} />
            {fieldError("notes")}
          </div>
          <div className="submission-trap" aria-hidden="true">
            <label htmlFor="submission-company">Company</label>
            <input id="submission-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={event => change("company", event.target.value)} />
          </div>
          <p className="submission-privacy">{zh ? "我们仅使用这些信息处理你的产品推荐。" : "We use these details to review your product recommendation."} <Link href={`/${lang}/privacy`}>{zh ? "隐私政策" : "Privacy policy"}</Link></p>
          <button className="button button--ink submission-submit" type="submit">
            {pending ? (zh ? "正在发送…" : "Sending…") : sent ? (zh ? "已发送审核" : "Sent for review") : emailConfigured ? (zh ? "提交审核" : "Send for review") : (zh ? "准备提交邮件" : "Prepare submission email")}
            {!pending && (emailConfigured ? <Send size={16} /> : <ArrowUpRight size={17} />)}
          </button>
        </fieldset>
      </form>
      <div ref={feedback} tabIndex={-1} className="submission-feedback" role="status" aria-live="polite" aria-atomic="true">
        {sent && <p className="submission-success"><CheckCircle2 size={20} /><span>{zh ? "已发送，等待编辑审核。产品通过审核后才会展示。" : "Sent for editorial review. Your product will appear only if it is approved."}</span></p>}
        {message && <p className="submission-status-message">{message}</p>}
        {prepared && (
          <div className="submission-email-preview">
            <h3>{zh ? "邮件已准备好，尚未发送" : "Email prepared — not yet sent"}</h3>
            <p>{zh ? "打开邮件应用并发送，或复制下面的信息，发送至" : "Open your email app and send, or copy these details and email"} <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>{zh ? "。" : "."}</p>
            <div className="submission-email-actions">
              <a className="button button--ink" href={mailto}><Mail size={16} />{zh ? "打开邮件应用" : "Open email app"}</a>
              <button className="button button--secondary" type="button" onClick={async () => {
                try {
                  await navigator.clipboard.writeText(body);
                  setCopyMessage(zh ? "信息已复制，请在邮件中粘贴并发送。" : "Copied. Paste the details into an email and send it.");
                } catch {
                  setCopyMessage(zh ? "无法自动复制，请选中下方文字手动复制。" : "Automatic copying is unavailable. Select and copy the text below.");
                }
              }}><Copy size={15} />{zh ? "复制信息" : "Copy details"}</button>
            </div>
            <textarea readOnly value={body} rows={7} aria-label={zh ? "待发送的提交信息" : "Submission details to send"} />
            {copyMessage && <p className="submission-copy-status">{copyMessage}</p>}
          </div>
        )}
      </div>
      <noscript><p>{zh ? "也可以直接将产品名称、网址与介绍发送至" : "You can also email the product name, URL, and description to"} <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p></noscript>
    </section>
  );
}
