
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import Header from "../../components/Header";
import { useUserStore } from "../../stores/userStore";

const metrics = [
    { label: "Total Creatives", value: "24", delta: "+12%", icon: "bi-collection" },
    { label: "Active Now", value: "8", delta: "+3", icon: "bi-activity" },
    { label: "Total Sends", value: "156K", delta: "+28%", icon: "bi-send" },
    { label: "Avg. Open Rate", value: "42%", delta: "+5%", icon: "bi-envelope-open" },
];

const creatives = [
    {
        name: "Summer Sale Creative 2026",
        status: "generated",
        owner: "Sarah Johnson",
        date: "09/02/2026",
        images: 12,
        sends: "5,000",
        opens: "49%",
        clicks: "17%",
    },
    {
        name: "Product Launch Announcement",
        status: "approved",
        owner: "Michael Chen",
        date: "08/02/2026",
        images: 8,
        sends: "6,500",
        opens: "49%",
        clicks: "18%",
    },
    {
        name: "Customer Engagement Series",
        status: "draft",
        owner: "Emily Davis",
        date: "07/02/2026",
        images: 16,
        sends: "8,200",
        opens: "50%",
        clicks: "20%",
    },
];

const recentFiles = [
    { name: "Summer Sale Creative 2026", date: "09/02/2026" },
    { name: "Product Launch Announcement", date: "08/02/2026" },
    { name: "Customer Engagement Series", date: "07/02/2026" },
];

export default function Dashboard() {
    const weeklyChartRef = useRef(null);
    const statusChartRef = useRef(null);
    const engagementChartRef = useRef(null);
    const userDetails = useUserStore((state) => state.userDetails);

    useEffect(() => {
        const weeklyChart = echarts.init(weeklyChartRef.current);
        const statusChart = echarts.init(statusChartRef.current);
        const engagementChart = echarts.init(engagementChartRef.current);

        weeklyChart.setOption({
            grid: { left: 10, right: 10, top: 10, bottom: 24, containLabel: true },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                axisLine: { lineStyle: { color: "#e0e0e0" } },
                axisTick: { show: false },
                axisLabel: { color: "#8a8a8a", fontSize: 11 },
            },
            yAxis: {
                type: "value",
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: "#f0f0f0" } },
                axisLabel: { color: "#8a8a8a", fontSize: 11 },
            },
            series: [
                {
                    name: "Opens",
                    type: "line",
                    smooth: true,
                    data: [40, 36, 42, 48, 44, 38, 35],
                    lineStyle: { color: "#6b2bd9", width: 3 },
                    areaStyle: { color: "rgba(107, 43, 217, 0.15)" },
                    symbol: "none",
                },
                {
                    name: "Clicks",
                    type: "line",
                    smooth: true,
                    data: [28, 30, 34, 32, 30, 26, 24],
                    lineStyle: { color: "#2f6bff", width: 2 },
                    areaStyle: { color: "rgba(47, 107, 255, 0.12)" },
                    symbol: "none",
                },
            ],
            tooltip: { trigger: "axis" },
        });

        statusChart.setOption({
            tooltip: { trigger: "item" },
            legend: {
                bottom: 0,
                textStyle: { color: "#6e6e6e", fontSize: 11 },
                itemWidth: 10,
                itemHeight: 10,
            },
            series: [
                {
                    type: "pie",
                    radius: ["55%", "75%"],
                    center: ["50%", "45%"],
                    label: { show: false },
                    data: [
                        { value: 12, name: "Sent", itemStyle: { color: "#00c27a" } },
                        { value: 5, name: "Approved", itemStyle: { color: "#b04bff" } },
                        { value: 4, name: "Generated", itemStyle: { color: "#2f6bff" } },
                        { value: 3, name: "Draft", itemStyle: { color: "#c1c1c1" } },
                    ],
                },
            ],
        });

        engagementChart.setOption({
            grid: { left: 10, right: 10, top: 10, bottom: 24, containLabel: true },
            xAxis: {
                type: "category",
                data: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
                axisLine: { lineStyle: { color: "#e0e0e0" } },
                axisTick: { show: false },
                axisLabel: { color: "#8a8a8a", fontSize: 11 },
            },
            yAxis: {
                type: "value",
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: "#f0f0f0" } },
                axisLabel: { color: "#8a8a8a", fontSize: 11 },
            },
            series: [
                {
                    type: "bar",
                    data: [28, 34, 38, 36, 40, 46],
                    barWidth: 40,
                    itemStyle: {
                        borderRadius: [10, 10, 10, 10],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "#C9200D" },
                            { offset: 1, color: "#494949" },
                        ]),
                    },
                },
            ],
            tooltip: { trigger: "axis" },
        });

        const handleResize = () => {
            weeklyChart.resize();
            statusChart.resize();
            engagementChart.resize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            weeklyChart.dispose();
            statusChart.dispose();
            engagementChart.dispose();
        };
    }, []);

    return (
        <div>
            <Header />
            <div className="dashboard-page">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="fs-4 fw-bold mb-1 text-body">Welcome back, {userDetails.name || userDetails.userName || "User"}✨</h1>
                        <p className="text-secondary mb-0">
                            Here’s what’s happening with your creatives today.
                        </p>
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    {metrics.map((item) => (
                        <div className="col-12 col-sm-6 col-lg-3" key={item.label}>
                            <div className="card shadow-sm h-100 border-0">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary" style={{ width: 34, height: 34 }}>
                                            <i className={`bi ${item.icon}`}></i>
                                        </span>
                                        <span className="badge text-bg-success">{item.delta}</span>
                                    </div>
                                    <p className="text-secondary small mt-3 mb-1">{item.label}</p>
                                    <p className="fs-5 fw-bold mb-0">{item.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-3 dashboard-panels">
                    <div className="col-12 col-lg-5">
                        <div className="card shadow-sm h-100 border-0">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                    <div>
                                        <h3 className="h6 fw-bold mb-1 text-body">Weekly Performance</h3>
                                        <p className="text-secondary small mb-0">Opens & Clicks trend</p>
                                    </div>
                                    <span className="badge text-bg-primary-subtle text-primary">+10.5%</span>
                                </div>
                                <div className="echart-container mt-2" ref={weeklyChartRef}></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-3">
                        <div className="card shadow-sm h-100 border-0">
                            <div className="card-body">
                                <div>
                                    <h3 className="h6 fw-bold mb-1 text-body">Creative Status</h3>
                                    <p className="text-secondary small mb-0">Distribution by stage</p>
                                </div>
                                <div className="echart-container echart-donut mt-2" ref={statusChartRef}></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="card shadow-sm h-100 border-0">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                    <div>
                                        <h3 className="h6 fw-bold mb-1 text-body">Engagement Rate</h3>
                                        <p className="text-secondary small mb-0">6-month growth</p>
                                    </div>
                                    <span className="badge text-bg-primary-subtle text-primary">+10.5%</span>
                                </div>
                                <div className="echart-container mt-2" ref={engagementChartRef}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row dashboard-bottom my-3">
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                    <div>
                                        <h3 className="h6 fw-bold mb-1 text-body">Email Creative</h3>
                                        <p className="text-secondary small mb-0">Manage and track your creatives</p>
                                    </div>
                                    <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-funnel"></i> Filter</button>
                                </div>

                                <div className="d-flex flex-column mt-3">
                                    {creatives.map((creative) => (
                                        <div className="border rounded-3 bg-body-tertiary p-2 mb-3" key={creative.name}>
                                            <div className="d-flex align-items-start gap-1">
                                                <div className="rounded-3 bg-secondary bg-opacity-25" style={{ width: 46, height: 46 }}></div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex flex-wrap align-items-center gap-2">
                                                        <strong className="fw-bold text-body">{creative.name}</strong>
                                                        <span className={`badge text-bg-${creative.status === "approved" ? "success" : creative.status === "generated" ? "primary" : "secondary"}`}>
                                                            {creative.status}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex flex-wrap text-secondary small">
                                                        <span className="me-1"><i className="bi bi-person me-1"></i>{creative.owner}</span>
                                                        <span className="me-1"><i className="bi bi-calendar3 me-1"></i>{creative.date}</span>
                                                        <span className="me-1"><i className="bi bi-image me-1"></i>{creative.images} images</span>
                                                    </div>
                                                </div>
                                                <button className="btn btn-light ms-auto">
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </button>
                                            </div>
                                            <div className="row text-secondary small mt-3">
                                                <div className="col-4">
                                                    <div className="fw-semibold text-body">{creative.sends}</div>
                                                    <div>Sends</div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="fw-semibold text-body">{creative.opens}</div>
                                                    <div>Opens</div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="fw-semibold text-body">{creative.clicks}</div>
                                                    <div>Clicks</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="card shadow-sm h-100 border-0">
                            <div className="card-body">
                                <div>
                                    <h3 className="h6 fw-bold mb-1 text-body">Recent Assets</h3>
                                    <p className="text-secondary small mb-2">Click a creative to view its assets</p>
                                </div>
                                <div className="empty-assets">
                                    <i className="bi bi-folder2-open"></i>
                                    <p>No creative selected</p>
                                </div>
                                <div className="recent-files">
                                    <h4>Recent Files</h4>
                                    {recentFiles.map((file) => (
                                        <div className="file-row" key={file.name}>
                                            <i className="bi bi-file-earmark-text"></i>
                                            <div>
                                                <strong>{file.name}</strong>
                                                <span>{file.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
