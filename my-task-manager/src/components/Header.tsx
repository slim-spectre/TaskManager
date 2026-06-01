// Header.tsx
function Header({ onLogout, setLang, lang }: any) {
  return (
    <header className="main-header">
      <div className="langSwitcher">
        <button onClick={() => setLang("uk")} className={lang === "uk" ? 'active' : ""}>UA</button>
        <button onClick={() => setLang("en")} className={lang === "en" ? 'active' : ""}>EN</button>
      </div>
      <button className="logout-btn" onClick={onLogout}>Log out</button>
    </header>
  );
}

export default Header;