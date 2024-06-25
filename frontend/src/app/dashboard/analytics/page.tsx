'use client';
import React, { useEffect, useState } from 'react';
import { Grid, Typography, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAnalytics } from '@/lib/api/results/service';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import { Doughnut, Line, Bar, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { CardItem, ChartItem, Metric, Row } from '@/lib/constants';
import { useTheme } from 'next-themes';

Chart.register(...registerables);

const Dashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('Total');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const { theme } = useTheme();
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await generateAnalytics();
      setData(fetchedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const isDarkMode = theme === 'dark';
    const commonChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: isDarkMode ? 'white' : 'black'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: isDarkMode ? 'white' : 'black'
          },
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          ticks: {
            color: isDarkMode ? 'white' : 'black'
          },
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    };
    setChartOptions(commonChartOptions);
  }, [theme]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedMetric(event.target.value as string);
  };

  const getMetricValue = (item: Metric) => {
    if (!item) return null;
    if (selectedMetric === 'Total') {
      return item.value;
    } else {
      return item.cluster_values[selectedMetric] ?? null;
    }
  };

  const getChartData = (chart: ChartItem) => {
    const dataset = chart.data.datasets[0];
    const newDataset = {
      ...dataset,
      data: selectedMetric === 'Total' ? dataset.data : dataset.cluster_values[selectedMetric] ?? []
    };

    return {
      labels: chart.data.labels,
      datasets: [newDataset]
    };
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <LoadingSkeleton message="Generating Analytics" />
      </div>
    );
  }

  const rows = data?.rows || data?.response?.rows;
  const title = data?.dashboard_title || data?.response?.dashboard_title;

  const selectStyles = {
    color: theme === 'dark' ? 'white' : 'black',
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: theme === 'dark' ? 'white' : 'grey',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme === 'dark' ? 'white' : 'black',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme === 'dark' ? 'white' : 'black',
    },
    '.MuiSvgIcon-root': {
      color: theme === 'dark' ? 'white' : 'black',
    },
  };

  return (
    <Grid container spacing={2}>
      {rows && (
        <div className="w-full flex items-center justify-between my-4">
          <Typography variant="h3" sx={{ fontWeight: 'bold', ml: 1 }}>
            {title}
          </Typography>
          <Select
            value={selectedMetric}
            onChange={handleChange}
            sx={selectStyles}
          >
            <MenuItem value={'Total'}>Total</MenuItem>
            {rows && rows[0].items && Object.keys(rows[0].items[0].cluster_values).map((cluster) => (
              <MenuItem key={cluster} value={cluster}>{`Cluster ${parseInt(cluster) + 1}`}</MenuItem>
            ))}
          </Select>
        </div>
      )}

      {rows && rows.map((row: Row, index: number) => (
        <Grid item xs={12} key={index}>
          {row.row_type === 'cards' ? (
            <Grid container spacing={2}>
              {row.items && row.items.map((item: CardItem, itemIndex: number) => (
                <Grid item xs={4} key={itemIndex}>
                  <Card className="my-0">
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Typography variant="h4">{getMetricValue(item)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {row.charts && row.charts.map((chart: ChartItem, chartIndex: number) => (
                <Grid item xs={6} key={chartIndex}>
                  <Card className="my-0">
                    <CardHeader>
                      <CardTitle>{chart.title}</CardTitle>
                    </CardHeader>
                    <CardContent style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {chart.type === 'pie' && (
                        <Doughnut data={getChartData(chart)} options={chartOptions} />
                      )}
                      {chart.type === 'line' && (
                        <Line data={getChartData(chart)} options={chartOptions} />
                      )}
                      {chart.type === 'bar' && (
                        <Bar data={getChartData(chart)} options={chartOptions} />
                      )}
                      {chart.type === 'scatter' && (
                        <Scatter data={chart.data} options={chartOptions} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard;
