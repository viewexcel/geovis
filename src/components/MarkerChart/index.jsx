import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts';

const SAMPLE_DATA = [
  [1721728800000, 84.7],
  [1721732400000, 70],
  [1721736000000, 60],
  [1721739600000, 30],
  [1721743200000, 50],
  [1721746800000, 84.6],
  [1721750400000, 84.6],
  [1721754000000, 84.6],
  [1721757600000, 84.6],
  [1721761200000, 84.6],
  [1721764800000, 84.6],
  [1721768400000, 84.6],
  [1721772000000, 84.6],
  [1721775600000, 84.6],
  [1721779200000, 84.6],
  [1721782800000, 84.7],
  [1721786400000, 84.6],
  [1721790000000, 84.7],
  [1721793600000, 84.7],
  [1721797200000, 84.7],
  [1721800800000, 84.7],
  [1721804400000, 84.7],
  [1721808000000, 84.7],
  [1721811600000, 84.7],
  [1721815200000, 84.7],
  [1721818800000, 84.7],
  [1721822400000, 84.7],
  [1721826000000, 84.7],
  [1721829600000, 84.6],
  [1721833200000, 84.4],
  [1721836800000, 84.4],
  [1721840400000, 84.3],
  [1721844000000, 84.3],
  [1721847600000, 84.3],
  [1721851200000, 84.3],
  [1721854800000, 84.4],
  [1721858400000, 84.6],
  [1721862000000, 84.6],
  [1721865600000, 84.6],
  [1721869200000, 84.6],
  [1721872800000, 84.6],
  [1721876400000, 120],
  [1721880000000, 110],
  [1721883600000, 125],
  [1721887200000, 84.6],
  [1721890800000, 84.6],
  [1721894400000, 84.6],
  [1721898000000, 84.6],
  [1721901600000, 84.6],
  [1721905200000, 84.6],
  [1721908800000, 84.6],
  [1721912400000, 84.6],
  [1721916000000, 84.6],
  [1721919600000, 84.6],
  [1721923200000, 84.6],
  [1721926800000, 84.6],
  [1721930400000, 84.5],
  [1721934000000, 84.5],
  [1721937600000, 84.5],
  [1721941200000, 84.5],
  [1721944800000, 84.5],
  [1721948400000, 84.5],
  [1721952000000, 84.5],
  [1721955600000, 84.5],
  [1721959200000, 84.6],
  [1721962800000, 84.6],
  [1721966400000, 84.6],
  [1721970000000, 84.6],
  [1721973600000, 84.6],
  [1721977200000, 84.6],
  [1721980800000, 84.5],
  [1721984400000, 84.6],
  [1721988000000, 84.6],
  [1721991600000, 84.6],
  [1721995200000, 84.6],
  [1721998800000, 84.6],
  [1722002400000, 84.5],
  [1722006000000, 84.5],
  [1722009600000, 84.5],
  [1722013200000, 84.5],
  [1722016800000, 84.5],
  [1722020400000, 84.4],
  [1722024000000, 84.4],
  [1722027600000, 84.4],
  [1722031200000, 84.5],
  [1722034800000, 84.5],
  [1722038400000, 84.5],
  [1722042000000, 84.5],
  [1722045600000, 84.5],
  [1722049200000, 84.5],
  [1722052800000, 84.5],
  [1722056400000, 84.5],
  [1722060000000, 84.5],
  [1722063600000, 84.5],
  [1722067200000, 84.5],
  [1722070800000, 84.5],
  [1722074400000, 84.5],
  [1722078000000, 84.5],
  [1722081600000, 84.5],
  [1722085200000, 84.5],
  [1722088800000, 84.5],
  [1722092400000, 84.4],
  [1722096000000, 84.3],
  [1722099600000, 84.3],
  [1722103200000, 84.2],
  [1722106800000, 84.2],
  [1722110400000, 84.2],
  [1722114000000, 84.2],
  [1722117600000, 84.4],
  [1722121200000, 84.4],
  [1722124800000, 84.4],
  [1722128400000, 84.4],
  [1722132000000, 84.4],
  [1722135600000, 84.4],
  [1722139200000, 84.5],
  [1722142800000, 84.5],
  [1722146400000, 84.5],
  [1722150000000, 84.5],
  [1722153600000, 84.5],
  [1722157200000, 84.5],
  [1722160800000, 84.5],
  [1722164400000, 84.4],
  [1722168000000, 84.4],
  [1722171600000, 84.4],
  [1722175200000, 84.4],
  [1722178800000, 84.3],
  [1722182400000, 84.2],
  [1722186000000, 84.2],
  [1722189600000, 84.1],
  [1722193200000, 84.1],
  [1722196800000, 84.2],
  [1722200400000, 84.2],
  [1722204000000, 84.3],
  [1722207600000, 84.3],
  [1722211200000, 84.3],
  [1722214800000, 84.4],
  [1722218400000, 84.3],
  [1722222000000, 84.3],
  [1722225600000, 84.3],
  [1722229200000, 84.4],
  [1722232800000, 84.3],
  [1722236400000, 84.3],
  [1722240000000, 84.3],
  [1722243600000, 84.3],
  [1722247200000, 84.3],
  [1722250800000, 84.3],
  [1722254400000, 84.3],
  [1722258000000, 84.3],
  [1722261600000, 84.2],
  [1722265200000, 84.1],
  [1722268800000, 84.0],
  [1722272400000, 84.0],
  [1722276000000, 84.0],
  [1722279600000, 84.0],
  [1722283200000, 84.0],
  [1722286800000, 84.1],
  [1722290400000, 84.1],
  [1722294000000, 84.2],
  [1722297600000, 84.2],
  [1722301200000, 84.2],
  [1722304800000, 84.2],
  [1722308400000, 84.2],
  [1722312000000, 84.2],
  [1722315600000, 84.2],
  [1722319200000, 84.2],
  [1722322800000, 84.2],
  [1722326400000, 84.2],
  [1722330000000, 84.2],
];

const transformData = (data) => {
  return data.map(([timestamp, humidity]) => ({
    time: timestamp,
    humidity,
  }));
};

const transformedData = transformData(SAMPLE_DATA);

const HumidityChart = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={100}>
      <LineChart
        data={transformedData}
        margin={{ top: 0, right: 10, left: -30, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <ReferenceArea y1={0} y2={30} fill='red' fillOpacity={0.3} />
        <ReferenceArea y1={30} y2={70} fill='yellow' fillOpacity={0.3} />
        <ReferenceArea y1={70} y2={100} fill='green' fillOpacity={0.3} />
        <ReferenceArea y1={100} y2={150} fill='blue' fillOpacity={0.3} />
        <XAxis
          tick={false}
          dataKey='time'
          tickFormatter={(time) => new Date(time).toLocaleDateString()}
        />
        <YAxis tick={{ fontSize: 9 }} domain={[0, 150]} />
        <Tooltip
          labelFormatter={(time) => new Date(time).toLocaleDateString()}
        />
        <Line
          type='monotone'
          dataKey='humidity'
          stroke='#333'
          // strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HumidityChart;
