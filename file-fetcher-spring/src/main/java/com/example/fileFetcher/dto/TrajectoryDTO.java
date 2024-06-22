package com.example.fileFetcher.dto;

import java.util.ArrayList;

public class TrajectoryDTO {
    private String label;
    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    private ArrayList<DataPointDTO> x = new ArrayList<>();
    private ArrayList<DataPointDTO> y = new ArrayList<>();
    private ArrayList<DataPointDTO> z = new ArrayList<>();
    private ArrayList<DataPointDTO> velocityX = new ArrayList<>();

    public ArrayList<DataPointDTO> getX() {
        return x;
    }

    public void setX(ArrayList<DataPointDTO> x) {
        this.x = x;
    }

    public ArrayList<DataPointDTO> getY() {
        return y;
    }

    public void setY(ArrayList<DataPointDTO> y) {
        this.y = y;
    }

    public ArrayList<DataPointDTO> getZ() {
        return z;
    }

    public void setZ(ArrayList<DataPointDTO> z) {
        this.z = z;
    }

    public ArrayList<DataPointDTO> getVelocityX() {
        return velocityX;
    }

    public void setVelocityX(ArrayList<DataPointDTO> velocityX) {
        this.velocityX = velocityX;
    }

   
}
