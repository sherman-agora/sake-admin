import React from 'react';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('Jan', 0),
  createData('Feb', 300),
  createData('Mar', 600),
  createData('Apr', 800),
  createData('May', 1500),
  createData('Jun', 2000),
  createData('Jul', 2400),
  createData('Aug', 2400),
  createData('Sep', undefined),
  createData('Oct', undefined),
  createData('Nov', undefined),
  createData('Dec', undefined),
];

export default function Chart() {
  return (
    <React.Fragment>
      <Title>2019</Title>
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
