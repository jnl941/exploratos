package com.example.fileFetcher.dto;

public class TrajectoryRequest {
    public String filePath;
    public String getFilePath() {
        return filePath;
    }
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    public TrajectoryRequest(String filePath){
        this.filePath = filePath;
    }
    public TrajectoryRequest(){
        
    }
}
