import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { MyData } from '../data.service';
import { AuthService } from '../auth.service';
import {FormsModule} from '@angular/forms'
import { MatError, MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { Observable, first, of } from 'rxjs';
import { Chart, ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective } from 'ng2-charts';
import { GraphParserService } from '../graph-parser.service';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import * as pluginAnnotations from "chartjs-plugin-annotation";


@Component({
  selector: 'app-graph-visualizer',
  standalone: true,
  imports: [NgStyle, NgClass, MatButton, BaseChartDirective, MatButtonModule, MatDialogClose, MatDialogContent, MatDialogActions, MatDialogTitle, MatLabel, MatFormField, MatError, FormsModule, CommonModule, NgIf, MatFormFieldModule, MatInputModule, NgFor],
  templateUrl: './graph-visualizer.component.html',
  styleUrl: './graph-visualizer.component.scss'
})
export class GraphVisualizerComponent {
  newComment: string = ''; // Variable to store the new comment
  userId: number = -1; // User's ID
  legendItems: any[] = []
  legendItemsIndex: any[] = []
  comments: Comment[] = [];
  graphDataParsed: any = [];
  groupedDatasets: any;
  regressionData: any;
  public lineChartPlugins = [pluginAnnotations];

  @Input()
  public data: MyData = {
    id: 0,
    name: "",
    subname: "",
    path: "",
    content: "",
    owner: ""
}
  // private double timestamp;
  //   private double x;
  //   private double y;
  //   private double z;
  //   private double velocityX;
  constructor(
  private apiService: ApiService,
  private authService: AuthService,
  private graphService: GraphParserService) {
    Chart.register(AnnotationPlugin);
     this.apiService.getUserId().subscribe(user => this.userId = user.id); // Get the user's ID from the authentication service
  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: this.graphDataParsed
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales:
    {
      x:{
        type: 'linear'
      }
    },
    plugins: {
      legend:{
        display: false,
        position: 'right'
      },
      annotation: {
        annotations: []
      }
    }
  };


  public lineChartLegend = false;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit(): void {
    // Fetch comments for the file from the Spring Boot backend
      this.chart?.chart?.legend?.chart.data.datasets.forEach(dataSet => dataSet.hidden = false)
      this.graphService.getGraphData(this.data).subscribe(
        data => {
          this.lineChartData = {datasets: this.graphService.graphDataParsed}
          console.log(this.graphService.graphDataParsed)
          this.groupedDatasets = this.graphService.groupDatasetsByLabel(this.lineChartData.datasets);
          // this.averageData = this.graphService.calculateAverageY(this.groupedDatasets);
          this.regressionData = this.graphService.calculateLinearRegression(this.groupedDatasets);
          console.log(this.groupedDatasets)
          this.lineChartData = {datasets: this.graphService.graphDataParsed}
          this.updateMeans()
          for(let i = 0; i < this.graphService.graphDataParsed.length / 4; i++){
            this.legendItems.push({
              x: this.graphService.graphDataParsed[(i*4)],
              y: this.graphService.graphDataParsed[(i*4)+1],
              z: this.graphService.graphDataParsed[(i*4)+2],
              velocityX: this.graphService.graphDataParsed[(i*4)+3]
            });
          }
          this.hiddenData = new Array(this.graphService.graphDataParsed.length)
          this.hiddenData.fill(false)
          this.hiddenTrajs = new Array(this.graphService.graphDataParsed.length/4)
          this.hiddenTrajs.fill(false)
        })

  }

  hideAll: any = {
    X: false,
    Y: false,
    Z: false,
    VelocityX: false
  }
  hiddenTrajs: any = []
  hiddenData: any = []
  toggleTrajs(label: string): void{
    // onClick: (evt, legendItem, legend) => {
    //   let newVal = !legendItem.hidden;
    //   legend.chart.data.datasets.forEach(dataset => {
    //     if (dataset.label?.split(' ')[0] === legendItem.text?.split(' ')[0] && dataset.label?.split(' ')[2] === legendItem.text?.split(' ')[2]) {
    //       dataset.hidden = newVal
    //     }
    //   });
    //   legend.chart.update();
    // }
    this.hideAll[label] = !this.hideAll[label];
    console.log(this.chart?.chart?.legend?.chart.data.datasets)
    this.chart?.chart?.legend?.chart.data.datasets.forEach(dataset => {
      if (dataset.label?.split(' ')[2] === label) {
        dataset.hidden = this.hideAll[label]
      }
    });
    let value = 0
    switch(label){
      case 'X':
        value = 0
        break;
      case 'Y':
        value = 1
        break;
      case 'Z':
        value = 2
        break;
      case 'VelocityX':
        value = 3
        break;
    }
    for(let i = 0; i < this.graphService.graphDataParsed.length/4; i++){
      this.hiddenData[i*4+value] = this.hideAll[label]
      if (this.areAllHiddenTraj(i)){
        this.hiddenTrajs[i] = true
      } else {
           this.hiddenTrajs[i] = false
      }
    }
    // this.chart?.chart?.legend?.chart.update();
    // this.chart?.update()
    this.updateMeans()
    this.chart?.chart?.update()
  }
  areNoneHiddenTraj(i: number) {
    return !this.hiddenData[i*4] && !this.hiddenData[(i*4)+1] && !this.hiddenData[(i*4)+2] && !this.hiddenData[(i*4)+3]
  }
  areAllHiddenTraj(i: number) {
    return this.hiddenData[i*4] && this.hiddenData[(i*4)+1] && this.hiddenData[(i*4)+2] && this.hiddenData[(i*4)+3]
  }
  updateMeans(){
    const datasetsFiltered = this.lineChartData.datasets.filter(dataset => !dataset.hidden)
    this.groupedDatasets = this.graphService.groupDatasetsByLabel(datasetsFiltered);
    this.regressionData = this.graphService.calculateLinearRegression(this.groupedDatasets);
    const annotations = this.graphService.createAnnotationsRegression(this.regressionData, datasetsFiltered)
    const max = Math.max(...datasetsFiltered.map(datasetFiltered => Math.max(...this.graphService.graphDataParsed.filter(datasetTrue => datasetTrue.label == datasetFiltered.label).map(dataset => Math.max(...dataset.data.map(data => data.y))))), ...Object.keys(annotations).map(annotationKey => annotations[annotationKey].yMax));
    const min = Math.min(...datasetsFiltered.map(datasetFiltered => Math.min(...this.graphService.graphDataParsed.filter(datasetTrue => datasetTrue.label == datasetFiltered.label).map(dataset => Math.min(...dataset.data.map(data => data.y))))), ...Object.keys(annotations).map(annotationKey => annotations[annotationKey].yMax));
    
    const max_maxmin_extra = Math.max(Math.abs(max), Math.abs(min))*.02
    this.lineChartOptions = {
      responsive: false,
      animation: false,
      normalized: true,
      // maintainAspectRatio: false,
      scales:
      {
        x:{
          type: 'linear',
          title: {
            display: true,
            text: "Simulation time (s)"
          },
          min: 0,
          max: this.regressionData.xMax
        },
        y:{
        //   min: Math.min(...this.graphService.graphDataParsed.map(dataset => Math.min(...dataset.data.map( data => data.y)))),
        //   max: Math.max(...this.graphService.graphDataParsed.map(dataset => Math.max(...dataset.data.map( data => data.y))))
          
          min: max+max_maxmin_extra,
          max: min-max_maxmin_extra
        }
      },
      plugins: {
        decimation: {
          enabled: true,

        },
        legend: {
          display: false,
          position: 'right',
          onClick: (evt, legendItem, legend) => {
            return
          }
        },
        annotation:{
          annotations: annotations as any
          //{
          //   box1: {
          //     // Indicates the type of annotation
          //     type: 'box',
          //     xMin: 1,
          //     xMax: 2,
          //     yMin: 50,
          //     yMax: 70,
          //     backgroundColor: 'rgba(255, 99, 132, 0.25)'
          //   }
          // }
        }
      }
    }
  }
  toggleTraj(num: number): void{
    // onClick: (evt, legendItem, legend) => {
    //   let newVal = !legendItem.hidden;
    //   legend.chart.data.datasets.forEach(dataset => {
    //     if (dataset.label?.split(' ')[0] === legendItem.text?.split(' ')[0] && dataset.label?.split(' ')[2] === legendItem.text?.split(' ')[2]) {
    //       dataset.hidden = newVal
    //     }
    //   });
    //   legend.chart.update();
    // }
    this.hiddenTrajs[num] = !this.hiddenTrajs[num];
    console.log(this.chart?.chart?.legend?.chart.data.datasets)
    this.chart?.chart?.legend?.chart.data.datasets.forEach(dataset => {
      if ((dataset.label?.split(' ')[1] as unknown as number)-1 === num) {
        dataset.hidden = this.hiddenTrajs[num]
      }
    });
    // this.chart?.chart?.legend?.chart.update();
    // this.chart?.update()
    this.hiddenData[num*4] = this.hiddenTrajs[num]
    this.hiddenData[num*4+1] = this.hiddenTrajs[num]
    this.hiddenData[num*4+2] = this.hiddenTrajs[num]
    this.hiddenData[num*4+3] = this.hiddenTrajs[num]
    this.updateMeans()

    this.chart?.chart?.update()
  }

  toggleData(num: number): void{
    // onClick: (evt, legendItem, legend) => {
    //   let newVal = !legendItem.hidden;
    //   legend.chart.data.datasets.forEach(dataset => {
    //     if (dataset.label?.split(' ')[0] === legendItem.text?.split(' ')[0] && dataset.label?.split(' ')[2] === legendItem.text?.split(' ')[2]) {
    //       dataset.hidden = newVal
    //     }
    //   });
    //   legend.chart.update();
    // }
    this.hiddenData[num] = !this.hiddenData[num];
    if (this.chart?.chart?.legend?.chart.data.datasets[num]) {
      this.chart.chart.legend.chart.data.datasets[num].hidden = this.hiddenData[num];
    }
    console.log(num/4)
    if (this.areAllHiddenTraj(Math.floor(num/4))){
      this.hiddenTrajs[Math.floor(num/4)] = true
    } else {
         this.hiddenTrajs[Math.floor(num/4)] = false
    }
    // this.chart?.chart?.legend?.chart.data.datasets.forEach(dataset => {
    //   if ((dataset.label?.split(' ')[1] as unknown as number)-1 === num) {
    //     dataset.hidden = this.hiddenTrajs[num]
    //   }
    // });
    // this.chart?.chart?.legend?.chart.update();
    // this.chart?.update()
    this.updateMeans()

    this.chart?.chart?.update()
  }
}
