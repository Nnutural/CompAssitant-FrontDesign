import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  Trophy,
  TrendingUp,
  Lightbulb,
  FileText,
  CalendarDays,
  FolderOpen,
  Briefcase,
  Database,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronRight,
} from 'lucide-react';
import { EvidenceDrawer } from './EvidenceDrawer';

const navItems = [
  { path: '/home', icon: Home, label: '总览' },
  { path: '/opportunities', icon: Trophy, label: '机会情报' },
  { path: '/recommender', icon: TrendingUp, label: '方向推荐' },
  { path: '/idea-lab', icon: Lightbulb, label: '选题推演' },
  { path: '/doc-studio', icon: FileText, label: '写作生成' },
  { path: '/planner', icon: CalendarDays, label: '计划与任务' },
  { path: '/assets', icon: FolderOpen, label: '成果资产库' },
  { path: '/careers', icon: Briefcase, label: '就业洞察' },
  { path: '/data-hub', icon: Database, label: '数据中心' },
  { path: '/settings', icon: Settings, label: '设置' },
];

export function Layout() {
  const navigate = useNavigate();
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-brand-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">安</span>
              </div>
              <span className="font-semibold text-gray-900">安枢 SecureHub</span>
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={() => navigate('/')}
              className="w-full flex justify-center hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-brand-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">安</span>
              </div>
            </button>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-brand-blue-50 text-brand-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索功能、数据、文档... (Ctrl+K)"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setEvidenceOpen(!evidenceOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Database className="w-4 h-4" />
              <span>证据链</span>
            </button>

            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">用户</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Evidence Drawer */}
      <EvidenceDrawer isOpen={evidenceOpen} onClose={() => setEvidenceOpen(false)} />
    </div>
  );
}