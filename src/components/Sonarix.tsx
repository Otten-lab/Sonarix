import { useState, useEffect, useCallback } from 'react';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    Activity,
    AlertTriangle,
    TrendingUp,
    Download,
    Settings,
    LogOut,
    Calendar,
    Filter,
    RefreshCw,
    Eye,
    FileText,
    Zap,
    Clock,
    Shield,
    Brain,
    X
} from 'lucide-react';

interface Campaign {
    id: number;
    name: string;
    status: string;
    budget: number;
    spent: number;
    clicks: number;
    ctr: number;
    cpc: number;
    conversions: number;
    romi: number;
}

interface Anomaly {
    id: number;
    type: 'critical' | 'warning' | 'info';
    campaign: string;
    metric: string;
    change: string;
    description: string;
    recommendation: string;
}

interface PerformanceData {
    date: string;
    clicks: number;
    conversions: number;
    spent: number;
}

interface DeviceData {
    name: string;
    value: number;
    color: string;
}

interface Report {
    id: number;
    name: string;
    date: string;
    size: string;
    campaigns: number;
}

interface DateRange {
    start: string;
    end: string;
}

interface TabButtonProps {
    tabId: string;
    children: React.ReactNode;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: number;
}

interface AnomalyCardProps {
    anomaly: Anomaly;
}

const Sonarix = () => {
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
    const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
    const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>({start: '2025-01-01', end: '2025-01-31'});
    const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
    const [reportProgress, setReportProgress] = useState<number>(0);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [connectingAccount, setConnectingAccount] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const campaignData: Campaign[] = [
        {
            id: 1,
            name: 'Кампания Москва',
            status: 'active',
            budget: 150000,
            spent: 87340,
            clicks: 12450,
            ctr: 2.8,
            cpc: 7.02,
            conversions: 342,
            romi: 285
        },
        {
            id: 2,
            name: 'Ретаргетинг B2B',
            status: 'active',
            budget: 200000,
            spent: 156200,
            clicks: 8920,
            ctr: 3.2,
            cpc: 17.51,
            conversions: 198,
            romi: 195
        },
        {
            id: 3,
            name: 'Поиск - Услуги',
            status: 'paused',
            budget: 100000,
            spent: 92100,
            clicks: 15680,
            ctr: 1.9,
            cpc: 5.87,
            conversions: 425,
            romi: 320
        },
        {
            id: 4,
            name: 'РСЯ Товары',
            status: 'active',
            budget: 80000,
            spent: 45200,
            clicks: 22100,
            ctr: 0.8,
            cpc: 2.05,
            conversions: 156,
            romi: 142
        }
    ];

    const anomalies: Anomaly[] = [
        {
            id: 1,
            type: 'critical',
            campaign: 'Кампания Москва',
            metric: 'CPC',
            change: '+42%',
            description: 'Резкий рост стоимости клика',
            recommendation: 'Снизьте ставки или приостановите группу объявлений'
        },
        {
            id: 2,
            type: 'warning',
            campaign: 'РСЯ Товары',
            metric: 'CTR',
            change: '-35%',
            description: 'Падение кликабельности',
            recommendation: 'Обновите креативы и тексты объявлений'
        },
        {
            id: 3,
            type: 'info',
            campaign: 'Поиск - Услуги',
            metric: 'ROMI',
            change: '+15%',
            description: 'Улучшение окупаемости',
            recommendation: 'Увеличьте бюджет для масштабирования'
        }
    ];

    const performanceData: PerformanceData[] = [
        {date: '01.01', clicks: 4200, conversions: 120, spent: 28500},
        {date: '05.01', clicks: 5100, conversions: 145, spent: 31200},
        {date: '10.01', clicks: 4800, conversions: 138, spent: 29800},
        {date: '15.01', clicks: 6200, conversions: 178, spent: 38900},
        {date: '20.01', clicks: 5500, conversions: 162, spent: 34200},
        {date: '25.01', clicks: 5900, conversions: 171, spent: 36500},
        {date: '30.01', clicks: 6100, conversions: 185, spent: 38100}
    ];

    const deviceData: DeviceData[] = [
        {name: 'Десктоп', value: 45, color: '#755D9A'},
        {name: 'Мобильные', value: 38, color: '#C0C0C0'},
        {name: 'Планшеты', value: 17, color: '#2F353B'}
    ];

    const reports: Report[] = [
        {id: 1, name: 'Аудит_январь_2025.pdf', date: '30.01.2025', size: '2.4 MB', campaigns: 4},
        {id: 2, name: 'Отчет_аномалии_28012025.pptx', date: '28.01.2025', size: '5.1 MB', campaigns: 3},
        {id: 3, name: 'Сводка_эффективности_Q4_2024.pdf', date: '15.01.2025', size: '3.8 MB', campaigns: 6}
    ];

    useEffect(() => {
        if (isGeneratingReport && reportProgress < 100) {
            const timer = setTimeout(() => {
                setReportProgress(prev => Math.min(prev + 20, 100));
            }, 400);
            return () => clearTimeout(timer);
        } else if (reportProgress === 100 && isGeneratingReport) {
            const timer = setTimeout(() => {
                setIsGeneratingReport(false);
                setReportProgress(0);
                alert('Отчет готов! Файл Sonarix_Report_2025-01.pdf сохранен в папке reports/');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isGeneratingReport, reportProgress]);

    const showError = useCallback((message: string) => {
        setError(message);
        setTimeout(() => setError(null), 3000);
    }, []);

    const handleConnectAccount = async (platform: string) => {
        if (connectedAccounts.includes(platform)) return;

        setConnectingAccount(platform);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (Math.random() > 0.8) {
                throw new Error('Ошибка авторизации. Попробуйте еще раз.');
            }

            setConnectedAccounts(prev => [...prev, platform]);
            setShowConnectModal(false);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
            showError(message);
        } finally {
            setConnectingAccount(null);
        }
    };

    const handleGenerateReport = () => {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);

        if (startDate > endDate) {
            showError('Дата начала не может быть позже даты окончания');
            return;
        }

        if (selectedCampaigns.length === 0) {
            showError('Выберите хотя бы одну кампанию');
            return;
        }

        setIsGeneratingReport(true);
        setReportProgress(0);
    };

    const toggleCampaignSelection = (campaignId: number) => {
        setSelectedCampaigns(prev =>
            prev.includes(campaignId)
                ? prev.filter(id => id !== campaignId)
                : [...prev, campaignId]
        );
    };

    const handleDateChange = (field: keyof DateRange, value: string) => {
        setDateRange(prev => ({ ...prev, [field]: value }));
    };

    const TabButton: React.FC<TabButtonProps> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tabId
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            {children}
        </button>
    );

    const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend !== undefined && (
                        <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </p>
                    )}
                </div>
                <Icon className="h-8 w-8 text-purple-600" />
            </div>
        </div>
    );

    const AnomalyCard: React.FC<AnomalyCardProps> = ({ anomaly }) => {
        const bgColor = {
            critical: 'bg-red-50 border-red-500',
            warning: 'bg-yellow-50 border-yellow-500',
            info: 'bg-blue-50 border-blue-500'
        }[anomaly.type];

        const iconColor = {
            critical: 'text-red-600',
            warning: 'text-yellow-600',
            info: 'text-blue-600'
        }[anomaly.type];

        return (
            <div className={`p-4 rounded-lg border-l-4 ${bgColor}`}>
                <div className="flex items-start">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 mr-3 ${iconColor}`} />
                    <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                            <h3 className="font-medium text-gray-900">{anomaly.campaign}</h3>
                            <span className="px-2 py-1 text-xs rounded-full bg-white">
                                {anomaly.metric} {anomaly.change}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{anomaly.description}</p>
                        <p className="text-sm text-purple-600 mt-2">
                            <strong>Рекомендация:</strong> {anomaly.recommendation}
                        </p>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {error && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                    {error}
                </div>
            )}

            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <Zap className="h-8 w-8 text-purple-600" />
                                <span className="ml-2 text-2xl font-bold text-gray-900">Sonarix</span>
                            </div>
                            <nav className="ml-10 flex space-x-8">
                                <TabButton tabId="dashboard">Дашборд</TabButton>
                                <TabButton tabId="audit">Аудит кампаний</TabButton>
                                <TabButton tabId="reports">Отчеты</TabButton>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Settings className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Подключенные аккаунты</h2>
                                <button
                                    onClick={() => setShowConnectModal(true)}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Подключить аккаунт
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {['Яндекс.Директ', 'Яндекс.Метрика'].map((platform) => (
                                    <div
                                        key={platform}
                                        className={`p-4 rounded-lg border-2 transition-colors ${
                                            connectedAccounts.includes(platform)
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{platform}</span>
                                            {connectedAccounts.includes(platform) ? (
                                                <div className="flex items-center text-green-600">
                                                    <Shield className="h-4 w-4 mr-1" />
                                                    <span className="text-sm">Подключен</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">Не подключен</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard title="Активные кампании" value="3" icon={Activity} trend={12} />
                            <MetricCard title="Общий расход" value="340,840 ₽" icon={TrendingUp} trend={-5} />
                            <MetricCard title="Конверсии" value="1,121" icon={Eye} trend={18} />
                            <MetricCard title="Средний ROMI" value="235%" icon={Brain} />
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Обнаруженные аномалии</h2>
                                <span className="text-sm text-gray-500">Последнее обновление: 5 минут назад</span>
                            </div>
                            <div className="space-y-3">
                                {anomalies.map((anomaly) => (
                                    <AnomalyCard key={anomaly.id} anomaly={anomaly} />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Динамика показателей</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="date" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="clicks"
                                            stroke="#755D9A"
                                            name="Клики"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="conversions"
                                            stroke="#C0C0C0"
                                            name="Конверсии"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Распределение по устройствам</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={deviceData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {deviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Настройка аудита кампаний</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Период анализа</label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                        <input
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => handleDateChange('start', e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <span className="text-gray-500">—</span>
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => handleDateChange('end', e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Выберите кампании для аудита</label>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center text-sm text-purple-600 hover:text-purple-700"
                                    >
                                        <Filter className="h-4 w-4 mr-1" />
                                        Фильтры
                                    </button>
                                </div>

                                {showFilters && (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Регион</label>
                                                <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                    <option>Все регионы</option>
                                                    <option>Москва</option>
                                                    <option>Санкт-Петербург</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Устройство</label>
                                                <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                    <option>Все устройства</option>
                                                    <option>Десктоп</option>
                                                    <option>Мобильные</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Пол</label>
                                                <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                    <option>Все</option>
                                                    <option>Мужчины</option>
                                                    <option>Женщины</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {campaignData.map((campaign) => (
                                        <div
                                            key={campaign.id}
                                            onClick={() => toggleCampaignSelection(campaign.id)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                selectedCampaigns.includes(campaign.id)
                                                    ? 'border-purple-600 bg-purple-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCampaigns.includes(campaign.id)}
                                                        onChange={() => toggleCampaignSelection(campaign.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="mr-3 h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                                                    />
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                                                        <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                                                            <span>CTR: {campaign.ctr}%</span>
                                                            <span>CPC: {campaign.cpc} ₽</span>
                                                            <span>ROMI: {campaign.romi}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Расход</p>
                                                    <p className="font-medium">{campaign.spent.toLocaleString()} ₽</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Выбрано кампаний: {selectedCampaigns.length}
                                </div>
                                <button
                                    onClick={handleGenerateReport}
                                    disabled={selectedCampaigns.length === 0 || isGeneratingReport}
                                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                                        selectedCampaigns.length === 0 || isGeneratingReport
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                                >
                                    {isGeneratingReport ? (
                                        <>
                                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                                            Генерация отчета... {reportProgress}%
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-5 w-5 mr-2" />
                                            Запустить аудит
                                        </>
                                    )}
                                </button>
                            </div>

                            {isGeneratingReport && (
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${reportProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-3">
                                    <Clock className="h-8 w-8 text-purple-600 mr-3" />
                                    <h3 className="font-semibold text-gray-900">Быстрая генерация</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Полный отчет готов всего за 1-2 минуты благодаря AI-обработке данных
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-3">
                                    <Brain className="h-8 w-8 text-purple-600 mr-3" />
                                    <h3 className="font-semibold text-gray-900">ML-рекомендации</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Модель обучается на ваших данных и дает персонализированные советы
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-3">
                                    <Shield className="h-8 w-8 text-purple-600 mr-3" />
                                    <h3 className="font-semibold text-gray-900">Безопасность данных</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Все данные шифруются и хранятся в защищенном облачном хранилище
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">История отчетов</h2>
                            <div className="space-y-3">
                                {reports.map((report) => (
                                    <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center">
                                            <FileText className="h-8 w-8 text-gray-400 mr-3" />
                                            <div>
                                                <h3 className="font-medium text-gray-900">{report.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {report.date} • {report.size} • {report.campaigns} кампаний
                                                </p>
                                            </div>
                                        </div>
                                        <button className="flex items-center px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                                            <Download className="h-4 w-4 mr-2" />
                                            Скачать
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {showConnectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-[90vw]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Подключить аккаунт</h3>
                            <button
                                onClick={() => setShowConnectModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {['Яндекс.Директ', 'Яндекс.Метрика'].map((platform) => (
                                <button
                                    key={platform}
                                    onClick={() => handleConnectAccount(platform)}
                                    disabled={connectedAccounts.includes(platform) || connectingAccount === platform}
                                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                                        connectedAccounts.includes(platform)
                                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : connectingAccount === platform
                                                ? 'border-purple-400 bg-purple-50 text-purple-600'
                                                : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                                    }`}
                                >
                                    {connectedAccounts.includes(platform) ? (
                                        'Уже подключен'
                                    ) : connectingAccount === platform ? (
                                        <span className="flex items-center justify-center">
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Подключение...
                                        </span>
                                    ) : (
                                        `Подключить ${platform}`
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sonarix;