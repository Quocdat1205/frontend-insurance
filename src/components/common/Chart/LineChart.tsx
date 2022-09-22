import React, { useEffect, useMemo, useRef, useState } from 'react'
import { API_GET_PRICE_CHART } from 'services/apis'
import fetchApi from 'services/fetch-api'
import colors from 'styles/colors'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler, ChartArea } from 'chart.js'
ChartJS.register(Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler)

interface LineChart {
    symbol: string
    negative: boolean
}

const LineChart = ({ symbol, negative }: LineChart) => {
    const chart = useRef<any>(null)
    const [dataSource, setDataSource] = useState<{ time: any[]; price: any[] }>({
        time: [],
        price: [],
    })

    const getData = async () => {
        const ts = Math.round(new Date().getTime() / 1000)
        const tsYesterday = ts - 24 * 3600
        const params = {
            broker: 'NAMI_SPOT',
            symbol: symbol,
            from: tsYesterday,
            to: ts,
            resolution: '1h',
        }
        const data = await fetchApi({ url: API_GET_PRICE_CHART, baseURL: '', params: params })
        if (data && Array.isArray(data)) {
            setDataSource({
                time: data?.map((rs: any) => rs[0]),
                price: data?.map((rs: any) => rs[1]),
            })
        }
    }
    useEffect(() => {
        getData()
    }, [])

    const createGradient = (ctx: CanvasRenderingContext2D, area: ChartArea) => {
        const colorStart = negative ? '#eb2b3e12' : '#52cc7412'
        const colorEnd = negative ? '#eb2b3e00' : '#52cc7400'
        const gradient = ctx?.createLinearGradient(0, area.top, 0, area.bottom)
        gradient?.addColorStop(0, colorStart)
        gradient?.addColorStop(1, colorEnd)

        return gradient
    }

    const data = useMemo(() => {
        return {
            labels: dataSource.time,
            datasets: [
                {
                    data: dataSource.price,
                    backgroundColor: createGradient(chart.current?.ctx, chart.current?.chartArea),
                    borderColor: negative ? colors.red.red : colors.success,
                    borderWidth: 1,
                    tension: 0.4,
                    fill: true,
                },
            ],
        }
    }, [dataSource])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        },
        scales: {
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawBorder: false,
                    display: false,
                },
            },
            y: {
                ticks: {
                    display: false,
                    beginAtZero: true,
                },
                grid: {
                    drawBorder: false,
                    display: false,
                },
            },
        },
    }
    return <Line height={100} ref={chart} data={data} options={options} />
}

export default LineChart
