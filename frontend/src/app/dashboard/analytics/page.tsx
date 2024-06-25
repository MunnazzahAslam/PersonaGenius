'use client';
import React, { useEffect, useState } from 'react';
import { Grid, Typography, MenuItem, Select } from '@mui/material';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAnalytics } from '@/lib/api/results/service';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import { Doughnut, Line, Bar, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Dashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('Total');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await generateAnalytics();
        setData(fetchedData);
        console.log(fetchedData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: any) => {
    setSelectedMetric(event.target.value as string);
  };

  const getMetricValue = (item: any) => {
    if (!item) return null;
    if (selectedMetric === 'Total') {
      return item.value;
    } else {
      return item.cluster_values[selectedMetric] ?? null;
    }
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

  return (
    <Grid container spacing={2}>
      {rows && (
        <div className="w-full flex items-center justify-between my-4">
          <Typography variant="h3" sx={{ fontWeight: 'bold', ml: 1 }}>
            {title}
          </Typography>
          <Select value={selectedMetric} onChange={handleChange}>
            <MenuItem value={'Total'}>Total</MenuItem>
            {rows && rows[0].items && Object.keys(rows[0].items[0].cluster_values).map((cluster) => (
              <MenuItem key={cluster} value={cluster}>{`Cluster ${parseInt(cluster) + 1}`}</MenuItem>
            ))}
          </Select>
        </div>
      )}

      {rows && rows.map((row: any, index: number) => (
        <Grid item xs={12} key={index}>
          {row.row_type === 'cards' ? (
            <Grid container spacing={2}>
              {row.items && row.items.map((item: any, itemIndex: number) => (
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
              {row.charts && row.charts.map((chart: any, chartIndex: number) => (
                <Grid item xs={6} key={chartIndex}>
                  <Card className="my-0">
                    <CardHeader>
                      <CardTitle>{chart.title}</CardTitle>
                    </CardHeader>
                    <CardContent style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {chart.type === 'pie' && (
                        <Doughnut data={chart.data} />
                      )}
                      {chart.type === 'line' && (
                        <Line data={chart.data} />
                      )}
                      {chart.type === 'bar' && (
                        <Bar data={chart.data} />
                      )}
                      {chart.type === 'scatter' && (
                        <Scatter data={chart.data} />
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
