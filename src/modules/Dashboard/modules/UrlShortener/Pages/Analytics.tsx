import React, { useEffect, useState } from "react";
import styles from "./Analytics.module.css";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import Day from "../assets/SVGs/Day";
import Night from "../assets/SVGs/Night";
import DayAndNight from "../assets/SVGs/DayAndNight";
import { Chart } from "react-google-charts";
import { useParams } from "react-router-dom";
import { getAnalytics } from "../Services/apis";

export const options = {
    title: "Weekly Analytics",
    curveType: "function",
    legend: { position: "bottom" }
};
const response1 = {
    total_clicks: 500,
    created_on: "2023-12-03",
    browsers: {
        Instagram: 24,
        Firefox: 1,
        "Chrome Mobile": 7,
        FacebookBot: 2,
        "Mobile Safari UI/WKWebView": 4,
        Chrome: 14,
        Facebook: 1
    },
    platforms: {
        Android: 32,
        Windows: 13,
        Other: 2,
        iOS: 4,
        "Mac OS X": 2
    },
    devices: {
        Mobile: 36,
        PC: 17
    },
    sources: {
        "https://l.instagram.com/": 37,
        "https://x.com/": 15,
        "https://mulearn.org/": 1
    },
    countries: {
        USA: 20,
        Canada: 15,
        UK: 8,
        India: 5
    },
    dimensions: {
        "360x640": 10,
        "1366x768": 5,
        "1920x1080": 2
    },
    time_based_data: {
        all_time: [
            ["time", "clicks"],
            ["2023-12-03T18:43:27.654Z", 100],
            ["2023-12-03T19:15:45.123Z", 350],
            ["2023-12-03T20:30:12.789Z", 200],
            ["2023-12-03T21:05:59.321Z", 250],
            ["2023-12-03T22:12:34.567Z", 100],
            ["2023-12-03T23:45:12.345Z", 150],
            ["2023-12-04T00:00:00.000Z", 200],
            ["2023-12-04T01:45:12.345Z", 250],
            ["2023-12-05T02:43:27.654Z", 300],
            ["2023-12-05T03:43:27.654Z", 350],
            ["2023-12-06T04:45:12.345Z", 400],
            ["2023-12-07T05:00:00.000Z", 450],
            ["2023-12-07T06:45:12.345Z", 100],
            ["2023-12-08T07:00:00.000Z", 250],
            ["2023-12-08T08:43:27.654Z", 400],
            ["2023-12-09T09:45:12.345Z", 350],
            ["2023-12-09T10:00:00.000Z", 300],
            ["2023-12-10T11:45:12.345Z", 250],
            ["2023-12-10T12:00:00.000Z", 200],
            ["2023-12-11T13:00:00.000Z", 150],
            ["2023-12-11T14:45:12.345Z", 100],
            ["2023-12-18T15:00:00.000Z", 50]
        ]
    }
};

// Function to get the date of the last occurrence of a specific day of the week
// const dayOfWeek = 1; // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

type Response = {
    total_clicks: number;
    created_on: string;
    browsers: {
        [key: string]: number;
    };
    platforms: {
        [key: string]: number;
    };
    devices: {
        [key: string]: number;
    };
    sources: {
        [key: string]: number;
    };
    countries: {
        [key: string]: number;
    };
    dimensions: {
        [key: string]: number;
    };
    time_based_data: {
        all_time: Array<[string, number]>;
    };
};

type Props = {};
const Analytics = (props: Props) => {
    // get id from query of url
    const { id } = useParams<{ id: string }>();
    // console.log(id);

    const [response, setResponse] = useState({
        total_clicks: 0,
        created_on: "",
        browsers: {},
        platforms: {},
        devices: {},
        sources: {},
        countries: {},
        dimensions: {},
        time_based_data: {
            all_time: []
        }
    } as Response);
    const [visits, setVisits] = useState<number>(response.total_clicks);
    const [month, setMonth] = useState<number>(0);
    function getLastDayOfWeek(dayOfWeek: number) {
        const today = new Date();
        const diff = today.getDay() - dayOfWeek;
        const lastDay = new Date(today);
        lastDay.setDate(today.getDate() - diff);
        return lastDay.toISOString().split("T")[0];
    }

    // Example: Get last Monday's date
    const lastMonday = getLastDayOfWeek(month); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

    // Filter data for last Monday
    const lastMondayData = (
        response.time_based_data.all_time as Array<[string, number]>
    ).filter(entry => (entry[0] as string).startsWith(lastMonday));

    // Convert to the desired format with 12-hour time
    const convertedData = [
        ["time", "clicks"],
        ...lastMondayData.map(entry => [
            new Date(entry[0] as string).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }),
            entry[1]
        ])
    ];
    const devicesCount = Object.keys(response.devices).length;
    const platformsCount = Object.keys(response.platforms).length;
    const browsersCount = Object.keys(response.browsers).length;

    const totalCategories = platformsCount + devicesCount + browsersCount;
    useEffect(() => {
        if (id) {
            // get analytics for the link with id
            getAnalytics(id)
                .then((res: any) => {
                    console.log(res);
                    setResponse(res);
                    setVisits(res.total_clicks);
                })
                .catch((err: any) => console.log(err));
        }
    });

    useEffect(() => {
        const bar = document.getElementById("progress-bar");
        if (bar) {
            const perc = visits;
            const rotateDegree = 45 + perc * 1.8;
            bar.style.transition = "transform 3s ease";
            bar.style.transform = `rotate(${rotateDegree}deg)`;
        }
    }, [visits]);
    const buttonMap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // console.log(response1.time_based_data.all_time[1][1]);
    return (
        <>
            <div className={styles.analytics_header}>
                <div className={styles.link_basics}>
                    <h1>Analytics</h1>
                    <p>Link title</p>
                    <p className={styles.date}>
                        Created on{" "}
                        {new Date(response.created_on).toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            }
                        )}
                    </p>

                    <select name="" id="">
                        <option value="">All Time</option>
                        <option value="">Yesterday</option>
                        <option value="">This week</option>
                        <option value="">This Month</option>
                        <option value="">This Year</option>
                    </select>
                </div>
                <div className={styles.link_copy}>
                    <a href="/">https://mulearn.r/shortenlink</a>
                    <a href="/">https://mulearn.org/longlonglonglongl...</a>
                </div>
            </div>

            <div className={styles.main_section_analytics}>
                <div className={styles.clicks_visits}>
                    <div className={styles.clicks}>
                        <h1>
                            Total clicks <span>+2.3%</span>
                        </h1>
                        <p>{response.total_clicks}</p>
                        <div className={styles.graph}>
                            <div className={styles.v_lines}>
                                <i className={styles.v_line}></i>
                                <i className={styles.v_line}></i>
                                <i className={styles.v_line}></i>
                                <i className={styles.v_line}></i>
                                <i className={styles.v_line}></i>
                                <i className={styles.v_line}></i>
                                <i className={styles.v_line}></i>
                                <i className={styles.v_line}></i>
                                <i className={styles.v_line}></i>
                            </div>
                            <div className={styles.h_lines}>
                                <i className={styles.h_line}></i>
                                <i className={styles.h_line}></i>
                                <i className={styles.h_line}></i>
                                <i className={styles.h_line}></i>
                            </div>
                            <div className={styles.bars}>
                                {Object.keys(
                                    response1.time_based_data.all_time
                                ).map((key: any, i: number) => {
                                    const data: any =
                                        response1.time_based_data.all_time[
                                            key as any
                                        ];
                                    console.log(data[0], data[1]);

                                    return (
                                        <i
                                            key={i}
                                            style={{
                                                height: `${data[1] / 5}%`,
                                                width: "30px",
                                                background: `rgb(108 123 255 / ${
                                                    data[1] / 5
                                                }%)`
                                            }}
                                            className={styles.bar}
                                        ></i>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={styles.visits}>
                        <div className={styles.progress}>
                            <div className={styles.barOverflow}>
                                <div
                                    id="progress-bar"
                                    className={styles.bar}
                                ></div>
                            </div>
                            <p>{visits}</p>
                            <p>Visits</p>
                        </div>
                    </div>
                </div>

                <div className={styles.sources_weeks}>
                    <div className={styles.sources}>
                        <Sources
                            title="Devices"
                            sourceCount={devicesCount}
                            totalCategories={totalCategories}
                            response={response}
                        />
                        <Sources
                            title="Platforms"
                            sourceCount={platformsCount}
                            totalCategories={totalCategories}
                            response={response}
                        />
                        <Sources
                            title="Browsers"
                            sourceCount={browsersCount}
                            totalCategories={totalCategories}
                            response={response}
                        />
                    </div>

                    <div className={styles.week_analytics}>
                        <div className={styles.header}>
                            <Day />
                            <Night />
                            <DayAndNight />
                        </div>
                        <div className={styles.graph}>
                            <Chart
                                chartType="LineChart"
                                // width="100%"
                                height="250px"
                                data={convertedData}
                                options={options}
                            />
                        </div>
                        <div className={styles.footer}>
                            {buttonMap.map((button, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMonth(index)}
                                    className={
                                        month === index ? styles.active : ""
                                    }
                                >
                                    {button}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.sources_countries}>
                    <div className={styles.sources}>
                        <h1>Sources</h1>
                        <div className={styles.source_list}>
                            <div className={styles.rowsH}>
                                <p className={styles.sourceH}>Source</p>
                                <p className={styles.visitsH}>Visits</p>
                            </div>
                            {Object.keys(response.sources).map(key => (
                                <div className={styles.rows} key={key}>
                                    <p className={styles.source}>
                                        {new URL(key).hostname
                                            .split(".")
                                            .slice(-2)
                                            .join(".")}
                                    </p>
                                    <p className={styles.visits}>
                                        {
                                            response.sources[
                                                key as keyof typeof response.sources
                                            ]
                                        }
                                        <span>
                                            {(
                                                (response.sources[
                                                    key as keyof typeof response.sources
                                                ] /
                                                    response.total_clicks) *
                                                100
                                            ).toPrecision(2)}
                                            %
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.countries}>
                        <h1>Countries</h1>
                        <div className={styles.source_list}>
                            <div className={styles.rowsH}>
                                <p className={styles.sourceH}>Country</p>
                                <p className={styles.visitsH}>Visits</p>
                            </div>
                            {Object.keys(response.countries).map(key => (
                                <div className={styles.rows} key={key}>
                                    <p className={styles.source}>{key}</p>
                                    <p className={styles.visits}>
                                        {
                                            response.countries[
                                                key as keyof typeof response.countries
                                            ]
                                        }
                                        <span>
                                            {(
                                                (response.countries[
                                                    key as keyof typeof response.countries
                                                ] /
                                                    response.total_clicks) *
                                                100
                                            ).toPrecision(2)}
                                            %
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.screen_size}>
                    <div className={styles.sources}>
                        <h1>Screens</h1>
                        <div className={styles.source_list}>
                            <div className={styles.rowsH}>
                                <p className={styles.sourceH}>Dimensions</p>
                                <p className={styles.visitsH}>Visits</p>
                            </div>
                            {Object.keys(response.dimensions).map(key => (
                                <div className={styles.rows} key={key}>
                                    <p className={styles.source}>{key}</p>
                                    <p className={styles.visits}>
                                        {
                                            response.dimensions[
                                                key as keyof typeof response.dimensions
                                            ]
                                        }
                                        <span>
                                            {(
                                                (response.dimensions[
                                                    key as keyof typeof response.dimensions
                                                ] /
                                                    response.total_clicks) *
                                                100
                                            ).toPrecision(2)}
                                            %
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;

type Props2 = {
    title: string;
    sourceCount: number;
    totalCategories: number;
    response: any;
};
const Sources = ({ title, sourceCount, totalCategories, response }: Props2) => {
    return (
        <div className={styles.source_box}>
            <h1>{title}</h1>
            <div className={styles.circle_progress_bar}>
                <CircularProgress
                    value={
                        parseInt(
                            ((sourceCount / totalCategories) * 100).toPrecision(
                                2
                            )
                        ) + 50
                    }
                    color="#6C7BFF"
                    capIsRound
                >
                    <CircularProgressLabel>
                        {(
                            (sourceCount / totalCategories) * 100 +
                            50
                        ).toPrecision(3)}
                    </CircularProgressLabel>
                </CircularProgress>
            </div>
            <div className={styles.source_list}>
                {Object.keys(
                    response[title.toLowerCase() as keyof typeof response]
                ).map(key => (
                    <p className={styles.source} key={key}>
                        {key}
                    </p>
                ))}
            </div>
        </div>
    );
};
