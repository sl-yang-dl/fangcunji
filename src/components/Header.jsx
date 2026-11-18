export default function Header({ total }) {
  return (
    <header className="site-header">
      <div className="header-filigree" aria-hidden="true"></div>
      <div className="header-inner">
        <div className="brand">
          <div className="brand-row">
            <span className="brand-seal" aria-hidden="true">邮</span>
            <div className="brand-text">
              <h1 className="brand-title">方寸集</h1>
              <p className="brand-sub">新中国邮票 · 图鉴</p>
            </div>
          </div>
          <div className="brand-rule"><span></span><i></i><span></span></div>
          <p className="brand-colophon">方寸之间 · 邮览山河</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-num">{total}</span>
            <span className="stat-label">收录邮票</span>
          </div>
        </div>
      </div>
      <svg className="header-wave" viewBox="0 0 1440 66" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,46 C360,14 1080,78 1440,38 L1440,66 L0,66 Z" fill="#f4efe3"></path>
      </svg>
    </header>
  );
}
