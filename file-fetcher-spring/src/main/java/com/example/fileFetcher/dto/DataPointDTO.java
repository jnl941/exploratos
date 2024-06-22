package com.example.fileFetcher.dto;

public class DataPointDTO {
    public Double x,y;

    public DataPointDTO(Double x, Double y) {
        this.x = x;
        this.y = y;
    }

    public DataPointDTO() {
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }
}
