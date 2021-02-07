import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import dateFormat from "dateformat";
import "./Graph.css";
import "./App.css";

function Graph({ getTeamName, teamNumber, params }) {
  const [data, setData] = useState([]);
  const [chartOneCoords, setChartOneCoords] = useState([]);
  const [chartTwoCoords, setChartTwoCoords] = useState([]);

  const [team, setTeam] = useState();
  const [overs, setOvers] = useState();
  const [runs, setRuns] = useState();
  const [runRate, setRunRate] = useState();

  useEffect(() => {
    const getData = async () => {
      let matchId = params.matchId;
      const response = await fetch(
        `https://cric.dreamcasino.live/sportsdata/?mid=${matchId}`
      );

      const allData = await response.json();
      setData(allData?.result);

      const buildData = allData?.result[0]?.data?.match;
      buildChartData(buildData);

      getTeamName(
        allData?.result[0]?.data?.match?.teams?.home?.abbr,
        allData?.result[0]?.data?.match?.teams?.away?.abbr
      );

      let team =
        teamNumber === 1
          ? buildData?.teams?.home?.name
          : buildData?.teams?.away?.name;
      setTeam(team);
      setOvers(buildData?.resultinfo?.innings[teamNumber]?.overs);
      setRuns(buildData?.resultinfo?.innings[teamNumber]?.runs);
      setRunRate(buildData?.current_run_rate);
    };
    getData();
  }, [data]);

  const buildChartData = (data) => {
    if (teamNumber === 1) {
      let chartData = chartOneCoords;
      const newPoint = {
        x:
          data &&
          data.resultinfo &&
          data.resultinfo.innings[teamNumber] &&
          data.resultinfo.innings[teamNumber].overs
            ? data.resultinfo.innings[teamNumber].overs
            : 0,
        y: data && data.current_run_rate ? data.current_run_rate : 0,
      };

      if (chartData[chartData.length - 1]?.x !== newPoint.x) {
        let newChartData = [...chartData, newPoint];
        setChartOneCoords(newChartData);
      }
    } else {
      let chartData = chartTwoCoords;
      const newPoint = {
        x: data?.resultinfo?.innings[teamNumber]?.overs,
        y: data?.current_run_rate,
      };

      if (chartData[chartData.length - 1]?.x !== newPoint.x) {
        let newChartData = [...chartData, newPoint];
        setChartTwoCoords(newChartData);
      }
      console.log(...chartTwoCoords);
    }
  };

  const teamCoords = () => {
    return teamNumber === 1 ? chartOneCoords : chartTwoCoords;
  };

  const options = {
    legend: {
      display: true,
      position: "top",
      align: "center",
      labels: {
        boxWidth: 0,
        fontColor: "white",
        fontStyle: "normal",
      },
    },
    title: {
      display: true,
      text: `${dateFormat(new Date(), "mmm d")} ${
        data[0]?.data?.match?._dt?.time
          ? ` | ${data[0]?.data?.match?._dt?.time}`
          : ""
      }`,
      fontSize: 14,
      fontColor: "grey",
      fontStyle: "light",
    },
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 1,
        pointStyle: "rect",
        hoverRadius: "7",
        backgroundColor: "#572",
      },
    },
    tooltips: {
      mode: "index",
      intersect: true,
    },
    scales: {
      xAxes: [
        {
          type: "linear",
          ticks: {
            autoSkip: false,
            stepSize: 5,
            min: 0,
            suggestedMax: 50,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            autoSkip: true,
            stepSize: 6,
            suggestedMax: 6,
          },
        },
      ],
    },
  };

  return (
    <div className="graph">
      {data?.length > 0 && (
        <div className="container">
          <div className="teams">
            <p>{data[0]?.data?.match?.teams?.home?.name}</p>
            <p>{data[0]?.data?.match?.teams?.away?.name}</p>
          </div>

          <div className="match-info">
            <p>
              <b>Team:</b> {team ? team : "- "},
            </p>
            <p>
              <b>Overs:</b> {overs ? overs : "- "},
            </p>
            <p>
              <b>Runs:</b> {runs ? runs : "- "},
            </p>
            <p>
              <b>Run rate:</b> {runRate ? runRate : "- "}
            </p>
          </div>
          <Line
            data={{
              datasets: [
                {
                  backgroundColor: "#1A74B510",
                  borderColor: "#1A74B5",
                  borderWidth: 1,
                  pointRadius: 0,
                  data: [{ x: 0, y: 0 }, ...teamCoords()],
                  label: "RUN RATE",
                },
              ],
            }}
            options={options}
            height={150}
          />
        </div>
      )}
    </div>
  );
}

export default Graph;
