import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, max, reduce } from 'rxjs/operators';
import { MyData } from './data.service';
import { DataPoint } from './interfaces/data-point';
import { SimpleLinearRegression } from 'ml-regression-simple-linear';
import { ChartDataset, Point } from 'chart.js';


export interface GraphDataSet {
  label: string,
  x: [DataPoint],
  y: [DataPoint],
  z: [DataPoint],
  velocityX: [DataPoint]
}
export interface GraphDataSetParsed {
  label: string,
  data: [DataPoint],
  fill: boolean,
  tension: number,
  borderColor: string,
  backgroundColor: string
}
@Injectable({
  providedIn: 'root'
})

export class GraphParserService {
  private apiUrl = 'http://localhost:8080'; // Update with your API URL
  private graphData: GraphDataSet[] = [];
  public graphDataParsed: GraphDataSetParsed[] = [];
  nextRngColour(): string{
    return '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
  };  
  getGraphData(graphFile: MyData): Observable<GraphDataSet[]>{
    let httpResponse = this.http.get<[GraphDataSet]>(this.apiUrl + "/api/trajs?filePath="+graphFile.path+graphFile.name)
    httpResponse.subscribe( data => {
      this.graphData = data 
      this.graphDataParsed = []
    let colour = this.nextRngColour()
    this.graphData.forEach(trajectory => {
      this.graphDataParsed.push({
        label: trajectory.label + " X",
        data: trajectory.x,
        fill: false,
        tension: 0,
        borderColor: this.blendColors(colour, '#000000', 0.5),
        backgroundColor: colour
      });
      colour = this.nextRngColour()
      this.graphDataParsed.push({
        label: trajectory.label + " Y",
        data: trajectory.y,
        fill: false,
        tension: 0,
        borderColor: this.blendColors(colour, '#000000', 0.5),
        backgroundColor: colour
      });
      colour = this.nextRngColour()
      this.graphDataParsed.push({
        label: trajectory.label + " Z",
        data: trajectory.z,
        fill: false,
        tension: 0,
        borderColor: this.blendColors(colour, '#000000', 0.5),
        backgroundColor: colour
      });
      colour = this.nextRngColour()
      this.graphDataParsed.push({
        label: trajectory.label + " VelocityX",
        data: trajectory.velocityX,
        fill: false,
        tension: 0,
        borderColor: this.blendColors(colour, '#000000', 0.5),
        backgroundColor: colour
      });
      })
      console.log(this.graphDataParsed)
    });
    return httpResponse
    }
  constructor(private http: HttpClient) { }

  groupDatasetsByLabel(datasets: any[]) {
    const groupedData: { [key: string]: any[] } = {};
  
    datasets.forEach(dataset => {
      const label = dataset.label.split(' ')[0] + ' ' + dataset.label.split(' ')[2];
      if (!groupedData[label]) {
        groupedData[label] = [];
      }
      groupedData[label].push(dataset);
    });
  
    return groupedData;
  }
  
  calculateLinearRegression(groupedDatasets: { [key: string]: any[] }) {
    const regressions: { [key: string]: {slope: number, offset: number, xMax: number, xMin: number}} = {};
  
    let result: {[key: string]: {slope: number[], offset: number[], xMax: number, xMin: number}} = {};
    for (const group in groupedDatasets) {
      result[group] = { slope: [], offset: [], xMax: 0, xMin: 0 };
      groupedDatasets[group].forEach(dataset => {
        let tempX: number[] = []
        let tempY: number[] = []
        dataset.data.map((point: { x: number, y: number }) => {tempX.push(point.x); tempY.push(point.y)});
        const regression = new SimpleLinearRegression(tempX, tempY)
        result[group].slope.push(regression.slope)
        result[group].offset.push(regression.intercept)
        result[group].xMax = Math.max(result[group].xMax,...tempX)
        result[group].xMin = Math.min(result[group].xMin,...tempX)
      });
      if(result){
        const size = result[group].slope.length
        regressions[group] = {
          slope: result[group].slope.reduce((result, current) => result += current/size, 0),
          offset: result[group].offset.reduce((result, current) => result += current/size, 0),
          xMax: result[group].xMax,
          xMin: result[group].xMax,
        }
      }
      
    }

    return regressions;
  }
  calculateAverageY(groupedDatasets: { [key: string]: any[] }) {
    const averages: { [key: string]: { x: number, y: number }[] } = {};
  
    for (const group in groupedDatasets) {
      const result: { [key: number]: { x: number, y: number } } = {};
      const count: { [key: number]: number } = {};
  
      groupedDatasets[group].forEach(dataset => {
        dataset.data.forEach((point: { x: number, y: number }) => {
          const x: number = point.x;
          if (result[x] === undefined) {
            result[x] = { x, y: 0 };
            count[x] = 0;
          }
          result[x].y += point.y;
          count[x]++;
        });
      });
  
      averages[group] = Object.keys(result).map(x => ({
        x: parseFloat(x),
        y: result[parseFloat(x)].y / count[parseFloat(x)]
      }));
    }

    return averages;
  }
  blendColors(colorA: string, colorB: string, amount: number) {
      const [rA, gA, bA] = colorA.match(/\w\w/g)?.map((c) => parseInt(c, 16)) || [0, 0, 0];
      const [rB, gB, bB] = colorB.match(/\w\w/g)?.map((c) => parseInt(c, 16)) || [0, 0, 0];
      const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
      const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
      const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
      return '#' + r + g + b;
  }
  
  createAnnotationsRegression(regressionData: { [key: string]: { slope: number, offset: number, xMax: number, xMin: number } }, datasetsFiltered: ChartDataset<"line", (number | Point | null)[]>[]): { [key: string]: { type: string, xScaleID: string, yScaleID: string, xMin: number, xMax: number, yMin: number, yMax: number, borderColor: string, borderWidth: number, label: {enabled: boolean, content: string, position: string}} } {
      const annotations: { [key: string]: { type: string, xScaleID: string, yScaleID: string, xMin: number, xMax: number, yMin: number, yMax: number, borderColor: string, borderWidth: number, label: {enabled: boolean, content: string, position: string}} } = {};
      const colors = ['red', 'purple', 'yellow', 'blue'];
      let colorIndex = 0;
  
      for (const group in regressionData) {
        const regressionGroup = regressionData[group];
        // const parsedGroup = datasetsFiltered.filter(dataset => dataset.label?.split(' ')[2] == group.split(' ')[1])
        // const colour = parsedGroup.map(dataset => dataset.backgroundColor).reduce((result, current) => this.blendColors(result as any, current as any, 0.5), '')
        let colour = ''
        switch(group.split(' ')[1]){
          case "X":
            colour = colors[0];
            break;
          case "Y":
            colour = colors[1];
            break;
          case "Z":
            colour = colors[2];
            break;
          case "VelocityX":
            colour = colors[3];
            break;
        }
        annotations[group] = {
          type: 'line',
          xScaleID: 'x',
          yScaleID: 'y',
          xMin: 0,
          xMax: regressionGroup.xMax,
          yMin: (0-regressionGroup.offset)*regressionGroup.slope,
          yMax: (regressionGroup.xMax-regressionGroup.offset)*regressionGroup.slope,
          // value: regressionGroup.map(point => point.offset),
          borderColor: colour as string,
          borderWidth: 2,
          label: {
            enabled: true,
            content: `Average ${group}`,
            position: 'center',
          }
        };
        colorIndex++;
      }
  
      return annotations;
  }

  createAnnotations(averageData: { [key: string]: { x: number, y: number }[] }) {
    const annotations: { [key: string]: any } = {};
    const colors = ['red', 'purple', 'yellow', 'blue'];
    let colorIndex = 0;

    for (const group in averageData) {
      annotations[group] = {
        type: 'line',
        scaleID: 'y',
        value: averageData[group].map(point => point.y),
        borderColor: colors[colorIndex % colors.length],
        borderWidth: 2,
        label: {
          enabled: true,
          content: `Average ${group}`,
          position: 'center'
        }
      };
      colorIndex++;
    }

    return annotations;
  }
  
  
  
}
