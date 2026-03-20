export default function PageHeader({ 
  title, 
  subtitle = "", 
  actionButtons = [], 
  userName = "Usuario",
  breadcrumb = [] 
}) {
  return (
    <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg">
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
          {breadcrumb.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span>{item}</span>
              {idx < breadcrumb.length - 1 && <span>/</span>}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          {subtitle && <p className="text-sm text-slate-400 mb-2">{subtitle}</p>}
          <h2 className="text-3xl font-bold text-slate-100">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Action Buttons */}
          {actionButtons.length > 0 && (
            <div className="flex items-center gap-3">
              {actionButtons.map((button) => (
                <button
                  key={button.label}
                  onClick={button.onClick}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    button.variant === "secondary"
                      ? "border border-slate-700 text-slate-300 hover:bg-slate-800"
                      : "bg-yellow-500 text-slate-900 hover:bg-yellow-600"
                  }`}
                  type="button"
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}

          {/* User Info */}
          <div className="border-l border-slate-700 pl-4 flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-100">{userName}</p>
              <p className="text-xs text-slate-400">Conectado</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-slate-900">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

