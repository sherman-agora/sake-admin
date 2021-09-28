import React from 'react';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('2018 Q1', 0),
  createData('Q2', 300),
  createData('Q3', 600),
  createData('Q4', 800),
  createData('2019 Q1', 1500),
  createData('Q2', 2000),
  createData('Q3', 2400),
];

export default function Chart() {
  return (
    <React.Fragment>
      <Title>October, 2019</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" />
          <YAxis>
            <Label angle={270} position="left" style={{ textAnchor: 'middle' }}>
              Sales ($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke="#556CD6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
