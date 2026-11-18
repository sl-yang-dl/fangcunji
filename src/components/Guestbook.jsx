import { useState } from "react";

// ============================================================
// 留言板 · GitHub Actions 代理模式（推荐，更安全）
//
// 流程：
//   前端 POST -> GitHub API workflow_dispatch -> Actions 服务器端
//   使用仓库的 GITHUB_TOKEN（repo secret）创建 Issue。
//
// 这样创建 Issue 所需的令牌只存在于 GitHub Actions 运行环境，
// 不会打包进前端产物，浏览器中不会暴露任何高权限凭据。
//
// 需要配置（二选一）：
//   方案一（推荐，纯 GitHub 代理）：
//     在 .env 中设置 VITE_GUESTBOOK_TOKEN 为"仅用于触发 workflow_dispatch"
//     的低权限 Fine-grained PAT（actions:write + issues:write 于本仓库）。
//     -> 见 .github/workflows/guestbook-proxy.yml 与 README。
//   方案二（零配置，仅供演示）：
//     不配置任何 token，前端会优雅提示未配置，不会报错。
//
// 注意：只要"纯静态前端 + GitHub 后端"，前端就必然需要一个"触发代理"
//       的窄权限令牌。该令牌无法完全避开浏览器。若要彻底不暴露任何令牌，
//       需在 GitHub Actions 之外再加一层服务端转发（见 README"更进一步"）。
// ============================================================
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || "your-name/your-repo";

export default function Guestbook({ stampName }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit = name.trim() && message.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    // 用于触发 workflow_dispatch 的低权限令牌（仅触发，不用于创建 Issue）
    const token = import.meta.env.VITE_GUESTBOOK_TOKEN || "";

    try {
      const headers = { Accept: "application/vnd.github+json" };
      if (token) headers.Authorization = "Bearer " + token;

      const res = await fetch(
        "https://api.github.com/repos/" +
          GITHUB_REPO +
          "/actions/workflows/guestbook-proxy.yml/dispatches",
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ref: "main",
            inputs: {
              nickname: name.trim(),
              stampName: stampName || "",
              message: message.trim(),
            },
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "HTTP " + res.status);
      }

      setStatus("success");
      setName("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        "提交失败：" +
          err.message +
          "。请确认已配置 VITE_GUESTBOOK_TOKEN，并已推送 main 分支以启用代理工作流（见 README）。"
      );
    }
  };

  return (
    <section className="guestbook" id="guestbook">
      <div className="guestbook-inner">
        <div className="guestbook-head">
          <span className="sec-dot"></span>
          <h2>留言板</h2>
        </div>
        <p className="guestbook-desc">
          欢迎留下你的意见、建议或邮票心得，留言将收录到项目的 GitHub Issues。
        </p>

        <form className="guestbook-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="gb-input"
            placeholder="你的昵称（必填）"
            value={name}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="gb-textarea"
            placeholder="写下你的留言…（必填）"
            value={message}
            maxLength={1000}
            rows={4}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="gb-actions">
            <span className="gb-counter">{message.length}/1000</span>
            <button
              type="submit"
              className="gb-submit"
              disabled={!canSubmit || status === "sending"}
            >
              {status === "sending" ? "提交中…" : "提交留言"}
            </button>
          </div>
        </form>

        {status === "success" && (
          <div className="gb-tip success">
            留言提交成功！将在几分钟内出现在仓库 Issues 中。
          </div>
        )}
        {status === "error" && (
          <div className="gb-tip error">{errorMsg}</div>
        )}
      </div>
    </section>
  );
}
